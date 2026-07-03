import { Request, Response } from 'express';
import Lead from '../models/Lead';
import Ticket from '../models/Ticket';
import Technician from '../models/Technician';
import Payment from '../models/Payment';
import Customer from '../models/Customer';
import InventoryItem from '../models/InventoryItem';

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
