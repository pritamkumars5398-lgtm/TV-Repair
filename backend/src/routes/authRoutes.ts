import express from 'express';
import { authAdmin, registerAdmin, sendOtp, verifyOtp } from '../controllers/authController';
import { protectAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/admin/login', authAdmin);
router.post('/admin/register', registerAdmin);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;
