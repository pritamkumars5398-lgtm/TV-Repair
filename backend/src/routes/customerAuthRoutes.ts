import express from 'express';
import { registerCustomer, loginCustomer, getCustomerProfile, forgotPassword, sendOTP, verifyOTP, resetPasswordWithOTP } from '../controllers/customerAuthController';
import { protectCustomer } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/forgot-password', forgotPassword);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password-otp', resetPasswordWithOTP);
router.get('/profile', protectCustomer, getCustomerProfile);

export default router;
