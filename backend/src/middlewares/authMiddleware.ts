import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import Customer from '../models/Customer';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protectAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      req.user = await Admin.findById(decoded.id).select('-password');

      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'manager')) {
        res.status(401).json({ message: 'Not authorized as an admin' });
        return;
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const protectCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      req.user = await Customer.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401).json({ message: 'Not authorized as a customer' });
        return;
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
