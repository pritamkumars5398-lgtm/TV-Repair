import express from 'express';
import { registerCustomer, loginCustomer, getCustomerProfile } from '../controllers/customerAuthController';
import { protectCustomer } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.get('/profile', protectCustomer, getCustomerProfile);

export default router;
