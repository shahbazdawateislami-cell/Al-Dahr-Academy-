import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { ProgramCode } from '../types';
import {
  Building,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Moon,
} from 'lucide-react';

interface ProgramsPageProps {
  initialCode?: ProgramCode;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ initialCode }) => {
  const { programs, setIsAdmissionModalOpen, setIsFeeCalculatorOpen, setEnquiryPrefill } = useAcademy();

  const handleApply = (programName: string) => {
    setEnquiryPrefill({ program: programName });
    setIsAdmissionModalOpen(true);
  };

  const activePrograms = initialCode
    ? programs.filter((p) => p.code === initialCode)
    : programs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          Our Educational Offerings
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel',serif] tracking-tight">
          {initialCode === 'residential'
            ? 'Residential Boarding Program'
            : initialCode === 'full-time'
            ? 'Full-Time Day Schooling Program'
            : initialCode === 'short-time'
            ? 'Short-Time Arabic & Urdu Program'
            : 'Academic Programs & Pathways'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Tailored learning options combining classical Islamic upbringing, modern education, and character mentorship for Classes 1 to 8 in Phulwari Sharif, Patna.
        </p>
      </div>

      {/* Program Blocks */}
      <div className="space-y-12">
        {activePrograms.map((prog) => {
          const isResidential = prog.code === 'residential';
          const isFullTime = prog.code === 'full-time';

          return (
            <div
              key={prog.id}
              className={`rounded-3xl bg-slate-900 border ${
                isResidential
                  ? 'border-amber-500/50 shadow-2xl shadow-amber-950/20'
                  : isFullTime
                  ? 'border-sky-500/40'
                  : 'border-emerald-500/40'
              } overflow-hidden p-6 sm:p-10 space-y-8`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Image */}
                <div className="lg:col-span-5 relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-950 shadow-xl">
                  <img
                    src={prog.imageUrl}
                    alt={prog.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-amber-400 border border-amber-500/30 text-xs font-bold">
                    {prog.classes}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-xs text-slate-300">Tuition & Charges:</p>
                    <p className="text-base font-bold text-amber-400">{prog.feeNote}</p>
                  </div>
                </div>

                {/* Right: Content */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isResidential
                          ? 'bg-amber-500/20 text-amber-400'
                          : isFullTime
                          ? 'bg-sky-500/20 text-sky-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {isResidential ? (
                        <Building className="w-6 h-6" />
                      ) : isFullTime ? (
                        <GraduationCap className="w-6 h-6" />
                      ) : (
                        <BookOpen className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
                        {prog.name}
                      </h2>
                      <p className="text-xs text-slate-400">
                        Available for Grades: {prog.classes}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="space-y-2.5">
                    <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Key Highlights & Inclusions:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {prog.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isResidential
                                ? 'text-amber-400'
                                : isFullTime
                                ? 'text-sky-400'
                                : 'text-emerald-400'
                            }`}
                          />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleApply(prog.name)}
                      className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg ${
                        isResidential
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                          : isFullTime
                          ? 'bg-sky-500 hover:bg-sky-600 text-slate-950'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                      }`}
                    >
                      Apply for {prog.name}
                    </button>

                    <button
                      onClick={() => setIsFeeCalculatorOpen(true)}
                      className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition flex items-center gap-2"
                    >
                      <span>Check Fee Breakdown</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Extra Residential Life details if residential */}
              {isResidential && (
                <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <Utensils className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-white">Halal Nutritious Diet</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Wholesome 3-time dining + morning milk/snacks.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <Moon className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-white">Tahajjud & Congregations</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">5 daily prayers in Musalla with Asatizah.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-white">24/7 Security & Wardens</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">CCTV monitored campus and resident housemasters.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
