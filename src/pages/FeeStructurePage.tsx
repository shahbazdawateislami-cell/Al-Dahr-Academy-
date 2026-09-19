import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Calculator,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Phone,
  MessageCircle,
} from 'lucide-react';

export const FeeStructurePage: React.FC = () => {
  const {
    classes,
    admissionFeeConfig,
    setIsAdmissionModalOpen,
    setIsFeeCalculatorOpen,
    setEnquiryPrefill,
    settings,
  } = useAcademy();

  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState<'residential' | 'full-time' | 'short-time'>('residential');

  const activeClass = classes[selectedClassIndex] || classes[0];

  let selectedMonthlyFee = activeClass.feeResidential;
  if (selectedProgram === 'full-time') selectedMonthlyFee = activeClass.feeFullTime;
  if (selectedProgram === 'short-time') selectedMonthlyFee = activeClass.feeShortTime;

  const dressFee = selectedProgram === 'short-time' ? 0 : admissionFeeConfig.dressFee;
  const totalAdmission =
    admissionFeeConfig.admissionFee +
    selectedMonthlyFee +
    dressFee +
    admissionFeeConfig.booksFee;

  const handleApply = () => {
    setEnquiryPrefill({
      class: activeClass.name,
      program:
        selectedProgram === 'residential'
          ? 'Residential Program'
          : selectedProgram === 'full-time'
          ? 'Full-Time Program'
          : 'Short-Time Program',
    });
    setIsAdmissionModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          Transparent & Affordable
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel',serif] tracking-tight">
          Academy Fee Structure 2025–2026
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Complete, honest breakdown with zero hidden development or exam fees. Manageable for all families in Bihar.
        </p>
      </div>

      {/* Initial Admission Breakdown & Live Calculator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Standard Admission Breakdown */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-bold">
                Initial Admission Fee Breakdown
              </div>
              <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white mt-1">
                One-Time Enrolment Package
              </h2>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700">
              New Students
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            At the time of joining, the academy collects the initial enrollment fee, one month advance fee, complete uniform kit, and syllabus textbooks so that the student is completely ready for academic and residential life from Day 1.
          </p>

          <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-300">1. Admission Fee (One-Time)</span>
              <span className="font-bold text-white">₹{admissionFeeConfig.admissionFee.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-300">2. 1st Month Advance Fee</span>
              <span className="font-bold text-white">₹{admissionFeeConfig.monthlyFee.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-300">3. Dress / Uniform Kit (2 Sets)</span>
              <span className="font-bold text-white">₹{admissionFeeConfig.dressFee.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-300">4. Books & Study Materials</span>
              <span className="font-bold text-white">₹{admissionFeeConfig.booksFee.toLocaleString()}</span>
            </div>

            {/* Total */}
            <div className="pt-2 flex items-center justify-between text-sm">
              <div>
                <span className="font-bold text-amber-400">Total Admission Amount:</span>
                <p className="text-[10px] text-slate-400">Standard Class 1 Residential reference</p>
              </div>
              <span className="text-2xl font-black text-amber-400 font-['Cinzel',serif]">
                ₹{(admissionFeeConfig.admissionFee + admissionFeeConfig.monthlyFee + admissionFeeConfig.dressFee + admissionFeeConfig.booksFee).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <p>• {admissionFeeConfig.note}</p>
            <p>• Sibling concessions and need-based fee adjustments available upon meeting management.</p>
          </div>
        </div>

        {/* Right: Interactive Live Fee Calculator */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-900 border border-sky-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-white">
                Live Dynamic Fee Calculator
              </h2>
              <p className="text-xs text-sky-400 font-semibold">
                Select your student's class and program to compute exact cost
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Choose Program Type:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedProgram('residential')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                    selectedProgram === 'residential'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Residential
                </button>
                <button
                  onClick={() => setSelectedProgram('full-time')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                    selectedProgram === 'full-time'
                      ? 'bg-sky-500 text-slate-950 border-sky-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Full-Time
                </button>
                <button
                  onClick={() => setSelectedProgram('short-time')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                    selectedProgram === 'short-time'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Short-Time
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Choose Class:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {classes.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClassIndex(idx)}
                    className={`py-2 rounded-lg text-xs font-bold transition border ${
                      selectedClassIndex === idx
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    {c.name.replace('Class ', 'C-')}
                  </button>
                ))}
              </div>
            </div>

            {/* Computed summary */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                <span>Selected:</span>
                <span className="font-bold text-white">
                  {activeClass.name} • {selectedProgram.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Monthly Recurring Fee:</span>
                <span className="font-bold text-sky-400">₹{selectedMonthlyFee.toLocaleString()} / month</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Admission Fee:</span>
                <span className="text-white">₹{admissionFeeConfig.admissionFee.toLocaleString()}</span>
              </div>
              {selectedProgram !== 'short-time' && (
                <div className="flex items-center justify-between">
                  <span>Dress Kit (2 Sets):</span>
                  <span className="text-white">₹{dressFee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Books:</span>
                <span className="text-white">₹{admissionFeeConfig.booksFee.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="font-bold text-amber-400">Total at Joining:</span>
                <span className="text-2xl font-black text-amber-400 font-['Cinzel',serif]">
                  ₹{totalAdmission.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-xl transition active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Apply for {activeClass.name} ({selectedProgram})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Fee Matrix Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl space-y-4 p-6 sm:p-8">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-white">
            Class-Wise Monthly Fee Matrix (Class 1 to 8)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Monthly recurring tuition and boarding fees for each category.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">Class / Grade</th>
                <th className="py-3 px-4 font-bold text-amber-400">Residential Program (Boarding + Deen + Modern)</th>
                <th className="py-3 px-4 font-bold text-sky-400">Full-Time Program (Complete Day Schooling)</th>
                <th className="py-3 px-4 font-bold text-emerald-400">Short-Time Program (Arabic + Urdu Only)</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                    {cls.name}
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-400 whitespace-nowrap">
                    ₹{cls.feeResidential.toLocaleString()} / mo
                  </td>
                  <td className="py-3 px-4 font-bold text-sky-400 whitespace-nowrap">
                    ₹{cls.feeFullTime.toLocaleString()} / mo
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-400 whitespace-nowrap">
                    ₹{cls.feeShortTime.toLocaleString()} / mo
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEnquiryPrefill({ class: cls.name });
                        setIsAdmissionModalOpen(true);
                      }}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs"
                    >
                      Enquire
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
