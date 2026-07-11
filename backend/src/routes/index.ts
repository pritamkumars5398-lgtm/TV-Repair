import express from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import leadRoutes from './leadRoutes';
import publicRoutes from './publicRoutes';
import ticketRoutes from './ticketRoutes';
import paymentRoutes from './paymentRoutes';
import blogRoutes from './blogRoutes';
import feedbackRoutes from './feedbackRoutes';
import customerAuthRoutes from './customerAuthRoutes';
import customerRoutes from './customerRoutes';
import customerPortalRoutes from './customerPortalRoutes';
import adminRoutes from './adminRoutes';
import { protectAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/customer-auth', customerAuthRoutes);
router.use('/customers', customerRoutes);
router.use('/customer', customerPortalRoutes);
router.use('/products', productRoutes);
router.use('/leads', leadRoutes);
router.use('/public', publicRoutes);
router.use('/tickets', ticketRoutes);
router.use('/payments', paymentRoutes);
router.use('/blogs', blogRoutes);
router.use('/feedbacks', feedbackRoutes);
router.use('/admin', protectAdmin, adminRoutes);

export default router;

