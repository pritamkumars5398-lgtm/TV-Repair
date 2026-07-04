import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRoutes from './routes';
import { connectDB } from './config/db';

// Connect to Database
connectDB();

const app = express();

// Ensure uploads directory exists and serve uploaded files
const uploadsDir = path.join(process.cwd(), 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (error) {
  console.warn('Could not create uploads directory (expected in read-only environments like Vercel):', error);
}
app.use('/uploads', express.static(uploadsDir));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'TV Repair CRM API is running' });
});

// Mount API Routes
app.use('/api/v1', apiRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

export default app;
