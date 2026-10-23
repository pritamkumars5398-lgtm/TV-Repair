import { Request, Response } from 'express';
import Ticket from '../models/Ticket';
import Payment from '../models/Payment';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import {
  sendBookingReceived,
  sendBookingPaymentConfirm,
  sendTicketStatusUpdate,
  sendEstimateApproved,
  sendEstimateCancelled,
} from '../utils/sendSMS';
import Notification from '../models/Notification';

// Helper to generate a unique ticket ID
const generateTicketId = () => {
  return `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
};

// @desc    Create a booking and initiate Razorpay (Mock)
// @route   POST /api/v1/public/bookings
// @access  Public
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, serviceType, preferredDate, preferredTime, issueDescription, tvBrand, tvSize, tvType, modelNumber, address, area, city, pincode, isPickup } = req.body;

    // Create a new Ticket with paymentStatus 'pending'
    const ticket = await Ticket.create({
      ticketId: generateTicketId(),
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      serviceType,
      preferredDate,
      preferredTime,
      issueDescription,
      tvBrand,
      tvSize,
      tvType,
      modelNumber,
      address,
      area,
      city,
      pincode,
      isPickup,
      status: 'tv_received',
      statusHistory: [{ status: 'tv_received', note: 'Ticket created.' }],
      paymentStatus: 'pending',
    });

    // Real Razorpay Order Creation
    const options = {
      amount: 25000, // 250 INR in paise
      currency: 'INR',
      receipt: ticket.ticketId,
    };

    let razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    try {
      if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('XXXXXXX')) {
        const rzp = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const order = await rzp.orders.create(options);
        razorpayOrderId = order.id;
      }
    } catch (err: any) {
      console.warn('Razorpay order creation failed, using fallback mock order ID', err.message);
    }
    
    // Save the razorpayOrderId to the ticket
    ticket.razorpayOrderId = razorpayOrderId;
    await ticket.save();

    // Create a Payment document
    await Payment.create({
      ticketId: ticket.ticketId,
      amount: 250, // 250 INR
      status: 'PENDING',
      razorpayOrderId,
    });

    // Send SMS Notification via MSG91 Flow: repaircart-booking-received
    if (phone) {
      const itemDescription = [ticket.tvBrand, ticket.tvSize, ticket.serviceType].filter(Boolean).join(' ') || ticket.serviceType;
      try {
        await sendBookingReceived(phone, {
          name: name || 'Customer',
          ticket: ticket.ticketId,
          item: itemDescription,
        });
      } catch (err: any) {
        console.error(`Failed to send booking SMS to ${phone}:`, err.message);
      }
    }

    res.status(201).json({
      razorpayOrderId,
      bookingId: ticket._id,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/v1/public/bookings/verify-payment
// @access  Public
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // In a real app, verify the signature using Razorpay SDK
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    // We allow the mock signature for local testing if Razorpay keys are not real
    if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('XXXXXXX')) {
      if (generatedSignature !== razorpay_signature) {
        res.status(400).json({ message: 'Invalid payment signature' });
        return;
      }
    }

    const ticket = await Ticket.findById(bookingId);
    
    if (!ticket) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    ticket.paymentStatus = 'paid';
    ticket.razorpayPaymentId = razorpay_payment_id || `pay_${crypto.randomBytes(8).toString('hex')}`;
    await ticket.save();

    // Update the Payment document
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { 
        status: 'CAPTURED',
        razorpayPaymentId: ticket.razorpayPaymentId,
      }
    );

    // Send Confirmation SMS via MSG91 Flow: repaircart-booking-payment-confirm
    if (ticket.customerPhone) {
      try {
        await sendBookingPaymentConfirm(ticket.customerPhone, {
          name: ticket.customerName,
          ticket: ticket.ticketId,
        });
      } catch (err: any) {
        console.error(`Failed to send booking confirmation SMS to ${ticket.customerPhone}:`, err.message);
      }
    }

    res.json({
      success: true,
      ticketId: ticket.ticketId,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Resend Booking Confirmation SMS
// @route   POST /api/v1/public/bookings/:ticketId/resend-confirmation
// @access  Public
export const resendConfirmationSMS = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Booking ticket not found' });
      return;
    }

    if (!ticket.customerPhone) {
      res.status(400).json({ success: false, message: 'No phone number attached to this ticket' });
      return;
    }

    const sent = await sendBookingPaymentConfirm(ticket.customerPhone, {
      name: ticket.customerName || 'Customer',
      ticket: ticket.ticketId,
    });

    res.json({
      success: true,
      message: 'Confirmation SMS dispatched successfully to ' + ticket.customerPhone,
      sent,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Track a ticket
// @route   GET /api/v1/public/track/:ticketId
// @access  Public
export const trackTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        ticketId: ticket.ticketId,
        status: ticket.status,
        serviceType: ticket.serviceType,
        statusHistory: ticket.statusHistory,
        adminEstimateAmount: ticket.adminEstimateAmount,
        adminEstimateBreakdown: ticket.adminEstimateBreakdown,
        estimateStatus: ticket.estimateStatus,
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Respond to an estimate
// @route   POST /api/v1/public/track/:ticketId/estimate-response
// @access  Public
export const respondToEstimate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (status !== 'approved' && status !== 'rejected') {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Only an estimate the admin has sent and the customer hasn't answered yet can be approved/rejected
    if (ticket.estimateStatus !== 'sent_to_customer') {
      res.status(409).json({
        message:
          ticket.estimateStatus === 'approved' || ticket.estimateStatus === 'rejected'
            ? `Estimate has already been ${ticket.estimateStatus}`
            : 'No estimate is awaiting your response for this ticket',
      });
      return;
    }

    ticket.estimateStatus = status;

    if (status === 'approved') {
      ticket.status = 'work_started';
      ticket.statusHistory.push({ status: 'work_started', note: 'Customer approved estimate.' });
    } else if (status === 'rejected') {
      ticket.status = 'cancelled';
      ticket.statusHistory.push({ status: 'cancelled', note: 'Customer rejected estimate.' });
    }

    await ticket.save();

    // Create a notification for the Admin
    await Notification.create({
      title: `Estimate ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Customer ${ticket.customerName} has ${status} the estimate for ticket ${ticket.ticketId}.`,
      type: status === 'approved' ? 'SUCCESS' : 'WARNING',
      link: `/admin/tickets?action=message&ticketId=${ticket.ticketId}`,
    });

    if (ticket.customerPhone) {
      try {
        const smsData = { name: ticket.customerName, ticket: ticket.ticketId };
        const sent =
          status === 'approved'
            ? await sendEstimateApproved(ticket.customerPhone, smsData)
            : await sendEstimateCancelled(ticket.customerPhone, smsData);

        // Fall back to the generic status template if the dedicated flow isn't set up on MSG91
        if (!sent) {
          await sendTicketStatusUpdate(ticket.customerPhone, {
            ...smsData,
            status: status === 'approved' ? 'Work Started' : 'Cancelled',
            note: status === 'approved' ? 'Estimate approved by customer.' : 'Estimate declined by customer.',
          });
        }
      } catch (err: any) {
        console.error(`Failed to send estimate response SMS to ${ticket.customerPhone}:`, err.message);
      }
    }

    res.json({
      success: true,
      message: 'Estimate response recorded successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
