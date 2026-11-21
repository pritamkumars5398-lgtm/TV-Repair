import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { sendBookingReceived } from '../utils/sendSMS';
import Lead from '../models/Lead';
import {
  converseWithGemini,
  endCallSession,
  synthesizeGeminiSpeech,
  storeAudio,
  getAudioBuffer,
} from '../utils/geminiVoiceAgent';
import { getPrebuiltAudioBuffer } from '../utils/prebuiltAudio';

// Support escalation phone number for RepairCart (Imran Khan / Operations)
const SUPPORT_FORWARD_NUMBER = process.env.SUPPORT_FORWARD_NUMBER || '+918586887887';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://repaircart.co.in';
const PLIVO_AUTH_ID = process.env.PLIVO_AUTH_ID || 'MAZDI5ZMM4YTYTMJG4NY';
const PLIVO_AUTH_TOKEN = process.env.PLIVO_AUTH_TOKEN || 'YjljYWY2NjctNWQwZC00MDJlLTc5MWMtMzA5MTMy';
const PLIVO_FROM_NUMBER = process.env.PLIVO_FROM_NUMBER || '+918031775263';

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

  const audioUrl = `${protocol}://${host}/api/v1/ivr/audio/welcome_greeting.wav`;
  const silenceUrl = `${protocol}://${host}/api/v1/ivr/audio/silence_prompt.wav`;
  const timeoutUrl = `${protocol}://${host}/api/v1/ivr/audio/timeout_goodbye.wav`;

  // Start in Hindi with Gemini Native Voice TTS.
  // Note: Plivo ASR requires language="en-IN" (India model which natively understands Hindi & Hinglish).
  // Plivo strictly permits only ONE <GetInput> verb per <Response>.
  const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <GetInput action="${actionUrl}" method="POST" inputType="speech" executionTimeout="15" speechEndTimeout="2" language="en-IN">
    <Play>${audioUrl}</Play>
  </GetInput>
  <Play>${silenceUrl}</Play>
  <Play>${timeoutUrl}</Play>
</Response>`;

  res.set('Content-Type', 'text/xml');
  return res.status(200).send(responseXml);
};

/**
 * Handle Gemini Conversational Turn
 * Receives caller's speech from Plivo, queries Gemini, and replies with human-like voice
 */
export const handleGeminiConverse = async (req: Request, res: Response) => {
  const speech = (req.body?.Speech || req.query?.Speech || '').toString().trim();
  const digits = (req.body?.Digits || req.query?.Digits || '').toString().trim();
  const callerNumber = (req.body?.From || req.query?.From || '').toString().trim();
  const callUUID = req.body?.CallUUID || req.query?.CallUUID || 'unknown_call';
  const toPlivoNumber = req.body?.To || req.query?.To || PLIVO_FROM_NUMBER;

  const host = req.get('host') || 'tv-repair-lac.vercel.app';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const actionUrl = `${protocol}://${host}/api/v1/ivr/gemini-converse`;

  console.log(`[IVR Voice AI] Turn for ${callUUID} | Speech: "${speech}" | Digits: "${digits}"`);

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
    res.set('Content-Type', 'text/xml');
    return res.status(200).send(responseXml);
  }

  // If no speech captured (silence/background noise)
  if (!speech && !digits) {
    const silenceUrl = `${protocol}://${host}/api/v1/ivr/audio/silence_prompt.wav`;
    const timeoutUrl = `${protocol}://${host}/api/v1/ivr/audio/timeout_goodbye.wav`;

    const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <GetInput action="${actionUrl}" method="POST" inputType="speech" executionTimeout="15" speechEndTimeout="2" language="en-IN">
    <Play>${silenceUrl}</Play>
  </GetInput>
  <Play>${timeoutUrl}</Play>
</Response>`;
    res.set('Content-Type', 'text/xml');
    return res.status(200).send(responseXml);
  }

  // Query Gemini Conversational Voice AI
  const userText = speech || `Keypad pressed: ${digits}`;
  const geminiResult = await converseWithGemini(callUUID, userText, callerNumber);
  const replyText = geminiResult.replyText;

  // Log conversation in CRM Lead non-blockingly
  recordInboundCallLead(
    callerNumber,
    `AI Voice: Customer said "${userText}" -> Priya replied "${replyText}"`
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
    res.set('Content-Type', 'text/xml');
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
    let byeAudioUrl = '';
    try {
      const audioBuf = await synthesizeGeminiSpeech(replyText);
      if (audioBuf) {
        const audioId = storeAudio(audioBuf);
        byeAudioUrl = `${protocol}://${host}/api/v1/ivr/audio/${audioId}.wav`;
      }
    } catch {}

    const promptSnippet = byeAudioUrl
      ? `<Play>${byeAudioUrl}</Play>`
      : `<Speak voice="Polly.Aditi" language="hi-IN">${escapeXml(replyText)}</Speak>`;

    const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${promptSnippet}
  <Hangup/>
</Response>`;
    res.set('Content-Type', 'text/xml');
    return res.status(200).send(responseXml);
  }

  // Synthesize Gemini Human Voice for the conversational response
  let replyAudioUrl = '';
  try {
    const audioBuf = await synthesizeGeminiSpeech(replyText);
    if (audioBuf) {
      const audioId = storeAudio(audioBuf);
      replyAudioUrl = `${protocol}://${host}/api/v1/ivr/audio/${audioId}.wav`;
    }
  } catch (err: any) {
    console.warn('[Gemini TTS turn error]:', err.message);
  }

  const promptSnippet = replyAudioUrl
    ? `<Play>${replyAudioUrl}</Play>`
    : `<Speak voice="Polly.Aditi" language="hi-IN">${escapeXml(replyText)}</Speak>`;

  // Default: Play realistic voice and continue conversational listening loop with language="en-IN"
  const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <GetInput action="${actionUrl}" method="POST" inputType="speech" executionTimeout="15" speechEndTimeout="2" language="en-IN">
    ${promptSnippet}
  </GetInput>
  <Speak voice="Polly.Aditi" language="hi-IN">धन्यवाद सर, आप repaircart.co.in पर कभी भी विजिट कर सकते हैं।</Speak>
</Response>`;

  res.set('Content-Type', 'text/xml');
  return res.status(200).send(responseXml);
};

/**
 * Endpoint to serve dynamically synthesized Gemini audio WAV files to Plivo
 */
export const handleAudioPlayback = (req: Request, res: Response) => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || '';
  const cleanId = rawId.replace(/\.wav$/i, '');

  // 1. Check pre-compiled Gemini TTS audio (0ms serverless guaranteed)
  let audioBuffer = getPrebuiltAudioBuffer(cleanId);

  // 2. Fallback to dynamic session cache
  if (!audioBuffer) {
    audioBuffer = getAudioBuffer(cleanId);
  }

  // 3. Fallback to disk if running in persistent environment
  if (!audioBuffer) {
    const diskPath = path.join(process.cwd(), 'public', `${cleanId}.wav`);
    if (fs.existsSync(diskPath)) {
      audioBuffer = fs.readFileSync(diskPath);
    }
  }

  if (!audioBuffer) {
    return res.status(404).send('Audio not found or expired');
  }

  res.set({
    'Content-Type': 'audio/wav',
    'Content-Length': audioBuffer.length.toString(),
    'Cache-Control': 'public, max-age=86400',
  });
  return res.status(200).send(audioBuffer);
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
  const rawTo = req.body?.to || req.query?.to;
  if (!rawTo) {
    return res.status(400).json({ error: 'Missing destination phone number in request body: { to: "+91XXXXXXXXXX" }' });
  }

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
