import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Youtube,
  Instagram,
  Facebook,
  Cpu,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Users,
  Trophy,
  Home,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

import defaultAiHandImage from '../assets/images/ai_hand_control_banner_1790176146501.jpg';
import defaultSocialPhoneImage from '../assets/images/phone_social_media_burst_banner_1790176164727.jpg';

export const EducationStructureWheel: React.FC = () => {
  const { structureData } = useAcademy();
  const [activeId, setActiveId] = useState<string | null>(null);

  const aiHandImage = structureData?.aiImageUrl || defaultAiHandImage;
  const socialPhoneImage = structureData?.socialImageUrl || defaultSocialPhoneImage;

  // Remaining pillars (Row 4) - Updated to dark royal blue & gold theme matching rest of site
  const secondarySegments = [
    {
      id: 'character',
      title: 'CHARACTER BUILDING',
      bgGradient: 'from-[#071330] via-[#0a1b42] to-[#040e26]',
      borderClass: 'border-amber-400/80',
      glowShadow: 'shadow-amber-500/30',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-md">
          <Users className="w-5 h-5 text-amber-300" />
        </div>
      ),
      bullets: [
        'Discipline',
        'Good Manners',
        'Leadership Skills',
        'Islamic Lifestyle',
        'Confidence Building',
      ],
    },
    {
      id: 'physical',
      title: 'PHYSICAL & MENTAL DEVELOPMENT',
      bgGradient: 'from-[#071330] via-[#0e173e] to-[#040e26]',
      borderClass: 'border-purple-400/80',
      glowShadow: 'shadow-purple-500/30',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a9 9 0 0 0 9 9" />
            <path d="M3 12a9 9 0 0 0 9 9" />
          </svg>
        </div>
      ),
      bullets: [
        'Sports & Outdoor Activities',
        'Health & Fitness Care',
        'Creative Activities',
        'Time Management',
      ],
    },
    {
      id: 'hostel',
      title: 'COMFORTABLE HOSTEL FACILITY',
      bgGradient: 'from-[#071330] via-[#07243c] to-[#040e26]',
      borderClass: 'border-cyan-400/80',
      glowShadow: 'shadow-cyan-500/30',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 4v16" />
            <path d="M2 8h18a2 2 0 0 1 2 2v10" />
            <path d="M2 17h20" />
            <path d="M6 8v3" />
            <circle cx="9" cy="11" r="2" />
          </svg>
        </div>
      ),
      bullets: [
        'Safe & Secure Environment',
        'Nutritious & Hygienic Food',
        'Clean Rooms',
        '24/7 Care & Supervision',
      ],
    },
    {
      id: 'support',
      title: 'EXTRA SUPPORT',
      bgGradient: 'from-[#071330] via-[#1a1b38] to-[#040e26]',
      borderClass: 'border-orange-400/80',
      glowShadow: 'shadow-orange-500/30',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 border-2 border-orange-400 flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-orange-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <circle cx="12" cy="7" r="3" />
            <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
          </svg>
        </div>
      ),
      bullets: [
        'Homework help',
        'Exam preparation',
        'Weak students support',
        'Regular parent updates',
      ],
    },
    {
      id: 'values',
      title: 'ISLAMIC & MODERN VALUES TOGETHER',
      bgGradient: 'from-[#071330] via-[#13223f] to-[#040e26]',
      borderClass: 'border-amber-400/90',
      glowShadow: 'shadow-amber-500/40',
      isSpecialValue: true,
      taglineDeen: 'Deen se Roshni',
      taglineDuniya: 'Duniya mein Kamyabi',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-emerald-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 2 6.5 5 8 0-4.5 3.5-8 8-8 1.5 0 3 .3 4.3 1C20.2 9.7 17 2 12 2z" />
            <path d="M12 22c5.5 0 10-4.5 10-10 0-3.5-2-6.5-5-8 0 4.5-3.5 8-8 8-1.5 0-3-.3-4.3-1C3.8 14.3 7 22 12 22z" opacity="0.6" />
          </svg>
        </div>
      ),
      bullets: [
        'Deen se Roshni',
        'Duniya mein Kamyabi',
      ],
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#031536] via-[#082252] to-[#020e26] py-12 sm:py-16 text-slate-100 border-y border-amber-500/30 shadow-2xl">
      {/* Background Graphic Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent pointer-events-none" />

      {/* Decorative Mosque Silhouette vector */}
      <div className="absolute top-0 left-0 right-0 h-32 opacity-15 pointer-events-none flex justify-between overflow-hidden">
        <svg className="w-64 h-32 text-sky-200 fill-current" viewBox="0 0 200 100">
          <path d="M0,100 L0,50 Q20,30 40,50 L40,100 M40,100 Q60,10 80,100 M80,100 L80,60 Q100,40 120,60 L120,100 Z" />
        </svg>
        <svg className="w-64 h-32 text-sky-200 fill-current" viewBox="0 0 200 100">
          <path d="M80,100 L80,50 Q100,30 120,50 L120,100 M120,100 Q140,10 160,100 M160,100 L160,60 Q180,40 200,60 L200,100 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header Title Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Official Academic Structure</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-['Cinzel',serif] tracking-tight drop-shadow-lg">
            AL-DAHR ACADEMY STRUCTURE
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/90 max-w-xl mx-auto">
            Modern CBSE Education, Islamic Taleem & Hifz-e-Qur'an, AI & Social Media Master Class, and Character Building.
          </p>
        </div>

        {/* ========================================================== */}
        {/* 1. TOP (ROW 1): MODERN EDUCATION (CBSE PATTERN) - DARK ROYAL THEME */}
        {/* ========================================================== */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#071330] via-[#0b1e4f] to-[#040e26] border-2 border-sky-400/80 shadow-[0_0_40px_rgba(14,165,233,0.3)] p-6 sm:p-8 overflow-hidden">
          {/* Header Badge */}
          <div className="-mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 px-6 py-4 bg-gradient-to-r from-[#031536] via-[#092257] to-[#031536] border-b-2 border-amber-400/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-sky-900 to-blue-950 border-2 border-sky-400 flex items-center justify-center shadow-md">
                <div className="flex flex-col items-center -space-y-1">
                  <div className="w-7 h-1.5 bg-red-500 rounded-sm shadow-sm" />
                  <div className="w-8 h-1.5 bg-sky-400 rounded-sm shadow-sm" />
                  <div className="w-9 h-1.5 bg-amber-400 rounded-sm shadow-sm" />
                  <div className="w-8 h-1.5 bg-emerald-500 rounded-sm shadow-sm" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-sky-300 tracking-widest">
                  ★ Primary Modern Education Pillar
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-white font-['Cinzel',serif] tracking-wide">
                  MODERN EDUCATION (CBSE PATTERN)
                </h3>
              </div>
            </div>
            <GraduationCap className="w-8 h-8 text-sky-300 hidden sm:block opacity-80" />
          </div>

          <p className="text-xs sm:text-sm font-semibold text-sky-200/90 mb-4">
            {structureData?.modernDescription || 'Comprehensive NCERT & CBSE Syllabus for Class 1 to Class 8 with strong foundation in core subjects:'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {(structureData?.modernSubjects || []).map((subject, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border-2 ${subject.color || 'border-blue-400/70 bg-[#030d29]/90 text-blue-200'} shadow-lg hover:border-sky-300 transition flex flex-col justify-between backdrop-blur-md`}
              >
                <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">
                  {subject.title}
                </span>
                <span className="text-[11px] font-bold text-sky-200/80 mt-1">
                  {subject.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================== */}
        {/* 2. SECOND (ROW 2): MERGED ISLAMIC EDUCATION & HIFZ-E-QUR'AN - DARK ROYAL THEME */}
        {/* ========================================================== */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#031d23] via-[#052b34] to-[#021118] border-2 border-emerald-400/80 shadow-[0_0_40px_rgba(16,185,129,0.3)] p-6 sm:p-8 overflow-hidden">
          {/* Header Banner */}
          <div className="-mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 px-6 py-4 bg-gradient-to-r from-[#031536] via-[#092257] to-[#031536] border-b-2 border-amber-400/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-emerald-900 to-teal-950 border-2 border-emerald-400 flex items-center justify-center shadow-md">
                <svg className="w-7 h-7 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <path d="M12 6l-3 3 3 3 3-3-3-3z" fill="currentColor" opacity="0.3" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-widest">
                  ★ Core Deeni & Qur'anic Tarbiyat Pillar
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-white font-['Cinzel',serif] tracking-wide">
                  ISLAMIC EDUCATION & HIFZ-E-QUR'AN
                </h3>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black">
              <span>Deeni Taleem</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-emerald-200/90 mb-4">
            {structureData?.islamicDescription || "Complete Deeni Taleem, Tajweed, Nazira & Step-by-step Hifz-e-Qur'an Curriculum:"}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
            {(structureData?.islamicSubjects || []).map((subject, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border-2 border-emerald-400/80 bg-[#021f1a]/90 text-emerald-100 shadow-lg hover:border-emerald-300 transition flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">
                      {subject.title}
                    </span>
                    {subject.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-slate-900 border border-slate-700 text-amber-300">
                        {subject.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-200/80 block">
                    {subject.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================== */}
        {/* 3. THIRD (ROW 3): AI MASTER CLASS & SOCIAL MEDIA MASTER CLASS (CLEAR VIVID BACKGROUND + FLOATING ANIMATIONS) */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT CARD: ADVANCED AI MASTER CLASS */}
          <div className="relative rounded-[2.5rem] border-4 border-sky-400/90 shadow-[0_0_50px_rgba(14,165,233,0.5)] overflow-hidden group min-h-[440px] flex flex-col justify-between">
            
            {/* Clear, Vivid & Floating Background Image (AI Robotic Hand controlling AI Logos) */}
            <div 
              className="absolute inset-0 bg-cover bg-center animate-float-slow filter contrast-110 brightness-110 saturate-125 transition-transform duration-1000"
              style={{ backgroundImage: `url(${aiHandImage})` }}
            />
            
            {/* Lighter, Crystal-Clear Overlay to make background image 100% visible & vibrant */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020b1f]/90 via-[#041438]/35 to-[#020b1f]/50 backdrop-contrast-105" />

            <div className="relative z-10 p-6 sm:p-8 space-y-6 flex flex-col justify-between h-full">
              {/* Floating Header Badge & Title */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/80 border border-purple-400/70 text-purple-200 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-lg animate-float">
                  <Cpu className="w-4 h-4 text-sky-400 animate-pulse-glow" />
                  <span>Futuristic Tech & AI Skills</span>
                </div>

                <h3 className="text-3xl sm:text-5xl font-black text-white font-['Cinzel',serif] tracking-wider drop-shadow-[0_4px_16px_rgba(0,0,0,1)] leading-tight">
                  ADVANCED AI <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-200 to-purple-300 drop-shadow">
                    MASTER CLASS
                  </span>
                </h3>

                <div className="p-2.5 rounded-xl bg-slate-950/75 border border-sky-400/40 backdrop-blur-md max-w-md">
                  <p className="text-xs sm:text-sm text-sky-100 font-bold drop-shadow">
                    Master AI workflows, ChatGPT, Gemini, DeepSeek, Claude, prompt engineering & automation.
                  </p>
                </div>
              </div>

              {/* Floating AI Key Skills Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {(structureData?.aiSkills || [
                  'AI Image Creation 📷',
                  'AI UGC & Videos 🎬',
                  'AI Podcast & Audio 🎙️',
                  'AI Monetization 💰',
                  'Google & Meta Ads 📈',
                  'Prompt Engineering ⚡',
                  'ChatGPT & Gemini 🧠',
                  'DeepSeek & Claude 🤖',
                ]).map((skillText, idx) => (
                  <div 
                    key={idx}
                    className={`px-3 py-2 rounded-xl bg-slate-950/80 border-2 border-sky-400/60 text-white text-xs font-black backdrop-blur-md flex items-center gap-2 shadow-xl hover:scale-105 transition transform ${idx % 2 === 0 ? 'animate-float' : 'animate-float-reverse'}`}
                    style={{ animationDelay: `${idx * 0.2}s` }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0 animate-pulse" />
                    <span className="drop-shadow-sm">{skillText}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-sky-400/50 flex items-center justify-between text-xs font-black text-sky-300 uppercase tracking-widest bg-slate-950/80 px-4 py-2 rounded-2xl backdrop-blur-md border border-sky-400/30">
                <span>Master AI Workflows</span>
                <span className="px-3 py-1 rounded-full bg-sky-500/30 border border-sky-400/60 text-sky-100 font-extrabold">
                  AL-DAHR ACADEMY
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: SOCIAL MEDIA MASTER CLASS */}
          <div className="relative rounded-[2.5rem] border-4 border-amber-400/90 shadow-[0_0_50px_rgba(245,158,11,0.5)] overflow-hidden group min-h-[440px] flex flex-col justify-between">
            
            {/* Clear, Vivid & Floating Background Image (Smartphone exploding with Social Media Icons) */}
            <div 
              className="absolute inset-0 bg-cover bg-center animate-float-slow filter contrast-110 brightness-110 saturate-125 transition-transform duration-1000"
              style={{ backgroundImage: `url(${socialPhoneImage})`, animationDelay: '1.5s' }}
            />
            
            {/* Lighter, Crystal-Clear Overlay to make background image 100% visible & vibrant */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f0e02]/90 via-[#381c04]/35 to-[#1a0c02]/50 backdrop-contrast-105" />

            <div className="relative z-10 p-6 sm:p-8 space-y-6 flex flex-col justify-between h-full">
              {/* Floating Header Badge & Title */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/80 border border-amber-400/70 text-amber-200 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-lg animate-float">
                  <Youtube className="w-4 h-4 text-amber-400 animate-pulse-glow" />
                  <span>Digital Media & Strategy</span>
                </div>

                <h3 className="text-3xl sm:text-5xl font-black text-white font-['Cinzel',serif] tracking-wider drop-shadow-[0_4px_16px_rgba(0,0,0,1)] leading-tight">
                  SOCIAL MEDIA <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 drop-shadow">
                    MASTER CLASS
                  </span>
                </h3>

                <div className="p-2.5 rounded-xl bg-slate-950/75 border border-amber-400/40 backdrop-blur-md max-w-md">
                  <p className="text-xs sm:text-sm text-amber-100 font-bold drop-shadow">
                    Positive content creation, video editing, social media growth, branding & Islamic media ethics.
                  </p>
                </div>
              </div>

              {/* Floating Social Platforms Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1.5 rounded-xl bg-red-600/90 text-white text-xs font-black flex items-center gap-1.5 shadow-xl border border-red-300/60 animate-float">
                  <Youtube className="w-4 h-4" /> YouTube
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xl border border-pink-300/60 animate-float-reverse">
                  <Instagram className="w-4 h-4" /> Instagram
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-blue-600/90 text-white text-xs font-black flex items-center gap-1.5 shadow-xl border border-blue-300/60 animate-float">
                  <Facebook className="w-4 h-4" /> Facebook
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-black/90 text-white text-xs font-black shadow-xl border border-slate-700 animate-float-reverse">
                  TikTok
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-black shadow-xl border border-slate-700 animate-float">
                  X
                </span>
              </div>

              {/* Floating Social Media Key Skills Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {(structureData?.socialSkills || [
                  'Positive Content Creation 📱',
                  'Video Editing & Reels ✂️',
                  'Channel Growth Strategy 🚀',
                  'Ethical Islamic Media 🌙',
                  'Digital Marketing & Ads 🎯',
                  'Graphic Design & Banner 🎨',
                  'Audience Engagement 💬',
                  'Monetization & Branding 💎',
                ]).map((skillText, idx) => (
                  <div 
                    key={idx}
                    className={`px-3 py-2 rounded-xl bg-slate-950/80 border-2 border-amber-400/60 text-white text-xs font-black backdrop-blur-md flex items-center gap-2 shadow-xl hover:scale-105 transition transform ${idx % 2 === 0 ? 'animate-float' : 'animate-float-reverse'}`}
                    style={{ animationDelay: `${idx * 0.2}s` }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                    <span className="drop-shadow-sm">{skillText}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-amber-400/50 flex items-center justify-between text-xs font-black text-amber-300 uppercase tracking-widest bg-slate-950/80 px-4 py-2 rounded-2xl backdrop-blur-md border border-amber-400/30">
                <span>Positive Digital Impact</span>
                <span className="px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/60 text-amber-100 font-extrabold">
                  AL-DAHR ACADEMY
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================== */}
        {/* 4. FOURTH (ROW 4): OTHER ACADEMIC & TARBIYAH PILLARS - DARK ROYAL THEME */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(structureData?.secondaryPillars || secondarySegments).map((seg) => {
            const fallback = secondarySegments.find((s) => s.id === seg.id) || secondarySegments[0];
            const icon = fallback.icon;
            const bgGradient = fallback.bgGradient;
            const borderClass = fallback.borderClass;

            return (
              <div
                key={seg.id}
                className={`rounded-3xl bg-gradient-to-b ${bgGradient} border-2 ${borderClass} p-5 shadow-2xl flex flex-col justify-between overflow-hidden hover:scale-[1.02] transition duration-300`}
              >
                <div className="-mx-5 -mt-5 mb-4 px-4 py-3 bg-gradient-to-r from-[#031536] via-[#092257] to-[#031536] border-b-2 border-amber-400/60 flex items-center gap-3">
                  {icon}
                  <h3 className="text-xs sm:text-sm font-black uppercase font-['Cinzel',serif] text-white tracking-wide">
                    {seg.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {(seg.taglineDeen || seg.taglineDuniya) && (
                    <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-sky-500/20 border border-amber-400/50 text-center space-y-0.5">
                      {seg.taglineDeen && (
                        <p className="text-xs font-black text-amber-300 uppercase tracking-wide">
                          {seg.taglineDeen}
                        </p>
                      )}
                      {seg.taglineDuniya && (
                        <p className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                          {seg.taglineDuniya}
                        </p>
                      )}
                    </div>
                  )}

                  <ul className="space-y-2">
                    {(seg.bullets || []).map((b: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-bold text-sky-100">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1 shadow-sm shadow-amber-400" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-2 border-t border-sky-500/30 text-[10px] font-black text-sky-300 uppercase flex items-center justify-between">
                  <span>AL-DAHR ACADEMY</span>
                  <span className="text-amber-400 font-bold">Facility</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
