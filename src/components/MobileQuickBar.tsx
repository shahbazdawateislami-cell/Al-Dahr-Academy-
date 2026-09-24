import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import { Phone, MessageCircle, Calculator } from 'lucide-react';

export const MobileQuickBar: React.FC = () => {
  const { settings, setIsAdmissionModalOpen, setIsFeeCalculatorOpen } = useAcademy();
  const { t } = useLanguage();

  const whatsappHref = `https://wa.me/91${settings.whatsapp}?text=${encodeURIComponent(
    `Assalamu Alaikum, I would like to enquire about admission at ${settings.academyName}, Phulwari Sharif, Patna.`
  )}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 shadow-2xl flex items-center justify-between gap-1.5">
      <a
        href={`tel:+91${settings.phone}`}
        className="flex-1 h-9 px-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold min-w-0 active:scale-95 transition shadow-sm"
      >
        <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="truncate">{t('btn_call_now', 'Call')}</span>
      </a>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 h-9 px-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1 text-[11px] font-bold min-w-0 shadow-sm active:scale-95 transition"
      >
        <MessageCircle className="w-3.5 h-3.5 text-white shrink-0" />
        <span className="truncate">WhatsApp</span>
      </a>

      <button
        onClick={() => setIsAdmissionModalOpen(true)}
        className="flex-1 h-9 px-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center gap-1 text-[11px] font-extrabold min-w-0 shadow-sm active:scale-95 transition"
      >
        <span className="truncate">{t('nav_apply_now', 'Apply')}</span>
      </button>

      <button
        onClick={() => setIsFeeCalculatorOpen(true)}
        className="flex-1 h-9 px-1.5 rounded-lg bg-sky-950/80 border border-sky-800/80 text-sky-300 flex items-center justify-center gap-1 text-[11px] font-bold min-w-0 shadow-sm active:scale-95 transition"
        title={t('hero_btn_fee', 'Fee Calculator')}
        aria-label={t('hero_btn_fee', 'Fee Calculator')}
      >
        <Calculator className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span className="truncate">{t('calc_badge', 'Fee Calc')}</span>
      </button>
    </div>
  );
};
