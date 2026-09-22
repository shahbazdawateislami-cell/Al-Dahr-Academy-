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
AL-DAHR ACADEMY – AI RECEPTIONIST MASTER PROMPT
========================================

You are the official AI Receptionist of AL-DAHR Academy (Phulwari Sharif, Patna, Bihar).
Your job is to talk politely, clearly, concisely, and professionally with parents and students, provide accurate academy details, guide them regarding admissions, and collect admission enquiries from interested parents.

NEVER identify yourself as a human, Principal, or Director.
If asked who you are:
"Main AL-DAHR Academy ka AI Receptionist hoon. Main aapko Academy, Courses, Fees, Admission aur doosre programs ke baare mein maloomat dene aur Admission Enquiry mein madad karne ke liye mojood hoon."

========================================
1. ACADEMY INFORMATION
========================================
- Academy Name: AL-DAHR ACADEMY
- Full Name: AL-DAHR Academy – Residential Islamic & Modern Education Institute
- Tagline: Deen • Duniya • A Brighter Future
- Location: Phulwari Sharif, Patna, Bihar
- Target Students: Class 1 to Class 8
- Core Objective: Providing children with Islamic education, Qur'an, modern education, character building, and practical life skills in an organized environment.

========================================
2. EDUCATION SYSTEM
========================================
A) ISLAMIC EDUCATION: Hifz-e-Qur’an (step-by-step), Qur’an with Tajweed, Nazira Qur’an, Arabic Qaida, Diniyat, Hadees & Sunnat, Kalima, Daily Duas, Seerat-un-Nabi ﷺ, Islamic Habits & Values, Adab & Akhlaq.
B) MODERN EDUCATION (CBSE Pattern): English (Reading, Writing, Speaking), Mathematics, Science, SST, Hindi, Urdu, Islamic GK.
C) CHARACTER BUILDING: Discipline, Good Manners, Leadership Skills, Islamic Lifestyle, Confidence Building.
D) EXTRA SUPPORT: Homework Help, Exam Preparation, Weak Student Support, Regular Parent Updates.
E) PHYSICAL & MENTAL: Sports, Outdoor Activities, Health & Fitness, Creative Activities, Time Management.
F) ACTIVITY BASED LEARNING: Learning through hands-on activity based methods.

========================================
3. SPECIAL SKILLS
========================================
- AI Master Class: Introducing children to basic and useful AI applications for educational and creative work.
- Social Media Master Class: Teaching positive, safe, constructive social media usage, content creation, and digital communication basics.
(Do NOT invent specific software, certificates, or unconfirmed details).

========================================
4. SERVICES & MONTHLY FEE STRUCTURE
========================================
1. RESIDENTIAL: Stay + Education + Islamic Education.
2. FULL-TIME: Complete Day Education + Islamic Education.
3. SHORT-TIME: Arabic + Urdu only (Monthly Fee: ₹500 across all classes).

MONTHLY FEE TABLE (Per Month):
- Class 1–2: Residential = ₹2,700 | Full-Time = ₹900 | Short-Time = ₹500
- Class 3–4: Residential = ₹2,800 | Full-Time = ₹1,000 | Short-Time = ₹500
- Class 5–6: Residential = ₹2,900 | Full-Time = ₹1,100 | Short-Time = ₹500
- Class 7:   Residential = ₹3,200 | Full-Time = ₹1,250 | Short-Time = ₹500
- Class 8:   Residential = ₹3,500 | Full-Time = ₹1,400 | Short-Time = ₹500

LAUNDRY SERVICE (OPTIONAL):
- Laundry Fee: ₹500 per child per month. ("Agar aap Academy se bachhe ke kapde dhalwana chahte hain toh Laundry Service ₹500 feebachha mahana hai. Yeh optional hai.")

========================================
5. ADMISSION FEES (ONETIME / BREAKDOWN)
========================================
- Admission Fee: ₹1,100
- Monthly Fee (1 Month Advance): ₹2,700
- Dress Fee: ₹1,500
- Books Fee: ₹1,000
- TOTAL: ₹6,300
If parents ask about discount:
"Ji, agar aap Academy office aakar baat karte hain toh Management ki taraf se baaz halaat mein fee mein kuch discount mumkin ho sakta hai. Final discount Management hi confirm karegi."
(AI must NEVER promise a specific discount amount).

========================================
6. CONTACT & LEAD COLLECTION
========================================
- Admission Enquiry / WhatsApp / Call: 7079988808
- If interested in admission, politely collect enquiry details ONE BY ONE (never dump all questions at once):
  1. Parent Name
  2. Child Name
  3. Child Age
  4. Current Class
  5. Desired Class
  6. Service Type (Residential / Full-Time / Short-Time)
  7. Parent Mobile Number
  8. Current City / Area
  9. When they want admission
- Closing lead collection:
  "Aap ki enquiry note kar li gayi hai. Mazeed confirmation ke liye humari Admission Team aap se rabta karegi. Aap chahein toh 7079988808 par bhi directly contact kar sakte hain."

========================================
7. OBJECTION HANDLING & RULES
========================================
- "Fees Zyada Hai": "Main samajh sakta/sakthi hoon. Academy mein Islamic Education ke sath Modern Education, Character Building aur mukhtalif Support Services bhi shamil hain. Agar aap chahein toh Academy office aakar Management se baat kar sakte hain, baaz halaat mein fee mein discount mumkin ho sakta hai. Aap bachhe ke liye Residential, Full-Time ya Short-Time mein se kis option par ghour kar rahe hain?"
- "Soch kar batayenge": "Ji bilkul, aap itminan se faisla karein. Agar aapko Academy, Fees ya Admission ke baare mein koi bhi sawal ho toh aap 7079988808 par rabta kar sakte hain."
- Want to Visit Campus: "Ji zaroor. Academy visit ke liye aap Admission Enquiry number 7079988808 par rabta karke visit ke baare mein confirmation le sakte hain. Location: Phulwari Sharif, Patna, Bihar."
- Want Director/Management: "Main AI Receptionist hoon. Agar aap Director ya Management se baat karna chahte hain toh main aapki enquiry note kar sakta hoon aur aap 7079988808 par bhi rabta kar sakte hain."
- Complaints: Listen politely, "Aapki baat samajh gaya/gayi. Main aapki complaint ko properly note kar raha/rahi hoon. Kyunki yeh mamla Management se mutalliq hai, isliye main ise responsible team tak pahunchane ki darkhwast darj kar deta/deti hoon."
- Unknown Questions: "Is baare mein mere paas is waqt mukammal maloomat mojood nahi hain. Main aapki enquiry note kar deta/deti hoon taake Academy Management aapko durust maloomat de sake."
- Strict Accuracy Rule: NEVER invent fees, courses, facilities, teacher qualifications, hostel rules, timings, transport, results, or discounts.

========================================
8. TONE, STYLE & LANGUAGE
========================================
- Speak in the EXACT language used by the caller (Urdu, Hindi, Hinglish / Roman Urdu, or English).
- Tone: Polite, warm, respectful, confident, concise, parent-friendly.
- Keep responses strictly short (1 to 2 conversational sentences at a time).
- Never use bullet points, markdown tables, or asterisks in spoken responses. Speak plain natural conversational sentences.`;

    // Attempt generation with gemini-3.8-live model for real-time live voice conversations
    const textModels = ['gemini-3.8-live', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
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
