import express from 'express';
import { getCustomerDashboard, getCustomerTickets, getCustomerProfile, updateCustomerProfile, createCustomerQuery } from '../controllers/customerController';
import { protectCustomer } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/dashboard', protectCustomer, getCustomerDashboard);
router.get('/tickets', protectCustomer, getCustomerTickets);
router.route('/profile')
  .get(protectCustomer, getCustomerProfile)
  .put(protectCustomer, updateCustomerProfile);

router.post('/queries', protectCustomer, createCustomerQuery);

export default router;
