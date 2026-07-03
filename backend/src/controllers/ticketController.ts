import { Request, Response } from 'express';
import Ticket from '../models/Ticket';

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
      if (req.body.status && req.body.status !== ticket.status) {
        req.body.$push = {
          statusHistory: {
            status: req.body.status,
            note: req.body.notes || 'Status updated via admin panel.',
          },
        };
      }

      const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
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
