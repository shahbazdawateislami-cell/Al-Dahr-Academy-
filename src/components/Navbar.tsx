import React, { useState, useRef, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import { PageRoute } from '../types';
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  GraduationCap,
  ChevronDown,
  ShieldCheck,
  Building,
  BookOpen,
  Camera,
  Video,
  Calculator,
  Globe,
  Check,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    settings,
    currentPage,
    setCurrentPage,
    setIsAdmissionModalOpen,
    setIsFeeCalculatorOpen,
    currentUser,
    handleAdminLoginWithGoogle,
    handleAdminLogout,
    isAdminLoggedIn,
  } = useAcademy();
  const { language, setLanguage, t, languages, currentLanguageInfo } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [educationDropdownOpen, setEducationDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(e.target as Node)
      ) {
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setProgramsDropdownOpen(false);
    setEducationDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappHref = `https://wa.me/91${settings.whatsapp}?text=${encodeURIComponent(
    `Assalamu Alaikum, I would like to enquire about admission at ${settings.academyName}, Phulwari Sharif, Patna.`
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Main Navigation Bar */}
      <nav className="bg-[#071330] text-white border-b border-blue-900/60 shadow-lg w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
            {/* Logo and Brand Title */}
            <div
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group min-w-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-900 p-0.5 shadow-lg shadow-blue-950/60 flex items-center justify-center shrink-0 ring-2 ring-sky-400/30 group-hover:ring-sky-400 transition duration-300">
                <div className="w-full h-full bg-[#050e26] rounded-full flex items-center justify-center overflow-hidden">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt={settings.academyName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <img
                      src="/logo.jpg"
                      alt={settings.academyName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white font-['Cinzel',serif] truncate block">
                  {settings.academyName}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1">
              <button
                onClick={() => navigateTo('home')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'home'
                    ? 'text-sky-300 bg-blue-900/60 border border-sky-400/30 font-bold shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-blue-950/60'
                }`}
              >
                {t('nav_home', 'Home')}
              </button>

              <button
                onClick={() => navigateTo('about')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'about'
                    ? 'text-sky-300 bg-blue-900/60 border border-sky-400/30 font-bold shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-blue-950/60'
                }`}
              >
                {t('nav_about', 'About')}
              </button>

              {/* Programs Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProgramsDropdownOpen(!programsDropdownOpen)}
                  onMouseEnter={() => setProgramsDropdownOpen(true)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition flex items-center gap-1 ${
                    currentPage.includes('program')
                      ? 'text-sky-300 bg-blue-900/60 border border-sky-400/30 font-bold shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-blue-950/60'
                  }`}
                >
                  <span>{t('nav_programs', 'Programs')}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {programsDropdownOpen && (
                  <div
                    onMouseLeave={() => setProgramsDropdownOpen(false)}
                    className="absolute top-full left-0 w-60 bg-[#071330] border border-blue-800/80 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  >
                    <button
                      onClick={() => navigateTo('residential-program')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-blue-950 hover:text-sky-300 flex items-center gap-2"
                    >
                      <Building className="w-4 h-4 text-sky-400 shrink-0" />
                      <div>
                        <p className="font-semibold">{t('nav_residential', 'Residential Program')}</p>
                        <p className="text-[10px] text-sky-200/70">{t('nav_residential_sub', 'Stay + Deen + Modern')}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => navigateTo('full-time-program')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-blue-950 hover:text-sky-300 flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <p className="font-semibold">{t('nav_fulltime', 'Full-Time Program')}</p>
                        <p className="text-[10px] text-sky-200/70">{t('nav_fulltime_sub', 'Complete Day Schooling')}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => navigateTo('short-time-program')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-blue-950 hover:text-sky-300 flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="font-semibold">{t('nav_shorttime', 'Short-Time Program')}</p>
                        <p className="text-[10px] text-sky-200/70">{t('nav_shorttime_sub', 'Arabic + Urdu Only')}</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Education Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setEducationDropdownOpen(!educationDropdownOpen)}
                  onMouseEnter={() => setEducationDropdownOpen(true)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition flex items-center gap-1 ${
                    currentPage.includes('education') || currentPage === 'curriculum'
                      ? 'text-sky-300 bg-blue-900/60 border border-sky-400/30 font-bold shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-blue-950/60'
                  }`}
                >
                  <span>{t('nav_islamic', 'Education')}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {educationDropdownOpen && (
                  <div
                    onMouseLeave={() => setEducationDropdownOpen(false)}
                    className="absolute top-full left-0 w-56 bg-[#071330] border border-blue-800/80 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  >
                    <button
                      onClick={() => navigateTo('islamic-education')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-blue-950 hover:text-sky-300"
                    >
                      📖 {t('nav_islamic', 'Islamic Education')}
                    </button>
                    <button
                      onClick={() => navigateTo('modern-education')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-blue-950 hover:text-sky-300"
                    >
                      🔬 {t('nav_modern', 'Modern Education')}
                    </button>
                    <button
                      onClick={() => navigateTo('curriculum')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-blue-950 hover:text-sky-300"
                    >
                      📋 {t('nav_curriculum', 'Curriculum Details')}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigateTo('classes')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'classes'
                    ? 'text-sky-300 bg-blue-900/60 border border-sky-400/30 font-bold shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-blue-950/60'
                }`}
              >
                {t('nav_classes', 'Classes 1–8')}
              </button>

              <button
                onClick={() => navigateTo('fee-structure')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'fee-structure'
                    ? 'text-sky-300 bg-blue-900/60 border border-sky-400/30 font-bold shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-blue-950/60'
                }`}
              >
                {t('nav_fee', 'Fee Structure')}
              </button>

              <button
                onClick={() => navigateTo('facilities')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'facilities'
                    ? 'text-sky-300 bg-blue-900/60 border border-sky-400/30 font-bold shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-blue-950/60'
                }`}
              >
                {t('nav_facilities', 'Facilities')}
              </button>

              <button
                onClick={() => navigateTo('gallery')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'gallery'
                    ? 'text-sky-300 bg-blue-900/60 border border-sky-400/30 font-bold shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-blue-950/60'
                }`}
              >
                {t('nav_gallery', 'Gallery')}
              </button>

              <button
                onClick={() => navigateTo('videos')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'videos' || currentPage === 'youtube-shorts' || currentPage === 'instagram-videos'
                    ? 'text-sky-300 bg-blue-900/60 border border-sky-400/30 font-bold shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-blue-950/60'
                }`}
              >
                {t('nav_videos', 'Videos')}
              </button>

              <button
                onClick={() => navigateTo('contact')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'contact'
                    ? 'text-sky-300 bg-blue-900/60 border border-sky-400/30 font-bold shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-blue-950/60'
                }`}
              >
                {t('nav_contact', 'Contact')}
              </button>
            </div>

            {/* Action Buttons & Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsAdmissionModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition transform active:scale-95"
              >
                <span>{t('nav_admission', 'Admission 2025')}</span>
              </button>

              {/* 4-Language Selector Dropdown Button (Replaced Admin button as requested) */}
              <div className="relative" ref={languageDropdownRef}>
                <button
                  id="navbar-language-select-button"
                  type="button"
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-950/80 hover:bg-blue-900/80 text-sky-200 hover:text-white text-[11px] font-bold border border-blue-700/60 transition cursor-pointer shadow-sm active:scale-95"
                  aria-label="Select Language"
                  title={t('select_language_title', 'Select Website Language')}
                >
                  <Globe className="w-3 h-3 text-sky-400 shrink-0" />
                  <span className="tracking-wider uppercase font-extrabold text-[11px]">
                    {currentLanguageInfo.code.toUpperCase()}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-sky-300 transition-transform ${
                      languageDropdownOpen ? 'rotate-180 text-sky-400' : ''
                    }`}
                  />
                </button>

                {languageDropdownOpen && (
                  <div
                    id="navbar-language-dropdown-menu"
                    className="absolute right-0 top-full mt-2 w-64 bg-[#071330] border border-blue-700/70 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-3 py-2 border-b border-blue-900/80 mb-1 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-sky-400" />
                        <span>{t('select_language_title', 'Choose Language')}</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      {languages.map((lang) => {
                        const isSelected = language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            id={`lang-select-${lang.code}`}
                            type="button"
                            onClick={() => {
                              setLanguage(lang.code);
                              setLanguageDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition cursor-pointer text-left ${
                              isSelected
                                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/40'
                                : 'text-slate-200 hover:text-white hover:bg-blue-950/80 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl leading-none">{lang.flag}</span>
                              <div>
                                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                                  <span>{lang.name}</span>
                                  {lang.code === 'en' && (
                                    <span className="text-[9px] font-semibold bg-blue-950 text-sky-300 px-1.5 py-0.5 rounded border border-blue-800">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-sky-200/70 font-normal mt-0.5">
                                  {lang.nativeName}
                                </div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Google Sign-In / User Profile Auth Button */}
              {currentUser ? (
                <div className="relative flex items-center gap-1.5">
                  <button
                    onClick={() => navigateTo('admin')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-900/80 hover:bg-blue-800 text-white text-xs font-bold border border-sky-400/50 shadow"
                    title={`Logged in as ${currentUser.displayName || currentUser.email}`}
                  >
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="w-5 h-5 rounded-full object-cover border border-sky-300" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                        {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:inline max-w-[80px] truncate text-[11px]">{currentUser.displayName?.split(' ')[0] || 'User'}</span>
                  </button>
                  <button
                    onClick={() => handleAdminLogout()}
                    className="p-1 text-slate-400 hover:text-rose-300 transition text-[10px] font-bold"
                    title="Sign Out"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAdminLoginWithGoogle()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-extrabold shadow border border-slate-200 transition active:scale-95"
                  title="Sign in with Google"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="hidden md:inline">Google Sign In</span>
                </button>
              )}

              {/* Hamburger Button for Mobile & Tablets */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-200 hover:text-white hover:bg-blue-950 focus:outline-none"
                aria-label="Open Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#050e26] border-b border-blue-900 px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto space-y-2 animate-in slide-in-from-top-4">
            {/* Header info */}
            <div className="p-3 bg-blue-950/60 rounded-xl flex items-center justify-between border border-blue-800/70">
              <div className="flex items-center gap-2.5">
                <img src={settings.logoUrl || '/logo.jpg'} alt={settings.academyName} className="w-9 h-9 rounded-full object-cover border border-sky-400/40" />
                <div>
                  <p className="text-xs font-bold text-white">{settings.academyName}</p>
                  <p className="text-[11px] text-sky-300">{t('nav_phulwari', 'Phulwari Sharif, Patna')}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAdmissionModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 rounded-lg text-xs font-bold shadow"
              >
                {t('nav_apply_now', 'Apply Now')}
              </button>
            </div>

            {/* Mobile 4-Language Switcher */}
            <div className="p-3 bg-[#071330] rounded-xl border border-blue-800/70 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t('select_language_title', 'Choose Language')}</span>
                </span>
                <span className="text-[10px] text-sky-300 font-semibold bg-sky-500/15 px-2 py-0.5 rounded border border-sky-500/30">
                  {currentLanguageInfo.name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {languages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold shadow'
                          : 'bg-blue-950/60 text-slate-200 hover:bg-blue-900/60 border border-blue-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-950" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => navigateTo('home')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'home' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                🏠 {t('nav_home', 'Home')}
              </button>
              <button
                onClick={() => navigateTo('about')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'about' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                ℹ️ {t('nav_about', 'About Academy')}
              </button>
              <button
                onClick={() => navigateTo('residential-program')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'residential-program' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                🏨 {t('nav_residential', 'Residential Program')}
              </button>
              <button
                onClick={() => navigateTo('full-time-program')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'full-time-program' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                🏫 {t('nav_fulltime', 'Full-Time Program')}
              </button>
              <button
                onClick={() => navigateTo('short-time-program')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'short-time-program' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                📖 {t('nav_shorttime', 'Short-Time Program')}
              </button>
              <button
                onClick={() => navigateTo('classes')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'classes' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                🎒 {t('nav_classes', 'Classes 1 to 8')}
              </button>
              <button
                onClick={() => navigateTo('fee-structure')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'fee-structure' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                💰 {t('nav_fee', 'Fee Structure')}
              </button>
              <button
                onClick={() => navigateTo('admission')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'admission' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                📝 {t('nav_admission', 'Admission 2025')}
              </button>
              <button
                onClick={() => navigateTo('islamic-education')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'islamic-education' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                🕌 {t('nav_islamic', 'Islamic Education')}
              </button>
              <button
                onClick={() => navigateTo('modern-education')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'modern-education' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                🔬 {t('nav_modern', 'Modern Education')}
              </button>
              <button
                onClick={() => navigateTo('facilities')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'facilities' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                🏢 {t('nav_facilities', 'Campus Facilities')}
              </button>
              <button
                onClick={() => navigateTo('curriculum')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'curriculum' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                📚 {t('nav_curriculum', 'Curriculum')}
              </button>
              <button
                onClick={() => navigateTo('student-life')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'student-life' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                🌿 {t('nav_student_life', 'Student Life')}
              </button>
              <button
                onClick={() => navigateTo('gallery')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'gallery' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                🖼️ {t('nav_gallery', 'Photo Gallery')}
              </button>
              <button
                onClick={() => navigateTo('videos')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'videos' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                🎬 {t('nav_videos', 'Videos')}
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'contact' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-200 bg-blue-950/40'
                }`}
              >
                📞 {t('nav_contact', 'Contact Us')}
              </button>
            </div>

            {/* Admin Management Option inside Mobile Hamburger Menu (User noted this is available here) */}
            <div className="pt-3 border-t border-blue-900/80 flex items-center justify-between">
              <button
                onClick={() => navigateTo('admin')}
                className="w-full py-2.5 bg-blue-950 hover:bg-blue-900 text-sky-300 text-xs font-bold rounded-lg border border-sky-500/30 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>{t('nav_admin', 'Admin Management Portal')}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
