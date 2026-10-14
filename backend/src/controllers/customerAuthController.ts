import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Customer from '../models/Customer';
import { sendOTP } from '../utils/sendSMS';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
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

// @desc    Send OTP for Login/Signup
// @route   POST /api/v1/customer-auth/send-auth-otp
// @access  Public
export const sendAuthOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, name, email } = req.body;

    if (!phone) {
      res.status(400).json({ message: 'Phone number is required' });
      return;
    }

    let customer = await Customer.findOne({ phone });

    // If customer doesn't exist and name is provided, create a placeholder
    // Or if name is not provided, maybe they are trying to login and don't exist.
    // Since unified flow, if we don't have name and they don't exist, we might ask them to sign up.
    // For simplicity, let's just generate the OTP on the existing customer or create a new one.
    if (!customer) {
      try {
        const createData: any = {
          name: name || 'Customer',
          phone,
        };
        if (email && email.trim()) {
          createData.email = email.trim();
        }
        customer = await Customer.create(createData);
      } catch (err: any) {
        if (err.code === 11000 && err.message?.includes('email')) {
          customer = await Customer.create({
            name: name || 'Customer',
            phone,
            email: `${phone.replace(/\D/g, '')}@customer.repaircart.co.in`,
          });
        } else {
          throw err;
        }
      }
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    customer.authOTP = otp;
    customer.authOTPExpires = expiry;
    await customer.save();

    console.log(`[OTP DEBUG] OTP for customer ${phone} is: ${otp}`);

    try {
      await sendOTP(customer.phone, otp);
    } catch (smsError: any) {
      console.error('Failed to dispatch OTP via MSG91:', smsError?.message || smsError);
    }

    res.json({ message: `OTP sent successfully.` });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Verify OTP for Login/Signup
// @route   POST /api/v1/customer-auth/verify-auth-otp
// @access  Public
export const verifyAuthOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      res.status(400).json({ message: 'Phone and OTP are required' });
      return;
    }

    const customer = await Customer.findOne({ phone });

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    if (!customer.authOTP || customer.authOTP !== otp) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    if (customer.authOTPExpires && customer.authOTPExpires < new Date()) {
      res.status(400).json({ message: 'OTP has expired' });
      return;
    }

    // Clear OTP fields
    customer.authOTP = undefined;
    customer.authOTPExpires = undefined;
    await customer.save();

    res.json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      token: generateToken(customer.id),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
