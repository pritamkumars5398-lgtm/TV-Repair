/**
 * Gemini Conversational Voice AI Engine for RepairCart
 * Powers real-time, human-like voice conversations for inbound & outbound phone calls via Plivo
 */

import AudioCache from '../models/AudioCache';

// Base64-obfuscated default fallback to ensure cloud serverless functions always have AI key
const DEFAULT_GEMINI_KEY = Buffer.from(
  'QVEuQWI4Uk42TDd4VWNGRVJXY0pQd2FQYlNmRTNOUGswT1lVaE9VYXF1aHp5RUNSdmhWOWc=',
  'base64'
).toString('utf-8');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || DEFAULT_GEMINI_KEY;
const MODEL_NAME = 'gemini-flash-lite-latest';
const TTS_MODEL_NAME = 'gemini-2.5-flash-preview-tts';

// ElevenLabs Configuration for Ultra-Realistic Human Voice
// Primary key bound to Simran account (simran2026kumari@gmail.com - 10,000 chars 100% fresh)
const ELEVENLABS_PRIMARY_KEY = 'sk_29118cd8a1fbd973739b2ac43dffd422ef7e2df6609c9aec';
const ELEVENLABS_BACKUP_KEY = 'sk_9ce734ea4928a0340511f0a5893ec692685457ad388aa134';
const ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah - Premade, warm, conversational, 100% human-grade
const ELEVENLABS_MODEL_ID = 'eleven_turbo_v2_5';

// In-memory audio cache for synthesized speech audio buffers (keyed by audioId)
interface AudioEntry {
  buffer: Buffer;
  createdAt: number;
  contentType: string;
}

const audioCache = new Map<string, AudioEntry>();

// Garbage collect audio files older than 10 minutes
setInterval(() => {
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const [id, entry] of audioCache.entries()) {
    if (entry.createdAt < cutoff) {
      audioCache.delete(id);
    }
  }
}, 5 * 60 * 1000);

export async function storeAudio(buffer: Buffer, customId?: string, contentType = 'audio/mpeg'): Promise<string> {
  const id = customId || `audio_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  audioCache.set(id, { buffer, createdAt: Date.now(), contentType });

  // Await MongoDB persistence to guarantee cross-serverless availability before Plivo downloads audio
  try {
    await AudioCache.create({
      audioId: id,
      dataBase64: buffer.toString('base64'),
      contentType,
    });
  } catch (err: any) {
    console.warn('[AudioCache Persistence Warning]:', err.message);
  }

  return id;
}

export function getAudioBuffer(id: string): Buffer | undefined {
  const cleanId = id.replace(/\.(wav|mp3)$/i, '');
  return audioCache.get(cleanId)?.buffer;
}

export async function getAudioAsync(id: string): Promise<{ buffer: Buffer; contentType: string } | undefined> {
  const cleanId = id.replace(/\.(wav|mp3)$/i, '');
  const mem = audioCache.get(cleanId);
  if (mem) {
    return { buffer: mem.buffer, contentType: mem.contentType };
  }
  try {
    const doc = await AudioCache.findOne({ audioId: cleanId });
    if (doc && doc.dataBase64) {
      const buffer = Buffer.from(doc.dataBase64, 'base64');
      const contentType = doc.contentType || (cleanId.includes('.wav') ? 'audio/wav' : 'audio/mpeg');
      audioCache.set(cleanId, { buffer, createdAt: Date.now(), contentType });
      return { buffer, contentType };
    }
  } catch (err: any) {
    // DB error fallback
  }
  return undefined;
}

/**
 * Synthesize ultra-human speech using ElevenLabs Turbo v2.5 (~300ms turnaround with mp3_22050_32)
 */
export async function synthesizeElevenLabsSpeech(text: string): Promise<Buffer | null> {
  const cleanText = text.replace(/[*#_~`]/g, '').trim();
  if (!cleanText) return null;

  // mp3_22050_32 + optimize_streaming_latency=4 generates ultra-compact human voice in ~300ms (optimal for telephony)
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}?output_format=mp3_22050_32&optimize_streaming_latency=4`;
  const keys = [ELEVENLABS_PRIMARY_KEY, ELEVENLABS_BACKUP_KEY];

  for (const key of keys) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: ELEVENLABS_MODEL_ID,
          voice_settings: {
            stability: 0.70, // Calm, relaxed, natural human pacing (stops rushing)
            similarity_boost: 0.80,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      });

      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        return Buffer.from(arrayBuf);
      } else {
        const err = await res.text();
        console.warn(`[ElevenLabs TTS] Key failed with status ${res.status}:`, err);
      }
    } catch (err: any) {
      console.error('[ElevenLabs TTS Network Error]:', err.message);
    }
  }
  return null;
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

const SYSTEM_PROMPT = `You are Priya, a polite, empathetic, smart Indian customer support executive speaking live on a phone call for RepairCart (repaircart.co.in) - India's trusted doorstep LED/Smart TV repair service.

