import { Request, Response } from 'express';
import Customer from '../models/Customer';

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
