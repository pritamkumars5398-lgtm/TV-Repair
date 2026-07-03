import { Request, Response } from 'express';
import Payment from '../models/Payment';

// @desc    Get all payments
// @route   GET /api/v1/payments
// @access  Private/Admin
export const getPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const items = await Payment.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Payment.countDocuments(query);

    res.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
