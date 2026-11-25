import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
const plivo = require('plivo');
import { sendBookingReceived } from '../utils/sendSMS';
import Lead from '../models/Lead';
import {
  converseWithGemini,
  endCallSession,
  synthesizeGeminiSpeech,
  storeAudio,
  getAudioBuffer,
  getAudioAsync,
  synthesizeElevenLabsSpeech,
} from '../utils/geminiVoiceAgent';
import { getPrebuiltAudioBuffer, getPrebuiltAudioInfo } from '../utils/prebuiltAudio';

// Support escalation phone number for RepairCart (configured for testing: +917800730968)
const SUPPORT_FORWARD_NUMBER = process.env.SUPPORT_FORWARD_NUMBER || '+917800730968';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://repaircart.co.in';
const PLIVO_AUTH_ID = process.env.PLIVO_AUTH_ID || 'MAZDI5ZMM4YTYTMJG4NY';
const PLIVO_AUTH_TOKEN = process.env.PLIVO_AUTH_TOKEN || 'YjljYWY2NjctNWQwZC00MDJlLTc5MWMtMzA5MTMy';
const PLIVO_FROM_NUMBER = process.env.PLIVO_FROM_NUMBER || '+918031775263';

// Telephony ASR hints to maximize recognition of Indian speech, TV brands and issues
const COMMON_SPEECH_HINTS =
  'Sony, Samsung, LG, Mi, Xiaomi, OnePlus, TCL, Panasonic, Vu, Realme, TV, television, repair, screen, display, panel, booking, technician, sound, audio, speaker, power, light, black screen, line, restart, remote, problem, kharab, ho gaya, kaam nahi kar raha, bilkul';

/**
 * Utility to safely escape XML special characters to prevent Plivo 8011 parse errors
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Helper to record or update an inbound caller as a Lead in MongoDB
 * Non-blocking async execution to ensure <150ms IVR response time
 */
const recordInboundCallLead = async (rawPhone: string, note: string) => {
  try {
    if (!rawPhone) return;
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length < 10) return;

    // Check if a Lead exists from today to avoid duplicate spam
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingLead = await Lead.findOne({
      phone: cleanPhone,
      createdAt: { $gte: startOfDay },
    }).sort({ createdAt: -1 });

    const timestamp = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });

    if (existingLead) {
      existingLead.message = `${note} (Last update: ${timestamp})`;
      if (existingLead.source !== 'PHONE_CALL') {
        existingLead.source = 'PHONE_CALL';
      }
      await existingLead.save();
      console.log(`[IVR] Updated existing Lead for phone caller: ${cleanPhone}`);
    } else {
      await Lead.create({
        name: `Caller ${cleanPhone}`,
        phone: cleanPhone,
        source: 'PHONE_CALL',
        serviceType: 'TV_REPAIR',
        status: 'NEW',
        message: `${note} (${timestamp})`,
      });
      console.log(`[IVR] Created new Lead for phone caller: ${cleanPhone}`);
    }
  } catch (err: any) {
    console.error('[IVR] Failed to record inbound caller Lead:', err.message);
  }
};

/**
 * Handle incoming or answered call from Plivo
 * Starts the Gemini Real-Time Voice Assistant session
 */
