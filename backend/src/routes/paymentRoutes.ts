import express from 'express';
import { getPayments } from '../controllers/paymentController';
import { protectAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', protectAdmin, getPayments);

export default router;
