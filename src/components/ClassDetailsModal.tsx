import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  BookOpen,
  GraduationCap,
  Sparkles,
  Activity,
} from 'lucide-react';
import { getLocalizedClass } from '../data/localizedData';

export const ClassDetailsModal: React.FC = () => {
  const {
    selectedClassForModal,
    setSelectedClassForModal,
    setIsAdmissionModalOpen,
    setEnquiryPrefill,
  } = useAcademy();

  const { t, language, isRTL } = useLanguage();

  if (!selectedClassForModal) return null;

  const localizedClass = getLocalizedClass(selectedClassForModal, language);

  const handleApplyForClass = (programName: string) => {
    const clsName = localizedClass.name;
    setSelectedClassForModal(null);
    setEnquiryPrefill({
      class: clsName,
      program: programName,
    });
    setIsAdmissionModalOpen(true);
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl bg-[#071330] border border-blue-900/80 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header with image */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-[#050e26]">
          {localizedClass.imageUrl && (
            <img
              src={localizedClass.imageUrl}
              alt={localizedClass.name}
              className="w-full h-full object-cover opacity-35"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071330] via-[#071330]/70 to-transparent" />

          <button
            onClick={() => setSelectedClassForModal(null)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-[#050e26]/80 text-white hover:bg-blue-900/70 border border-blue-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500 text-slate-950 text-xs font-bold mb-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('class_modal_badge', 'Standard Syllabus')}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
              {localizedClass.name} - {t('classes_view_syllabus', 'Full Syllabus')}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1">
              {localizedClass.description}
            </p>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Islamic Curriculum */}
          <div className="bg-[#050e26] rounded-xl p-4 border border-blue-900/80 space-y-2">
            <h4 className="text-sm font-bold text-sky-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>{t('class_islamic_curriculum', 'Islamic Curriculum')} ({localizedClass.name})</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {localizedClass.islamicCurriculum}
            </p>
          </div>

          {/* Modern Academic Curriculum */}
          <div className="bg-[#050e26] rounded-xl p-4 border border-blue-900/80 space-y-2">
            <h4 className="text-sm font-bold text-sky-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              <span>{t('class_modern_curriculum', 'Modern Academic Curriculum')}</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {localizedClass.modernCurriculum}
            </p>
          </div>

          {/* Subjects List */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              {t('class_subjects_covered', 'Key Subjects')} ({localizedClass.name}):
            </h4>
            <div className="flex flex-wrap gap-2">
              {localizedClass.subjects.map((sub, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#0b1e4f] border border-blue-800 rounded-lg text-xs text-slate-200 font-medium"
                >
                  ✓ {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Activities List */}
          {localizedClass.activities && localizedClass.activities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>{t('class_activities_tarbiyah', 'Character Tarbiyah')}:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {localizedClass.activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-[#050e26] border border-blue-900/80 rounded-lg text-xs text-slate-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fee Matrix for this class */}
          <div className="bg-[#050e26] rounded-xl p-4 border border-blue-900/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {t('class_monthly_fee_struct', 'Monthly Fee Structure')} - {localizedClass.name}:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#071330] border border-sky-500/40">
                <p className="text-[11px] text-sky-400 font-bold">{t('nav_residential', 'Residential')}</p>
                <p className="text-lg font-bold text-white font-['Cinzel',serif] my-1">
                  ₹{localizedClass.feeResidential}
                  <span className="text-xs text-slate-400 font-normal"> / mo</span>
                </p>
                <p className="text-[10px] text-slate-400">{t('home_residential_desc', 'Boarding + Deen + School')}</p>
                <button
                  onClick={() => handleApplyForClass('Residential Program')}
                  className="mt-2 w-full py-1.5 text-[11px] bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-lg hover:from-sky-400 hover:to-blue-500 shadow transition"
                >
                  {t('btn_apply_now', 'Apply Now')} {t('nav_residential', 'Residential')}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-[#071330] border border-blue-700/50">
                <p className="text-[11px] text-sky-300 font-bold">{t('nav_fulltime', 'Full-Time')}</p>
                <p className="text-lg font-bold text-white font-['Cinzel',serif] my-1">
                  ₹{localizedClass.feeFullTime}
                  <span className="text-xs text-slate-400 font-normal"> / mo</span>
                </p>
                <p className="text-[10px] text-slate-400">{t('home_fulltime_desc', 'Complete Day Schooling')}</p>
                <button
                  onClick={() => handleApplyForClass('Full-Time Program')}
                  className="mt-2 w-full py-1.5 text-[11px] bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition"
                >
                  {t('btn_apply_now', 'Apply Now')} {t('nav_fulltime', 'Full-Time')}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-[#071330] border border-cyan-800/60">
                <p className="text-[11px] text-cyan-400 font-bold">{t('nav_shorttime', 'Short-Time')}</p>
                <p className="text-lg font-bold text-white font-['Cinzel',serif] my-1">
                  ₹{localizedClass.feeShortTime}
                  <span className="text-xs text-slate-400 font-normal"> / mo</span>
                </p>
                <p className="text-[10px] text-slate-400">{t('home_shorttime_desc', 'Arabic + Urdu Only')}</p>
                <button
                  onClick={() => handleApplyForClass('Short-Time Program')}
                  className="mt-2 w-full py-1.5 text-[11px] bg-cyan-700 text-white font-bold rounded-lg hover:bg-cyan-600 transition"
                >
                  {t('btn_apply_now', 'Apply Now')} {t('nav_shorttime', 'Short-Time')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
