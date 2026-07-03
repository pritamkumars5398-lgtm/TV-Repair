import express from 'express';
import {
  getDashboard,
  getRevenueChart,
  getLeadSourceChart,
  getCustomers,
  getTechnicians,
  createTechnician,
  updateTechnician,
  getInventory,
  updateStock,
  getReports,
} from '../controllers/adminController';

const router = express.Router();

router.get('/dashboard', getDashboard);
router.get('/reports/revenue', getRevenueChart);
router.get('/reports/lead-sources', getLeadSourceChart);
router.get('/customers', getCustomers);
router.route('/technicians')
  .get(getTechnicians)
  .post(createTechnician);
router.put('/technicians/:id', updateTechnician);
router.get('/inventory', getInventory);
router.put('/inventory/:id/stock', updateStock);
router.get('/reports', getReports);

export default router;
