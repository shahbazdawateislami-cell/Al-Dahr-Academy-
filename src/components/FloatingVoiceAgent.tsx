import React, { useState, useEffect, useRef } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Phone,
  MessageCircle,
  Calculator,
  GraduationCap,
  GripHorizontal,
  RotateCcw,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  action?: {
    type: 'admission' | 'calculator' | 'classes' | 'call' | 'whatsapp' | 'programs';
    label: string;
  };
  timestamp: string;
}

export const FloatingVoiceAgent: React.FC = () => {
  const {
    settings,
    admissionFeeConfig,
    classes,
    programs,
    voiceKnowledge,
    isVoiceAgentOpen,
    setIsVoiceAgentOpen,
    setIsAdmissionModalOpen,
    setIsFeeCalculatorOpen,
    setCurrentPage,
  } = useAcademy();

  const { t, language } = useLanguage();

  // Floating position state
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    const saved = localStorage.getItem('aldahr_voice_pos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {
        // default
      }
    }
    const defaultX = typeof window !== 'undefined' ? Math.max(16, window.innerWidth - 86) : 20;
    const defaultY = typeof window !== 'undefined' ? Math.max(16, window.innerHeight - 100) : 100;
    return { x: defaultX, y: defaultY };
  });

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const elementStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedSignificantly = useRef(false);

  // Voice recognition & speech synthesis state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Assalamu Alaikum! I am Al-Dahr Academy AI Voice Assistant (الدھر اکیڈمی وائس ایجنٹ). How can I assist you with Admissions, Fees, Hostel, or Syllabus today?',
      timestamp: 'Just now',
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'ur' ? 'ur-PK' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleUserQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isVoiceAgentOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isVoiceAgentOpen]);

  // Adjust position on window resize
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

  // Text-to-Speech speaking function
  const speakText = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // cancel any active speech

    // Clean text for speech
    const cleanText = text
      .replace(/[•*#_\[\]()]/g, ' ')
      .replace(/₹/g, ' rupees ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick appropriate voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.includes('hi') ||
        v.lang.includes('ur') ||
        v.name.includes('India') ||
        v.lang.includes('en-IN')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Comprehensive Knowledge Query Matcher
  const findAnswer = (query: string): { answer: string; action?: ChatMessage['action'] } => {
    const q = query.toLowerCase().trim();

    // 1. Check Custom Admin Knowledge Base first (dynamically added from Admin Panel!)
    if (voiceKnowledge && voiceKnowledge.length > 0) {
      for (const item of voiceKnowledge) {
        if (!item.active) continue;

        // Check exact or keyword match
        const matchesKeyword = item.keywords?.some((kw) =>
          q.includes(kw.toLowerCase().trim())
        );
        const questionMatches =
          item.question.toLowerCase().includes(q) ||
          q.includes(item.question.toLowerCase());

        if (matchesKeyword || questionMatches) {
          let act: ChatMessage['action'] = undefined;
          if (item.category === 'admissions') {
            act = { type: 'admission', label: 'Apply for Admission' };
          } else if (item.category === 'fees') {
            act = { type: 'calculator', label: 'Open Fee Calculator' };
          } else if (item.category === 'contacts') {
            act = { type: 'call', label: `Call ${settings.phone}` };
          }
          return { answer: item.answer, action: act };
        }
      }
    }

    // 2. Built-in Intelligence for Fee inquiries
    if (
      q.includes('fee') ||
      q.includes('fees') ||
      q.includes('kharcha') ||
      q.includes('paisa') ||
      q.includes('rate') ||
      q.includes('charge') ||
      q.includes('cost') ||
      q.includes('price') ||
      q.includes('kitna')
    ) {
      const sampleClass = classes[0];
      const resFee = sampleClass?.feeResidential || 4500;
      const fullFee = sampleClass?.feeFullTime || 2000;
      const shortFee = sampleClass?.feeShortTime || 1000;
      const admFee = admissionFeeConfig.admissionFee || 1500;
      const uniformFee = admissionFeeConfig.dressFee || 1200;
      const bookFee = admissionFeeConfig.booksFee || 1500;

      return {
        answer: `Fee Structure of Al-Dahr Academy:\n• Residential Program: ₹${resFee}/month (includes boarding, meals, Quran Hifz & modern classes).\n• Full-Time Day Program: ₹${fullFee}/month.\n• Short-Time Program: ₹${shortFee}/month.\n• One-time admission fee: ₹${admFee}, Uniform: ₹${uniformFee}, Books: ₹${bookFee}.\nWe also offer merit and orphan scholarship concessions.`,
        action: { type: 'calculator', label: 'Open Fee Calculator' },
      };
    }

    // 3. Admission / How to apply
    if (
      q.includes('admission') ||
      q.includes('apply') ||
      q.includes('dakhla') ||
      q.includes('enroll') ||
      q.includes('form') ||
      q.includes('seat') ||
      q.includes('registration')
    ) {
      return {
        answer: `Admissions are currently OPEN for Academic Session 2025–26 for Classes 1 to 8 in Residential, Full-Time, and Short-Time modes. You can submit an enquiry online, call us at ${settings.phone}, or visit our campus in Phulwari Sharif, Patna.`,
        action: { type: 'admission', label: 'Apply Online Now' },
      };
    }

    // 4. Location / Address / Where is the academy
    if (
      q.includes('address') ||
      q.includes('location') ||
      q.includes('kahan') ||
      q.includes('where') ||
      q.includes('patna') ||
      q.includes('phulwari') ||
      q.includes('jagah') ||
      q.includes('map') ||
      q.includes('pata')
    ) {
      return {
        answer: `Al-Dahr Academy is located at: ${settings.address}.\nPatna, Bihar, India. Landmark: Phulwari Sharif. Parents are warmly welcomed to visit our campus. Call us at ${settings.phone} for directions.`,
        action: { type: 'call', label: `Call for Directions (${settings.phone})` },
      };
    }

    // 5. Contact / Phone / WhatsApp
    if (
      q.includes('contact') ||
      q.includes('phone') ||
      q.includes('call') ||
      q.includes('mobile') ||
      q.includes('whatsapp') ||
      q.includes('number') ||
      q.includes('email') ||
      q.includes('helpline') ||
      q.includes('raabta')
    ) {
      return {
        answer: `You can reach Al-Dahr Academy directly at:\n• Phone: ${settings.phone}\n• WhatsApp: ${settings.whatsapp}\n• Email: ${settings.email}\nOur office is open from 8:00 AM to 6:00 PM every day.`,
        action: { type: 'whatsapp', label: 'Chat on WhatsApp' },
      };
    }

    // 6. Hostel, Food, Dining, Residential living
    if (
      q.includes('hostel') ||
      q.includes('food') ||
      q.includes('khana') ||
      q.includes('room') ||
      q.includes('rehna') ||
      q.includes('living') ||
      q.includes('dormitory') ||
      q.includes('residential') ||
      q.includes('stay') ||
      q.includes('safety') ||
      q.includes('cctv')
    ) {
      return {
        answer: `Our residential campus provides 100% halal, hygienic, nutritious home-cooked meals 3 times a day, RO purified drinking water, clean airy dormitories with individual bedding, 24/7 CCTV surveillance, on-call doctors, and affectionate mentor Asatizah.`,
        action: { type: 'programs', label: 'View Residential Details' },
      };
    }

    // 7. Syllabus, Classes, Islamic & Modern subjects
    if (
      q.includes('class') ||
      q.includes('classes') ||
      q.includes('syllabus') ||
      q.includes('subject') ||
      q.includes('quran') ||
      q.includes('hifz') ||
      q.includes('tajweed') ||
      q.includes('hadith') ||
      q.includes('english') ||
      q.includes('science') ||
      q.includes('math') ||
      q.includes('padhai') ||
      q.includes('course')
    ) {
      return {
        answer: `We teach Classes 1 to 8 with a dual integration:\n1. Islamic Education: Holy Quran Memorization (Hifz), Tajweed, Noorani Qaida, Hadith, Fiqh, Arabic language, Urdu literature, and 5-time Namaz practice.\n2. Modern Academic Education: Mathematics, Science, English Grammar & Spoken English, Social Science, Computer Studies, and Hindi.`,
        action: { type: 'classes', label: 'Explore Class 1–8 Syllabus' },
      };
    }

    // 8. Daily routine & timings
    if (
      q.includes('routine') ||
      q.includes('schedule') ||
      q.includes('timing') ||
      q.includes('subah') ||
      q.includes('time table') ||
      q.includes('namaz') ||
      q.includes('waqt')
    ) {
      return {
        answer: `Daily Student Routine:\n• 4:30 AM: Tahajjud & Fajr Salah\n• 5:30 AM: Quran memorization (Hifz)\n• 7:30 AM: Breakfast & refresh\n• 8:30 AM – 1:30 PM: Modern school classes (CBSE syllabus)\n• 1:30 PM: Zuhr Salah & lunch\n• 4:30 PM: Asr Salah & sports\n• 6:00 PM: Maghrib Salah & Islamic Deeniyat\n• 8:00 PM: Dinner & Isha Salah\n• 9:30 PM: Bedtime.`,
      };
    }

    // Default polite response with helpful prompts
    return {
      answer: `Thank you for asking! Al-Dahr Academy offers Classes 1 to 8 in Residential, Full-Time, and Short-Time programs in Phulwari Sharif, Patna. You can ask me about our Monthly Fees, Hostel Facilities, Admission Process, or Islamic and Modern Syllabus. Or click below to contact our office!`,
      action: { type: 'call', label: `Call Admission Desk (${settings.phone})` },
    };
  };

  const handleUserQuery = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Process answer with slight natural delay
    setTimeout(() => {
      const { answer, action } = findAnswer(userText);
      const agentMsg: ChatMessage = {
        id: 'agent-' + Date.now(),
        sender: 'agent',
        text: answer,
        action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
      speakText(answer);
    }, 350);
  };

  const triggerVoiceInput = () => {
    if (isSpeaking) {
      stopSpeaking();
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start exception:', e);
      }
    } else {
      alert('Speech recognition is not supported in this browser. Please type your query in the box.');
    }
  };

  const handleExecuteAction = (action?: ChatMessage['action']) => {
    if (!action) return;
    if (action.type === 'admission') {
      setIsAdmissionModalOpen(true);
      setIsVoiceAgentOpen(false);
    } else if (action.type === 'calculator') {
      setIsFeeCalculatorOpen(true);
      setIsVoiceAgentOpen(false);
    } else if (action.type === 'classes') {
      setCurrentPage('classes');
      setIsVoiceAgentOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.type === 'programs') {
      setCurrentPage('residential-program');
      setIsVoiceAgentOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.type === 'call') {
      window.open(`tel:${settings.phone}`, '_self');
    } else if (action.type === 'whatsapp') {
      const cleanWa = settings.whatsapp.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/91${cleanWa}?text=Assalamu%20Alaikum%20Al-Dahr%20Academy,%20I%20want%20information%20regarding%20admissions`, '_blank');
    }
  };

  // Drag handlers for the floating button and panel header
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasMovedSignificantly.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { x: position.x, y: position.y };

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMovedSignificantly.current = true;
    }

    const newX = elementStartPos.current.x + dx;
    const newY = elementStartPos.current.y + dy;

    // Boundary constraints
    const maxX = window.innerWidth - (isVoiceAgentOpen ? 370 : 76);
    const maxY = window.innerHeight - (isVoiceAgentOpen ? 520 : 76);

    const clampedX = Math.min(Math.max(12, newX), maxX);
    const clampedY = Math.min(Math.max(12, newY), maxY);

    setPosition({ x: clampedX, y: clampedY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch (err) {
      // ignore
    }

    localStorage.setItem('aldahr_voice_pos', JSON.stringify(position));

    // If it was just a tap/click without moving, toggle the modal!
    if (!hasMovedSignificantly.current) {
      setIsVoiceAgentOpen(!isVoiceAgentOpen);
    }
  };

  return (
    <>
      {/* Floating Agent Button (Draggable everywhere across the website) */}
      <div
        id="floating-voice-agent-root"
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
          touchAction: 'none',
        }}
        className="select-none"
      >
        {!isVoiceAgentOpen ? (
          <div className="relative group">
            {/* Pulsing ring effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-sky-500 to-emerald-500 rounded-full blur-md opacity-70 group-hover:opacity-100 animate-pulse transition duration-500" />

            {/* Draggable Circle Button */}
            <button
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              aria-label="Open Al-Dahr Voice AI Assistant"
              className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-[#071333] via-[#0d2258] to-[#040a1d] text-white border-2 border-amber-400 shadow-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
            >
              {isListening ? (
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-rose-500 animate-ping absolute" />
                  <Mic className="w-7 h-7 text-white animate-bounce relative z-10" />
                </div>
              ) : isSpeaking ? (
                <Volume2 className="w-7 h-7 text-emerald-400 animate-pulse" />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Bot className="w-6 h-6 text-amber-400" />
                    <Sparkles className="w-3 h-3 text-sky-400 absolute -top-1 -right-2 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  <span className="text-[9px] font-black tracking-tighter text-sky-300 uppercase mt-0.5">
                    VOICE AI
                  </span>
                </div>
              )}
            </button>

            {/* Tooltip hint explaining draggability */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Voice AI (آواز ایجنٹ) • Drag me anywhere</span>
            </div>
          </div>
        ) : (
          /* Floating Active Dialog Window */
          <div
            className="w-[330px] sm:w-[380px] h-[480px] sm:h-[530px] bg-slate-950/95 backdrop-blur-xl rounded-3xl border-2 border-amber-400/80 shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-200"
          >
            {/* Draggable Header Bar */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="px-4 py-3.5 bg-gradient-to-r from-[#0a1945] via-[#0d2258] to-[#08153b] border-b border-amber-400/30 flex items-center justify-between cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-white font-['Cinzel',serif] tracking-wider">
                      AL-DAHR VOICE AI
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-amber-300/90 font-medium">
                    آواز ایجنٹ • Drag Header to Move
                  </p>
                </div>
              </div>

              {/* Header Action Controls */}
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
                  title={isMuted ? 'Unmute voice' : 'Mute voice'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    stopSpeaking();
                    setIsVoiceAgentOpen(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-600/80 text-slate-300 hover:text-white border border-slate-700 transition"
                  title="Close Voice Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
              <button
                onClick={() => handleUserQuery('What is the fee structure for Residential and Day classes?')}
                className="px-2.5 py-1 rounded-full bg-sky-950/70 hover:bg-sky-800 border border-sky-700 text-sky-200 whitespace-nowrap transition"
              >
                💰 Fee Structure
              </button>
              <button
                onClick={() => handleUserQuery('How do I apply for admission in 2025?')}
                className="px-2.5 py-1 rounded-full bg-amber-950/70 hover:bg-amber-800 border border-amber-700 text-amber-200 whitespace-nowrap transition"
              >
                📝 Admission
              </button>
              <button
                onClick={() => handleUserQuery('What hostel, food, and security facilities are provided?')}
                className="px-2.5 py-1 rounded-full bg-emerald-950/70 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 whitespace-nowrap transition"
              >
                🏠 Hostel & Food
              </button>
              <button
                onClick={() => handleUserQuery('Where is Al Dahr Academy located in Patna?')}
                className="px-2.5 py-1 rounded-full bg-indigo-950/70 hover:bg-indigo-800 border border-indigo-700 text-indigo-200 whitespace-nowrap transition"
              >
                📍 Location
              </button>
            </div>

            {/* Chat History Messages Scroll Area */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-sky-700 text-white'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <UserIcon className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold'
                        : 'bg-slate-900 border border-slate-800 text-slate-100 font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                    {/* Action button inside agent response */}
                    {msg.action && (
                      <button
                        onClick={() => handleExecuteAction(msg.action)}
                        className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-bold text-[11px] shadow flex items-center justify-center gap-1.5 transition active:scale-98"
                      >
                        <span>{msg.action.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    <span
                      className={`block text-[9px] mt-1 ${
                        msg.sender === 'user' ? 'text-amber-950/70' : 'text-slate-500'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isListening && (
                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-semibold animate-pulse">
                    Listening to your voice... Speak now! (بولیں)
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form & Microphone Controls */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserQuery(inputText);
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Mic Button */}
                <button
                  type="button"
                  onClick={triggerVoiceInput}
                  className={`p-3 rounded-2xl border transition active:scale-95 flex-shrink-0 ${
                    isListening
                      ? 'bg-rose-600 border-rose-400 text-white animate-pulse shadow-lg shadow-rose-600/50'
                      : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border-slate-700'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak into microphone'}
                >
                  <Mic className="w-5 h-5" />
                </button>

                {/* Text input for typing */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a question or tap microphone..."
                  className="flex-1 bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-2xl border border-slate-700 focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                />

                {/* Send text button */}
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Bottom Quick Contact bar */}
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-1 hover:text-amber-400 transition"
                >
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>{settings.phone}</span>
                </a>
                <button
                  onClick={() => {
                    setMessages([
                      {
                        id: 'reset',
                        sender: 'agent',
                        text: 'History cleared. What would you like to know about Al-Dahr Academy?',
                        timestamp: 'Just now',
                      },
                    ]);
                  }}
                  className="flex items-center gap-1 hover:text-slate-200 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
