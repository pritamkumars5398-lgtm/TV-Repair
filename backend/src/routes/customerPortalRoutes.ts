import express from 'express';
import { getCustomerDashboard, getCustomerTickets, getCustomerProfile, updateCustomerProfile } from '../controllers/customerController';
import { protectCustomer } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/dashboard', protectCustomer, getCustomerDashboard);
router.get('/tickets', protectCustomer, getCustomerTickets);
router.route('/profile')
  .get(protectCustomer, getCustomerProfile)
  .put(protectCustomer, updateCustomerProfile);

export default router;
