import { Request, Response } from 'express';
import Ticket from '../models/Ticket';
import { sendTicketStatusUpdate } from '../utils/sendSMS';

const STATUS_LABELS: Record<string, string> = {
  tv_received: 'TV Received',
  diagnosis_completed: 'Diagnosis Completed',
  parts_ordered: 'Spare Parts Ordered',
  repair_in_progress: 'Repair In Progress',
  quality_check: 'Quality Testing',
  ready_for_delivery: 'Ready for Delivery',
  delivered: 'Delivered',
};

// @desc    Get all tickets
// @route   GET /api/v1/tickets
// @access  Private/Admin
export const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query: any = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query.$or = [
        { ticketId: searchRegex },
        { customerName: searchRegex },
        { customerPhone: searchRegex },
      ];
    }

    const items = await Ticket.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Ticket.countDocuments(query);

    res.json({
      success: true,
      data: {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Update ticket
// @route   PUT /api/v1/tickets/:id
// @access  Private/Admin
export const updateTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      let statusChanged = false;
      let newStatus = '';
      
      if (req.body.status && req.body.status !== ticket.status) {
        statusChanged = true;
        newStatus = req.body.status;
        req.body.$push = {
          statusHistory: {
            status: req.body.status,
            note: req.body.notes || 'Status updated via admin panel.',
          },
        };
      }

      const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: 'after',
        runValidators: true,
      });

      // Send SMS notification to customer if status changed via MSG91 Flow: repaircart-ticket-status-update
      if (statusChanged && updatedTicket && updatedTicket.customerPhone) {
        const ticketId = updatedTicket.ticketId;
        const statusLabel = STATUS_LABELS[newStatus] || newStatus;
        const note = req.body.notes || 'Status updated.';
        
        sendTicketStatusUpdate(updatedTicket.customerPhone, {
          name: updatedTicket.customerName,
          ticket: ticketId,
          status: statusLabel,
          note: note,
        }).catch((err) => {
          console.error(`Failed to send status update SMS to ${updatedTicket.customerPhone}:`, err.message);
        });
      }

      res.json({
        success: true,
        data: updatedTicket,
      });
    } else {
      res.status(404).json({ success: false, message: 'Ticket not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
