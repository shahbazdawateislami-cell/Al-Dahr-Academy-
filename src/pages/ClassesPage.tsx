import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { SchoolClassItem } from '../types';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  ArrowRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const ClassesPage: React.FC = () => {
  const { classes, setSelectedClassForModal, setIsAdmissionModalOpen, setEnquiryPrefill } = useAcademy();

  const handleApply = (cls: SchoolClassItem) => {
    setEnquiryPrefill({ class: cls.name });
    setIsAdmissionModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          Academic Grades
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel',serif] tracking-tight">
          Classes 1 to 8 Curriculum & Syllabi
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Discover the complete subject breakdown, Islamic syllabus, modern education, and fee options for each grade at Al-Dahr Academy.
        </p>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 overflow-hidden flex flex-col justify-between transition duration-300 p-6 sm:p-8 space-y-6 group"
          >
            <div className="space-y-4">
              {/* Class Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg font-['Cinzel',serif]">
                    C{cls.gradeNumber}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white group-hover:text-amber-400 transition">
                      {cls.name}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Primary & Middle School Foundation
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClassForModal(cls)}
                  className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>Full Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {cls.description}
              </p>

              {/* Islamic Curriculum snippet */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/20 space-y-1">
                <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Islamic Curriculum:</span>
                </p>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {cls.islamicCurriculum}
                </p>
              </div>

              {/* Modern Curriculum snippet */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/20 space-y-1">
                <p className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Modern Academic Curriculum:</span>
                </p>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {cls.modernCurriculum}
                </p>
              </div>

              {/* Subjects Pills */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Key Subjects:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cls.subjects.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Fee Breakdown & Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Residential</p>
                  <p className="text-xs font-bold text-amber-400">₹{cls.feeResidential}/mo</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Full-Time</p>
                  <p className="text-xs font-bold text-sky-400">₹{cls.feeFullTime}/mo</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Short-Time</p>
                  <p className="text-xs font-bold text-emerald-400">₹{cls.feeShortTime}/mo</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedClassForModal(cls)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition text-center"
                >
                  View Details & Routine
                </button>
                <button
                  onClick={() => handleApply(cls)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
