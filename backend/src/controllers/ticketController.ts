import { Request, Response } from 'express';
import Ticket from '../models/Ticket';
import { sendEmail } from '../utils/sendEmail';

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
        new: true,
        runValidators: true,
      });

      // Send email notification to customer if status changed
      if (statusChanged && updatedTicket && updatedTicket.customerEmail) {
        const ticketId = updatedTicket.ticketId;
        const statusLabel = STATUS_LABELS[newStatus] || newStatus;
        const note = req.body.notes || 'Your TV repair status has been updated.';
        
        const subject = `Repair Ticket Status Update - ${ticketId}`;
        const message = `Hello ${updatedTicket.customerName},\n\nThe status of your TV repair request (${ticketId}) has been updated to: ${statusLabel}.\n\nNote: ${note}\n\nYou can track the live progress of your repair here: http://localhost:3000/track?id=${ticketId}\n\nThank you,\nTV Repair Support`;
        
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a; text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 20px;">TV Repair Status Update</h2>
            <p style="font-size: 16px; color: #334155;">Hello <strong>${updatedTicket.customerName}</strong>,</p>
            <p style="font-size: 16px; color: #334155;">The status of your repair request (Ticket ID: <span style="font-family: monospace; font-weight: bold; color: #1e293b;">${ticketId}</span>) has been updated.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #0284c7; margin: 20px 0;">
              <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">New Status</p>
              <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #0284c7;">${statusLabel}</p>
              
              <p style="margin: 15px 0 0 0; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Technician Note</p>
              <p style="margin: 5px 0 0 0; font-size: 15px; color: #334155; font-style: italic;">"${note}"</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/track?id=${ticketId}" style="background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">Track Live Progress</a>
            </div>
            
            <p style="font-size: 13px; color: #64748b; text-align: center;">If the button above does not work, copy and paste this URL into your browser:<br/><a href="http://localhost:3000/track?id=${ticketId}" style="color: #0284c7;">http://localhost:3000/track?id=${ticketId}</a></p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">TV Repair Service &copy; ${new Date().getFullYear()}</p>
          </div>
        `;

        sendEmail({
          email: updatedTicket.customerEmail,
          subject,
          message,
          html,
        }).catch((err) => {
          console.error(`Failed to send status update email to ${updatedTicket.customerEmail}:`, err.message);
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
