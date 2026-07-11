import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Technician from '../models/Technician';
import InventoryItem from '../models/InventoryItem';
import Product from '../models/Product';

const seedProducts = async () => {
  try {
    console.log('--- SEEDING REAL PRODUCTS AND COPYING IMAGES ---');
    
    const srcDir = path.join(process.cwd(), '..', 'frontend', 'assets', 'images');
    const destDir = path.join(process.cwd(), '..', 'frontend', 'public', 'images');
    
    // Ensure destDir exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    const imagesToCopy = [
      'WhatsApp Image 2026-07-10 at 19.37.19.jpeg',
      'WhatsApp Image 2026-07-10 at 19.37.18.jpeg',
      'WhatsApp Image 2026-07-10 at 19.37.19 (1).jpeg',
      'WhatsApp Image 2026-07-10 at 19.29.00.jpeg',
      'WhatsApp Image 2026-07-10 at 19.28.52 (2).jpeg'
    ];
    
    imagesToCopy.forEach(imgName => {
      const srcPath = path.join(srcDir, imgName);
      const destPath = path.join(destDir, imgName);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied image to public folder: ${imgName}`);
      } else {
        console.warn(`Source image not found in assets/images: ${imgName}`);
      }
    });
    
    // Clear and insert products
    await Product.deleteMany({});
    console.log('Cleared existing products.');
    
    await Product.create([
      {
        name: 'GOONZ Premium Tower Speaker',
        category: 'sound',
        desc: 'Experience state-of-the-art sound with the GOONZ Premium Tower Speaker. Featuring deep bass, clear treble, and wireless Bluetooth connectivity.',
        specs: ['100W RMS', 'Bluetooth 5.0', 'Wood Cabinet', 'LED Lights', 'Remote Control'],
        price: '₹14,999',
        img: '/images/WhatsApp Image 2026-07-10 at 19.37.19.jpeg',
        isApproved: true
      },
      {
        name: 'Mega Bass XT Single Tower Speaker',
        category: 'sound',
        desc: 'Power up your music with Mega Bass XT. Designed for clear vocals and thunderous bass, ideal for large rooms and party setups.',
        specs: ['140W RMS', 'Dual Subwoofer', 'Bluetooth/USB/AUX', 'FM Radio', 'Mic Input'],
        price: '₹18,500',
        img: '/images/WhatsApp Image 2026-07-10 at 19.37.18.jpeg',
        isApproved: true
      },
      {
        name: 'Professional Single Tower Speaker',
        category: 'sound',
        desc: 'Professional single tower speaker system. Built-in amplifier, powerful sound projection, and karaoke support.',
        specs: ['80W Output', 'Karaoke Supported', 'Bluetooth / SD Card', 'Wireless Mic Included'],
        price: '₹9,999',
        img: '/images/WhatsApp Image 2026-07-10 at 19.37.19 (1).jpeg',
        isApproved: true
      },
      {
        name: 'Premium Home Theater Soundbar System',
        category: 'Home Theater',
        desc: 'Complete soundbar and subwoofer system components. Cinematic surround sound with optical input, HDMI ARC, and deep bass subwoofer.',
        specs: ['120W Peak Power', 'Wireless Subwoofer', 'HDMI ARC & Optical', 'Wall Mountable'],
        price: '₹15,999',
        img: '/images/WhatsApp Image 2026-07-10 at 19.29.00.jpeg',
        isApproved: true
      },
      {
        name: 'INCHELL Cobra IC-9066 Intercom System',
        category: 'Home Audio',
        desc: 'INCHELL Cobra multi-line intercom system. Supports up to 9 extensions, secure communication, clear voice quality, and easy installation.',
        specs: ['Cobra IC-9066', 'Up to 9 Lines', 'Junction box included', 'AC Power Adapter'],
        price: '₹5,499',
        img: '/images/WhatsApp Image 2026-07-10 at 19.28.52 (2).jpeg',
        isApproved: true
      }
    ]);
    
    console.log('Real products seeded successfully.');
  } catch (error: any) {
    console.error(`Seeding products failed: ${error.message}`);
  }
};

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
  // If already connected or connecting, run seedProducts and return
  if (mongoose.connection.readyState >= 1) {
    seedProducts();
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
    
    await seedInitialData();
    await seedProducts();
  } catch (error: any) {
    dbError = error.message || String(error);
    console.error(`Database Connection Error: ${error.message}`);
    // Do not call process.exit(1) to prevent crashing the serverless container
  }
};

