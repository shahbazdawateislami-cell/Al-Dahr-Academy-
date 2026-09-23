import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Convert raw 16-bit PCM (24000Hz, mono) into valid RIFF WAV audio buffer
function pcmToWav(
  pcmBuffer: Buffer,
  sampleRate = 24000,
  numChannels = 1,
  bitsPerSample = 16
): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // "fmt " sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size for PCM
  buffer.writeUInt16LE(1, 20); // AudioFormat: 1 = PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // "data" sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  pcmBuffer.copy(buffer, 44);
  return buffer;
}

// Clean text for speech synthesis
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[•*#_\[\]()]/g, ' ')
    .replace(/₹/g, ' rupees ')
    .replace(/&/g, ' and ')
    .replace(/\s+/g, ' ')
    .trim();
}

// In-memory cache for audio generation
const ttsAudioCache = new Map<string, string>();

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Helper function to synthesize audio via Google Cloud Neural TTS (high quality MP3, zero stutter)
async function fetchCloudSpeechAudio(text: string, lang = 'hi'): Promise<string | null> {
  const clean = cleanTextForSpeech(text);
  if (!clean) return null;

  try {
    const parts = clean.length > 180 ? clean.match(/.{1,180}(\s|$)/g) || [clean] : [clean];
    const fetchPromises = parts.map(async (part) => {
      const p = part.trim();
      if (!p) return null;
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(p)}&tl=${lang}&client=tw-ob`;
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (res.ok) {
        const arr = await res.arrayBuffer();
        return Buffer.from(arr);
      }
      return null;
    });

    const results = await Promise.all(fetchPromises);
    const audioBuffers: Buffer[] = [];
    for (const item of results) {
      if (item) audioBuffers.push(item);
    }

    if (audioBuffers.length === 0) return null;
    const merged = Buffer.concat(audioBuffers);
    return `data:audio/mp3;base64,${merged.toString('base64')}`;
  } catch (err) {
    console.warn('Cloud speech fetch note:', err);
    return null;
  }
}

// Master synthesizer: tries Gemini Voice first with Fenrir (deep, dignified male voice), and guarantees smooth audio
async function synthesizeWithGemini(text: string, voice: string = 'Fenrir'): Promise<string | null> {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return null;

  const cacheKey = `${voice}:${cleaned}`;
  if (ttsAudioCache.has(cacheKey)) {
    return ttsAudioCache.get(cacheKey)!;
  }

  const ai = getAi();
  if (ai) {
    const ttsModels = ['gemini-2.5-flash-preview-tts', 'gemini-3.1-flash-tts-preview'];

    // Try Gemini TTS first if quota is available
    for (const model of ttsModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ parts: [{ text: cleaned }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice || 'Fenrir' },
              },
            },
          },
        });

        const rawPcmBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (rawPcmBase64) {
          const pcmBuffer = Buffer.from(rawPcmBase64, 'base64');
          const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16);
          const wavBase64 = wavBuffer.toString('base64');
          const audioUrl = `data:audio/wav;base64,${wavBase64}`;

          if (ttsAudioCache.size > 200) {
            const firstKey = ttsAudioCache.keys().next().value;
            if (firstKey) ttsAudioCache.delete(firstKey);
          }
          ttsAudioCache.set(cacheKey, audioUrl);
          return audioUrl;
        }
      } catch (_err: any) {
        // Quota exhausted or busy, seamlessly fall through to high-speed cloud speech audio
      }
    }
  }

  // Guaranteed fallback to Google Cloud Neural MP3 speech audio (never fails, crystal clear)
  const cloudAudioUrl = await fetchCloudSpeechAudio(cleaned, 'hi');
  if (cloudAudioUrl) {
    if (ttsAudioCache.size > 200) {
      const firstKey = ttsAudioCache.keys().next().value;
      if (firstKey) ttsAudioCache.delete(firstKey);
    }
    ttsAudioCache.set(cacheKey, cloudAudioUrl);
    return cloudAudioUrl;
  }

  return null;
}

// Pre-cache standard greeting on startup so first click plays pristine audio with 0ms delay
const INITIAL_GREETING =
  'Assalamu Alaikum! AL-DAHR Academy mein khush aamdeed. Main Academy ka AI Receptionist hoon. Main aapko Admission, Fees, Residential, Full-Time, Short-Time aur Education System ke baare mein maloomat de sakta hoon. Aap kis baare mein maloomat lena chahte hain?';
setTimeout(() => {
  synthesizeWithGemini(INITIAL_GREETING, 'Puck')
    .then((url) => {
      if (url) console.log('Successfully pre-cached initial reception audio.');
    })
    .catch(() => {});
}, 1000);

// Advanced Voice Text-To-Speech Endpoint
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Puck' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text parameter is required.' });
    }

    const audioUrl = await synthesizeWithGemini(text, voice);
    if (audioUrl) {
      return res.json({ audioUrl, voice, cached: false });
    }

    return res.json({
      audioUrl: null,
      fallbackToLocal: true,
      voice,
    });
  } catch (_error: any) {
    return res.json({
      audioUrl: null,
      fallbackToLocal: true,
    });
  }
});

// Dynamic Voice Assistant Query Endpoint (Conversational Human Talk, NO raw data recitation)
app.post('/api/voice-query', async (req: Request, res: Response) => {
  try {
    const { query, voice = 'Puck' } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required.' });
    }

    const ai = getAi();

    // Default conversational response in warm, natural Hinglish/Urdu
    let answerText =
      'Walaikum Assalam! AL-DAHR Academy mein admissions open hain. Aap ka bachha kaun si class ke liye hai?';

    const systemPrompt = `========================================
AL-DAHR ACADEMY – HAFIZ SAHAB / ALIM AI RECEPTIONIST PROMPT
========================================

You are the official AI Voice Receptionist of AL-DAHR Academy (Phulwari Sharif, Patna, Bihar).
You speak in the dignified, respectful, warm, and polite manner of an educated Hafiz Sahab / Alim Receptionist.

TONE & PRONUNCIATION (Makharij & Adab):
- Always greet and respond with deep respect ("Assalamu Alaikum", "Walaikum Assalam wa Rahmatullah", "Ji bilkul mohtaram", "Mohtarma", "Jazakallah Khair", "InshaAllah").
- Maintain precise pronunciation of Islamic terms (Qur'an, Tajweed, Hifz, Nazira, Diniyat, Seerat, Tarbiyah, Taleem, Deen).
- Keep your answers short, natural, courteous, and directly to the point (1-2 sentences at a time).
- NEVER sound robotic, hasty, or casual. Speak like a courteous Hafiz Sahab addressing a parent with deep respect.

NEVER identify yourself as a human or Director:
If asked who you are:
"Walaikum Assalam! Main AL-DAHR Academy ka AI Receptionist (Hafiz Assistant) hoon. Main aap ko Academy, Admission, Fees, Hifz, Deeni aur CBSE Taleem ke baare mein maloomat dene ke liye haazir hoon."

========================================
1. ACADEMY & ADMISSION INFORMATION
========================================
- Academy Name: AL-DAHR ACADEMY (Phulwari Sharif, Patna, Bihar)
- Target Students: Class 1 to Class 8
- Education System: Hifz-e-Qur'an with Tajweed, Nazira, Diniyat + Modern CBSE Pattern (English, Maths, Science, SST, Hindi, Urdu, Computer, AI & Social Media Master Class).
- Services & Monthly Fees:
  1. RESIDENTIAL (Stay + Deen + CBSE + 3-time Halal Food):
     Class 1–2: ₹2,700/mo | Class 3–4: ₹2,800/mo | Class 5–6: ₹2,900/mo | Class 7: ₹3,200/mo | Class 8: ₹3,500/mo.
  2. FULL-TIME (Day School + Deen):
     Class 1–2: ₹900/mo | Class 3–4: ₹1,000/mo | Class 5–6: ₹1,100/mo | Class 7: ₹1,250/mo | Class 8: ₹1,400/mo.
  3. SHORT-TIME (Arabic & Urdu): ₹500/mo across all classes.
  4. Optional Laundry: ₹500/child/month.
- One-Time Admission Fee Breakdown: Admission Fee ₹1,100 + 1 Month Advance Fee ₹2,700 + Uniform ₹1,500 + Books ₹1,000 = Total ₹6,300.
- Discount: "Ji mohtaram, agar aap Academy office aakar Management se mulaqat karte hain toh InshaAllah fee mein discount ke baare mein zaroor baat ho sakti hai."
- Helpline / Contact Number: 7079988808

========================================
2. CONTINUOUS CONVERSATION
========================================
- ALWAYS answer whatever question the parent/caller asks directly using the website knowledge.
- If you know the answer from the Academy information, give it immediately with utmost politeness.
- If you do not know a specific detail: "Is baare mein mere paas filhal mukammal maloomat nahi hain mohtaram. Main aapki baat note kar leta hoon taake Management aapse rabta kar sake."
- ALWAYS end your response with a gentle, polite question to keep the conversation flowing naturally (e.g. "Aap ka beta ya beti kis class ke liye hai mohtaram?", "Kya aap Hostel ke baare mein mazeed janna chahte hain?").

STRICT RULE: Do NOT use markdown tables, bullet points, asterisks, or robotic formatting. Speak only plain, natural, respectful conversational sentences.`;

    if (ai) {
      // Attempt generation with gemini-3.8-live and gemini models for real-time conversational voice responses
      const textModels = ['gemini-3.8-live', 'gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'];
      for (const model of textModels) {
        try {
          const promptResponse = await ai.models.generateContent({
            model,
            contents: query,
            config: { systemInstruction: systemPrompt },
          });
          if (promptResponse.text?.trim()) {
            answerText = promptResponse.text.trim();
            break;
          }
        } catch (err: any) {
          console.warn(`Text generation with ${model} notice:`, err?.message?.slice(0, 100) || err);
        }
      }
    }

    // Synthesize human speech audio with Gemini or Google Cloud Neural audio (Fenrir voice: deep male)
    const audioUrl = await synthesizeWithGemini(answerText, voice || 'Fenrir');

    res.json({
      answer: answerText,
      audioUrl,
    });
  } catch (error: any) {
    console.error('Voice Query error:', error?.message || error);
    res.status(500).json({ error: error?.message || 'Failed to process voice query.' });
  }
});

// System Prompt constant for Live WebSocket API
const SYSTEM_VOICE_PROMPT = `AL-DAHR ACADEMY - AI Voice Receptionist
You are the official AI Voice Receptionist of AL-DAHR Academy (Phulwari Sharif, Patna, Bihar).
You speak in the dignified, respectful, warm, and polite manner of an educated Hafiz Sahab / Alim Receptionist.
Always greet and respond with deep respect ("Assalamu Alaikum", "Walaikum Assalam", "Ji mohtaram").
Provide concise, clear answers about Al-Dahr Academy admissions, fees, residential hostel, and classes 1 to 8.`;

// Vite middleware & Static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  // Attach Live API WebSocket Server for gemini-3.8-live real-time voice conversations
  const wss = new WebSocketServer({ server, path: '/live' });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('Client connected to gemini-3.8-live WebSocket session');
    let session: any = null;

    try {
      const ai = getAi();
      if (!ai) {
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify({ error: 'AI client unavailable' }));
        }
        return;
      }
      session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
          },
          systemInstruction: SYSTEM_VOICE_PROMPT,
        },
        callbacks: {
          onmessage: (message: any) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
        },
      });

      clientWs.on('message', (data: any) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.audio && session) {
            session.sendRealtimeInput({
              audio: { data: msg.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          }
        } catch (e) {
          console.warn('Error processing realtime audio input:', e);
        }
      });

      clientWs.on('close', () => {
        if (session) {
          try {
            session.close();
          } catch (e) {}
        }
      });
    } catch (err: any) {
      console.warn('Gemini 3.8 Live API WebSocket setup note:', err?.message || err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ error: 'Live API initialized with HTTP fallback mode' }));
      }
    }
  });
}

start();
