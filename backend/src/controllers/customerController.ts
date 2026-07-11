import { Request, Response } from 'express';
import Customer from '../models/Customer';
import Ticket from '../models/Ticket';

// @desc    Get all customers
// @route   GET /api/v1/customers
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

    const items = await Customer.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Customer.countDocuments(query);

    const formattedItems = items.map((item: any) => {
      const customer = item.toObject();
      return {
        ...customer,
        id: customer.id || customer._id,
        totalRepairs: 0,
        totalSpent: 0,
      };
    });

    res.json({
      items: formattedItems,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get customer dashboard metrics
// @route   GET /api/v1/customer/dashboard
// @access  Private (Customer)
export const getCustomerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById((req as any).user._id);
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    const tickets = await Ticket.find({
      $or: [
        { customerEmail: customer.email },
        { customerPhone: customer.phone }
      ]
    });

    const activeTickets = tickets.filter(t => t.status !== 'delivered').length;
    const completedRepairs = tickets.filter(t => t.status === 'delivered').length;
    const pendingPayments = tickets.filter(t => t.paymentStatus === 'pending').length;
    const totalSpent = tickets.filter(t => t.paymentStatus === 'paid').length * 1500;

    res.json({
      success: true,
      data: {
        activeTickets,
        completedRepairs,
        pendingPayments,
        totalSpent
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get customer tickets list
// @route   GET /api/v1/customer/tickets
// @access  Private (Customer)
export const getCustomerTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById((req as any).user._id);
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { customerEmail: customer.email },
        { customerPhone: customer.phone }
      ]
    };

    const items = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ticket.countDocuments(query);

    res.json({
      success: true,
      data: {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get customer profile
// @route   GET /api/v1/customer/profile
// @access  Private (Customer)
export const getCustomerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById((req as any).user._id).select('-password');
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    res.json({
      success: true,
      data: customer
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Update customer profile
// @route   PUT /api/v1/customer/profile
// @access  Private (Customer)
export const updateCustomerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById((req as any).user._id);
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    if (req.body.name !== undefined) customer.name = req.body.name;
    if (req.body.email !== undefined) customer.email = req.body.email;
    if (req.body.phone !== undefined) customer.phone = req.body.phone;
    if (req.body.address !== undefined) customer.address = req.body.address;
    if (req.body.city !== undefined) customer.city = req.body.city;
    if (req.body.state !== undefined) customer.state = req.body.state;
    if (req.body.pincode !== undefined) customer.pincode = req.body.pincode;

    const updated = await customer.save();

    res.json({
      success: true,
      data: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        city: updated.city,
        state: updated.state,
        pincode: updated.pincode
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
