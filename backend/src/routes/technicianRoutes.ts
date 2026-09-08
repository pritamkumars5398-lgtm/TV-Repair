import express from 'express';
import {
  getDashboardStats,
  getTechnicianJobs,
  markOnTheWay,
  verifyPickupOtp,
  createEstimate,
  getJobDetail,
  updateJobStatus,
  addRepairNote,
  notifyPickup,
  uploadJobPhotos
} from '../controllers/technicianController';
import { protectTechnician } from '../middlewares/authMiddleware';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.use(protectTechnician); // Protect all technician routes

router.get('/dashboard', getDashboardStats);
router.get('/jobs', getTechnicianJobs);
router.get('/jobs/:ticketId', getJobDetail);
router.put('/jobs/:ticketId/status', updateJobStatus);
router.post('/jobs/:ticketId/notes', addRepairNote);
router.post('/jobs/:ticketId/on-the-way', markOnTheWay);
router.post('/jobs/:ticketId/verify-pickup', verifyPickupOtp);
router.post('/jobs/:ticketId/notify-pickup', notifyPickup);
router.post('/jobs/:ticketId/estimate', createEstimate);
router.post('/jobs/:ticketId/photos', upload.array('photos', 5), uploadJobPhotos);

export default router;
