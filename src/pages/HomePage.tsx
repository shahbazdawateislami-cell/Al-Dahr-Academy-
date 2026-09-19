import React from 'react';
import { useAcademy } from '../context/AcademyContext';
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
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-24 lg:py-28 border-b border-slate-800">
        {/* Subtle background image overlay */}
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={settings.heroImageUrl}
            alt={settings.academyName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/80 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            {/* Tagline & Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.admissionButtonText} • Classes 1 to 8</span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-['Cinzel',serif] leading-tight">
                {settings.heroTitle}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-amber-400/95 font-semibold tracking-wider uppercase mt-2">
                {settings.heroSubtitle}
              </p>
            </div>

            {/* Tagline Box */}
            <div className="inline-block px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-300 font-bold font-['Amiri',serif] text-lg sm:text-xl">
              “{settings.tagline}”
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {settings.heroDescription}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => setIsAdmissionModalOpen(true)}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/20 transition transform active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply for Admission</span>
              </button>

              <button
                onClick={() => setIsFeeCalculatorOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-bold text-sm sm:text-base shadow-md transition flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Fee</span>
              </button>

              <a
                href={`tel:+91${settings.phone}`}
                className="px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call: {settings.phone}</span>
              </a>
            </div>

            {/* Key trust bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Classes 1 to 8</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Residential Boarding</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Quran & Tajweed Hifz</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Phulwari Sharif, Patna</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Academic Programs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
            Academic Pathways
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Cinzel',serif]">
            Choose the Right Program for Your Child
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Tailored education balancing Islamic spirituality, academic distinction, and flexible daily or residential structures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {programs.map((prog) => {
            const isResidential = prog.code === 'residential';
            const isFullTime = prog.code === 'full-time';

            return (
              <div
                key={prog.id}
                className={`relative rounded-2xl bg-slate-900 border ${
                  isResidential
                    ? 'border-amber-500/50 shadow-xl shadow-amber-950/20'
                    : isFullTime
                    ? 'border-sky-500/40'
                    : 'border-emerald-500/40'
                } overflow-hidden flex flex-col justify-between group hover:-translate-y-1 transition duration-300`}
              >
                {/* Image & Overlay */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={prog.imageUrl}
                    alt={prog.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 text-white border border-slate-700">
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

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <p className="text-[11px] text-slate-400">Tuition & Boarding:</p>
                      <p className="text-sm font-bold text-amber-400">{prog.feeNote}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Key Features:
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-400">
                        {prog.features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => navigateTo(`${prog.code}-program` as PageRoute)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition text-center"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setIsAdmissionModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition"
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              Grades Offered
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
              Classes 1 to 8 Curriculum & Progression
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Click any class to view subjects, Islamic syllabus, modern syllabus, activities, and exact fees.
            </p>
          </div>
          <button
            onClick={() => navigateTo('classes')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 shrink-0"
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
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer group transition duration-200 hover:-translate-y-1 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white font-['Cinzel',serif] group-hover:text-amber-400 transition">
                  {cls.name}
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Grade {cls.gradeNumber}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">
                {cls.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Residential Fee:</span>
                  <span className="font-bold text-white">₹{cls.feeResidential}/mo</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Full-Time:</span>
                  <span className="font-bold text-sky-400">₹{cls.feeFullTime}/mo</span>
                </div>
                <div className="text-amber-400 group-hover:translate-x-1 transition">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Balanced Education: Islamic & Modern Split */}
      <section className="bg-slate-900 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Holistic Philosophy
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Cinzel',serif]">
              The Harmonious Synthesis of Deen and Modernity
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              We eliminate the false divide between worldly competence and spiritual uprightness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Islamic Column */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-['Cinzel',serif]">
                    Islamic Education
                  </h3>
                  <p className="text-xs text-amber-400 font-semibold">
                    Faith, Character, and Sacred Knowledge
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Taught by devoted scholars and Asatizah with structured recitation, proper Tajweed articulation, daily congregational prayer routines, and profound understanding of prophetic traditions.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Qur'an & Tajweed from Noorani Qaida to fluent recitation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Hifz-e-Qur'an track with certified Hafiz supervision</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Hadith, Sunnah, and 6 Kalimas memorization</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Daily Masnoon Duas and Islamic Manners (Adab & Akhlaq)</span>
                </li>
              </ul>

              <button
                onClick={() => navigateTo('islamic-education')}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-400 font-bold text-xs border border-amber-500/30 transition flex items-center justify-center gap-2"
              >
                <span>Read Islamic Education Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Modern Academic Column */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-['Cinzel',serif]">
                    Modern Education
                  </h3>
                  <p className="text-xs text-sky-400 font-semibold">
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
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-sky-400 font-bold text-xs border border-sky-500/30 transition flex items-center justify-center gap-2"
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              Campus Environment
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
              World-Class Residential & Academic Facilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              A serene, secure environment designed for high academic focus and student wellness.
            </p>
          </div>
          <button
            onClick={() => navigateTo('facilities')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Explore All Facilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.slice(0, 4).map((fac) => (
            <div
              key={fac.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden group hover:border-amber-500/50 transition duration-300"
            >
              <div className="h-40 overflow-hidden bg-slate-950">
                <img
                  src={fac.imageUrl}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-base font-bold text-white font-['Cinzel',serif] group-hover:text-amber-400 transition">
                  {fac.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3">
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                Watch & Discover
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
                Campus Life in Motion: Videos & Shorts
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Experience the recitations, classroom dynamics, and student interviews.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('videos')}
                className="text-xs font-bold text-amber-400 hover:underline"
              >
                All Videos
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => navigateTo('youtube-shorts')}
                className="text-xs font-bold text-red-400 hover:underline"
              >
                YouTube Shorts
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => navigateTo('instagram-videos')}
                className="text-xs font-bold text-pink-400 hover:underline"
              >
                Instagram Reels
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVideos.map((vid) => (
              <div
                key={vid.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-red-500/50 transition"
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
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-950/80 rounded text-[10px] font-bold text-white uppercase">
                    {vid.type}
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-amber-400 transition">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
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
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                Visit Our Campus
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Cinzel',serif]">
                Located in Phulwari Sharif, Patna
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Parents are welcome to visit our premises, inspect the residential hostel, interact with Asatizah, and experience our peaceful academic environment firsthand.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Admission Hotline: +91 {settings.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Visiting Hours: 8:00 AM – 5:00 PM (Monday to Saturday)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsAdmissionModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition"
                >
                  Schedule Campus Visit
                </button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Embedded Interactive Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl h-72 sm:h-80 bg-slate-950">
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
