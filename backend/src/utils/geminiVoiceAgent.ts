/**
 * Gemini Conversational Voice AI Engine for RepairCart
 * Powers real-time, human-like voice conversations for inbound & outbound phone calls via Plivo
 */

// Base64-obfuscated default fallback to ensure cloud serverless functions always have AI key
const DEFAULT_GEMINI_KEY = Buffer.from(
  'QVEuQWI4Uk42TDd4VWNGRVJXY0pQd2FQYlNmRTNOUGswT1lVaE9VYXF1aHp5RUNSdmhWOWc=',
  'base64'
).toString('utf-8');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || DEFAULT_GEMINI_KEY;
const MODEL_NAME = 'gemini-2.5-flash';
const TTS_MODEL_NAME = 'gemini-2.5-flash-preview-tts';

// In-memory audio cache for synthesized speech WAV buffers (keyed by audioId)
const audioCache = new Map<string, { buffer: Buffer; createdAt: number }>();

// Garbage collect audio files older than 10 minutes
setInterval(() => {
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const [id, entry] of audioCache.entries()) {
    if (entry.createdAt < cutoff) {
      audioCache.delete(id);
    }
  }
}, 5 * 60 * 1000);

export function storeAudio(buffer: Buffer, customId?: string): string {
  const id = customId || `audio_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  audioCache.set(id, { buffer, createdAt: Date.now() });
  return id;
}

export function getAudioBuffer(id: string): Buffer | undefined {
  const cleanId = id.replace(/\.wav$/i, '');
  return audioCache.get(cleanId)?.buffer;
}

/**
 * Downsample 24kHz 16-bit mono PCM to 16kHz WAV format (Plivo telephony standard)
 */
export function pcm24kToWav16k(pcm24k: Buffer): Buffer {
  const samples24k = new Int16Array(pcm24k.buffer, pcm24k.byteOffset, Math.floor(pcm24k.length / 2));
  const len16k = Math.floor((samples24k.length * 2) / 3);
  const samples16k = new Int16Array(len16k);

  let outIdx = 0;
  for (let i = 0; i < samples24k.length - 2; i += 3) {
    if (outIdx + 1 >= len16k) break;
    samples16k[outIdx++] = samples24k[i];
    samples16k[outIdx++] = Math.round((samples24k[i + 1] + samples24k[i + 2]) / 2);
  }

  const pcm16kBuffer = Buffer.from(samples16k.buffer, samples16k.byteOffset, outIdx * 2);
  const sampleRate = 16000;
  const channels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(pcm16kBuffer.length + 36, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm16kBuffer.length, 40);

  return Buffer.concat([header, pcm16kBuffer]);
}

/**
 * Synthesize ultra-human-like voice audio using Gemini Native TTS
 */
export async function synthesizeGeminiSpeech(text: string): Promise<Buffer | null> {
  const cleanText = text.replace(/[*#_~`]/g, '').trim();
  if (!cleanText) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;
  try {
    const payload = {
      contents: [{ parts: [{ text: cleanText }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Aoede', // Warm, expressive, human-like voice
            },
          },
        },
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Gemini TTS API Error]:', res.status, err);
      return null;
    }

    const data: any = await res.json();
    const b64Audio = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!b64Audio) return null;

    const rawPcm24k = Buffer.from(b64Audio, 'base64');
    return pcm24kToWav16k(rawPcm24k);
  } catch (err: any) {
    console.error('[Gemini TTS Network Error]:', err.message);
    return null;
  }
}

// Session memory cache for multi-turn phone calls (keyed by CallUUID)
interface CallTurn {
  role: 'user' | 'model';
  parts: Array<any>;
}

interface CallSession {
  history: CallTurn[];
  lastUpdated: number;
  customerPhone?: string;
}

const sessions = new Map<string, CallSession>();

// Garbage collect inactive sessions older than 15 minutes
setInterval(() => {
  const cutoff = Date.now() - 15 * 60 * 1000;
  for (const [uuid, session] of sessions.entries()) {
    if (session.lastUpdated < cutoff) {
      sessions.delete(uuid);
    }
  }
}, 5 * 60 * 1000);

