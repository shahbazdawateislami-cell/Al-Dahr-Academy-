import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  Phone,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, setIsAdmissionModalOpen } = useAcademy();
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-white">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          {t('about_badge', 'About Our Institution')}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel',serif] tracking-tight">
          {t('about_title', 'Nurturing Deen & Duniya in Perfect Harmony')}
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          {t('about_subtitle', 'Al-Dahr Academy is a premier residential and day-boarding Islamic educational institute situated in the historic learning hub of Phulwari Sharif, Patna, Bihar.')}
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12">
        <div className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-white">
            {t('about_mission_title', 'Our Noble Mission & Vision')}
          </h2>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <p className="text-amber-400 font-bold font-['Amiri',serif] text-xl">
              “{settings.tagline}”
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {t('footer_tagline', 'Guiding our youth towards eternal spiritual salvation alongside modern scholastic leadership.')}
            </p>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t('about_mission_desc', "In an era where secular schooling often overlooks spiritual anchor, and traditional madrasas sometimes lag in contemporary sciences, Al-Dahr Academy bridges the divide. We provide an integrated educational ecosystem where a student memorizes the Qur'an with Tajweed and simultaneously excels in English essay writing, mathematical reasoning, and scientific discovery.")}
          </p>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t('about_pillar1', 'Full residential boarding under watchful, nurturing Asatizah mentorship')}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{t('about_pillar2', 'Classes 1 through 8 structured according to recognized educational frameworks')}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('about_pillar3', 'Spoken English fluency, mathematical problem solving, and science lab practice')}</span>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-80 sm:h-96 bg-slate-950 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80"
            alt="Al-Dahr Academy Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-white">Phulwari Sharif Campus</p>
            <p className="text-[11px] text-amber-400">Patna, Bihar • {t('home_facilities_desc', 'Serene, secure, and conducive to learning')}</p>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Al-Dahr */}
      <div className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-center">
          {t('home_pathways_title', 'The Four Pillars of Our Foundation')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Cinzel',serif]">1. {t('sec_islamic_title', 'Pure Islamic Ethos')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('sec_islamic_desc', 'Instilling love for Allah, the Messenger (PBUH), daily Salah, and exemplary Sunnah manners from Class 1.')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Cinzel',serif]">2. {t('sec_modern_title', 'Modern Academics')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('sec_modern_desc', 'Standard curricula in English, Mathematics, Science, and Social Studies ensuring high competitive readiness.')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Cinzel',serif]">3. {t('class_activities_tarbiyah', 'Character Tarbiyah')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('about_pillar4', 'Developing humility, respect for parents, truthfulness, and integrity through active mentor supervision.')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Cinzel',serif]">4. {t('nav_residential_prog', 'Residential Care')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('about_pillar1', 'Wholesome hygienic meals, structured study hours, restful sleeping quarters, and dedicated medical care.')}
            </p>
          </div>
        </div>
      </div>

      {/* Leadership & Faculty */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-white">
          {t('about_mission_title', 'Our Asatizah & Academic Leadership')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {t('sec_islamic_desc', 'The teachers at Al-Dahr Academy are dual-disciplined: our Islamic instructors hold certified credentials in Tajweed, Hifz, and Dars-e-Nizami, while modern educators bring recognized pedagogical degrees in Science, Mathematics, and English linguistics. This combination ensures students receive compassionate, authentic guidance at every step.')}
        </p>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setIsAdmissionModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition"
          >
            {t('hero_btn_apply', 'Apply for Admission')}
          </button>
          <a
            href={`tel:+91${settings.phone}`}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>{t('btn_call_now', 'Speak to Administrator')}: +91 {settings.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
