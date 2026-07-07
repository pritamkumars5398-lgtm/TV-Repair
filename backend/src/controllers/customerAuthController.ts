import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Customer from '../models/Customer';
import { sendEmail } from '../utils/sendEmail';

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

// @desc    Forgot/Reset password
// @route   POST /api/v1/customer-auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, newPassword } = req.body;

    const customer = await Customer.findOne({ email });

    if (!customer) {
      res.status(404).json({ message: 'Customer with this email does not exist' });
      return;
    }

    customer.password = newPassword;
    await customer.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Send OTP for password reset
// @route   POST /api/v1/customer-auth/send-otp
// @access  Public
export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const customer = await Customer.findOne({ email });

    if (!customer) {
      res.status(404).json({ message: 'Customer with this email does not exist' });
      return;
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    customer.resetPasswordOTP = otp;
    customer.resetPasswordOTPExpires = expiry;
    await customer.save();

    // Log the OTP on the console for backend tracking
    console.log(`[OTP DEBUG] OTP for customer ${email} is: ${otp}`);

    // Send email with OTP
    const subject = 'Password Reset OTP - TV Repair Service';
    const message = `Your One-Time Password (OTP) for password reset is: ${otp}. This OTP is valid for 10 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; text-align: center;">TV Repair Support</h2>
        <p style="font-size: 16px; color: #334155;">Hello,</p>
        <p style="font-size: 16px; color: #334155;">You requested a password reset. Please use the following One-Time Password (OTP) to reset your password:</p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #0284c7;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #64748b; text-align: center;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">TV Repair Service &copy; ${new Date().getFullYear()}</p>
      </div>
    `;

    try {
      await sendEmail({
        email: customer.email,
        subject,
        message,
        html,
      });
    } catch (emailError) {
      console.error('Failed to send real email via SMTP, falling back to mock behavior:', emailError);
    }

    res.json({ 
      message: `OTP sent successfully.`
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Verify OTP for password reset
// @route   POST /api/v1/customer-auth/verify-otp
// @access  Public
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const customer = await Customer.findOne({ email });

    if (!customer) {
      res.status(404).json({ message: 'Customer with this email does not exist' });
      return;
    }

    if (!customer.resetPasswordOTP || customer.resetPasswordOTP !== otp) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    if (customer.resetPasswordOTPExpires && customer.resetPasswordOTPExpires < new Date()) {
      res.status(400).json({ message: 'OTP has expired' });
      return;
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Reset password using OTP
// @route   POST /api/v1/customer-auth/reset-password-otp
// @access  Public
export const resetPasswordWithOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    const customer = await Customer.findOne({ email });

    if (!customer) {
      res.status(404).json({ message: 'Customer with this email does not exist' });
      return;
    }

    if (!customer.resetPasswordOTP || customer.resetPasswordOTP !== otp) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    if (customer.resetPasswordOTPExpires && customer.resetPasswordOTPExpires < new Date()) {
      res.status(400).json({ message: 'OTP has expired' });
      return;
    }

    // Set new password and clear OTP fields
    customer.password = newPassword;
    customer.resetPasswordOTP = undefined;
    customer.resetPasswordOTPExpires = undefined;
    await customer.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
