import React, { useState, useEffect, useRef } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Calculator,
} from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const {
    settings,
    heroSlides,
    setCurrentPage,
    setIsAdmissionModalOpen,
    setIsFeeCalculatorOpen,
  } = useAcademy();

  const { t, language } = useLanguage();

  const activeSlides = heroSlides && heroSlides.length > 0
    ? heroSlides.filter((s) => s.active)
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance carousel every 5.5 seconds
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSlides.length, isPaused]);

  const handlePrev = () => {
    if (activeSlides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    if (activeSlides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const currentSlide = activeSlides[currentIndex] || {
    id: 'default',
    badge: 'WELCOME TO AL-DAHR ACADEMY',
    title: 'Start Your Beautiful And Bright Future',
    subtitle: 'Nurturing sacred Islamic Tarbiyah, Hifz-e-Quran, and modern school academics in Phulwari Sharif, Patna. Enrolling Classes 1 to 8.',
    imageUrl: settings.heroImageUrl,
    primaryBtnText: settings.admissionButtonText,
    primaryBtnAction: 'admission',
    secondaryBtnText: 'Explore Programs',
    secondaryBtnAction: 'programs',
  };

  const handleAction = (action?: string) => {
    if (action === 'admission') {
      setIsAdmissionModalOpen(true);
    } else if (action === 'calculator') {
      setIsFeeCalculatorOpen(true);
    } else if (action === 'classes') {
      setCurrentPage('classes');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'programs') {
      setCurrentPage('residential-program');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'facilities') {
      setCurrentPage('facilities');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'contact') {
      setCurrentPage('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'about') {
      setCurrentPage('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdmissionModalOpen(true);
    }
  };

  return (
    <div
      className="relative w-full bg-[#050e26] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Carousel Viewport - flex items-end to position text at bottom-left corner */}
      <div className="relative min-h-[400px] sm:min-h-[480px] lg:min-h-[540px] overflow-hidden flex items-end">
        {/* Background Image Carousel Slides */}
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-out"
                style={{
                  transform: isActive ? 'scale(1.03)' : 'scale(1.0)',
                }}
              />
              {/* Deep cinematic overlay matching the dark elegant tone & securing readability at bottom left */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#03091e]/95 via-[#061438]/85 to-[#050e26]/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03091e] via-[#050e26]/60 to-transparent" />
            </div>
          );
        })}

        {/* Carousel Content Container - Positioned at bottom-left corner */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-14 pt-16 sm:pt-24 lg:pt-28 w-full">
          <div className="max-w-3xl space-y-3 sm:space-y-4 text-left">
            {/* Top Welcome Badge (Like the Eduka / Academy Welcome in screenshot) */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-lg backdrop-blur-md animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {currentSlide.badge || 'WELCOME TO AL-DAHR ACADEMY'}
              </span>
            </div>

            {/* Main Headline - Refined proportional size for mobile and laptop */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-['Cinzel',serif] leading-tight drop-shadow-md">
              {currentSlide.title}
            </h1>

            {/* Subtitle / Paragraph */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-200 leading-relaxed font-medium max-w-2xl drop-shadow line-clamp-3 sm:line-clamp-none">
              {currentSlide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="pt-1.5 sm:pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3.5">
              <button
                onClick={() => handleAction(currentSlide.primaryBtnAction || 'admission')}
                className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-950/40 transition active:scale-98 flex items-center gap-2 uppercase tracking-wider"
              >
                <span>{currentSlide.primaryBtnText || t('btn_apply_now', 'Admission 2025–26')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleAction(currentSlide.secondaryBtnAction || 'programs')}
                className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700/80 hover:border-sky-400/50 shadow-lg backdrop-blur-md transition active:scale-98 flex items-center gap-2 uppercase tracking-wider"
              >
                <span>{currentSlide.secondaryBtnText || t('nav_programs', 'Explore Programs')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
              </button>

              <button
                onClick={() => setIsFeeCalculatorOpen(true)}
                className="px-3.5 py-2.5 sm:py-3 rounded-xl bg-sky-950/70 hover:bg-sky-900/80 text-sky-300 font-semibold text-xs border border-sky-800/60 shadow-lg transition flex items-center gap-1.5"
                title="Calculate School & Residential Fees"
              >
                <Calculator className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">{t('calc_badge', 'Fee Calculator')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Left Arrow Button (screenshot style circular floating button) */}
        {activeSlides.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-950/60 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/20 hover:border-amber-400 flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-sm group"
          >
            <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>
        )}

        {/* Right Arrow Button (screenshot style circular floating button) */}
        {activeSlides.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-950/60 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/20 hover:border-amber-400 flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-sm group"
          >
            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}

        {/* Slide Indicator Dots (Bottom Right to keep bottom-left text area clear) */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-5 sm:bottom-7 right-6 sm:right-12 z-30 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-xl">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-7 sm:w-8 bg-amber-400 shadow-md shadow-amber-500/50'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
