import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { Phone, MessageCircle, Sparkles, Calculator } from 'lucide-react';

export const MobileQuickBar: React.FC = () => {
  const { settings, setIsAdmissionModalOpen, setIsFeeCalculatorOpen } = useAcademy();

  const whatsappHref = `https://wa.me/91${settings.whatsapp}?text=${encodeURIComponent(
    `Assalamu Alaikum, I would like to enquire about admission at ${settings.academyName}, Phulwari Sharif, Patna.`
  )}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 shadow-2xl flex items-center justify-between gap-2">
      <a
        href={`tel:+91${settings.phone}`}
        className="flex-1 py-2.5 px-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold active:scale-95 transition"
      >
        <Phone className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Call Now</span>
      </a>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 text-xs font-bold shadow-md shadow-emerald-900/30 active:scale-95 transition"
      >
        <MessageCircle className="w-4 h-4 text-white shrink-0" />
        <span>WhatsApp</span>
      </a>

      <button
        onClick={() => setIsAdmissionModalOpen(true)}
        className="flex-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center gap-1.5 text-xs font-extrabold shadow-md shadow-amber-500/20 active:scale-95 transition"
      >
        <Sparkles className="w-4 h-4 shrink-0" />
        <span>Apply</span>
      </button>

      <button
        onClick={() => setIsFeeCalculatorOpen(true)}
        className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center border border-slate-700 shrink-0"
        title="Fee Calculator"
        aria-label="Fee Calculator"
      >
        <Calculator className="w-4 h-4" />
      </button>
    </div>
  );
};
