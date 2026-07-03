import express from 'express';
import { getCustomers } from '../controllers/customerController';
import { protectAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').get(protectAdmin, getCustomers);

export default router;