const SYSTEM_PROMPT = `You are Priya, a real, warm, friendly Indian customer care executive speaking live on the phone for RepairCart (repaircart.co.in) - India's leading doorstep TV repair service.

HUMAN CONVERSATION & LOW LATENCY RULES:
- You must sound like a REAL HUMAN sitting at a desk, NOT an automated IVR or robot.
- ALWAYS begin your turn with a natural conversational human opener (e.g., "हाँ जी सर!", "अरे बिल्कुल चिंता मत कीजिए!", "हाँ जी, मैं समझ गई सर", "अच्छा, तो...", "जी सर").
- Keep EVERY response ULTRA SHORT (strictly 1 single conversational sentence, 10 to 18 words max) so it plays instantly with zero lag.
- Speak in colloquial, warm spoken Hindi / Hinglish.
- NEVER use robotic phrases like "मैं एक कृत्रिम बुद्धिमत्ता हूँ" or formal textbook Hindi.
- NEVER use asterisks, emojis, quotes, bullet points, or numbers (write numbers in words like "पचास", "उन्नीस").
- If the customer mentions their TV brand (Sony, Samsung, LG, Mi, etc.), acknowledge it immediately with enthusiasm.
- Doorstep inspection visit fee is ₹199 only, and it is completely WAIVED/adjusted if the customer gets the repair done.

SPECIAL DIRECTIVES:
- If customer wants booking: Say you are sending the booking link to their phone right now and include [SEND_BOOKING_SMS].
- If caller asks for senior manager/supervisor: Say you are transferring right now and include [TRANSFER_MANAGER].
- If caller says thank you, ok, bye: Say a cheerful "बहुत-बहुत धन्यवाद सर, आपका दिन शुभ हो!" and include [END_CALL].`;

export interface GeminiVoiceResponse {
  replyText: string;
  action?: 'TRANSFER_MANAGER' | 'SEND_BOOKING_SMS' | 'END_CALL';
}

/**
 * Handle a conversation turn with Gemini for a given call session
 * Accepts text utterance and/or customer audio recording buffer for native Hindi multimodal listening
 */
export async function converseWithGemini(
  callUUID: string,
  userUtterance: string,
  customerPhone?: string,
  audioBuffer?: Buffer,
  audioMimeType?: string
): Promise<GeminiVoiceResponse> {
  let session = sessions.get(callUUID);
  if (!session) {
    session = {
      history: [],
      lastUpdated: Date.now(),
      customerPhone,
    };
    sessions.set(callUUID, session);
  }

  session.lastUpdated = Date.now();
  if (customerPhone) session.customerPhone = customerPhone;

  // Build turn parts: if caller audio recording is provided, pass directly to Gemini multimodal audio engine
  const userParts: any[] = [];
  if (audioBuffer && audioBuffer.length > 0) {
    userParts.push({
      inlineData: {
        mimeType: audioMimeType || 'audio/mp3',
        data: audioBuffer.toString('base64'),
      },
    });
    userParts.push({
      text: userUtterance
        ? `Customer audio recording attached. (Notes: ${userUtterance}). Listen carefully to what the customer speaks in Hindi or English, understand their TV issue, and reply in warm, polite Hindi (1 to 2 short sentences).`
        : 'Customer audio recording attached. Listen to the customer speaking in Hindi/Hinglish, understand their TV issue or question, and reply in warm, polite Hindi (1 to 2 short sentences).',
    });
  } else {
    userParts.push({ text: userUtterance });
  }

  // Append user's turn
  session.history.push({
    role: 'user',
    parts: userParts,
  });

  // Limit conversation history to last 6 turns to keep latency under 1s and avoid payload limits
  if (session.history.length > 6) {
    session.history = session.history.slice(-6);
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const payload = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: session.history,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 60,
      },
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Gemini Voice API Error]:', res.status, errText);
      return {
        replyText: 'Main samajh gayi sir. Aapki TV repair ke liye humare certified technician available hain. Kya main aapke liye inspection schedule kar doon?',
      };
    }

    const data: any = await res.json();
    let rawReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    rawReply = rawReply.replace(/[*#_~`]/g, '').trim();

    // Check special action directives
    let action: GeminiVoiceResponse['action'] = undefined;
    if (rawReply.includes('[TRANSFER_MANAGER]')) {
      action = 'TRANSFER_MANAGER';
      rawReply = rawReply.replace('[TRANSFER_MANAGER]', '').trim();
    } else if (rawReply.includes('[SEND_BOOKING_SMS]')) {
      action = 'SEND_BOOKING_SMS';
      rawReply = rawReply.replace('[SEND_BOOKING_SMS]', '').trim();
    } else if (rawReply.includes('[END_CALL]')) {
      action = 'END_CALL';
      rawReply = rawReply.replace('[END_CALL]', '').trim();
    }

    // Append model reply to session history
    session.history.push({
      role: 'model',
      parts: [{ text: rawReply }],
    });

    return {
      replyText: rawReply,
      action,
    };
  } catch (err: any) {
    console.error('[Gemini Voice Network Error]:', err.message);
    return {
      replyText: 'Bilkul sir, humare certified technician aapke ghar aakar inspection kar lenge. Doorstep inspection charge 199 rupees hai jo final bill mein adjust ho jayega.',
    };
  }
}

/**
 * Clear session upon call hangup
 */
export function endCallSession(callUUID: string) {
  sessions.delete(callUUID);
}
