import { Request, Response } from 'express';
import Lead from '../models/Lead';
import Ticket from '../models/Ticket';
import Technician from '../models/Technician';
import Payment from '../models/Payment';
import Customer from '../models/Customer';
import InventoryItem from '../models/InventoryItem';
import Notification from '../models/Notification';
import {
  sendTechnicianAssigned,
  sendEstimateQuotation,
  sendDeliveryDateUpdate,
  sendTicketStatusUpdate,
} from '../utils/sendSMS';

// @desc    Get Admin Notifications
// @route   GET /api/v1/admin/notifications
// @access  Private/Admin
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Mark Notification as Read
// @route   PUT /api/v1/admin/notifications/:id/read
// @access  Private/Admin
export const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { returnDocument: 'after' }
    );
    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }
    res.json({ success: true, data: notification });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/v1/admin/dashboard
// @access  Private/Admin
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // 1. New Leads Today
    const newLeadsToday = await Lead.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    // 2. Active Tickets
    const activeTickets = await Ticket.countDocuments({
      status: { $ne: 'delivered' },
    });

    // 3. Technicians on Field
    const techniciansOnField = await Technician.countDocuments({
      isActive: true,
    });

    // 4. Revenue This Month
    const paymentsThisMonth = await Payment.find({
      status: 'CAPTURED',
      createdAt: { $gte: startOfMonth },
    });
    const revenueThisMonth = paymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);

    // 5. Pending Payments
    const pendingPayments = await Payment.countDocuments({
      status: 'PENDING',
    });

    // 6. Completed Jobs Today
    const completedJobsToday = await Ticket.countDocuments({
      status: 'delivered',
      updatedAt: { $gte: startOfDay },
    });

    res.json({
      success: true,
      data: {
        newLeadsToday,
        activeTickets,
        techniciansOnField,
        revenueThisMonth,
        pendingPayments,
        completedJobsToday,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get Revenue Chart Data
// @route   GET /api/v1/admin/reports/revenue
// @access  Private/Admin
export const getRevenueChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const days = Number(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const payments = await Payment.find({
      status: 'CAPTURED',
      createdAt: { $gte: startDate },
    });

    // Initialize map with all dates in the range to avoid gaps
    const revenueMap: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      revenueMap[dateStr] = 0;
    }

    payments.forEach((p) => {
      const dateStr = p.createdAt.toISOString().split('T')[0];
      if (revenueMap[dateStr] !== undefined) {
        revenueMap[dateStr] += p.amount;
      }
    });

    const data = Object.keys(revenueMap)
      .map((date) => ({ date, revenue: revenueMap[date] }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get Lead Source Chart Data
// @route   GET /api/v1/admin/reports/lead-sources
// @access  Private/Admin
export const getLeadSourceChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const sourcesAgg = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    const data = sourcesAgg.map((s) => ({
      source: s._id || 'UNKNOWN',
      count: s.count,
    }));

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get all customers with aggregated stats
// @route   GET /api/v1/admin/customers
// @access  Private/Admin
export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const customers = await Customer.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Customer.countDocuments(query);

    const formattedItems = await Promise.all(
      customers.map(async (c: any) => {
        const customerObj = c.toObject();
        // Find tickets using customer phone/email
        const tickets = await Ticket.find({ customerPhone: c.phone });
        const ticketIds = tickets.map(t => t.ticketId);

        const totalRepairs = tickets.length;
        const payments = await Payment.find({
          ticketId: { $in: ticketIds },
          status: 'CAPTURED',
        });
        const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

        return {
          ...customerObj,
          id: customerObj._id.toString(),
          totalRepairs,
          totalSpent,
        };
      })
    );

    res.json({
      success: true,
      data: {
        items: formattedItems,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get all technicians
// @route   GET /api/v1/admin/technicians
// @access  Private/Admin
export const getTechnicians = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const technicians = await Technician.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Technician.countDocuments();

    res.json({
      success: true,
      data: {
        items: technicians,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Create technician
// @route   POST /api/v1/admin/technicians
// @access  Private/Admin
export const createTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const technician = await Technician.create(req.body);
    res.status(201).json({
      success: true,
      data: technician,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Update technician
// @route   PUT /api/v1/admin/technicians/:id
// @access  Private/Admin
export const updateTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const technician = await Technician.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!technician) {
      res.status(404).json({ success: false, message: 'Technician not found' });
      return;
    }

    res.json({
      success: true,
      data: technician,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get all inventory items
// @route   GET /api/v1/admin/inventory
// @access  Private/Admin
export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { category: searchRegex },
      ];
    }

    const items = await InventoryItem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await InventoryItem.countDocuments(query);

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

// @desc    Update inventory stock
// @route   PUT /api/v1/admin/inventory/:id/stock
// @access  Private/Admin
export const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { quantity, type } = req.body;
    const item = await InventoryItem.findById(req.params.id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Inventory item not found' });
      return;
    }

    if (type === 'IN') {
      item.quantity += Number(quantity);
    } else if (type === 'OUT') {
      item.quantity = Math.max(0, item.quantity - Number(quantity));
    }

    await item.save();

    res.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get detailed reports
// @route   GET /api/v1/admin/reports
// @access  Private/Admin
export const getReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const { from, to, type } = req.query;
    const fromDate = from ? new Date(from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to as string) : new Date();

    let data: any = {};

    if (type === 'revenue') {
      const payments = await Payment.find({
        status: 'CAPTURED',
        createdAt: { $gte: fromDate, $lte: toDate },
      });
      const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
      data = { totalRevenue, count: payments.length, payments };
    } else if (type === 'leads') {
      const leads = await Lead.find({
        createdAt: { $gte: fromDate, $lte: toDate },
      });
      data = { totalLeads: leads.length, leads };
    } else if (type === 'tickets') {
      const tickets = await Ticket.find({
        createdAt: { $gte: fromDate, $lte: toDate },
      });
      data = { totalTickets: tickets.length, tickets };
    } else {
      data = { message: 'Report type not implemented yet' };
    }

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Assign technician to a ticket
// @route   POST /api/v1/admin/tickets/:ticketId/assign
// @access  Private/Admin
export const assignTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const { technicianId } = req.body;

    const technician = await Technician.findById(technicianId);
    if (!technician) {
      res.status(404).json({ success: false, message: 'Technician not found' });
      return;
    }

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }

    ticket.technicianId = technician._id;
    ticket.technicianName = technician.name;
    ticket.technicianPhone = technician.phone;
    ticket.technicianPhoto = technician.photo || '';
    ticket.statusHistory.push({
      status: ticket.status,
      note: `Assigned to technician ${technician.name}`,
    });

    await ticket.save();

    // Send SMS to customer via MSG91 Flow: repaircart-technician-assigned
    if (ticket.customerPhone) {
      try {
        await sendTechnicianAssigned(ticket.customerPhone, {
          name: ticket.customerName,
          tech_name: technician.name,
          tech_phone: technician.phone,
          ticket: ticket.ticketId,
        });
      } catch (err: any) {
        console.error(`Failed to send technician assignment SMS to ${ticket.customerPhone}:`, err.message);
      }
    }

    res.json({
      success: true,
      message: 'Technician assigned successfully',
      data: ticket,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Admin sends final estimate to customer
// @route   POST /api/v1/admin/tickets/:ticketId/send-estimate
// @access  Private/Admin
export const sendEstimateToCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const { amount, breakdown } = req.body;

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }

    ticket.adminEstimateAmount = amount;
    ticket.adminEstimateBreakdown = breakdown;
    ticket.estimateAmount = amount; // Backwards compatibility for the track page if needed
    ticket.estimateBreakdown = breakdown; // Backwards compatibility
    ticket.estimateStatus = 'sent_to_customer';
    
    ticket.statusHistory.push({
      status: ticket.status,
      note: `Final Estimate sent to Customer by Admin. Amount: ₹${amount}. Breakdown: ${breakdown}`,
    });

    await ticket.save();

    // Send SMS to customer via MSG91 Flow: repaircart-estimate-quotation
    if (ticket.customerPhone) {
      try {
        await sendEstimateQuotation(ticket.customerPhone, {
          name: ticket.customerName,
          ticket: ticket.ticketId,
          cost: amount,
          details: breakdown || 'Inspection & Repair',
        });
      } catch (err: any) {
        console.error(`Failed to send estimate SMS to ${ticket.customerPhone}:`, err.message);
      }
    }

    res.json({
      success: true,
      message: 'Estimate sent to customer successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Admin sends a custom message to customer
// @route   POST /api/v1/admin/tickets/:ticketId/send-message
// @access  Private/Admin
export const sendMessageToCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const { message, date } = req.body;

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }

    const dateStr = date ? ` Expected completion: ${new Date(date).toLocaleDateString()}.` : '';
    
    ticket.statusHistory.push({
      status: ticket.status,
      note: `Admin Message: ${message}.${dateStr}`,
    });

    await ticket.save();

    if (ticket.customerPhone) {
      try {
        if (date) {
          // Send SMS via MSG91 Flow: repaircart-delivery-date-update
          const formattedDate = new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
          await sendDeliveryDateUpdate(ticket.customerPhone, {
            name: ticket.customerName,
            ticket: ticket.ticketId,
            date: formattedDate,
          });
        } else {
          // Send status update SMS via MSG91 Flow: repaircart-ticket-status-update
          await sendTicketStatusUpdate(ticket.customerPhone, {
            name: ticket.customerName,
            ticket: ticket.ticketId,
            status: ticket.status,
            note: message || 'Repair update from admin.',
          });
        }
      } catch (err: any) {
        console.error(`Failed to send message/update SMS to ${ticket.customerPhone}:`, err.message);
      }
    }

    res.json({
      success: true,
      message: 'Message sent to customer successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Global search across entities
// @route   GET /api/v1/admin/search
// @access  Private/Admin
export const globalSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = req.query.q as string;
    if (!q || q.length < 2) {
      res.json({ success: true, data: { tickets: [], customers: [], leads: [] } });
      return;
    }

    const searchRegex = new RegExp(q, 'i');

    const tickets = await Ticket.find({
      $or: [
        { ticketId: searchRegex },
        { customerName: searchRegex },
        { customerPhone: searchRegex }
      ]
    }).limit(5).select('ticketId customerName status');

    const customers = await Customer.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ]
    }).limit(5).select('name email phone');

    const leads = await Lead.find({
      $or: [
        { name: searchRegex },
        { phone: searchRegex }
      ]
    }).limit(5).select('name phone status');

    res.json({
      success: true,
      data: { tickets, customers, leads },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
