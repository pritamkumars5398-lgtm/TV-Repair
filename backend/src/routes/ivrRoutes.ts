import express from 'express';
import {
  handleIncomingCall,
  handleGeminiConverse,
  handleCallStatus,
  triggerOutboundCall,
  handleAudioPlayback,
} from '../controllers/ivrController';

const router = express.Router();

/**
 * @route   GET /api/v1/ivr/audio/:id
 * @desc    Serves dynamically synthesized Gemini human voice WAV audio
 * @access  Public
 */
router.get('/audio/:id', handleAudioPlayback);

/**
 * @route   POST /api/v1/ivr/incoming
 * @desc    Plivo Voice entrypoint: greets caller with Priya and initiates speech recognition
 * @access  Public (Plivo Webhook)
 */
router.post('/incoming', handleIncomingCall);
router.get('/incoming', handleIncomingCall);

/**
 * @route   POST /api/v1/ivr/gemini-converse
 * @desc    Gemini Conversational Voice Loop: processes caller's spoken words and responds in real time
 * @access  Public (Plivo Webhook)
 */
router.post('/gemini-converse', handleGeminiConverse);
router.get('/gemini-converse', handleGeminiConverse);

/**
 * @route   POST /api/v1/ivr/outbound-call
 * @desc    Trigger an automated AI Voice call to a user's phone for testing or customer callback
 * @access  Public / Protected
 */
router.post('/outbound-call', triggerOutboundCall);
router.get('/outbound-call', triggerOutboundCall);

/**
 * @route   POST /api/v1/ivr/status
 * @desc    Call status & duration CDR callback
 * @access  Public (Plivo Webhook)
 */
router.post('/status', handleCallStatus);

export default router;
