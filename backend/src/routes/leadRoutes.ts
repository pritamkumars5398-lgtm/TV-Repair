import express from 'express';
import { getLeads, createLead, updateLead } from '../controllers/leadController';
import { protectAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', protectAdmin, getLeads);
router.post('/', protectAdmin, createLead);
router.put('/:id', protectAdmin, updateLead);

export default router;
