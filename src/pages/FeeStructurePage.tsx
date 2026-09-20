import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Calculator,
  ArrowRight,
} from 'lucide-react';

export const FeeStructurePage: React.FC = () => {
  const {
    classes,
    admissionFeeConfig,
    setIsAdmissionModalOpen,
    setEnquiryPrefill,
  } = useAcademy();

  const { t, isRTL } = useLanguage();

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
    <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
          {t('fee_page_badge')}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel',serif] tracking-tight">
          {t('fee_page_title')}
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          {t('fee_page_subtitle')}
        </p>
      </div>

      {/* Initial Admission Breakdown & Live Calculator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Standard Admission Breakdown */}
        <div className="lg:col-span-6 rounded-3xl bg-[#071330] border border-blue-900/80 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[11px] font-bold">
                {t('fee_enrolment_pkg')}
              </div>
              <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white mt-1">
                {t('fee_enrolment_pkg')}
              </h2>
            </div>
            <span className="text-xs bg-[#050e26] text-sky-300 px-3 py-1 rounded-lg border border-blue-900/60">
              {t('fee_new_students')}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {t('fee_pkg_desc')}
          </p>

          <div className="space-y-3 bg-[#050e26] p-4 rounded-2xl border border-blue-900/80 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-blue-900/60">
              <span className="text-slate-300">1. {t('calc_admission_fee')}</span>
              <span className="font-bold text-white">₹{admissionFeeConfig.admissionFee.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-blue-900/60">
              <span className="text-slate-300">2. {t('calc_first_month')}</span>
              <span className="font-bold text-white">₹{admissionFeeConfig.monthlyFee.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-blue-900/60">
              <span className="text-slate-300">3. {t('calc_dress_fee')}</span>
              <span className="font-bold text-white">₹{admissionFeeConfig.dressFee.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-blue-900/60">
              <span className="text-slate-300">4. {t('calc_books_fee')}</span>
              <span className="font-bold text-white">₹{admissionFeeConfig.booksFee.toLocaleString()}</span>
            </div>

            {/* Total */}
            <div className="pt-2 flex items-center justify-between text-sm">
              <div>
                <span className="font-bold text-sky-400">{t('fee_total_joining')}</span>
                <p className="text-[10px] text-slate-400">Class 1 Residential</p>
              </div>
              <span className="text-2xl font-black text-sky-400 font-['Cinzel',serif]">
                ₹{(admissionFeeConfig.admissionFee + admissionFeeConfig.monthlyFee + admissionFeeConfig.dressFee + admissionFeeConfig.booksFee).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <p>• {admissionFeeConfig.note || t('calc_note')}</p>
          </div>
        </div>

        {/* Right: Interactive Live Fee Calculator */}
        <div className="lg:col-span-6 rounded-3xl bg-[#071330] border border-sky-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shadow-inner">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-white">
                {t('fee_live_calc_title')}
              </h2>
              <p className="text-xs text-sky-300 font-semibold">
                {t('fee_live_calc_subtitle')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('fee_choose_program')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedProgram('residential')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                    selectedProgram === 'residential'
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-400 shadow-md'
                      : 'bg-[#050e26] text-slate-300 border-blue-900/60 hover:border-blue-700'
                  }`}
                >
                  {t('nav_residential').split(' ')[0]}
                </button>
                <button
                  onClick={() => setSelectedProgram('full-time')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                    selectedProgram === 'full-time'
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-400 shadow-md'
                      : 'bg-[#050e26] text-slate-300 border-blue-900/60 hover:border-blue-700'
                  }`}
                >
                  {t('nav_fulltime').split(' ')[0]}
                </button>
                <button
                  onClick={() => setSelectedProgram('short-time')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                    selectedProgram === 'short-time'
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-400 shadow-md'
                      : 'bg-[#050e26] text-slate-300 border-blue-900/60 hover:border-blue-700'
                  }`}
                >
                  {t('nav_shorttime').split(' ')[0]}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('fee_choose_class')}
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {classes.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClassIndex(idx)}
                    className={`py-2 rounded-lg text-xs font-bold transition border ${
                      selectedClassIndex === idx
                        ? 'bg-sky-500 text-slate-950 font-black border-sky-300'
                        : 'bg-[#050e26] text-slate-300 border-blue-900/60 hover:border-blue-700'
                    }`}
                  >
                    {c.name.replace('Class ', 'C-')}
                  </button>
                ))}
              </div>
            </div>

            {/* Computed summary */}
            <div className="bg-[#050e26] rounded-2xl p-4 border border-blue-900/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-blue-900/60">
                <span>{t('calc_selected_plan')}</span>
                <span className="font-bold text-sky-400">
                  {activeClass.name} • {selectedProgram.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('fee_monthly_recurring')}</span>
                <span className="font-bold text-sky-400">₹{selectedMonthlyFee.toLocaleString()} / month</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('calc_admission_fee')}:</span>
                <span className="text-white">₹{admissionFeeConfig.admissionFee.toLocaleString()}</span>
              </div>
              {selectedProgram !== 'short-time' && (
                <div className="flex items-center justify-between">
                  <span>{t('calc_dress_fee')}:</span>
                  <span className="text-white">₹{dressFee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>{t('calc_books_fee')}:</span>
                <span className="text-white">₹{admissionFeeConfig.booksFee.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-blue-900/60 flex items-center justify-between">
                <span className="font-bold text-sky-400">{t('fee_total_joining')}</span>
                <span className="text-2xl font-black text-sky-400 font-['Cinzel',serif]">
                  ₹{totalAdmission.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white font-bold text-sm shadow-xl shadow-sky-950/50 transition active:scale-98 flex items-center justify-center gap-2"
            >
              <span>{t('calc_apply_btn')} - {activeClass.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Fee Matrix Table */}
      <div className="rounded-3xl bg-[#071330] border border-blue-900/80 overflow-hidden shadow-2xl space-y-4 p-6 sm:p-8">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-white">
            {t('fee_table_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('fee_table_subtitle')}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#050e26] border-b border-blue-900/80 text-slate-300 uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">{t('fee_table_col_class')}</th>
                <th className="py-3 px-4 font-bold text-sky-400">{t('fee_table_col_res')}</th>
                <th className="py-3 px-4 font-bold text-sky-300">{t('fee_table_col_full')}</th>
                <th className="py-3 px-4 font-bold text-cyan-400">{t('fee_table_col_short')}</th>
                <th className="py-3 px-4 font-bold text-right">{t('fee_table_col_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/50">
              {classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-blue-950/40 transition">
                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                    {cls.name}
                  </td>
                  <td className="py-3 px-4 font-bold text-sky-400 whitespace-nowrap">
                    ₹{cls.feeResidential.toLocaleString()} / mo
                  </td>
                  <td className="py-3 px-4 font-bold text-sky-300 whitespace-nowrap">
                    ₹{cls.feeFullTime.toLocaleString()} / mo
                  </td>
                  <td className="py-3 px-4 font-bold text-cyan-400 whitespace-nowrap">
                    ₹{cls.feeShortTime.toLocaleString()} / mo
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEnquiryPrefill({ class: cls.name });
                        setIsAdmissionModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-lg text-xs shadow transition"
                    >
                      {t('fee_enquire_btn')}
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