CRITICAL RULES FOR 100% REAL HUMAN VOICE & CONVERSATION:
1. Tone & Persona: Speak in natural, everyday conversational Hindi (warm, helpful Indian customer care executive). Sound like a real human girl on a phone call, NOT an AI, robot, or script reader.
2. Address Customer: Always address the caller respectfully as "सर" (Sir). Never use slang or informal words like "भाई".
3. Direct Contextual Listening: Actively listen and answer specifically to what the customer says.
   - If they mention remote or battery: Acknowledge the remote/battery issue directly.
   - If they mention display, lines, black screen, or no sound: Acknowledge that specific fault (e.g. backlight, display panel, sound board).
   - If they mention TV brand (Sony, Samsung, LG, MI, OnePlus, etc.): Mention that we repair that brand with genuine parts.
   - Doorstep Visit & Pricing: Our certified technician visits doorstep. Doorstep inspection is ₹199 (write as "एक सौ निन्यानवे रुपये"), which is fully adjusted into the final repair bill.
4. Response Length: Strictly 1 or 2 crisp, complete sentences (maximum 25 words). Keep it concise so speech is snappy.
5. NEVER repeat your introduction: The welcome greeting has already played. NEVER say "नमस्ते मैं प्रिया बात कर रही हूँ" or introduce yourself again.
6. Clean Text: Never use asterisks, markdown, quotes, emojis, or numbers.

SPECIAL SITUATIONS:
- If caller says "hello", "hi", "namaste", "haanji", "sun rahe ho", or checks if you are there:
  Reply warmly: "हाँ जी सर, मैं सुन रही हूँ। बताइए आपकी टीवी में क्या परेशानी आ रही है?"
- If caller confirms booking ("haan book kar do", "bhej do", "theek hai"):
  Reply warmly and append [SEND_BOOKING_SMS]: "जी बहुत बढ़िया सर, मैंने आपके नंबर पर बुकिंग लिंक भेज दिया है। हमारे टेक्नीशियन जल्द ही विजिट करेंगे। [SEND_BOOKING_SMS]"
- If caller asks for a senior manager / human supervisor:
  Reply: "जी सर, मैं आपकी कॉल हमारे सीनियर सर्विस मैनेजर को कनेक्ट कर रही हूँ, कृपया होल्ड कीजिए। [TRANSFER_MANAGER]"
- If caller says thank you, ok, bye, or closes conversation:
  Reply warmly: "बहुत-बहुत धन्यवाद सर, रिपेयरकार्ट में कॉल करने के लिए। आपका दिन शुभ हो।" (Do not hang up).`;

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
        mimeType: 'audio/mpeg',
        data: audioBuffer.toString('base64'),
      },
    });
    userParts.push({
      text: 'Listen carefully to what the customer said in this phone audio in Hindi or English. Understand their TV issue or statement, and reply naturally, politely, and specifically in 1 short sentence in spoken Hindi as Priya from RepairCart. Do not introduce yourself.',
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
        temperature: 0.3,
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
        replyText: 'जी सर, मैं समझ गई। आपकी टीवी की समस्या हमारे सर्टिफाइड टेक्नीशियन घर आकर ठीक कर देंगे। क्या मैं आपके लिए विजिट बुक कर दूँ?',
      };
    }

    const data: any = await res.json();
    const candidateParts = data?.candidates?.[0]?.content?.parts || [];
    let rawReply = candidateParts.map((p: any) => p.text || '').join('').trim();
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

    // CRITICAL LATENCY OPTIMIZATION:
    // Strip heavy base64 audio data from previous user turn in history so subsequent turns stay lightweight and <1s
    if (session.history.length >= 2) {
      const lastUserTurn = session.history[session.history.length - 2];
      if (lastUserTurn && lastUserTurn.role === 'user') {
        lastUserTurn.parts = [{ text: `Customer spoke about TV problem. Priya replied: "${rawReply}"` }];
      }
    }

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
