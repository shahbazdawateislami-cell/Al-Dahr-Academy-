import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import { PageRoute } from '../types';
import {
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
import { EducationStructureWheel } from '../components/EducationStructureWheel';
import { parseVideoUrl } from '../utils/videoUtils';
import { getMapEmbedUrl, getMapDirectUrl } from '../utils/mapUtils';
import { VideoModal } from '../components/VideoModal';
import { VideoMediaItem } from '../types';

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

  // Active video modal state
  const [activeVideoToPlay, setActiveVideoToPlay] = useState<VideoMediaItem | null>(null);

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

      {/* Official Academy Education Structure Wheel matching user template */}
      <EducationStructureWheel />

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

          {/* Action Buttons Shifted Here Just Below Heading Text */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            <button
              onClick={() => setIsAdmissionModalOpen(true)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-950/40 transition active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider text-center"
            >
              <span>{t('btn_apply_now', 'Admission 2025–26')}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              onClick={() => navigateTo('residential-program')}
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700/80 hover:border-sky-400/50 shadow-lg backdrop-blur-md transition active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider text-center"
            >
              <span>{t('nav_programs', 'Explore Programs')}</span>
              <ArrowRight className="w-4 h-4 text-sky-400 shrink-0" />
            </button>

            <button
              onClick={() => setIsFeeCalculatorOpen(true)}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-sky-950/80 hover:bg-sky-900/90 text-sky-300 font-semibold text-xs sm:text-sm border border-sky-800/60 shadow-lg transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
              title="Calculate School & Residential Fees"
            >
              <Calculator className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{t('calc_badge', 'Fee Calculator')}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {localizedPrograms.map((prog) => {
            const isResidential = prog.code === 'residential';
            const isFullTime = prog.code === 'full-time';

            return (
              <div
                key={prog.id}
                className={`relative rounded-3xl overflow-hidden bg-[#071330] border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl h-full ${
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
                  <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-300 leading-relaxed min-h-[38px] line-clamp-2">
                      {prog.description}
                    </p>

                    <div className="p-3 bg-[#050e26] rounded-xl border border-blue-900/60 h-14 flex flex-col justify-center shrink-0">
                      <p className="text-[11px] text-sky-200/70">{t('class_monthly_fee_struct', 'Tuition & Boarding:')}</p>
                      <p className="text-sm font-bold text-sky-300 truncate">{prog.feeNote}</p>
                    </div>

                    <div className="space-y-2 shrink-0">
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

                  <div className="pt-3 border-t border-blue-900/60 flex items-center gap-2 mt-auto shrink-0">
                    <button
                      onClick={() => navigateTo(`${prog.code}-program` as PageRoute)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-950/80 hover:bg-blue-900/80 text-white font-semibold text-xs transition text-center border border-blue-800/60"
                    >
                      {t('btn_view_details', 'View Details')}
                    </button>
                    <button
                      onClick={() => setIsAdmissionModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold text-xs transition shadow shrink-0"
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
                {/* Folded Header */}
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

                {/* Unfolded Details */}
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
            {featuredVideos.map((vid) => {
              const parsed = parseVideoUrl(vid.url, vid.type);
              const thumb = vid.thumbnail || parsed.thumbnailUrl;

              return (
                <div
                  key={vid.id}
                  onClick={() => setActiveVideoToPlay(vid)}
                  className="rounded-2xl bg-[#071330] border border-blue-900/60 overflow-hidden flex flex-col justify-between group hover:border-amber-500/80 transition duration-300 shadow-lg cursor-pointer"
                >
                  {/* Interactive Video Card Preview & Thumbnail */}
                  <div className="relative h-60 sm:h-64 bg-slate-950 overflow-hidden group/thumb">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center gap-3 ${
                        vid.type === 'instagram'
                          ? 'bg-gradient-to-tr from-amber-600 via-pink-600 to-purple-800'
                          : 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900'
                      }`}>
                        {vid.type === 'instagram' ? (
                          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                            <Play className="w-10 h-10 text-white fill-white" />
                          </div>
                        ) : (
                          <div className="p-3 rounded-2xl bg-red-600/30 border border-red-500/50">
                            <Play className="w-10 h-10 text-red-400 fill-red-400" />
                          </div>
                        )}
                        <span className="text-xs font-bold text-white tracking-wide drop-shadow line-clamp-1">
                          {vid.title}
                        </span>
                      </div>
                    )}

                    {/* Glowing Center Play Overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 group-hover/thumb:bg-slate-950/20 transition-all duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl transition transform group-hover/thumb:scale-110">
                        <Play className="w-6 h-6 ml-1 fill-slate-950" />
                      </div>
                    </div>

                    {/* Top Right Platform Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/90 backdrop-blur-md rounded-lg text-[10px] font-extrabold text-amber-400 border border-amber-400/40 uppercase shadow-lg pointer-events-none">
                      {vid.type === 'youtube' ? 'YouTube' : vid.type === 'shorts' ? '⚡ Shorts' : '📷 Instagram Reel'}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-amber-400 transition font-['Cinzel',serif]">
                        {vid.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-blue-900/60">
                      <div className="text-xs font-bold text-amber-400 group-hover:text-amber-300 inline-flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 fill-amber-400" />
                        <span>Click to Play Video</span>
                      </div>
                      <span className="text-[10px] text-sky-300 font-semibold px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800/80">
                        {vid.category || 'Al-Dahr Media'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Video Modal Player Popup */}
      <VideoModal
        video={activeVideoToPlay}
        onClose={() => setActiveVideoToPlay(null)}
      />

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
                  href={getMapDirectUrl(settings.googleMapsUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open Google Maps</span>
                </a>
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
                src={getMapEmbedUrl(settings.googleMapsUrl)}
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
