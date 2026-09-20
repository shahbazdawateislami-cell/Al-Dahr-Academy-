import React, { useRef, useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import { PageRoute } from '../types';
import {
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Shield,
  Heart,
  Upload,
  Camera,
  CheckCircle2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setCurrentPage, setIsAdmissionModalOpen, updateSettings } = useAcademy();
  const { t } = useLanguage();
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Kripya valid photo ya logo file chunein (PNG, JPG, SVG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDimension = 600;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.9);
          await updateSettings({ logoUrl: compressed });
        } else {
          await updateSettings({ logoUrl: event.target?.result as string });
        }
        showToast('Academy Logo Gallery se successfully add ho gaya!');
      };
      img.onerror = () => {
        showToast('Photo process karne mein dikkat aayi.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappHref = `https://wa.me/91${settings.whatsapp}?text=${encodeURIComponent(
    `Assalamu Alaikum, I would like to enquire about admission at ${settings.academyName}, Phulwari Sharif, Patna.`
  )}`;

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Pre-Footer Call to Action Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('footer_admissions_open', 'Admissions Open for Session 2025–2026')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Cinzel',serif]">
              {t('footer_give_child', 'Give Your Child Both Deen & Modern Success')}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {t('footer_classes_desc', 'Classes 1 to 8 • Residential, Full-Time & Short-Time Programs with comprehensive Tarbiyah & Modern Academics in Phulwari Sharif, Patna.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAdmissionModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition transform active:scale-95"
            >
              {t('hero_btn_apply', 'Apply for Admission')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Hidden device gallery logo input */}
        <input
          id="footer-logo-file-input"
          ref={logoFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoFileChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Academy Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                id="footer-logo-container"
                onClick={() => logoFileInputRef.current?.click()}
                className="relative group w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden hover:border-amber-400 transition"
                title="Click karein gallery se logo select ya change karne ke liye"
                role="button"
                tabIndex={0}
              >
                {settings.logoUrl ? (
                  <img
                    id="footer-logo-image"
                    src={settings.logoUrl}
                    alt={settings.academyName}
                    className="w-10 h-10 object-cover rounded-lg group-hover:opacity-60 transition"
                  />
                ) : (
                  <GraduationCap className="w-7 h-7 text-amber-400 group-hover:opacity-60 transition" />
                )}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Camera className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-['Cinzel',serif] tracking-wide">
                  {settings.academyName}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
                    {settings.subtitle}
                  </p>
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    className="text-[10px] text-slate-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer transition"
                    title="Gallery se logo chunein"
                  >
                    <Upload className="w-2.5 h-2.5" />
                    <span>Change Logo</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <p className="text-amber-300 font-bold text-sm tracking-wide font-['Amiri',serif] text-center">
                “{settings.tagline}”
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Al-Dahr Academy is a premiere residential and day-boarding Islamic educational institute dedicated to instilling sound faith, pristine moral conduct (Akhlaq), and high modern academic excellence.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-300 mb-2">Connect With Us:</p>
              <div className="flex items-center gap-2">
                {settings.socialYoutube && (
                  <a
                    href={settings.socialYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-red-600/20 border border-slate-800 hover:border-red-500 text-slate-300 hover:text-red-400 flex items-center justify-center transition"
                    title="YouTube"
                  >
                    ▶
                  </a>
                )}
                {settings.socialInstagram && (
                  <a
                    href={settings.socialInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-pink-600/20 border border-slate-800 hover:border-pink-500 text-slate-300 hover:text-pink-400 flex items-center justify-center transition"
                    title="Instagram"
                  >
                    📷
                  </a>
                )}
                {settings.socialFacebook && (
                  <a
                    href={settings.socialFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-blue-400 flex items-center justify-center transition"
                    title="Facebook"
                  >
                    f
                  </a>
                )}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-emerald-600/20 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  About Academy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('classes')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Classes 1 to 8
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('fee-structure')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Fee Structure & Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admission')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Admission Information
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('facilities')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Campus Facilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('curriculum')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Curriculum & Syllabus
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('gallery')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Photo Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('videos')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Academy Videos & Shorts
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Programs */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Our Programs
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition">
                <button
                  onClick={() => navigateTo('residential-program')}
                  className="text-left w-full"
                >
                  <p className="font-bold text-white hover:text-amber-400">Residential Program</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Stay + Education + Islamic Education</p>
                </button>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition">
                <button
                  onClick={() => navigateTo('full-time-program')}
                  className="text-left w-full"
                >
                  <p className="font-bold text-white hover:text-sky-400">Full-Time Program</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Complete Day Education + Islamic Studies</p>
                </button>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition">
                <button
                  onClick={() => navigateTo('short-time-program')}
                  className="text-left w-full"
                >
                  <p className="font-bold text-white hover:text-emerald-400">Short-Time Program</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Arabic + Urdu Only Module</p>
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('islamic-education')}
                className="text-xs text-amber-400 hover:underline block"
              >
                Explore Islamic Education →
              </button>
              <button
                onClick={() => navigateTo('modern-education')}
                className="text-xs text-sky-400 hover:underline block mt-1"
              >
                Explore Modern Education →
              </button>
            </div>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Contact & Location
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">AL-DAHR ACADEMY</p>
                  <p className="text-slate-400">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-slate-400">Admission Hotline:</p>
                  <a
                    href={`tel:+91${settings.phone}`}
                    className="font-bold text-white hover:text-amber-400 transition"
                  >
                    +91 {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-slate-400">WhatsApp Enquiry:</p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-300 hover:text-emerald-200 transition"
                  >
                    +91 {settings.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <p className="text-slate-400">Email:</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-slate-300 hover:text-white transition truncate block"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('contact')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
                >
                  View Interactive Google Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{settings.footerText}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('privacy-policy')}
              className="hover:text-slate-400 transition"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('terms-conditions')}
              className="hover:text-slate-400 transition"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('admin')}
              className="text-amber-500/80 hover:text-amber-400 flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div
            id="footer-logo-toast"
            className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </footer>
  );
};