export const handleIncomingCall = (req: Request, res: Response) => {
  const callerNumber = req.body?.From || req.query?.From || 'Customer';
  const callUUID = req.body?.CallUUID || req.query?.CallUUID || 'unknown_call';
  console.log(`[IVR Voice AI] Call started from: ${callerNumber} (CallUUID: ${callUUID})`);

  // Record caller as a Lead in the CRM non-blockingly
  recordInboundCallLead(callerNumber, 'AI Voice Call connected with Priya (Gemini Hindi Assistant)').catch((e) =>
    console.error('[IVR] Lead recording error:', e)
  );

  const host = req.get('host') || 'tv-repair-lac.vercel.app';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const actionUrl = `${protocol}://${host}/api/v1/ivr/gemini-converse`;

  // Play ElevenLabs ultra-realistic human voice greeting
  const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${protocol}://${host}/api/v1/ivr/audio/welcome_elevenlabs.mp3</Play>
  <Record action="${actionUrl}" method="POST" maxLength="15" timeout="2" playBeep="false" redirect="true"/>
</Response>`;

  res.set('Content-Type', 'application/xml');
  return res.status(200).send(responseXml);
};

/**
 * Handle Gemini Conversational Turn
 * Receives caller's speech from Plivo, queries Gemini, and replies with human-like voice
 */
export const handleGeminiConverse = async (req: Request, res: Response) => {
  const speech = (req.body?.Speech || req.query?.Speech || '').toString().trim();
  const digits = (req.body?.Digits || req.query?.Digits || '').toString().trim();
  const recordUrl = (req.body?.RecordUrl || req.query?.RecordUrl || '').toString().trim();
  const callerNumber = (req.body?.From || req.query?.From || '').toString().trim();
  const callUUID = req.body?.CallUUID || req.query?.CallUUID || 'unknown_call';
  const toPlivoNumber = req.body?.To || req.query?.To || PLIVO_FROM_NUMBER;

  const host = req.get('host') || 'tv-repair-lac.vercel.app';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const actionUrl = `${protocol}://${host}/api/v1/ivr/gemini-converse`;

  console.log(`[IVR Voice AI] Turn for ${callUUID} | Speech: "${speech}" | Digits: "${digits}" | RecordUrl: "${recordUrl}"`);

  // Fallback if caller pressed keypad digit 2 -> connect to human manager
  if (digits === '2') {
    recordInboundCallLead(callerNumber, `Caller pressed 2 (Forwarded to Manager: ${SUPPORT_FORWARD_NUMBER})`).catch(console.error);
    const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Speak voice="Polly.Aditi" language="en-IN">Please hold while I connect your call directly to our senior service manager.</Speak>
  <Dial callerId="${toPlivoNumber}">
    <Number>${SUPPORT_FORWARD_NUMBER}</Number>
  </Dial>
</Response>`;
    res.set('Content-Type', 'application/xml');
    return res.status(200).send(responseXml);
  }

  // Fetch caller audio recording if provided by Plivo <Record>
  let callerAudioBuffer: Buffer | undefined;
  let audioMime = 'audio/mp3';
  if (recordUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1400);
      const audioFetch = await fetch(recordUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (audioFetch.ok) {
        const arrayBuf = await audioFetch.arrayBuffer();
        callerAudioBuffer = Buffer.from(arrayBuf);
        if (recordUrl.endsWith('.wav')) audioMime = 'audio/wav';
        console.log(`[IVR Voice AI] Fetched caller audio recording: ${callerAudioBuffer.length} bytes`);
      }
    } catch (e: any) {
      console.warn('[IVR Voice AI] Could not fetch RecordUrl (timed out or error):', e.message);
    }
  }

  // If no speech or digits (caller remained silent for full timeout)
  if (!speech && !digits && (!callerAudioBuffer || callerAudioBuffer.length < 500)) {
    const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${protocol}://${host}/api/v1/ivr/audio/silence_elevenlabs.mp3</Play>
  <Record action="${actionUrl}" method="POST" maxLength="15" timeout="2" playBeep="false" redirect="true"/>
</Response>`;
    res.set('Content-Type', 'application/xml');
    return res.status(200).send(responseXml);
  }

  // Query Gemini Multimodal Conversational Voice AI
  const userText = speech || (digits ? `Keypad pressed: ${digits}` : '');
  const geminiResult = await converseWithGemini(callUUID, userText, callerNumber, callerAudioBuffer, audioMime);
  const replyText = geminiResult.replyText;

  // Log conversation in CRM Lead non-blockingly
  recordInboundCallLead(
    callerNumber,
    `AI Voice Turn: Customer spoken -> Priya replied: "${replyText}"`
  ).catch(console.error);

  // Check actions from Gemini response
  if (geminiResult.action === 'TRANSFER_MANAGER') {
    const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Speak voice="Polly.Aditi" language="hi-IN">${escapeXml(replyText)}</Speak>
  <Dial callerId="${toPlivoNumber}">
    <Number>${SUPPORT_FORWARD_NUMBER}</Number>
  </Dial>
</Response>`;
    res.set('Content-Type', 'application/xml');
    return res.status(200).send(responseXml);
  }

  if (geminiResult.action === 'SEND_BOOKING_SMS') {
    // Send SMS with booking link via MSG91
    if (callerNumber) {
      const cleanPhone = callerNumber.replace(/\D/g, '');
      sendBookingReceived(cleanPhone, {
        name: 'Valued Customer',
        ticket: 'RC-AI-BOOK',
        item: 'Doorstep TV Inspection',
        url: `${FRONTEND_URL}/book`,
      }).catch((e) => console.error('[IVR SMS error]:', e));
    }
  }

  if (geminiResult.action === 'END_CALL') {
    const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${protocol}://${host}/api/v1/ivr/audio/goodbye_elevenlabs.mp3</Play>
  <Hangup/>
</Response>`;
    res.set('Content-Type', 'application/xml');
    return res.status(200).send(responseXml);
  }

  // Ultra-Realistic Human Voice Output:
  // 1. ElevenLabs Turbo v2.5 with Sarah voice (rich, 100% human Indian Hindi voice)
  let voiceAudioUrl = '';
  try {
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3200));
    const elevenMp3 = await Promise.race([synthesizeElevenLabsSpeech(replyText), timeoutPromise]);
    if (elevenMp3) {
      const audioId = await storeAudio(elevenMp3, undefined, 'audio/mpeg');
      voiceAudioUrl = `${protocol}://${host}/api/v1/ivr/audio/${audioId}.mp3`;
    }
  } catch (err: any) {
    console.warn('[IVR Voice AI] ElevenLabs synthesis error:', err.message);
  }

  // 2. Google Gemini 2.5 Flash Native Speech TTS fallback (warm human neural voice)
  if (!voiceAudioUrl) {
    try {
      const geminiWav = await synthesizeGeminiSpeech(replyText);
      if (geminiWav) {
        const audioId = await storeAudio(geminiWav, undefined, 'audio/wav');
        voiceAudioUrl = `${protocol}://${host}/api/v1/ivr/audio/${audioId}.wav`;
      }
    } catch (err: any) {
      console.warn('[IVR Voice AI] Gemini TTS fallback error:', err.message);
    }
  }

  let voicePlayXml = '';
  if (voiceAudioUrl) {
    voicePlayXml = `<Play>${voiceAudioUrl}</Play>`;
  } else {
    voicePlayXml = `<Speak voice="Polly.Aditi" language="hi-IN">${escapeXml(replyText)}</Speak>`;
  }

  // Next conversational turn: Play Priya's voice and listen with Record
  const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${voicePlayXml}
  <Record action="${actionUrl}" method="POST" maxLength="15" timeout="2" playBeep="false" redirect="true"/>
