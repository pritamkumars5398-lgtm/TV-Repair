import express from 'express';
import { createPublicInquiry } from '../controllers/leadController';
import { createBooking, verifyPayment, trackTicket } from '../controllers/publicBookingController';

const router = express.Router();

router.post('/inquiries', createPublicInquiry);
router.post('/leads', createPublicInquiry);

router.post('/bookings', createBooking);
router.post('/bookings/verify-payment', verifyPayment);

router.get('/track/:ticketId', trackTicket);

export default router;
