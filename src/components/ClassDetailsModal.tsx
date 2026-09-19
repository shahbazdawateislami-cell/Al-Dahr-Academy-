import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  X,
  BookOpen,
  GraduationCap,
  Sparkles,
  Activity,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export const ClassDetailsModal: React.FC = () => {
  const {
    selectedClassForModal,
    setSelectedClassForModal,
    setIsAdmissionModalOpen,
    setEnquiryPrefill,
  } = useAcademy();

  if (!selectedClassForModal) return null;

  const handleApplyForClass = (programName: string) => {
    const clsName = selectedClassForModal.name;
    setSelectedClassForModal(null);
    setEnquiryPrefill({
      class: clsName,
      program: programName,
    });
    setIsAdmissionModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header with image */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-950">
          {selectedClassForModal.imageUrl && (
            <img
              src={selectedClassForModal.imageUrl}
              alt={selectedClassForModal.name}
              className="w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          <button
            onClick={() => setSelectedClassForModal(null)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/70 text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Session 2025–2026</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
              {selectedClassForModal.name} Syllabus & Details
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1">
              {selectedClassForModal.description}
            </p>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Islamic Curriculum */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Islamic Curriculum for {selectedClassForModal.name}</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedClassForModal.islamicCurriculum}
            </p>
          </div>

          {/* Modern Academic Curriculum */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-sky-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Modern Academic Curriculum</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedClassForModal.modernCurriculum}
            </p>
          </div>

          {/* Subjects List */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Subjects Taught in {selectedClassForModal.name}:
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedClassForModal.subjects.map((sub, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 font-medium"
                >
                  ✓ {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Activities List */}
          {selectedClassForModal.activities && selectedClassForModal.activities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Activities & Tarbiyah Highlights:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedClassForModal.activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-slate-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fee Matrix for this class */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Monthly Fee Structure for {selectedClassForModal.name}:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-amber-500/30">
                <p className="text-[11px] text-amber-400 font-bold">Residential Program</p>
                <p className="text-lg font-bold text-white font-['Cinzel',serif] my-1">
                  ₹{selectedClassForModal.feeResidential}
                  <span className="text-xs text-slate-400 font-normal"> / mo</span>
                </p>
                <p className="text-[10px] text-slate-400">Boarding + Full Education</p>
                <button
                  onClick={() => handleApplyForClass('Residential Program')}
                  className="mt-2 w-full py-1 text-[11px] bg-amber-500 text-slate-950 font-bold rounded hover:bg-amber-400 transition"
                >
                  Apply Residential
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-sky-500/30">
                <p className="text-[11px] text-sky-400 font-bold">Full-Time Program</p>
                <p className="text-lg font-bold text-white font-['Cinzel',serif] my-1">
                  ₹{selectedClassForModal.feeFullTime}
                  <span className="text-xs text-slate-400 font-normal"> / mo</span>
                </p>
                <p className="text-[10px] text-slate-400">Complete Day Schooling</p>
                <button
                  onClick={() => handleApplyForClass('Full-Time Program')}
                  className="mt-2 w-full py-1 text-[11px] bg-sky-500 text-slate-950 font-bold rounded hover:bg-sky-400 transition"
                >
                  Apply Full-Time
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30">
                <p className="text-[11px] text-emerald-400 font-bold">Short-Time Program</p>
                <p className="text-lg font-bold text-white font-['Cinzel',serif] my-1">
                  ₹{selectedClassForModal.feeShortTime}
                  <span className="text-xs text-slate-400 font-normal"> / mo</span>
                </p>
                <p className="text-[10px] text-slate-400">Arabic + Urdu Only</p>
                <button
                  onClick={() => handleApplyForClass('Short-Time Program')}
                  className="mt-2 w-full py-1 text-[11px] bg-emerald-500 text-slate-950 font-bold rounded hover:bg-emerald-400 transition"
                >
                  Apply Short-Time
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
