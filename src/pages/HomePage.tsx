import React from 'react';
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
  CheckCircle2,
  ShieldCheck,
  Award,
  HeartHandshake,
  Play,
  MapPin,
  Clock,
  Users,
} from 'lucide-react';

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
  } = useAcademy();
  const { t, language } = useLanguage();

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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#050e26] via-[#091a45] to-[#060f29] text-white py-16 sm:py-24 lg:py-28 border-b border-blue-900/60 shadow-2xl">
        {/* Subtle background image overlay */}
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={settings.heroImageUrl}
            alt={settings.academyName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050e26] via-[#050e26]/90 to-[#091a45]/80 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            {/* Tagline & Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{t('hero_badge', `${settings.admissionButtonText} • Classes 1 to 8`)}</span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-['Cinzel',serif] leading-tight">
                {language === 'en' ? settings.heroTitle : (
                  <span>
                    {t('hero_title_prefix')}{' '}
                    <span className="text-sky-400">{t('hero_title_highlight')}</span>
                  </span>
                )}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-sky-300/95 font-semibold tracking-wider uppercase mt-2">
                {t('hero_subtitle', settings.heroSubtitle)}
              </p>
            </div>

            {/* Tagline Box */}
            <div className="inline-block px-4 py-2 rounded-xl bg-blue-950/80 border border-blue-800/80 text-sky-200 font-bold font-['Amiri',serif] text-lg sm:text-xl shadow-lg">
              “{t('academy_tagline', settings.tagline)}”
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              {t('hero_desc', settings.heroDescription)}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => setIsAdmissionModalOpen(true)}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-sky-500/25 transition transform active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{t('hero_btn_apply', 'Apply for Admission')}</span>
              </button>

              <button
                onClick={() => setIsFeeCalculatorOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-blue-950/90 hover:bg-blue-900/90 text-sky-300 border border-sky-400/40 font-bold text-sm sm:text-base shadow-md transition flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-sky-400" />
                <span>{t('hero_btn_fee', 'Calculate Fee')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Academic Programs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
            {t('nav_programs', 'Academic Pathways')}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Cinzel',serif]">
            {t('sec_programs_title', 'Choose the Right Program for Your Child')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('sec_programs_subtitle', 'Tailored education balancing Islamic spirituality, academic distinction, and flexible daily or residential structures.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {programs.map((prog) => {
            const isResidential = prog.code === 'residential';
            const isFullTime = prog.code === 'full-time';

            return (
              <div
                key={prog.id}
                className={`relative rounded-2xl bg-[#071330] border ${
                  isResidential
                    ? 'border-sky-500/70 shadow-2xl shadow-blue-950/70'
                    : isFullTime
                    ? 'border-blue-700/60'
                    : 'border-teal-600/60'
                } overflow-hidden flex flex-col justify-between group hover:-translate-y-1 transition duration-300`}
              >
                {/* Image & Overlay */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={prog.imageUrl}
                    alt={prog.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071330] via-[#071330]/40 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#050e26]/90 text-sky-200 border border-blue-800">
                    {prog.classes}
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-xl font-bold text-white font-['Cinzel',serif]">
                      {prog.name}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="p-3 bg-[#050e26] rounded-xl border border-blue-900/60">
                      <p className="text-[11px] text-sky-200/70">Tuition & Boarding:</p>
                      <p className="text-sm font-bold text-sky-300">{prog.feeNote}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-sky-200 uppercase tracking-wider">
                        Key Features:
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {prog.features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-blue-900/60 flex items-center gap-2">
                    <button
                      onClick={() => navigateTo(`${prog.code}-program` as PageRoute)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-950/80 hover:bg-blue-900/80 text-white font-semibold text-xs transition text-center border border-blue-800/60"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setIsAdmissionModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold text-xs transition shadow"
                    >
                      Apply
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
              Grades Offered
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
              Classes 1 to 8 Curriculum & Progression
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Click any class to view subjects, Islamic syllabus, modern syllabus, activities, and exact fees.
            </p>
          </div>
          <button
            onClick={() => navigateTo('classes')}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All Class Syllabi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              onClick={() => setSelectedClassForModal(cls)}
              className="p-5 rounded-2xl bg-[#071330] border border-blue-900/60 hover:border-sky-400/60 cursor-pointer group transition duration-200 hover:-translate-y-1 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white font-['Cinzel',serif] group-hover:text-sky-300 transition">
                  {cls.name}
                </span>
                <span className="text-xs font-bold text-sky-300 bg-sky-500/15 px-2 py-0.5 rounded-full border border-sky-400/30">
                  Grade {cls.gradeNumber}
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2">
                {cls.description}
              </p>

              <div className="pt-2 border-t border-blue-900/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-sky-200/60 block text-[10px]">Residential Fee:</span>
                  <span className="font-bold text-white">₹{cls.feeResidential}/mo</span>
                </div>
                <div>
                  <span className="text-sky-200/60 block text-[10px]">Full-Time:</span>
                  <span className="font-bold text-sky-400">₹{cls.feeFullTime}/mo</span>
                </div>
                <div className="text-sky-400 group-hover:translate-x-1 transition font-bold">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Balanced Education: Islamic & Modern Split */}
      <section className="bg-[#050e26] border-y border-blue-900/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
              Holistic Philosophy
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Cinzel',serif]">
              The Harmonious Synthesis of Deen and Modernity
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              We eliminate the false divide between worldly competence and spiritual uprightness.
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
                    Islamic Education
                  </h3>
                  <p className="text-xs text-sky-300 font-semibold">
                    Faith, Character, and Sacred Knowledge
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Taught by devoted scholars and Asatizah with structured recitation, proper Tajweed articulation, daily congregational prayer routines, and profound understanding of prophetic traditions.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Qur'an & Tajweed from Noorani Qaida to fluent recitation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Hifz-e-Qur'an track with certified Hafiz supervision</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Hadith, Sunnah, and 6 Kalimas memorization</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Daily Masnoon Duas and Islamic Manners (Adab & Akhlaq)</span>
                </li>
              </ul>

              <button
                onClick={() => navigateTo('islamic-education')}
                className="w-full py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-sky-300 font-bold text-xs border border-sky-500/30 transition flex items-center justify-center gap-2"
              >
                <span>Read Islamic Education Details</span>
                <ArrowRight className="w-4 h-4" />
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
                    Modern Education
                  </h3>
                  <p className="text-xs text-sky-300 font-semibold">
                    Scientific Temper, Literacy, and Digital Skills
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Standard academic education covering the complete state and national curriculum, preparing children to excel in board examinations, higher studies, and global careers.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>English Language, Grammar, Phonics & Spoken communication</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Mathematics: Arithmetic, logic, geometry, and algebra</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>General Science with hands-on experiment demonstrations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Social Studies, Urdu literature, and Computer foundations</span>
                </li>
              </ul>

              <button
                onClick={() => navigateTo('modern-education')}
                className="w-full py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-sky-300 font-bold text-xs border border-sky-500/30 transition flex items-center justify-center gap-2"
              >
                <span>Read Modern Education Details</span>
                <ArrowRight className="w-4 h-4" />
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
              Campus Environment
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
              World-Class Residential & Academic Facilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              A serene, secure environment designed for high academic focus and student wellness.
            </p>
          </div>
          <button
            onClick={() => navigateTo('facilities')}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Explore All Facilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.slice(0, 4).map((fac) => (
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
                Watch & Discover
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
                Campus Life in Motion: Videos & Shorts
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Experience the recitations, classroom dynamics, and student interviews.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('videos')}
                className="text-xs font-bold text-sky-400 hover:underline"
              >
                All Videos
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => navigateTo('youtube-shorts')}
                className="text-xs font-bold text-blue-400 hover:underline"
              >
                YouTube Shorts
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => navigateTo('instagram-videos')}
                className="text-xs font-bold text-teal-400 hover:underline"
              >
                Instagram Reels
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
                    <span>Watch on {vid.type === 'youtube' ? 'YouTube' : vid.type === 'shorts' ? 'YouTube Shorts' : 'Instagram'}</span>
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
                Parents are welcome to visit our premises, inspect the residential hostel, interact with Asatizah, and experience our peaceful academic environment firsthand.
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
                  {t('sec_schedule_visit', 'Schedule Campus Visit')}
                </button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('sec_whatsapp_chat', 'Chat on WhatsApp')}</span>
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
