import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import {
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { getLocalizedCurriculum } from '../data/localizedData';

export const CurriculumPage: React.FC = () => {
  const { curriculum, setIsAdmissionModalOpen } = useAcademy();
  const { t, language } = useLanguage();

  const localizedCurriculum = curriculum.map((item) => getLocalizedCurriculum(item, language));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          {t('curriculum_page_badge', 'Pedagogical Architecture')}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel',serif] tracking-tight">
          {t('curriculum_page_title', 'Comprehensive Educational Curriculum')}
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          {t('curriculum_page_subtitle', 'Our curriculum integrates sacred sciences, competitive mainstream academics, moral tarbiyah, and practical life skills.')}
        </p>
      </div>

      {/* Curriculum Pillars */}
      <div className="space-y-8">
        {localizedCurriculum.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-5 shadow-xl hover:border-amber-500/40 transition duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-['Cinzel',serif] text-lg">
                0{idx + 1}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-white">
                  {item.title}
                </h2>
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  {t('classes_page_badge', 'Category')}: {item.category === 'islamic' ? t('nav_islamic_prog', 'Islamic') : t('nav_modern_prog', 'Modern')}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {item.description}
            </p>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                {t('class_subjects_covered', 'Key Topics & Modules Covered')}:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {item.topics.map((topic, i) => (
                  <div key={i} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center space-y-4">
        <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="text-2xl font-bold font-['Cinzel',serif]">
          {t('footer_give_child', 'Prepare Your Child for Success in Both Worlds')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          {t('footer_classes_desc', 'Enroll in Al-Dahr Academy for the upcoming academic session. Admissions open for Classes 1 to 8.')}
        </p>
        <button
          onClick={() => setIsAdmissionModalOpen(true)}
          className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-xl transition"
        >
          {t('hero_btn_apply', 'Submit Admission Application')}
        </button>
      </div>
    </div>
  );
};
