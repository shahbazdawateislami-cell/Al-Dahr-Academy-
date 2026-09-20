import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Bot,
  User as UserIcon,
  Phone,
  ExternalLink,
  RotateCcw,
  Radio,
} from 'lucide-react';

interface SpokenExchange {
  id: string;
  userQuery?: string;
  agentResponse: string;
  agentUrdu?: string;
  action?: {
    type: 'admission' | 'calculator' | 'classes' | 'call' | 'whatsapp' | 'programs';
    label: string;
  };
  timestamp: string;
}

const INITIAL_GREETING_HINGLISH =
  'Assalamu Alaikum! Main Al-Dahr Academy ka virtual helpline hoon. Aapko kis cheez ke baare mein jaankari chahiye, batayein?';
const INITIAL_GREETING_URDU =
  'السلام علیکم! میں الدھر اکیڈمی کا ورچوئل ہیلپ لائن ہوں۔ آپ کو کس چیز کے بارے میں معلومات چاہیے، بتائیں؟';

export const FloatingVoiceAgent: React.FC = () => {
  const {
    settings,
    admissionFeeConfig,
    classes,
    voiceKnowledge,
    isVoiceAgentOpen,
    setIsVoiceAgentOpen,
    setIsAdmissionModalOpen,
    setIsFeeCalculatorOpen,
    setCurrentPage,
  } = useAcademy();

  // Floating button position (persisted in localStorage)
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    const saved = localStorage.getItem('aldahr_voice_pos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // default
      }
    }
    const defaultX = typeof window !== 'undefined' ? Math.max(16, window.innerWidth - 80) : 20;
    const defaultY = typeof window !== 'undefined' ? Math.max(16, window.innerHeight - 100) : 100;
    return { x: defaultX, y: defaultY };
  });

  // Dragging states
  const isDraggingRef = useRef(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const elementStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedSignificantly = useRef(false);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [micStatusText, setMicStatusText] = useState<string>('Ready');
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Spoken Conversation Exchanges (Voice Only, No Typing)
  const [currentExchange, setCurrentExchange] = useState<SpokenExchange>({
    id: 'welcome',
    agentResponse: INITIAL_GREETING_HINGLISH,
    agentUrdu: INITIAL_GREETING_URDU,
    timestamp: 'Just now',
  });
  const [history, setHistory] = useState<SpokenExchange[]>([]);

  const recognitionRef = useRef<any>(null);
  const speechTimeoutRef = useRef<any>(null);
  const autoListenTimerRef = useRef<any>(null);

  // Keep position constrained on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const maxX = window.innerWidth - 76;
        const maxY = window.innerHeight - 76;
        return {
          x: Math.min(Math.max(12, prev.x), maxX),
          y: Math.min(Math.max(12, prev.y), maxY),
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Text-To-Speech function
  const speakText = useCallback(
    (text: string, onEndCallback?: () => void) => {
      if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) {
        if (onEndCallback) onEndCallback();
        return;
      }

      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }

      const cleanText = text
        .replace(/[•*#_\[\]()]/g, ' ')
        .replace(/₹/g, ' rupees ')
        .replace(/\n+/g, '. ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Prefer Indian / Urdu / Hindi voices
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.includes('hi') ||
          v.lang.includes('ur') ||
          v.name.includes('India') ||
          v.lang.includes('en-IN')
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setMicStatusText('AI Bol raha hai... (Speaking)');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setMicStatusText('Sunne ke liye taiyaar (Ready)');
        if (onEndCallback) {
          onEndCallback();
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setMicStatusText('Ready');
        if (onEndCallback) {
          onEndCallback();
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [isMuted]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Voice Query Matching Algorithm (Admin Knowledge Base has top priority!)
  const findAnswer = useCallback(
    (query: string): { answer: string; urdu?: string; action?: SpokenExchange['action'] } => {
      const q = query.toLowerCase().trim();

      // 1. TOP PRIORITY: Custom Admin Knowledge Base fed via Admin Panel!
      if (voiceKnowledge && voiceKnowledge.length > 0) {
        // First try exact keyword match
        for (const item of voiceKnowledge) {
          if (!item.active) continue;
          const matchesKeyword = item.keywords?.some((kw) => {
            const cleanKw = kw.toLowerCase().trim();
            return cleanKw && (q.includes(cleanKw) || cleanKw.includes(q));
          });

          const questionMatches =
            item.question.toLowerCase().includes(q) ||
            q.includes(item.question.toLowerCase());

          if (matchesKeyword || questionMatches) {
            let act: SpokenExchange['action'] = undefined;
            if (item.category === 'admissions') {
              act = { type: 'admission', label: 'Admission Form Kholein' };
            } else if (item.category === 'fees') {
              act = { type: 'calculator', label: 'Fee Calculator Kholein' };
            } else if (item.category === 'contacts') {
              act = { type: 'call', label: `Helpline Par Call Karein: ${settings.phone}` };
            }
            return {
              answer: item.answer,
              action: act,
            };
          }
        }

        // Second pass: token intersection
        const queryWords = q.split(/\s+/).filter((w) => w.length > 2);
        for (const item of voiceKnowledge) {
          if (!item.active) continue;
          const qWords = item.question.toLowerCase().split(/\s+/);
          const matchCount = queryWords.filter((w) => qWords.includes(w)).length;
          if (matchCount >= 2 || (queryWords.length === 1 && matchCount >= 1)) {
            return {
              answer: item.answer,
            };
          }
        }
      }

      // 2. Fee inquiries
      if (
        q.includes('fee') ||
        q.includes('fees') ||
        q.includes('kharcha') ||
        q.includes('paisa') ||
        q.includes('kitna') ||
        q.includes('rate') ||
        q.includes('charge')
      ) {
        const sampleClass = classes[0];
        const resFee = sampleClass?.feeResidential || 4500;
        const fullFee = sampleClass?.feeFullTime || 2000;
        const shortFee = sampleClass?.feeShortTime || 1000;
        const admFee = admissionFeeConfig.admissionFee || 1500;

        return {
          answer: `Al-Dahr Academy ki Monthly Fees:\n• Residential Program: ₹${resFee} rupaye mahana (rehna, khana, Hifz aur school shamil hai).\n• Full-Time Day School: ₹${fullFee} mahana.\n• Short-Time: ₹${shortFee} mahana.\nAdmission fee ek baar ₹${admFee} hai. Yateem aur zarooratmand bacchon ke liye scholarship bhi maujood hai.`,
          action: { type: 'calculator', label: 'Fee Calculator Kholein' },
        };
      }

      // 3. Admission inquiries
      if (
        q.includes('admission') ||
        q.includes('dakhla') ||
        q.includes('apply') ||
        q.includes('form') ||
        q.includes('seat') ||
        q.includes('registration')
      ) {
        return {
          answer: `Al-Dahr Academy mein Academic Session 2025-26 ke liye Class 1 se Class 8 tak Admissions OPEN hain. Aap website par online form bhar sakte hain ya hamare helpline number ${settings.phone} par seedha call kar sakte hain.`,
          action: { type: 'admission', label: 'Online Admission Form Bharein' },
        };
      }

      // 4. Location & Address
      if (
        q.includes('address') ||
        q.includes('location') ||
        q.includes('kahan') ||
        q.includes('patna') ||
        q.includes('phulwari') ||
        q.includes('pata') ||
        q.includes('jagah')
      ) {
        return {
          answer: `Al-Dahr Academy ka campus ${settings.address} mein sthit hai. Patna, Bihar. Aap kisi bhi din subah 9 baje se sham 5 baje tak campus visit kar sakte hain. Call karein ${settings.phone}.`,
          action: { type: 'call', label: `Call Helpline: ${settings.phone}` },
        };
      }

      // 5. Hostel & Khana (Food)
      if (
        q.includes('hostel') ||
        q.includes('khana') ||
        q.includes('food') ||
        q.includes('rehna') ||
        q.includes('room') ||
        q.includes('mess') ||
        q.includes('stay')
      ) {
        return {
          answer: `Hamare Residential Hostel mein 3 time taza, 100% halaal aur hygienic khana diya jata hai. Saaf-suthre havadar kamre, RO purified paani, 24 ghante CCTV nigrani aur hamesha asatizah ki dekh-rekh rehti hai.`,
          action: { type: 'programs', label: 'Hostel Ki Puri Tafseel Dekhein' },
        };
      }

      // 6. Syllabus & Padhai (Curriculum)
      if (
        q.includes('syllabus') ||
        q.includes('padhai') ||
        q.includes('hifz') ||
        q.includes('quran') ||
        q.includes('english') ||
        q.includes('math') ||
        q.includes('subject')
      ) {
        return {
          answer: `Al-Dahr Academy mein Deen aur Duniya dono ki taleem sath chalti hai:\n1. Deeni Taleem: Hifz-e-Quran, Tajweed, Deeniyat, Hadith, Arabic aur Urdu.\n2. Asri School: English Spoken, Mathematics, Science, Computer aur Social Studies (CBSE pattern).`,
          action: { type: 'classes', label: 'Class 1 se 8 ka Syllabus Dekhein' },
        };
      }

      // 7. Fallback polite answer
      return {
        answer: `Ji, is sawal ki jaankari ke liye aap hamare helpline number ${settings.phone} par call kar sakte hain. Saath hi Admin Panel ke Voice AI tab mein iska naya jawab add kiya ja sakta hai.`,
        action: { type: 'call', label: `Helpline Par Call Karein: ${settings.phone}` },
      };
    },
    [voiceKnowledge, classes, admissionFeeConfig, settings]
  );

  // Start microphone recognition
  const startListening = useCallback(() => {
    stopSpeaking();
    setPermissionError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setPermissionError('Aapke browser mein Speech Recognition support nahi hai. Chrome ya Edge use karein.');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      // Multi-lingual Indian support (Hindi/Urdu/Indian English)
      recognition.lang = 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setMicStatusText('Aapki aawaz sun rahe hain... Boliye! (Listening)');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          handleUserVoiceQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setPermissionError('Microphone permission block hai. Kripya browser mein Mic allow karein.');
        } else if (event.error === 'no-speech') {
          setMicStatusText('Aawaz nahi aayi. Dobara mic par tap karein.');
        } else {
          setMicStatusText('Ready');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Error starting speech recognition:', err);
      setIsListening(false);
      setPermissionError('Microphone shuru nahi ho saka. Tap karke dobara koshish karein.');
    }
  }, [stopSpeaking]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
    setMicStatusText('Ready');
  }, []);

  // Handle transcribed user voice query
  const handleUserVoiceQuery = useCallback(
    (query: string) => {
      stopListening();
      setMicStatusText('Jawab dhoondh rahe hain...');

      const { answer, urdu, action } = findAnswer(query);

      const exchange: SpokenExchange = {
        id: 'ex-' + Date.now(),
        userQuery: query,
        agentResponse: answer,
        agentUrdu: urdu,
        action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCurrentExchange(exchange);
      setHistory((prev) => [exchange, ...prev.slice(0, 4)]);

      // Speak response aloud, and when speaking finishes, stay ready
      speechTimeoutRef.current = setTimeout(() => {
        speakText(answer, () => {
          setMicStatusText('Mic par tap karein agla sawal bolne ke liye');
        });
      }, 300);
    },
    [findAnswer, speakText, stopListening]
  );

  // AUTOMATIC GREETING UPON TAP / OPEN:
  // "use per type karte hi jo hai uska Mike chalu hokar ke blank hona chahie aur fauran assalam walekum main aldar academy ka virtual helpline Ho..."
  useEffect(() => {
    if (isVoiceAgentOpen) {
      // Reset current exchange to initial greeting
      const initial: SpokenExchange = {
        id: 'welcome-' + Date.now(),
        agentResponse: INITIAL_GREETING_HINGLISH,
        agentUrdu: INITIAL_GREETING_URDU,
        timestamp: 'Just now',
      };
      setCurrentExchange(initial);
      setPermissionError(null);

      // Fauran bolo (Speak greeting immediately)
      const greetingTimer = setTimeout(() => {
        speakText(INITIAL_GREETING_HINGLISH, () => {
          // After speaking the greeting, automatically start microphone to listen to the user!
          autoListenTimerRef.current = setTimeout(() => {
            startListening();
          }, 350);
        });
      }, 250);

      return () => {
        clearTimeout(greetingTimer);
        clearTimeout(autoListenTimerRef.current);
        clearTimeout(speechTimeoutRef.current);
        stopSpeaking();
        stopListening();
      };
    } else {
      stopSpeaking();
      stopListening();
    }
  }, [isVoiceAgentOpen, speakText, startListening, stopSpeaking, stopListening]);

  // Execute action button
  const handleExecuteAction = (action?: SpokenExchange['action']) => {
    if (!action) return;
    stopSpeaking();
    stopListening();
    setIsVoiceAgentOpen(false);

    if (action.type === 'admission') {
      setIsAdmissionModalOpen(true);
    } else if (action.type === 'calculator') {
      setIsFeeCalculatorOpen(true);
    } else if (action.type === 'classes') {
      setCurrentPage('classes');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.type === 'programs') {
      setCurrentPage('residential-program');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.type === 'call') {
      window.location.href = `tel:${settings.phone}`;
    }
  };

  // Draggable logic for the floating trigger
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasMovedSignificantly.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { x: position.x, y: position.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      hasMovedSignificantly.current = true;
    }

    const maxX = window.innerWidth - 76;
    const maxY = window.innerHeight - 76;
    const newX = Math.min(Math.max(12, elementStartPos.current.x + dx), maxX);
    const newY = Math.min(Math.max(12, elementStartPos.current.y + dy), maxY);
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }

    if (hasMovedSignificantly.current) {
      localStorage.setItem('aldahr_voice_pos', JSON.stringify(position));
    } else {
      // If it was a clean tap without dragging, open or toggle the voice assistant
      setIsVoiceAgentOpen(!isVoiceAgentOpen);
    }
  };

  return (
    <>
      {/* Backdrop overlay when voice card is open on mobile */}
      {isVoiceAgentOpen && (
        <div
          onClick={() => {
            stopSpeaking();
            stopListening();
            setIsVoiceAgentOpen(false);
          }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 sm:hidden animate-in fade-in"
        />
      )}

      <div
        id="aldahr-floating-voice-agent"
        style={{
          position: 'fixed',
          left: isVoiceAgentOpen && typeof window !== 'undefined' && window.innerWidth < 640 ? '50%' : `${position.x}px`,
          top: isVoiceAgentOpen && typeof window !== 'undefined' && window.innerWidth < 640 ? '50%' : `${position.y}px`,
          transform: isVoiceAgentOpen && typeof window !== 'undefined' && window.innerWidth < 640 ? 'translate(-50%, -50%)' : 'none',
          zIndex: 50,
          touchAction: 'none',
        }}
        className="select-none"
      >
        {!isVoiceAgentOpen ? (
          /* =========================================================================
             FLOATING TRIGGER BUTTON (Tap to activate Voice Assistant & Mic)
             ========================================================================= */
          <div className="relative group">
            {/* Pulsing ring effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-sky-500 to-emerald-500 rounded-full blur-md opacity-75 group-hover:opacity-100 animate-pulse transition duration-500" />

            <button
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              aria-label="Al-Dahr Academy Voice Helpline (Tap to Speak)"
              title="Al-Dahr Voice Helpline • Tap to Speak"
              className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-[#071333] via-[#0d2258] to-[#040a1d] text-white border-2 border-amber-400 shadow-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              {isListening ? (
                <div className="relative flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-rose-500 animate-ping absolute" />
                  <Mic className="w-7 h-7 text-white relative z-10 animate-bounce" />
                </div>
              ) : isSpeaking ? (
                <Volume2 className="w-7 h-7 text-amber-400 animate-pulse" />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="relative">
                    <Mic className="w-6 h-6 text-amber-400" />
                    <Sparkles className="w-3 h-3 text-sky-400 absolute -top-1 -right-2 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  <span className="text-[9px] font-black tracking-tighter text-sky-300 uppercase mt-0.5">
                    VOICE AI
                  </span>
                </div>
              )}
            </button>

            {/* Hint tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Voice Helpline (بول کر پوچھیں) • Tap to Speak</span>
            </div>
          </div>
        ) : (
          /* =========================================================================
             PURE VOICE ASSISTANT MODAL (NO TYPING - 100% VOICE ONLY)
             ========================================================================= */
          <div
            className="w-[320px] sm:w-[380px] bg-[#071126] border-2 border-amber-400/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-200"
          >
            {/* Draggable Header */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="px-4 py-3 bg-gradient-to-r from-[#0a1945] via-[#0d2258] to-[#08153b] border-b border-amber-400/30 flex items-center justify-between cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-white font-['Cinzel',serif] tracking-wider">
                      AL-DAHR VIRTUAL HELPLINE
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-amber-300 font-medium">
                    آواز ورچوئل ہیلپ لائن • Voice Assistant Only
                  </p>
                </div>
              </div>

              {/* Mute & Close Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    setIsMuted(!isMuted);
                  }}
                  className={`p-1.5 rounded-lg border transition ${
                    isMuted
                      ? 'bg-rose-900/40 border-rose-500/50 text-rose-300'
                      : 'bg-emerald-900/40 border-emerald-500/50 text-emerald-300'
                  }`}
                  title={isMuted ? 'Unmute Voice' : 'Mute Voice'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    stopSpeaking();
                    stopListening();
                    setIsVoiceAgentOpen(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-600/80 text-slate-300 hover:text-white border border-slate-700 transition"
                  title="Close Voice Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Central Animated Voice Visualizer / Speaking & Listening Stage */}
            <div className="p-5 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#071126] to-[#040a1d] border-b border-slate-800/80 space-y-4">
              {/* Animated Sound Wave Bars */}
              <div className="flex items-center justify-center gap-1.5 h-12">
                {[40, 70, 100, 60, 85, 45, 95, 65, 35].map((height, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isListening
                        ? 'bg-rose-500 animate-pulse'
                        : isSpeaking
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-slate-700'
                    }`}
                    style={{
                      height: isListening || isSpeaking ? `${height}%` : '20%',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>

              {/* Big Interactive Glowing Voice Microphone Button */}
              <div className="relative">
                {isListening && (
                  <div className="absolute -inset-3 bg-rose-500 rounded-full blur-lg opacity-80 animate-ping" />
                )}
                {isSpeaking && (
                  <div className="absolute -inset-3 bg-amber-400 rounded-full blur-lg opacity-70 animate-pulse" />
                )}

                <button
                  onClick={() => {
                    if (isListening) {
                      stopListening();
                    } else {
                      startListening();
                    }
                  }}
                  aria-label={isListening ? 'Stop listening' : 'Start speaking into microphone'}
                  className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 border-2 ${
                    isListening
                      ? 'bg-gradient-to-br from-rose-600 to-rose-700 border-rose-300 text-white shadow-rose-600/50 scale-105 animate-pulse'
                      : isSpeaking
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 border-amber-300 text-slate-950 shadow-amber-500/50'
                      : 'bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 border-sky-400 text-white hover:scale-105'
                  }`}
                >
                  {isListening ? (
                    <Mic className="w-8 h-8 text-white animate-bounce" />
                  ) : isSpeaking ? (
                    <Volume2 className="w-8 h-8 text-slate-950 animate-pulse" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </button>
              </div>

              {/* Real-time Status Text */}
              <div className="space-y-1">
                <p
                  className={`text-xs font-bold tracking-wide ${
                    isListening
                      ? 'text-rose-400 animate-pulse'
                      : isSpeaking
                      ? 'text-amber-400'
                      : 'text-sky-300'
                  }`}
                >
                  {isListening
                    ? '🎤 Aapki aawaz sun rahe hain... Boliye!'
                    : isSpeaking
                    ? '🔊 Virtual Helpline bol raha hai...'
                    : 'Mic par tap karein aur bolein (Tap Mic to Speak)'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isListening
                    ? 'Say: Fees kitni hai? • Admission kaise lein? • Hostel kaisa hai?'
                    : micStatusText}
                </p>
              </div>

              {/* Permission error warning if any */}
              {permissionError && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-700 text-[11px] text-rose-300 w-full text-center">
                  {permissionError}
                </div>
              )}
            </div>

            {/* Conversation Display Area (Shows Spoken Exchange) */}
            <div className="p-4 max-h-56 overflow-y-auto space-y-3 text-xs bg-slate-950/80">
              {/* If user just asked something */}
              {currentExchange.userQuery && (
                <div className="flex items-start gap-2 flex-row-reverse animate-in fade-in">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-amber-500/20 border border-amber-500/40 rounded-2xl px-3 py-2 text-amber-200 max-w-[85%] text-left">
                    <p className="text-[10px] text-amber-400/80 font-bold uppercase mb-0.5">
                      Aapne pucha (You asked):
                    </p>
                    <p className="font-semibold text-xs leading-relaxed">
                      "{currentExchange.userQuery}"
                    </p>
                  </div>
                </div>
              )}

              {/* AI Agent Spoken Answer */}
              <div className="flex items-start gap-2 animate-in fade-in">
                <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-slate-100 max-w-[85%] text-left space-y-2">
                  <p className="whitespace-pre-line leading-relaxed text-xs">
                    {currentExchange.agentResponse}
                  </p>

                  {/* Urdu transliteration or subtitle */}
                  {currentExchange.agentUrdu && (
                    <p
                      dir="rtl"
                      className="text-[11px] text-amber-300/90 font-['Amiri',serif] leading-relaxed border-t border-slate-800 pt-1.5"
                    >
                      {currentExchange.agentUrdu}
                    </p>
                  )}

                  {/* One-click Action Button if answer has an action */}
                  {currentExchange.action && (
                    <button
                      onClick={() => handleExecuteAction(currentExchange.action)}
                      className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-[11px] shadow flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer mt-1"
                    >
                      <span>{currentExchange.action.label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-950" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar (Direct Call & Re-listen to Greeting) */}
            <div className="p-3 bg-[#061026] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Helpline: {settings.phone}</span>
              </a>

              <button
                onClick={() => {
                  const initial: SpokenExchange = {
                    id: 'welcome-' + Date.now(),
                    agentResponse: INITIAL_GREETING_HINGLISH,
                    agentUrdu: INITIAL_GREETING_URDU,
                    timestamp: 'Just now',
                  };
                  setCurrentExchange(initial);
                  speakText(INITIAL_GREETING_HINGLISH, () => {
                    startListening();
                  });
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                title="Repeat Welcome Greeting"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Dobara Sunen</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
