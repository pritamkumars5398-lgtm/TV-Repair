import express from 'express';
import { getTickets, updateTicket } from '../controllers/ticketController';
import { protectAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', protectAdmin, getTickets);
router.put('/:id', protectAdmin, updateTicket);

export default router;
