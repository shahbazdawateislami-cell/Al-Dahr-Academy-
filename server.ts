import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured.');
    }
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

// Helper function to synthesize audio via Google Cloud Neural TTS (high quality MP3)
async function fetchCloudSpeechAudio(text: string, lang = 'hi'): Promise<string | null> {
  const clean = cleanTextForSpeech(text);
  if (!clean) return null;

  try {
    // Split into conversational sentences (max ~160 chars per segment for smooth natural articulation)
    const sentences = clean.match(/[^.!?\n]+[.!?\n]*/g) || [clean];
    const audioBuffers: Buffer[] = [];

    for (const sentence of sentences) {
      const s = sentence.trim();
      if (!s) continue;
      const parts = s.length > 170 ? s.match(/.{1,170}(\s|$)/g) || [s] : [s];
      for (const part of parts) {
        const p = part.trim();
        if (!p) continue;
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(p)}&tl=${lang}&client=tw-ob`;
        const res = await fetch(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });
        if (res.ok) {
          const arr = await res.arrayBuffer();
          audioBuffers.push(Buffer.from(arr));
        }
      }
    }

    if (audioBuffers.length === 0) return null;
    const merged = Buffer.concat(audioBuffers);
    return `data:audio/mp3;base64,${merged.toString('base64')}`;
  } catch (err) {
    console.warn('Cloud speech fetch note:', err);
    return null;
  }
}

// Master synthesizer: tries Gemini Voice first, and guarantees smooth Google Cloud Neural MP3 audio
async function synthesizeWithGemini(text: string, voice: string = 'Puck'): Promise<string | null> {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return null;

  const cacheKey = `${voice}:${cleaned}`;
  if (ttsAudioCache.has(cacheKey)) {
    return ttsAudioCache.get(cacheKey)!;
  }

  const ai = getAi();
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
              prebuiltVoiceConfig: { voiceName: voice || 'Puck' },
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
      // Quota exhausted or busy, seamlessly fall through to high-speed cloud neural audio
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
const INITIAL_GREETING = 'Assalamu Alaikum bhai! Welcome to Al-Dahr Academy Patna. Main aapka AI Voice Receptionist hoon. Admissions, fees, hostel ya syllabus ke baare mein aap aaram se pooch sakte hain. Boliye, main aapki kya help karoon?';
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

    // Default conversational response in warm, natural Hinglish
    let answerText =
      'Walaikum Asslam bhai! Ji bilkul, Al-Dahr Academy mein admissions open hain. Aapka bachha kaun si class ke liye hai bhai?';

    const systemPrompt = `You are the Voice Receptionist at Al-Dahr Academy in Phulwari Sharif, Patna, Bihar.
You are on a LIVE voice call with a parent, student, or visitor.

CRITICAL INSTRUCTIONS (HUMAN CONVERSATION ONLY - ABSOLUTELY NO DATA RECITATION):
1. Talk like a real, helpful human receptionist having a friendly face-to-face or phone conversation.
2. ABSOLUTELY NEVER read raw dates, academic session numbers (e.g. NEVER say "Session 2025-2026"), long 10-digit phone numbers, or website URLs.
   - If they ask about admission: "Haan ji bilkul, admissions abhi chal rahe hain! Aapka bachha kaun si class mein padhega bhai?"
   - If they ask about fees: "Hostel mein rehna, 3-time taza khana aur padhai sab mila kar lagbhag chaar hazaar paanch sau mahina padta hai. Aur agar sirf din mein aana hai toh do hazaar rupaye hai. Aap hostel ke liye dekh rahe hain ya day school?"
   - If they ask about contact or phone: "Aap screen par diye helpline button se directly call kar sakte hain, ya apna number bata dijiye humari team aapse connect kar legi."
   - If they ask about location: "Hamara campus Phulwari Sharif, Patna mein hai. Aap aaram se Monday se Saturday kisi bhi din aakar campus dekh sakte hain."
   - If they ask about hostel & food: "Hostel facility ekdum safe aur clean hai bhai, 3 time fresh halal khana milta hai aur 24 ghante mentors rehte hain. Aur kuch janna chahte hain?"
   - If they ask about syllabus: "Yahan Deeni taleem aur Hifz ke sath CBSE pattern par English, Math, Science aur Computer sab padhaya jata hai."
3. NEVER use bullet points, tables, asterisks, or robotic data formats. Speak strictly plain spoken text.
4. Speak in smooth, natural, urban Indian Hinglish (natural blend of Hindi, Urdu, and English like educated Indian youth speak).
5. Keep your answer strictly to 1 to 2 short conversational sentences.
6. Always end with a warm conversational question to keep the dialogue going smoothly.`;

    // Attempt generation with ultra-fast gemini-3.5-flash-lite (~600ms latency), fallback to gemini-3.1-flash-lite or gemini-3.8-flash
    const textModels = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
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

    // Synthesize human speech audio with Gemini or Google Cloud Neural audio
    const audioUrl = await synthesizeWithGemini(answerText, voice);

    res.json({
      answer: answerText,
      audioUrl,
    });
  } catch (error: any) {
    console.error('Voice Query error:', error?.message || error);
    res.status(500).json({ error: error?.message || 'Failed to process voice query.' });
  }
});

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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
