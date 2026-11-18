import express from 'express';
import { handleIncomingCall, handleMenuSelection, handleCallStatus } from '../controllers/ivrController';

const router = express.Router();

/**
 * @route   POST /api/v1/ivr/incoming
 * @desc    Plivo Voice webhook entrypoint for inbound calls
 * @access  Public (Plivo Webhook)
 */
router.post('/incoming', handleIncomingCall);
router.get('/incoming', handleIncomingCall); // Fallback for GET testing

/**
 * @route   POST /api/v1/ivr/menu
 * @desc    Handles DTMF keypress (1: Booking link, 2: Real person transfer, 3: Tracking)
 * @access  Public (Plivo Webhook)
 */
router.post('/menu', handleMenuSelection);
router.get('/menu', handleMenuSelection);

/**
 * @route   POST /api/v1/ivr/status
 * @desc    Call status & duration CDR callback
 * @access  Public (Plivo Webhook)
 */
router.post('/status', handleCallStatus);

export default router;
