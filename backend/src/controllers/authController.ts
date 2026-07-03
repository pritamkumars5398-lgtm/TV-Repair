import { Request, Response } from 'express';
import Admin from '../models/Admin';
import generateToken from '../utils/generateToken';

// @desc    Auth admin & get token
// @route   POST /api/v1/auth/admin/login
// @access  Public
export const authAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;

    let admin = await Admin.findOne({ phone });

    // Seed default admin if it doesn't exist (Fixed credentials as requested)
    if (!admin && phone === '9876543210' && password === 'admin123') {
      admin = await Admin.create({
        name: 'System Admin',
        phone: '9876543210',
        password: 'admin123',
        role: 'admin',
      });
    }

    // Assuming we have added `.matchPassword` to the Admin schema methods
    if (admin && (await (admin as any).matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        phone: admin.phone,
        role: admin.role,
        token: generateToken(admin._id.toString(), admin.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid phone number or password' });
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
