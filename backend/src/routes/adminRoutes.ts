import express from 'express';
import {
  getDashboard,
  getRevenueChart,
  getLeadSourceChart,
  getCustomers,
  getTechnicians,
  getTechnicianReport,
  createTechnician,
  updateTechnician,
  getInventory,
  updateStock,
  getReports,
  assignTechnician,
  getNotifications,
  markNotificationRead,
  sendEstimateToCustomer,
  sendMessageToCustomer,
  globalSearch
} from '../controllers/adminController';
import multer from 'multer';
import { uploadToCloudinary } from '../utils/cloudinary';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Global Search
router.get('/search', globalSearch);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

router.get('/dashboard', getDashboard);
router.get('/reports/revenue', getRevenueChart);
router.get('/reports/lead-sources', getLeadSourceChart);
router.get('/reports/technicians', getTechnicianReport);
router.get('/customers', getCustomers);
router.route('/technicians')
  .get(getTechnicians)
  .post(createTechnician);
router.put('/technicians/:id', updateTechnician);
router.get('/inventory', getInventory);
router.put('/inventory/:id/stock', updateStock);
router.get('/reports', getReports);
router.post('/tickets/:ticketId/assign', assignTechnician);
router.post('/tickets/:ticketId/send-estimate', sendEstimateToCustomer);
router.post('/tickets/:ticketId/send-message', sendMessageToCustomer);

// General image upload route
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }
    const imageUrl = await uploadToCloudinary(file.buffer, 'admin_uploads');
    res.json({ success: true, imageUrl });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
});

export default router;
