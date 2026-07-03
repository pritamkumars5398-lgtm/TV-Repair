import express from 'express';
import { submitFeedback, getAdminFeedbacks } from '../controllers/feedbackController';
import { protectAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', submitFeedback);
router.get('/admin', protectAdmin, getAdminFeedbacks);

export default router;
