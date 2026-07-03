import { Request, Response } from 'express';
import Ticket from '../models/Ticket';
import Payment from '../models/Payment';
import crypto from 'crypto';
import Razorpay from 'razorpay';

// Helper to generate a unique ticket ID
const generateTicketId = () => {
  return `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
};

// @desc    Create a booking and initiate Razorpay (Mock)
// @route   POST /api/v1/public/bookings
// @access  Public
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, serviceType, preferredDate, preferredTime, issueDescription, address, area, city, pincode, isPickup } = req.body;

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

    res.json({
      success: true,
      ticketId: ticket.ticketId,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
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
      ticketId: ticket.ticketId,
      status: ticket.status,
      serviceType: ticket.serviceType,
      statusHistory: ticket.statusHistory,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
