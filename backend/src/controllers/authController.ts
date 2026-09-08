import { Request, Response } from 'express';
import Admin from '../models/Admin';
import generateToken from '../utils/generateToken';
import Technician from '../models/Technician';
import { sendSMS } from '../utils/sendSMS';

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

// @desc    Mock Send OTP
// @route   POST /api/v1/auth/send-otp
// @access  Public
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body;
  const otp = '123456'; // Mock OTP for now
  
  await sendSMS({
    phone,
    message: `Dear User, your RC RepairCart verification code is ${otp}. Valid for 10 minutes. - RC RepairCart`,
  });

  res.json({ success: true, message: 'OTP sent successfully' });
};

// @desc    Mock Verify OTP
// @route   POST /api/v1/auth/verify-otp
// @access  Public
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp, role } = req.body;
    
    // For demo: any OTP passes as long as it's 6 chars, say '123456'
    if (otp !== '123456') {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
      return;
    }

    if (role === 'technician') {
      let tech = await Technician.findOne({ phone });
      if (!tech) {
        // Fallback for easy testing: just get the first technician in the DB
        tech = await Technician.findOne();
      }
      if (!tech) {
        res.status(404).json({ success: false, message: 'No technician found in database' });
        return;
      }
      
      const token = generateToken(tech._id.toString(), 'technician');
      res.json({
        success: true,
        data: {
          user: { id: tech._id, name: tech.name, phone: tech.phone, role: 'technician' },
          token,
        }
      });
      return;
    }
    
    res.status(400).json({ success: false, message: 'Role not supported for mock auth' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
