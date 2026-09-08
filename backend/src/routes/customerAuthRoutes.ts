import express from 'express';
import { getCustomerProfile, sendAuthOTP, verifyAuthOTP } from '../controllers/customerAuthController';
import { protectCustomer } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/send-auth-otp', sendAuthOTP);
router.post('/verify-auth-otp', verifyAuthOTP);
router.get('/profile', protectCustomer, getCustomerProfile);

export default router;
