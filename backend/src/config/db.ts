import mongoose from 'mongoose';
import Technician from '../models/Technician';
import InventoryItem from '../models/InventoryItem';

const seedInitialData = async () => {
  try {
    const techCount = await Technician.countDocuments();
    if (techCount === 0) {
      console.log('Seeding initial technicians...');
      await Technician.create([
        {
          name: 'Amit Sharma',
          phone: '9876543210',
          email: 'amit@tvrepair.com',
          specialization: 'OLED/QLED Panel Repair',
          jobsCompleted: 15,
          rating: 4.8,
          isActive: true,
        },
        {
          name: 'Rohan Varma',
          phone: '9876543211',
          email: 'rohan@tvrepair.com',
          specialization: 'Motherboard & Circuits',
          jobsCompleted: 8,
          rating: 4.5,
          isActive: true,
        },
        {
          name: 'Vikram Singh',
          phone: '9876543212',
          email: 'vikram@tvrepair.com',
          specialization: 'Speaker & Audio Calibration',
          jobsCompleted: 22,
          rating: 4.9,
          isActive: true,
        },
      ]);
      console.log('Technicians seeded successfully.');
    }

    const inventoryCount = await InventoryItem.countDocuments();
    if (inventoryCount === 0) {
      console.log('Seeding initial inventory items...');
      await InventoryItem.create([
        {
          name: '55-inch OLED T-Con Board',
          category: 'Display Boards',
          sku: 'TC-OLED-55A',
          quantity: 12,
          reorderLevel: 5,
          unitPrice: 3500,
        },
        {
          name: 'Universal LED TV Backlight Strips',
          category: 'Backlights',
          sku: 'BL-LED-UNI',
          quantity: 3,
          reorderLevel: 5,
          unitPrice: 850,
        },
        {
          name: 'Power Supply Board (UA32)',
          category: 'Power Boards',
          sku: 'PS-UA32-X',
          quantity: 0,
          reorderLevel: 2,
          unitPrice: 1200,
        },
        {
          name: 'High Fidelity 4-inch Speaker Cone',
          category: 'Audio',
          sku: 'SPK-4IN-HF',
          quantity: 25,
          reorderLevel: 10,
          unitPrice: 450,
        },
      ]);
      console.log('Inventory items seeded successfully.');
    }
  } catch (error: any) {
    console.error(`Seeding error: ${error.message}`);
  }
};

let dbError: string | null = null;

export const getDbError = () => dbError;

export const connectDB = async () => {
  // If already connected or connecting, do not re-establish connection
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI || '';
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is missing.');
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    dbError = null;
    
    // Only seed initial data in development and if it hasn't been seeded
    if (process.env.NODE_ENV !== 'production') {
      await seedInitialData();
    }
  } catch (error: any) {
    dbError = error.message || String(error);
    console.error(`Database Connection Error: ${error.message}`);
    // Do not call process.exit(1) to prevent crashing the serverless container
  }
};

