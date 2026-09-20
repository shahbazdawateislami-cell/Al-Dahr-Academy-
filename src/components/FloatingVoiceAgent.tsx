import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Mic,
  Volume2,
  PhoneCall,
  PhoneOff,
  Sparkles,
  Radio,
} from 'lucide-react';

interface SpokenExchange {
  id: string;
  userQuery?: string;
  agentResponse: string;
  timestamp: string;
}

const GREETING_TEXT =
  'Assalamu Alaikum wa Rahmatullahi wa Barakatuh! Main Al-Dahr Academy ka Virtual Receptionist hoon. Aap admission, fees, courses ya hostel ke baare mein poochh sakte hain. Batayein, main aapki kya madad karoon?';

export const FloatingVoiceAgent: React.FC = () => {
  const {
    settings,
    admissionFeeConfig,
    classes,
    voiceKnowledge,
    isVoiceAgentOpen,
    setIsVoiceAgentOpen,
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
    const defaultX = typeof window !== 'undefined' ? Math.max(16, window.innerWidth - 86) : 20;
    const defaultY = typeof window !== 'undefined' ? Math.max(16, window.innerHeight - 100) : 100;
    return { x: defaultX, y: defaultY };
  });

  // Dragging states
  const isDraggingRef = useRef(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const elementStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedSignificantly = useRef(false);

  // Call / Receptionist Agent States (Pure Voice - NO Page opens)
  const [isActiveCall, setIsActiveCall] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'idle' | 'speaking' | 'listening' | 'processing'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const isSpeakingRef = useRef<boolean>(false);
  const activeCallRef = useRef<boolean>(false);

  // Keep activeCallRef in sync
  useEffect(() => {
    activeCallRef.current = isActiveCall;
  }, [isActiveCall]);

  // Keep position constrained on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const maxX = window.innerWidth - 86;
        const maxY = window.innerHeight - 86;
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
      if (typeof window === 'undefined' || !window.speechSynthesis) {
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

      // Select natural Hindi/Urdu/Indian English voice if available
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
        isSpeakingRef.current = true;
        setAgentStatus('speaking');
        setStatusMessage('Salam bol rahe hain...');
      };

      utterance.onend = () => {
        isSpeakingRef.current = false;
        if (activeCallRef.current) {
          if (onEndCallback) {
            onEndCallback();
          } else {
            startListening();
          }
        } else {
          setAgentStatus('idle');
          setStatusMessage('');
        }
      };

      utterance.onerror = () => {
        isSpeakingRef.current = false;
        if (activeCallRef.current) {
          if (onEndCallback) onEndCallback();
          else startListening();
        } else {
          setAgentStatus('idle');
          setStatusMessage('');
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    }
  }, []);

  // Knowledge Matching Algorithm (Al-Dahr Receptionist Source of Truth)
  const findAnswer = useCallback(
    (query: string): string => {
      const q = query.toLowerCase().trim();

      // 1. TOP PRIORITY: Custom Admin Knowledge Base
      if (voiceKnowledge && voiceKnowledge.length > 0) {
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
            return item.answer;
          }
        }

        // Token intersection
        const queryWords = q.split(/\s+/).filter((w) => w.length > 2);
        for (const item of voiceKnowledge) {
          if (!item.active) continue;
          const qWords = item.question.toLowerCase().split(/\s+/);
          const matchCount = queryWords.filter((w) => qWords.includes(w)).length;
          if (matchCount >= 2 || (queryWords.length === 1 && matchCount >= 1)) {
            return item.answer;
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

        return `Al-Dahr Academy ki Monthly Fees: Residential Program ki fees ₹${resFee} rupaye mahana hai jismein rahna, khana, Hifz aur school shamil hai. Day School ₹${fullFee} mahana hai, aur Short-Time ₹${shortFee} mahana hai. Admission fee ek baar ₹${admFee} hai. Yateem aur zarooratmand bacchon ke liye scholarship bhi maujood hai.`;
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
        return `Al-Dahr Academy mein Academic Session 2025-26 ke liye Class 1 se Class 8 tak Admissions OPEN hain. Aap website par online form bhar sakte hain ya hamare helpline number ${settings.phone} par seedha call kar sakte hain.`;
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
        return `Al-Dahr Academy ka campus ${settings.address} mein sthit hai. Patna, Bihar. Aap subah 9 baje se sham 5 baje tak campus visit kar sakte hain. Call karein ${settings.phone}.`;
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
        return `Hamare Residential Hostel mein 3 time taza, 100% halaal aur hygienic khana diya jata hai. Saaf-suthre havadar kamre, RO purified water, aur 24 ghante asatizah ki dekh-rekh rehti hai.`;
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
        return `Al-Dahr Academy mein Deen aur Duniya dono ki taleem sath chalti hai. Hifz-e-Quran, Tajweed aur Deeniyat ke sath-sath English Spoken, Mathematics, Science aur Computer ki behtareen padhai hoti hai.`;
      }

      // 7. Polite fallback
      return `Ji, is baare mein mazeed jaankari ke liye aap hamare helpline number ${settings.phone} par call kar sakte hain. Aur kya jaanna chahte hain aap?`;
    },
    [voiceKnowledge, classes, admissionFeeConfig, settings]
  );

  // Stop microphone listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Handle transcribed user voice query
  const handleUserVoiceQuery = useCallback(
    (query: string) => {
      if (!activeCallRef.current) return;
      stopListening();
      setAgentStatus('processing');
      setStatusMessage(`Sun liya: "${query.slice(0, 30)}..."`);

      const answer = findAnswer(query);

      setTimeout(() => {
        if (!activeCallRef.current) return;
        setStatusMessage('Jawab de rahe hain...');
        speakText(answer, () => {
          if (activeCallRef.current) {
            startListening();
          }
        });
      }, 400);
    },
    [findAnswer, speakText, stopListening]
  );

  // Start microphone recognition
  const startListening = useCallback(() => {
    if (!activeCallRef.current) return;
    stopSpeaking();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage('Voice recognition support nahi hai browser mein');
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
      recognition.lang = 'hi-IN';

      recognition.onstart = () => {
        if (!activeCallRef.current) {
          recognition.abort();
          return;
        }
        setAgentStatus('listening');
        setStatusMessage('🎤 Boliye, sun rahe hain...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          handleUserVoiceQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        if (!activeCallRef.current) return;
        if (event.error === 'no-speech') {
          setStatusMessage('🎤 Kuchh boliye, sun rahe hain...');
          // Retry listening automatically
          setTimeout(() => {
            if (activeCallRef.current && agentStatus !== 'speaking') {
              startListening();
            }
          }, 800);
        } else {
          setAgentStatus('listening');
        }
      };

      recognition.onend = () => {
        if (activeCallRef.current && agentStatus === 'listening') {
          // Keep listening loop alive while call is active
          setTimeout(() => {
            if (activeCallRef.current && !isSpeakingRef.current) {
              try {
                recognition.start();
              } catch (e) {
                // ignore
              }
            }
          }, 500);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
    }
  }, [handleUserVoiceQuery, stopSpeaking, agentStatus]);

  // Main Action: START or END CALL
  // "is button per type karne se sirf iska color change hona chahie aur billink karna chahie uske andar ka koi bhi page Khulna nahin chahie"
  // "Jaise hi is per Koi type karta hai yah Kisi ka sawal puche bagair pahle hi yah Salam Karen kisi ke voice ko sunane ka intezar na Karen pahle hi yah Salam Karen"
  const toggleReceptionistCall = () => {
    if (isActiveCall) {
      // END THE CALL
      activeCallRef.current = false;
      setIsActiveCall(false);
      setAgentStatus('idle');
      setStatusMessage('');
      stopSpeaking();
      stopListening();
      setIsVoiceAgentOpen(false);
    } else {
      // START THE CALL IMMEDIATELY
      activeCallRef.current = true;
      setIsActiveCall(true);
      setIsVoiceAgentOpen(true);
      setAgentStatus('speaking');
      setStatusMessage('Assalamu Alaikum...');

      // Without waiting for anyone's voice, speak Salam right now!
      speakText(GREETING_TEXT, () => {
        // After Salam completes, start listening to user's question!
        if (activeCallRef.current) {
          startListening();
        }
      });
    }
  };

  // Draggable logic for the floating button
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

    const maxX = window.innerWidth - 86;
    const maxY = window.innerHeight - 86;
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
      // Clean tap: toggle call directly! NO page opens!
      toggleReceptionistCall();
    }
  };

  // Sync if admin dashboard or other components trigger setIsVoiceAgentOpen
  useEffect(() => {
    if (isVoiceAgentOpen && !isActiveCall) {
      toggleReceptionistCall();
    }
  }, [isVoiceAgentOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, [stopSpeaking, stopListening]);

  return (
    <div
      id="aldahr-floating-voice-agent"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 50,
        touchAction: 'none',
      }}
      className="select-none flex flex-col items-center pointer-events-auto"
    >
      {/* Dynamic Mini Floating Status Capsule (NO Page/Modal, just a sleek floating pill above button) */}
      {isActiveCall && (
        <div className="mb-2 -translate-y-1 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
          <div
            className={`px-3 py-1 rounded-full shadow-2xl backdrop-blur-md border text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap ${
              agentStatus === 'speaking'
                ? 'bg-emerald-950/90 border-emerald-400/60 text-emerald-300 shadow-emerald-900/50'
                : agentStatus === 'listening'
                ? 'bg-rose-950/90 border-rose-400/60 text-rose-300 shadow-rose-900/50'
                : 'bg-stone-900/90 border-amber-400/50 text-amber-300 shadow-stone-900/50'
            }`}
          >
            {/* Blinking Status Dot */}
            <span
              className={`w-2 h-2 rounded-full animate-ping ${
                agentStatus === 'speaking'
                  ? 'bg-emerald-400'
                  : agentStatus === 'listening'
                  ? 'bg-rose-400'
                  : 'bg-amber-400'
              }`}
            />
            <span>{statusMessage || 'AI Receptionist Active'}</span>

            {/* Live Audio Waveform Bars */}
            <div className="flex items-center gap-0.5 ml-1 h-3">
              {[60, 100, 40, 80].map((h, i) => (
                <div
                  key={i}
                  className={`w-0.5 rounded-full animate-pulse ${
                    agentStatus === 'speaking'
                      ? 'bg-emerald-400'
                      : agentStatus === 'listening'
                      ? 'bg-rose-400'
                      : 'bg-amber-400'
                  }`}
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          THE MAIN RECEPTIONIST FLOATING BUTTON (Al-Dahr Receptionist AI)
          - Tapping changes color and starts blinking.
          - NO PAGE OR MODAL OPENS!
          - Speaks Salam immediately without waiting for voice!
          ========================================================================= */}
      <div className="relative group">
        {/* Animated Concentric Radar / Glow Rings */}
        {isActiveCall ? (
          <>
            {/* Pulsing Outer Blinking Glow */}
            <div
              className={`absolute -inset-3 rounded-full blur-lg opacity-90 animate-ping transition-all duration-300 ${
                agentStatus === 'speaking'
                  ? 'bg-emerald-500'
                  : agentStatus === 'listening'
                  ? 'bg-rose-500'
                  : 'bg-amber-500'
              }`}
            />
            {/* Secondary Ripple Wave */}
            <div
              className={`absolute -inset-2 rounded-full blur-md opacity-80 animate-pulse transition-all duration-300 ${
                agentStatus === 'speaking'
                  ? 'bg-emerald-400'
                  : agentStatus === 'listening'
                  ? 'bg-rose-400'
                  : 'bg-amber-400'
              }`}
            />
          </>
        ) : (
          /* Subtle standby glow */
          <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition duration-500" />
        )}

        <button
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          aria-label="Al-Dahr Academy Virtual Receptionist (Tap to Call)"
          title={
            isActiveCall
              ? 'Receptionist Active • Tap to Disconnect Call'
              : 'Al-Dahr Academy Virtual Receptionist (Tap to Start)'
          }
          className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 ${
            isActiveCall
              ? agentStatus === 'speaking'
                ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 border-2 border-emerald-300 text-white shadow-emerald-600/60 scale-105 animate-pulse'
                : agentStatus === 'listening'
                ? 'bg-gradient-to-br from-rose-600 via-rose-700 to-red-950 border-2 border-rose-300 text-white shadow-rose-600/60 scale-105 animate-pulse'
                : 'bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-900 border-2 border-amber-300 text-slate-950 shadow-amber-500/60 scale-105 animate-pulse'
              : 'bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 hover:from-emerald-700 hover:to-emerald-900 border-2 border-emerald-400/80 text-white shadow-emerald-950/80 hover:scale-105'
          }`}
        >
          {isActiveCall ? (
            agentStatus === 'speaking' ? (
              <div className="flex flex-col items-center justify-center">
                <Volume2 className="w-7 h-7 text-white animate-bounce" />
                <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-200 mt-0.5">
                  SPEAKING
                </span>
              </div>
            ) : agentStatus === 'listening' ? (
              <div className="flex flex-col items-center justify-center">
                <Mic className="w-7 h-7 text-white animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-tighter text-rose-200 mt-0.5">
                  LISTENING
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <PhoneCall className="w-7 h-7 text-slate-950 animate-bounce" />
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-950 mt-0.5">
                  CONNECTED
                </span>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <PhoneCall className="w-6 h-6 text-emerald-300 group-hover:scale-110 transition-transform" />
                <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -right-2 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <span className="text-[8.5px] font-black tracking-tight text-emerald-200 uppercase mt-0.5">
                AI CALL
              </span>
            </div>
          )}
        </button>

        {/* Hover Standby Tooltip (Only when not active) */}
        {!isActiveCall && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900/95 text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-emerald-600/40 pointer-events-none">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Al-Dahr Virtual Receptionist • Tap to Speak</span>
          </div>
        )}
      </div>
    </div>
  );
};
