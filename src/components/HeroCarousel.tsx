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
                className="w-full h-full object-cover object-center transition-transform duration-10000 ease-out"
                style={{
                  transform: isActive ? 'scale(1.03)' : 'scale(1.0)',
                }}
              />
            </div>
          );
        })}

        {/* Carousel Content Container - Compact & fitted at bottom-left corner */}
        <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-4 sm:pb-6 pt-10 w-full">
          <div className="max-w-xl space-y-1.5 sm:space-y-2 text-left p-3 sm:p-4.5 rounded-xl sm:rounded-2xl bg-[#03091e]/80 backdrop-blur-md border border-white/10 shadow-2xl">
            {/* Top Welcome Badge - Compact */}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                {currentSlide.badge || 'WELCOME TO AL-DAHR ACADEMY'}
              </span>
            </div>

            {/* Main Headline - Compact text size (~60% smaller) */}
            <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-white tracking-tight font-['Cinzel',serif] leading-tight drop-shadow-sm">
              {currentSlide.title}
            </h1>

            {/* Subtitle / Paragraph - Compact */}
            <p className="text-[10px] sm:text-xs text-slate-200 leading-snug font-normal max-w-lg drop-shadow line-clamp-2">
              {currentSlide.subtitle}
            </p>
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
