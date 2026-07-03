import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

// @desc    Submit feedback
// @route   POST /api/v1/feedbacks
// @access  Public
export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, rating, message } = req.body;

    const feedback = await Feedback.create({
      name,
      email,
      rating,
      message,
    });

    res.status(201).json(feedback);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all feedbacks
// @route   GET /api/v1/feedbacks/admin
// @access  Private/Admin
export const getAdminFeedbacks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const items = await Feedback.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Feedback.countDocuments();

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
