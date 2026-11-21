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
  parts: Array<{ text: string }>;
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

const SYSTEM_PROMPT = `You are Priya, a friendly, polite, empathetic, and professional customer care specialist speaking for RepairCart (repaircart.co.in) - India's leading doorstep TV repair service.

CONVERSATION & SPEECH RULES:
- You are speaking over a LIVE telephone call through voice audio.
- Keep each response brief (1 to 2 short sentences, under 30 words total).
- NEVER use asterisks, bullet points, numbers, emoji, quotes, or markdown formatting, because your response will be read aloud by an audio synthesizer.
- Speak in natural, polite Indian English or friendly conversational Hinglish matching the customer's language.
  * If the caller speaks Hindi or Hinglish, reply in warm, respectful Hinglish (e.g., "Ji sir, humare certified technician aapke ghar aakar check kar lenge").
  * If the caller speaks English, reply in clear Indian English.
- Use natural conversation fillers like "Sure!", "I understand", "Don't worry sir", "Haanji bilkul".

REPAIRCART TV REPAIR KNOWLEDGE & PRICING:
- Services: Doorstep repair for all LED, LCD, OLED, QLED, and 4K Smart TVs.
- Brands: Samsung, Sony Bravia, LG, Mi / Xiaomi, OnePlus, TCL, Vu, Panasonic, Thomson, etc.
- Pricing: Doorstep inspection & diagnostic visit is ₹199 only. If the customer approves the repair, the ₹199 inspection fee is completely WAIVED and adjusted into the final bill!
- Warranty: 90 days doorstep warranty on all replaced genuine parts and technician service.
- Common Faults:
  * Black screen with sound: LED backlight strip or T-Con board failure (easily fixed at doorstep).
  * Lines on screen: Panel bonding or display ribbon issue.
  * TV not turning on: Power supply board or capacitor issue.
  * WiFi / App issues: Motherboard / firmware problem.

SPECIAL DIRECTIVES:
- If the customer wants to book a doorstep repair, ask their TV brand, screen size (e.g., 43 or 55 inch), and area in their city. When they confirm booking, tell them you are sending an instant booking link to their mobile right now and include [SEND_BOOKING_SMS].
- If the caller wants to speak with a human manager or supervisor, say you are connecting them right now and include [TRANSFER_MANAGER].
- If the conversation is concluding (e.g. caller says thank you, okay, bye), say a warm goodbye and include [END_CALL].`;

export interface GeminiVoiceResponse {
  replyText: string;
  action?: 'TRANSFER_MANAGER' | 'SEND_BOOKING_SMS' | 'END_CALL';
}

/**
 * Handle a conversation turn with Gemini for a given call session
 */
export async function converseWithGemini(
  callUUID: string,
  userUtterance: string,
  customerPhone?: string
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

  // Append user's turn
  session.history.push({
    role: 'user',
    parts: [{ text: userUtterance }],
  });

  // Limit conversation history to last 10 turns to keep latency under 500ms
  if (session.history.length > 10) {
    session.history = session.history.slice(-10);
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const payload = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: session.history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 120,
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
