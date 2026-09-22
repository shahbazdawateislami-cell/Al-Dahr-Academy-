import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import { PageRoute } from '../types';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Calculator,
  Building,
  GraduationCap,
  BookOpen,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  Award,
  HeartHandshake,
  Play,
  MapPin,
  Clock,
  Users,
} from 'lucide-react';
import {
  getLocalizedProgram,
  getLocalizedClass,
  getLocalizedFacility,
} from '../data/localizedData';
import { HeroCarousel } from '../components/HeroCarousel';

export const HomePage: React.FC = () => {
  const {
    settings,
    programs,
    classes,
    facilities,
    videos,
    setCurrentPage,
    setIsAdmissionModalOpen,
    setIsFeeCalculatorOpen,
    setSelectedClassForModal,
    setEnquiryPrefill,
  } = useAcademy();
  const { t, language } = useLanguage();

  // Fold / Unfold state for classes (Default folded: only class name + arrow visible)
  const [unfoldedClassIds, setUnfoldedClassIds] = useState<Record<string, boolean>>({});

  const toggleClassFold = (id: string) => {
    setUnfoldedClassIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const localizedPrograms = programs.map((p) => getLocalizedProgram(p, language));
  const localizedClasses = classes.map((c) => getLocalizedClass(c, language));
  const localizedFacilities = facilities.map((f) => getLocalizedFacility(f, language));

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappHref = `https://wa.me/91${settings.whatsapp}?text=${encodeURIComponent(
    `Assalamu Alaikum, I would like to enquire about admission at ${settings.academyName}, Phulwari Sharif, Patna.`
  )}`;

  const featuredVideos = videos.filter((v) => v.active && v.isFeatured).slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Dynamic Hero Carousel matching user screenshot */}
      <HeroCarousel />

      {/* 3 Core Academic Pathways */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
            {t('home_pathways_badge', '3 Academic Pathways')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Cinzel',serif] tracking-tight">
            {t('home_pathways_title', 'Choose the Right Pathway for Your Child')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t('home_pathways_desc', 'Whether you need comprehensive 24/7 residential boarding, full-day modern schooling with Islamic studies, or focused Arabic-Urdu language modules, Al-Dahr Academy caters to your specific needs.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {localizedPrograms.map((prog) => {
            const isResidential = prog.code === 'residential';
            const isFullTime = prog.code === 'full-time';

            return (
              <div
                key={prog.id}
                className={`relative rounded-3xl overflow-hidden bg-[#071330] border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl ${
                  isResidential
                    ? 'border-sky-500/50 shadow-sky-950/50'
                    : isFullTime
                    ? 'border-blue-700/60 hover:border-sky-400/60'
                    : 'border-blue-900/60 hover:border-teal-500/50'
                }`}
              >
                {/* Header Image / Badge */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-950 shrink-0">
                  <img
                    src={prog.imageUrl}
                    alt={prog.name}
                    className="w-full h-full object-cover opacity-75 hover:opacity-90 hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071330] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-blue-950/90 border border-blue-700/80 text-sky-300 text-xs font-bold shadow">
                      {prog.classes}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel',serif] line-clamp-1">
                      {prog.name}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3.5">
                    <p className="text-xs text-slate-300 leading-relaxed min-h-[38px] line-clamp-2">
                      {prog.description}
                    </p>

                    <div className="p-3 bg-[#050e26] rounded-xl border border-blue-900/60 min-h-[56px] flex flex-col justify-center">
                      <p className="text-[11px] text-sky-200/70">{t('class_monthly_fee_struct', 'Tuition & Boarding:')}</p>
                      <p className="text-sm font-bold text-sky-300 truncate">{prog.feeNote}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-sky-200 uppercase tracking-wider">
                        {t('class_activities_tarbiyah', 'Key Features:')}
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-300 min-h-[96px]">
                        {prog.features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-blue-900/60 flex items-center gap-2 mt-auto">
                    <button
                      onClick={() => navigateTo(`${prog.code}-program` as PageRoute)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-950/80 hover:bg-blue-900/80 text-white font-semibold text-xs transition text-center border border-blue-800/60"
                    >
                      {t('btn_view_details', 'View Details')}
                    </button>
                    <button
                      onClick={() => setIsAdmissionModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold text-xs transition shadow"
                    >
                      {t('btn_apply_now', 'Apply')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Classes 1 to 8 Snapshot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
              {t('home_classes_badge', 'Grades Offered')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
              {t('home_classes_title', 'Classes 1 to 8 Curriculum & Progression')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {t('home_classes_desc', 'Click any class to view subjects, Islamic syllabus, modern syllabus, activities, and exact fees.')}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                const allUnfolded = localizedClasses.every((c) => unfoldedClassIds[c.id]);
                if (allUnfolded) {
                  setUnfoldedClassIds({});
                } else {
                  const all: Record<string, boolean> = {};
                  localizedClasses.forEach((c) => {
                    all[c.id] = true;
                  });
                  setUnfoldedClassIds(all);
                }
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-950/70 border border-blue-800 text-sky-300 hover:text-white hover:border-sky-500/50 transition flex items-center gap-1.5"
            >
              <span>{localizedClasses.every((c) => unfoldedClassIds[c.id]) ? 'Fold All' : 'Unfold All'}</span>
            </button>
            <button
              onClick={() => navigateTo('classes')}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>{t('home_view_all_classes', 'View All Class Syllabi')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Classes Fold / Unfold Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-stretch">
          {localizedClasses.map((cls) => {
            const isUnfolded = !!unfoldedClassIds[cls.id];
            return (
              <div
                key={cls.id}
                className={`rounded-2xl border transition-all duration-200 shadow-md overflow-hidden flex flex-col ${
                  isUnfolded
                    ? 'bg-[#071330] border-sky-400/80 shadow-sky-950/40 ring-1 ring-sky-400/20'
                    : 'bg-[#071330]/90 border-blue-900/60 hover:border-sky-500/50 hover:bg-[#0a1945]'
                }`}
              >
                {/* Folded Header (In fold state: ONLY class name and an arrow, uniform height and line-height) */}
                <button
                  type="button"
                  onClick={() => toggleClassFold(cls.id)}
                  aria-expanded={isUnfolded}
                  className="w-full h-14 sm:h-16 px-4 py-3 flex items-center justify-between gap-3 text-left transition cursor-pointer select-none group shrink-0"
                >
                  <span className="text-base sm:text-lg font-bold text-white font-['Cinzel',serif] tracking-wide group-hover:text-sky-300 transition truncate">
                    {cls.name}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                      isUnfolded
                        ? 'bg-sky-500/20 text-sky-300 rotate-180'
                        : 'bg-blue-900/50 text-slate-300 group-hover:bg-sky-500/20 group-hover:text-sky-300'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Unfolded Details (Visible ONLY when unfolded) */}
                {isUnfolded && (
                  <div className="px-4 pb-4 pt-1 space-y-3.5 border-t border-blue-900/50 animate-in fade-in duration-200 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-xs font-bold text-sky-300 bg-sky-500/15 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                          Grade {cls.gradeNumber}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                          Admissions Open
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {cls.description}
                      </p>

                      <div className="pt-1.5 border-t border-blue-900/60 grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-900/50">
                          <span className="text-sky-200/60 block text-[10px]">
                            {t('home_residential_fee', 'Residential')}:
                          </span>
                          <span className="font-bold text-white text-xs">
                            ₹{cls.feeResidential}/mo
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-900/50">
                          <span className="text-sky-200/60 block text-[10px]">
                            {t('home_fulltime_fee', 'Full-Time')}:
                          </span>
                          <span className="font-bold text-sky-400 text-xs">
                            ₹{cls.feeFullTime}/mo
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClassForModal(cls);
                        }}
                        className="flex-1 py-2 px-2.5 rounded-xl bg-blue-900/50 hover:bg-blue-800 text-sky-200 text-xs font-semibold transition text-center"
                      >
                        {t('btn_view_details', 'Full Syllabus')}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEnquiryPrefill({ class: cls.name });
                          setIsAdmissionModalOpen(true);
                        }}
                        className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 text-xs font-bold transition shadow"
                      >
                        {t('btn_apply_now', 'Apply')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Balanced Education: Islamic & Modern Split */}
      <section className="bg-[#050e26] border-y border-blue-900/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
              {t('home_synthesis_badge', 'Holistic Philosophy')}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Cinzel',serif]">
              {t('home_synthesis_title', 'The Harmonious Synthesis of Deen and Modernity')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {t('home_synthesis_desc', 'We eliminate the false divide between worldly competence and spiritual uprightness.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Islamic Column */}
            <div className="p-8 rounded-2xl bg-[#071330] border border-sky-500/40 space-y-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-['Cinzel',serif]">
                    {t('sec_islamic_title', 'Islamic Education')}
                  </h3>
                  <p className="text-xs text-sky-300 font-semibold">
                    {t('sec_islamic_subtitle', 'Faith, Character, and Sacred Knowledge')}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('sec_islamic_desc', 'Taught by devoted scholars and Asatizah with structured recitation, proper Tajweed articulation, daily congregational prayer routines, and profound understanding of prophetic traditions.')}
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{t('about_pillar4', "Qur'an & Tajweed from Noorani Qaida to fluent recitation")}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{t('hero_stat_hifz', 'Hifz-e-Qur\'an track with certified Hafiz supervision')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{t('sec_islamic_subtitle', 'Hadith, Sunnah, and 6 Kalimas memorization')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{t('about_pillar1', 'Daily Masnoon Duas and Islamic Manners (Adab & Akhlaq)')}</span>
                </li>
              </ul>

              <button
                onClick={() => navigateTo('islamic-education')}
                className="w-full py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-sky-300 font-bold text-xs border border-sky-500/30 transition flex items-center justify-center gap-2"
              >
                <span>{t('home_read_islamic', 'Read Islamic Education Details →')}</span>
              </button>
            </div>

            {/* Modern Academic Column */}
            <div className="p-8 rounded-2xl bg-[#071330] border border-blue-700/50 space-y-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-sky-400 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-['Cinzel',serif]">
                    {t('sec_modern_title', 'Modern Education')}
                  </h3>
                  <p className="text-xs text-sky-300 font-semibold">
                    {t('sec_modern_subtitle', 'Scientific Temper, Literacy, and Digital Skills')}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('sec_modern_desc', 'Standard academic education covering the complete state and national curriculum, preparing children to excel in board examinations, higher studies, and global careers.')}
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{t('about_pillar3', 'English Language, Grammar, Phonics & Spoken communication')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{t('about_pillar2', 'Mathematics: Arithmetic, logic, geometry, and algebra')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{t('modern_page_subtitle', 'General Science with hands-on experiment demonstrations')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{t('sec_modern_desc', 'Social Studies, Urdu literature, and Computer foundations')}</span>
                </li>
              </ul>

              <button
                onClick={() => navigateTo('modern-education')}
                className="w-full py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-sky-300 font-bold text-xs border border-sky-500/30 transition flex items-center justify-center gap-2"
              >
                <span>{t('home_read_modern', 'Read Modern Education Details →')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
              {t('home_facilities_badge', 'Campus Environment')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
              {t('sec_facilities_title', 'World-Class Residential & Academic Facilities')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {t('home_facilities_desc', 'A serene, secure environment designed for high academic focus and student wellness.')}
            </p>
          </div>
          <button
            onClick={() => navigateTo('facilities')}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{t('home_explore_facilities', 'Explore All Facilities')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {localizedFacilities.slice(0, 4).map((fac) => (
            <div
              key={fac.id}
              className="rounded-2xl bg-[#071330] border border-blue-900/60 overflow-hidden group hover:border-sky-400/60 transition duration-300 shadow-lg"
            >
              <div className="h-40 overflow-hidden bg-slate-950">
                <img
                  src={fac.imageUrl}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-base font-bold text-white font-['Cinzel',serif] group-hover:text-sky-300 transition">
                  {fac.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-3">
                  {fac.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academy Videos, Shorts & Reels Highlight */}
      {featuredVideos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
                {t('home_videos_badge', 'Watch & Discover')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
                {t('home_videos_title', 'Campus Life in Motion: Videos & Shorts')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {t('home_videos_desc', 'Experience the recitations, classroom dynamics, and student interviews.')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('videos')}
                className="text-xs font-bold text-sky-400 hover:underline"
              >
                {t('home_all_videos', 'All Videos')}
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => navigateTo('youtube-shorts')}
                className="text-xs font-bold text-blue-400 hover:underline"
              >
                {t('home_yt_shorts', 'YouTube Shorts')}
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => navigateTo('instagram-videos')}
                className="text-xs font-bold text-teal-400 hover:underline"
              >
                {t('home_ig_reels', 'Instagram Reels')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVideos.map((vid) => (
              <div
                key={vid.id}
                className="rounded-2xl bg-[#071330] border border-blue-900/60 overflow-hidden flex flex-col justify-between group hover:border-sky-400/60 transition shadow-lg"
              >
                <div className="relative h-48 bg-slate-950">
                  {vid.thumbnail ? (
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950">
                      <Play className="w-12 h-12 text-slate-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-950/80 rounded text-[10px] font-bold text-white uppercase">
                    {vid.type}
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-sky-300 transition">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {vid.description}
                    </p>
                  </div>

                  <a
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-2 text-xs font-semibold text-sky-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t('home_watch_on', 'Watch on')} {vid.type === 'youtube' ? 'YouTube' : vid.type === 'shorts' ? 'YouTube Shorts' : 'Instagram'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Location & Quick Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#071330] via-[#0b1e4f] to-[#071330] border border-blue-800/70 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
                {t('sec_location_title', 'Campus Location')}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Cinzel',serif]">
                {t('sec_location_subtitle', 'Located in Phulwari Sharif, Patna')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {t('home_location_desc', 'Located in the serene surroundings of Phulwari Sharif, Patna, our campus provides an optimal atmosphere away from city distractions while remaining easily accessible by road and rail.')}
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-sky-400 shrink-0" />
                  <span>{t('sec_visiting_hours', 'Visiting Hours: 8:00 AM – 5:00 PM (Monday to Saturday)')}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsAdmissionModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg"
                >
                  {t('home_schedule_visit', 'Schedule Campus Visit')}
                </button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('home_chat_whatsapp', 'Chat on WhatsApp')}</span>
                </a>
              </div>
            </div>

            {/* Embedded Interactive Map */}
            <div className="rounded-2xl overflow-hidden border border-blue-700/60 shadow-2xl h-72 sm:h-80 bg-slate-950">
              <iframe
                title="Al-Dahr Academy Location"
                src={settings.googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