</Response>`;

  res.set('Content-Type', 'application/xml');
  return res.status(200).send(responseXml);
};

/**
 * Endpoint to serve dynamically synthesized ElevenLabs and Gemini audio files to Plivo
 */
export const handleAudioPlayback = async (req: Request, res: Response) => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || '';
  const cleanId = rawId.replace(/\.(wav|mp3)$/i, '');

  // 1. Check pre-compiled ElevenLabs & Gemini audio (0ms serverless in-memory)
  const prebuilt = getPrebuiltAudioInfo(cleanId);
  if (prebuilt) {
    res.set({
      'Content-Type': prebuilt.contentType,
      'Content-Length': prebuilt.buffer.length.toString(),
      'Cache-Control': 'public, max-age=86400',
    });
    return res.status(200).send(prebuilt.buffer);
  }

  // 2. Dynamic session cache & cross-serverless MongoDB persistence
  const dynamicAudio = await getAudioAsync(cleanId);
  if (dynamicAudio) {
    res.set({
      'Content-Type': dynamicAudio.contentType,
      'Content-Length': dynamicAudio.buffer.length.toString(),
      'Cache-Control': 'public, max-age=86400',
    });
    return res.status(200).send(dynamicAudio.buffer);
  }

  // 3. Fallback to disk if running in persistent environment
  const diskMp3 = path.join(process.cwd(), 'public', `${cleanId}.mp3`);
  if (fs.existsSync(diskMp3)) {
    const buf = fs.readFileSync(diskMp3);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buf.length.toString(),
      'Cache-Control': 'public, max-age=86400',
    });
    return res.status(200).send(buf);
  }

  const diskWav = path.join(process.cwd(), 'public', `${cleanId}.wav`);
  if (fs.existsSync(diskWav)) {
    const buf = fs.readFileSync(diskWav);
    res.set({
      'Content-Type': 'audio/wav',
      'Content-Length': buf.length.toString(),
      'Cache-Control': 'public, max-age=86400',
    });
    return res.status(200).send(buf);
  }

  return res.status(404).send('Audio not found or expired');
};

/**
 * Handle call status / CDR (Call Detail Record) callback
 */
export const handleCallStatus = (req: Request, res: Response) => {
  const { CallUUID, From, To, CallStatus, Duration, BillRate } = req.body;
  console.log(`[IVR CDR] Call ${CallUUID}: ${From} -> ${To} | Status: ${CallStatus} | Duration: ${Duration}s | Bill: ${BillRate}`);
  if (CallUUID) {
    endCallSession(CallUUID);
  }
  if (From && Duration) {
    recordInboundCallLead(From, `Call completed (${Duration}s, status: ${CallStatus})`).catch((e) =>
      console.error('[IVR] Lead status update error:', e)
    );
  }
  return res.status(200).json({ status: 'ok', logged: true });
};

/**
 * Trigger an outbound test call to a customer's phone
 * Dialed from Plivo Virtual Number (+91 80 3177 5263)
 */
export const triggerOutboundCall = async (req: Request, res: Response) => {
  const rawTo = req.body?.to || req.query?.to || '+917800730968';

  let cleanTo = String(rawTo).replace(/[\s()-]/g, '');
  if (/^[6-9]\d{9}$/.test(cleanTo)) {
    cleanTo = `+91${cleanTo}`;
  } else if (!cleanTo.startsWith('+')) {
    cleanTo = `+${cleanTo}`;
  }

  const host = req.get('host') || 'tv-repair-lac.vercel.app';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const answerUrl = `${protocol}://${host}/api/v1/ivr/incoming`;

  try {
    const plivoUrl = `https://api.plivo.com/v1/Account/${PLIVO_AUTH_ID}/Call/`;
    const authHeader = 'Basic ' + Buffer.from(`${PLIVO_AUTH_ID}:${PLIVO_AUTH_TOKEN}`).toString('base64');

    const plivoPayload = {
      from: PLIVO_FROM_NUMBER,
      to: cleanTo,
      answer_url: answerUrl,
      answer_method: 'POST',
    };

    const plivoRes = await fetch(plivoUrl, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plivoPayload),
    });

    const data: any = await plivoRes.json();
    if (plivoRes.status === 201) {
      console.log(`[IVR Outbound] Call queued for ${cleanTo}:`, data);
      return res.status(200).json({
        success: true,
        message: `Outbound AI Voice Call initiated to ${cleanTo}`,
        callUUID: data.request_uuid || data.api_id,
        from: PLIVO_FROM_NUMBER,
      });
    } else {
      console.error(`[IVR Outbound Error]:`, data);
      return res.status(plivoRes.status).json({ success: false, error: data });
    }
  } catch (err: any) {
    console.error(`[IVR Outbound Exception]:`, err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};
