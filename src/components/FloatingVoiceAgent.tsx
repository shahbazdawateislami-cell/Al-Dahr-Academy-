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
  'Assalamu Alaikum bhai! Welcome to Al-Dahr Academy Patna. Main aapka AI Voice Receptionist hoon. Admissions, monthly fees, hostel ya syllabus ke baare mein aap freely pooch sakte hain. Boliye, main aapki kya help karoon?';

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
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const startListeningRef = useRef<() => void>(() => {});

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

  // Helper function to detect and disqualify female voices
  const isFemaleVoice = (voice: SpeechSynthesisVoice): boolean => {
    const n = (voice.name || '').toLowerCase();
    const lang = (voice.lang || '').toLowerCase();
    return (
      n.includes('female') ||
      n.includes('woman') ||
      n.includes('girl') ||
      n.includes('kalpana') ||
      n.includes('heera') ||
      n.includes('zira') ||
      n.includes('susan') ||
      n.includes('samantha') ||
      n.includes('victoria') ||
      n.includes('karen') ||
      n.includes('moira') ||
      n.includes('fiona') ||
      n.includes('tessa') ||
      n.includes('serena') ||
      n.includes('lekha') ||
      n.includes('veena') ||
      n.includes('swara') ||
      n.includes('ananya') ||
      n.includes('geeta') ||
      n.includes('priya') ||
      n.includes('shruti') ||
      n.includes('sunita') ||
      n.includes('zoya') ||
      // Default Google Hindi voice is female, so block it from being selected as male
      (n.includes('google') && (n.includes('hindi') || n.includes('हिन्दी') || lang === 'hi-in' || lang === 'hi_in'))
    );
  };

  // Find guaranteed male voice from browser synthesis engine
  const getGuaranteedMaleVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Filter out all female voices
    const nonFemaleVoices = voices.filter((v) => !isFemaleVoice(v));

    // 1. Highest Priority: Natural Indian English Male voice (Microsoft Ravi, Apple Rishi, Google en-IN Male, etc.)
    // These voices are trained specifically on Indian English and Roman Hinglish!
    const indianEnglishMale = nonFemaleVoices.find((v) => {
      const l = v.lang.toLowerCase().replace('_', '-');
      const n = v.name.toLowerCase();
      const isIndian = l.includes('en-in') || n.includes('india') || n.includes('indian');
      const isNamedMale = n.includes('male') || n.includes('ravi') || n.includes('rishi') || n.includes('kunal') || n.includes('prabhat') || n.includes('hemant');
      return isIndian && isNamedMale && !l.startsWith('hi');
    });
    if (indianEnglishMale) return indianEnglishMale;

    // 2. Any Indian English non-female voice (strictly NOT hi-IN because hi-IN spells out Latin letters robotically like Google Translate)
    const anyIndianEnglish = nonFemaleVoices.find((v) => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return l.includes('en-in') && !l.startsWith('hi');
    });
    if (anyIndianEnglish) return anyIndianEnglish;

    // 3. High Quality Modern English Male voices (Natural, smooth conversational flow)
    const standardMale = nonFemaleVoices.find((v) => {
      const n = v.name.toLowerCase();
      return (
        n.includes('natural') ||
        n.includes('neural') ||
        n.includes('guy') ||
        n.includes('male') ||
        n.includes('david') ||
        n.includes('george') ||
        n.includes('daniel') ||
        n.includes('oliver')
      );
    });
    if (standardMale) return standardMale;

    // 4. Any non-female voice that is NOT hi-IN (to prevent letter-by-letter spelling)
    const safeNonHindi = nonFemaleVoices.find((v) => !v.lang.toLowerCase().startsWith('hi'));
    return safeNonHindi || nonFemaleVoices[0] || null;
  }, []);

  // Pre-fetch voices on mount so they are available immediately
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Guaranteed Male Browser Speech Synthesis (Smooth, natural, no robotic spelling)
  const fallbackBrowserSpeak = useCallback(
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
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      // Natural modern cadence:
      utterance.lang = 'en-IN';
      utterance.pitch = 1.0;
      utterance.rate = 1.02;

      const maleVoice = getGuaranteedMaleVoice();
      if (maleVoice) {
        utterance.voice = maleVoice;
      }

      utterance.onstart = () => {
        isSpeakingRef.current = true;
        setAgentStatus('speaking');
        setStatusMessage('AI Voice बोल रहे हैं...');
      };

      utterance.onend = () => {
        isSpeakingRef.current = false;
        if (activeCallRef.current) {
          setAgentStatus('listening');
          setStatusMessage('🎤 Boliye, sun rahe hain...');
          if (onEndCallback) onEndCallback();
          else startListeningRef.current();
        } else {
          setAgentStatus('idle');
          setStatusMessage('');
        }
      };

      utterance.onerror = () => {
        isSpeakingRef.current = false;
        if (activeCallRef.current) {
          setAgentStatus('listening');
          setStatusMessage('🎤 Boliye, sun rahe hain...');
          if (onEndCallback) onEndCallback();
          else startListeningRef.current();
        } else {
          setAgentStatus('idle');
          setStatusMessage('');
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [getGuaranteedMaleVoice]
  );

  // Stop currently playing audio or speech
  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {
        // ignore
      }
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    isSpeakingRef.current = false;
  }, []);

  // Primary Advanced Text-To-Speech: Google Gemini Voice TTS API (Puck - fluent, youthful, natural)
  const speakText = useCallback(
    async (text: string, onEndCallback?: () => void) => {
      stopSpeaking();

      const cleanText = text
        .replace(/[•*#_\[\]()]/g, ' ')
        .replace(/₹/g, ' rupees ')
        .replace(/\n+/g, '. ')
        .trim();

      isSpeakingRef.current = true;
      setAgentStatus('speaking');
      setStatusMessage('AI Voice bol rahe hain...');

      try {
        // Request Google Gemini TTS (Puck: natural, fluent modern Indian male voice)
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            voice: 'Puck',
          }),
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();
        if (!data || !data.audioUrl) {
          fallbackBrowserSpeak(cleanText, onEndCallback);
          return;
        }

        const audio = new Audio(data.audioUrl);
        currentAudioRef.current = audio;

        audio.onplay = () => {
          isSpeakingRef.current = true;
          setAgentStatus('speaking');
          setStatusMessage('Gemini AI bol rahe hain...');
        };

        audio.onended = () => {
          isSpeakingRef.current = false;
          currentAudioRef.current = null;
          if (activeCallRef.current) {
            setAgentStatus('listening');
            setStatusMessage('🎤 Boliye, sun rahe hain...');
            if (onEndCallback) {
              onEndCallback();
            } else {
              startListeningRef.current();
            }
          } else {
            setAgentStatus('idle');
            setStatusMessage('');
          }
        };

        audio.onerror = () => {
          fallbackBrowserSpeak(cleanText, onEndCallback);
        };

        await audio.play();
      } catch (_err) {
        fallbackBrowserSpeak(cleanText, onEndCallback);
      }
    },
    [fallbackBrowserSpeak, stopSpeaking]
  );

  // Knowledge Matching Algorithm (Al-Dahr Receptionist Source of Truth in smooth conversational Hinglish)
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

      // 2. Fee inquiries (Conversational, no data tables)
      if (
        q.includes('fee') ||
        q.includes('fees') ||
        q.includes('kharcha') ||
        q.includes('paisa') ||
        q.includes('kitna') ||
        q.includes('rate') ||
        q.includes('charge')
      ) {
        return 'Hostel mein rehna, 3-time taza khana aur padhai sab mila kar lagbhag 4,500 rupaye mahina hai bhai. Aur agar sirf din mein aana chahein toh 2,000 rupaye hai. Aap hostel ke liye dekh rahe hain ya day school?';
      }

      // 3. Admission inquiries (Conversational, no session dates)
      if (
        q.includes('admission') ||
        q.includes('dakhla') ||
        q.includes('apply') ||
        q.includes('form') ||
        q.includes('seat') ||
        q.includes('registration')
      ) {
        return 'Haan ji bilkul bhai, admissions abhi open hain! Aapka bachha kaun si class mein padhega?';
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
        return 'Hamara campus Phulwari Sharif, Patna mein hai. Aap aaram se Monday se Saturday kisi bhi din aakar dekh sakte hain. Kya aap Patna se hi hain?';
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
        return 'Hostel facility ekdum safe aur clean hai bhai, 3 time taza halal khana milta hai aur 24 ghante teachers ki dekh-rekh rehti hai. Aur kuch janna chahte hain?';
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
        return 'Yahan Deeni taleem aur Hifz ke sath-sath CBSE pattern par English, Math, Science aur Computer sab padhaya jata hai. Aapka bachha kis class mein hai?';
      }

      // 7. Polite fallback
      return 'Aap chahein toh screen par diye helpline button se directly call kar sakte hain. Aur kuch janna hai bhai?';
    },
    [voiceKnowledge]
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

  // Handle transcribed user voice query via Gemini AI API
  const handleUserVoiceQuery = useCallback(
    async (query: string) => {
      if (!activeCallRef.current) return;
      stopListening();
      setAgentStatus('processing');
      setStatusMessage(`Sun liya: "${query.slice(0, 30)}..."`);

      try {
        // Send all queries to Gemini AI for natural, fluent Hinglish conversation
        const res = await fetch('/api/voice-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, voice: 'Puck' }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.answer) {
            if (!activeCallRef.current) return;
            setStatusMessage('Jawab de rahe hain...');

            if (data.audioUrl) {
              stopSpeaking();
              const audio = new Audio(data.audioUrl);
              currentAudioRef.current = audio;
              audio.onplay = () => {
                isSpeakingRef.current = true;
                setAgentStatus('speaking');
                setStatusMessage('AI Receptionist bol rahe hain...');
              };
              audio.onended = () => {
                isSpeakingRef.current = false;
                currentAudioRef.current = null;
                if (activeCallRef.current) {
                  setAgentStatus('listening');
                  setStatusMessage('🎤 Boliye, sun rahe hain...');
                  startListeningRef.current();
                } else {
                  setAgentStatus('idle');
                }
              };
              audio.onerror = () => {
                speakText(data.answer, () => {
                  if (activeCallRef.current) {
                    setAgentStatus('listening');
                    setStatusMessage('🎤 Boliye, sun rahe hain...');
                    startListeningRef.current();
                  }
                });
              };
              await audio.play();
              return;
            } else {
              speakText(data.answer, () => {
                if (activeCallRef.current) {
                  setAgentStatus('listening');
                  setStatusMessage('🎤 Boliye, sun rahe hain...');
                  startListeningRef.current();
                }
              });
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Voice query request notice:', err);
      }

      // Fallback only if offline/network failure
      const localAnswer = findAnswer(query);
      setTimeout(() => {
        if (!activeCallRef.current) return;
        setStatusMessage('Jawab de rahe hain...');
        speakText(localAnswer, () => {
          if (activeCallRef.current) {
            setAgentStatus('listening');
            setStatusMessage('🎤 Boliye, sun rahe hain...');
            startListeningRef.current();
          }
        });
      }, 150);
    },
    [findAnswer, speakText, stopListening, stopSpeaking]
  );

  // Start microphone recognition with continuous conversation loop
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
      recognition.continuous = true;
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
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex]?.[0]?.transcript;
        if (transcript && transcript.trim()) {
          handleUserVoiceQuery(transcript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        if (!activeCallRef.current) return;
        if (event.error === 'no-speech' || event.error === 'network' || event.error === 'aborted') {
          setTimeout(() => {
            if (activeCallRef.current && !isSpeakingRef.current) {
              startListeningRef.current();
            }
          }, 400);
        } else {
          setAgentStatus('listening');
        }
      };

      recognition.onend = () => {
        // Keep listening loop continuously alive while call is active
        if (activeCallRef.current && !isSpeakingRef.current) {
          setTimeout(() => {
            if (activeCallRef.current && !isSpeakingRef.current) {
              try {
                recognition.start();
              } catch (e) {
                // ignore
              }
            }
          }, 300);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
    }
  }, [handleUserVoiceQuery, stopSpeaking]);

  // Keep startListeningRef updated
  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

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
          id="aldahr-voice-call-button"
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
