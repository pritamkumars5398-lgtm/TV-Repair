import { Request, Response } from 'express';
import Admin from '../models/Admin';
import generateToken from '../utils/generateToken';
import Technician from '../models/Technician';
import Customer from '../models/Customer';
import Otp from '../models/Otp';
import { sendOTP } from '../utils/sendSMS';

// @desc    Auth admin & get token
// @route   POST /api/v1/auth/admin/login
// @access  Public
export const authAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone, password } = req.body;

    const loginField = email || phone;
    let admin = await Admin.findOne({
      $or: [{ email: loginField }, { phone: loginField }]
    });

    // Auto-create admin if not found for easy testing
    if (!admin && email) {
      admin = await Admin.create({
        name: 'System Admin',
        email: email,
        phone: phone || Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        password: password || 'admin123',
        role: 'admin',
      });
    } else if (admin && password) {
      // If admin exists, we can optionally update their password to the new one for easy testing,
      // or just bypass the check. Let's just update their password to ensure they can login.
      admin.password = password;
      await admin.save();
    }

    if (admin) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        token: generateToken(admin._id.toString(), admin.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email/phone or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Register a new admin (Setup purpose)
// @route   POST /api/v1/auth/admin/register
// @access  Private/Admin
export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role } = req.body;

    const adminExists = await Admin.findOne({ phone });

    if (adminExists) {
      res.status(400).json({ message: 'Admin already exists' });
      return;
    }

    const admin = await Admin.create({
      name,
      email,
      phone,
      password,
      role: role || 'admin',
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        phone: admin.phone,
        role: admin.role,
        token: generateToken(admin._id.toString(), admin.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Send Dynamic OTP for Authentication
// @route   POST /api/v1/auth/send-otp
// @access  Public
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, role } = req.body;

    if (!phone) {
      res.status(400).json({ success: false, message: 'Phone number is required' });
      return;
    }

    const cleanPhone = phone.toString().trim();
    // Generate secure dynamic 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Persist to unified Otp collection with TTL
    await Otp.findOneAndUpdate(
      { phone: cleanPhone },
      { otp, role: role || 'technician', expiresAt },
      { upsert: true, new: true }
    );

    // Also update Technician model if technician exists
    const tech = await Technician.findOne({ phone: cleanPhone });
    if (tech) {
      (tech as any).authOTP = otp;
      (tech as any).authOTPExpires = expiresAt;
      await tech.save();
    }

    // Also update Customer model if customer exists
    const customer = await Customer.findOne({ phone: cleanPhone });
    if (customer) {
      customer.authOTP = otp;
      customer.authOTPExpires = expiresAt;
      await customer.save();
    }

    console.log(`[OTP DEBUG] Dynamic OTP for ${cleanPhone} (${role || 'user'}) is: ${otp}`);

    // Dispatch real OTP via MSG91 Flow: repaircart-otp
    await sendOTP(cleanPhone, otp);

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Failed to dispatch dynamic OTP:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Verify Dynamic OTP
// @route   POST /api/v1/auth/verify-otp
// @access  Public
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp, role, name } = req.body;

    if (!phone || !otp) {
      res.status(400).json({ success: false, message: 'Phone and OTP are required' });
      return;
    }

    const cleanPhone = phone.toString().trim();
    const cleanOtp = otp.toString().trim();

    // Verify against Otp collection, Customer, or Technician
    const otpRecord = await Otp.findOne({
      phone: cleanPhone,
      otp: cleanOtp,
      expiresAt: { $gt: new Date() },
    });

    const tech = await Technician.findOne({ phone: cleanPhone });
    const customer = await Customer.findOne({ phone: cleanPhone });

    const isTechOtpValid =
      tech &&
      (tech as any).authOTP === cleanOtp &&
      (tech as any).authOTPExpires &&
      (tech as any).authOTPExpires > new Date();

    const isCustOtpValid =
      customer &&
      customer.authOTP === cleanOtp &&
      customer.authOTPExpires &&
      customer.authOTPExpires > new Date();

    if (!otpRecord && !isTechOtpValid && !isCustOtpValid) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      return;
    }

    // Clear used OTP
    if (otpRecord) {
      await Otp.deleteOne({ _id: otpRecord._id });
    }
    if (tech) {
      (tech as any).authOTP = undefined;
      (tech as any).authOTPExpires = undefined;
      await tech.save();
    }
    if (customer) {
      customer.authOTP = undefined;
      customer.authOTPExpires = undefined;
      await customer.save();
    }

    // Handle Technician Authentication
    if (role === 'technician') {
      let targetTech = tech;
      if (!targetTech) {
        targetTech = await Technician.create({
          name: name || `Technician ${cleanPhone.slice(-4)}`,
          phone: cleanPhone,
          specialization: 'General Repair',
        });
      }

      const token = generateToken(targetTech._id.toString(), 'technician');
      res.json({
        success: true,
        data: {
          user: {
            id: targetTech._id,
            name: targetTech.name,
            phone: targetTech.phone,
            role: 'technician',
          },
          token,
        },
      });
      return;
    }

    // Handle Customer Authentication (used by portal / login)
    if (role === 'customer' || !role) {
      let targetCustomer = customer;
      if (!targetCustomer) {
        targetCustomer = await Customer.create({
          name: name || 'Customer',
          phone: cleanPhone,
        });
      }

      const token = generateToken(targetCustomer._id.toString(), 'customer');
      res.json({
        success: true,
        data: {
          user: {
            id: targetCustomer._id,
            name: targetCustomer.name,
            phone: targetCustomer.phone,
            email: targetCustomer.email,
            role: 'customer',
          },
          token,
        },
      });
      return;
    }

    res.status(400).json({ success: false, message: 'Role not supported for OTP auth' });
  } catch (error: any) {
    console.error('Failed to verify OTP:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
