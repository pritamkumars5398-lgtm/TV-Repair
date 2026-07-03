import { Request, Response } from 'express';
import Lead from '../models/Lead';

// @desc    Create a public inquiry (lead)
// @route   POST /api/v1/public/inquiries
// @access  Public
export const createPublicInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, productInterest, message, serviceType } = req.body;

    const lead = await Lead.create({
      name,
      phone,
      email,
      source: 'WEBSITE',
      serviceType: serviceType || 'PRODUCT_INQUIRY',
      productInterest,
      message,
      status: 'NEW',
    });

    res.status(201).json(lead);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all leads
// @route   GET /api/v1/leads
// @access  Private/Admin
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query: any = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.serviceType) {
      query.serviceType = req.query.serviceType;
    }

    if (req.query.excludeServiceType) {
      query.serviceType = { $ne: req.query.excludeServiceType };
    }
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query.$or = [{ name: searchRegex }, { phone: searchRegex }, { email: searchRegex }];
    }

    const items = await Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Lead.countDocuments(query);

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

// @desc    Create lead (Admin)
// @route   POST /api/v1/leads
// @access  Private/Admin
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update lead
// @route   PUT /api/v1/leads/:id
// @access  Private/Admin
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
