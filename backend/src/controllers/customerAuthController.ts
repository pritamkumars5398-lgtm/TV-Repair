import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Customer from '../models/Customer';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// @desc    Register a new customer
// @route   POST /api/v1/customer-auth/register
// @access  Public
export const registerCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
      res.status(400).json({ message: 'Customer already exists' });
      return;
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      password,
    });

    if (customer) {
      res.status(201).json({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        token: generateToken(customer.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid customer data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Auth customer & get token
// @route   POST /api/v1/customer-auth/login
// @access  Public
export const loginCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const customer: any = await Customer.findOne({ email });

    if (customer && (await customer.matchPassword(password))) {
      res.json({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        token: generateToken(customer.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get customer profile
// @route   GET /api/v1/customer-auth/profile
// @access  Private (Customer)
export const getCustomerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById((req as any).user._id).select('-password');

    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
