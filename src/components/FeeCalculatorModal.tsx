import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { ProgramCode } from '../types';
import {
  X,
  Calculator,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export const FeeCalculatorModal: React.FC = () => {
  const {
    isFeeCalculatorOpen,
    setIsFeeCalculatorOpen,
    admissionFeeConfig,
    classes,
    programs,
    setIsAdmissionModalOpen,
    setEnquiryPrefill,
  } = useAcademy();

  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedProgramCode, setSelectedProgramCode] = useState<ProgramCode>('residential');

  if (!isFeeCalculatorOpen) return null;

  const currentClass = classes.find((c) => c.gradeNumber === selectedGrade) || classes[0];

  // Dynamic monthly fee based on class and program
  let monthlyFeeForSelection = currentClass?.feeResidential || 2700;
  if (selectedProgramCode === 'full-time') {
    monthlyFeeForSelection = currentClass?.feeFullTime || 900;
  } else if (selectedProgramCode === 'short-time') {
    monthlyFeeForSelection = currentClass?.feeShortTime || 500;
  }

  // Base admission items
  const admissionFee = admissionFeeConfig.admissionFee || 1100;
  const dressFee = selectedProgramCode === 'short-time' ? 0 : (admissionFeeConfig.dressFee || 1500);
  const booksFee = admissionFeeConfig.booksFee || 1000;

  // Additional items sum
  const additionalSum = (admissionFeeConfig.additionalItems || []).reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0
  );

  // Total at admission
  const totalAdmissionInitial = admissionFee + monthlyFeeForSelection + dressFee + booksFee + additionalSum;

  const handleApplyNow = () => {
    setIsFeeCalculatorOpen(false);
    setEnquiryPrefill({
      class: currentClass?.name || 'Class 1',
      program:
        selectedProgramCode === 'residential'
          ? 'Residential Program'
          : selectedProgramCode === 'full-time'
          ? 'Full-Time Program'
          : 'Short-Time Program',
    });
    setIsAdmissionModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Cinzel',serif]">
                Admission & Fee Calculator
              </h3>
              <p className="text-xs text-amber-400 font-medium">
                Transparent Fee Structure • No Hidden Charges
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFeeCalculatorOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Program & Class Selectors */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                1. Select Desired Program:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {programs.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProgramCode(p.code)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center border ${
                      selectedProgramCode === p.code
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {p.name.replace(' Program', '')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                2. Select Class (Class 1 to 8):
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {classes.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedGrade(c.gradeNumber)}
                    className={`py-2 rounded-lg text-xs font-bold transition border ${
                      selectedGrade === c.gradeNumber
                        ? 'bg-sky-500 text-slate-950 border-sky-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {c.name.replace('Class ', 'C-')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs text-slate-400">Selected Plan:</span>
              <span className="text-xs font-bold text-amber-400">
                {currentClass.name} • {selectedProgramCode.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Admission Fee (One-Time)</span>
              <span className="font-semibold text-white">₹{admissionFee.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">
                1st Month Advance Fee ({selectedProgramCode === 'residential' ? 'Boarding + Education' : 'Tuition'})
              </span>
              <span className="font-semibold text-white">₹{monthlyFeeForSelection.toLocaleString()}</span>
            </div>

            {selectedProgramCode !== 'short-time' && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Dress / Uniform Kit (2 Sets)</span>
                <span className="font-semibold text-white">₹{dressFee.toLocaleString()}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Course Books & Materials</span>
              <span className="font-semibold text-white">₹{booksFee.toLocaleString()}</span>
            </div>

            {admissionFeeConfig.additionalItems?.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <span className="text-slate-300">{item.label}</span>
                <span className="font-semibold text-white">₹{item.amount.toLocaleString()}</span>
              </div>
            ))}

            {/* Total Highlight */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Total Amount at Admission:</p>
                <p className="text-[10px] text-amber-400/90">(Includes 1st Month advance)</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400 font-['Cinzel',serif]">
                  ₹{totalAdmissionInitial.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-900 flex items-center justify-between">
              <span>Subsequent Monthly Fee:</span>
              <span className="font-bold text-sky-300">₹{monthlyFeeForSelection.toLocaleString()} / month</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * Note: {admissionFeeConfig.note || 'No hidden extra exam fees or development charges. Sibling discounts applicable on consultation.'}
          </p>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              onClick={handleApplyNow}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
            >
              <span>Apply for {currentClass.name} ({selectedProgramCode})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
