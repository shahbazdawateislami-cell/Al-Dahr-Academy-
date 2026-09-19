import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { PageRoute } from '../types';
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Building,
  BookOpen,
  Camera,
  Video,
  Calculator,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, currentPage, setCurrentPage, setIsAdmissionModalOpen, setIsFeeCalculatorOpen } = useAcademy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [educationDropdownOpen, setEducationDropdownOpen] = useState(false);

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
      {/* Top Announcement Bar */}
      {settings.showAnnouncement && settings.announcement && (
        <div className="bg-amber-600 text-slate-950 px-4 py-1.5 text-xs sm:text-sm font-semibold flex items-center justify-between overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 truncate">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-950" />
            <span className="truncate">{settings.announcement}</span>
          </div>
          <button
            onClick={() => setIsAdmissionModalOpen(true)}
            className="hidden sm:inline-flex shrink-0 ml-4 px-2.5 py-0.5 bg-slate-900 text-amber-400 rounded-full text-xs font-bold hover:bg-slate-800 transition"
          >
            Apply Now
          </button>
        </div>
      )}

      {/* Institutional Header with Contacts */}
      <div className="bg-slate-950 text-slate-200 border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-amber-400/90 font-medium hidden md:inline">
              📍 {settings.address}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden lg:inline">
              | “{settings.tagline}”
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <a
              href={`tel:+91${settings.phone}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-amber-400 transition bg-slate-900/90 border border-slate-700/60 px-2.5 py-1 rounded-md"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call: {settings.phone}</span>
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition bg-emerald-950/80 border border-emerald-700/50 px-2.5 py-1 rounded-md"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xs:inline">WhatsApp</span>
            </a>

            <button
              onClick={() => setIsFeeCalculatorOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200 transition bg-amber-950/70 border border-amber-600/40 px-2.5 py-1 rounded-md"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Fee Calculator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand Title */}
            <div
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt={settings.academyName}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <GraduationCap className="w-7 h-7 text-amber-400" />
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Cinzel',serif]">
                    {settings.academyName}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    Phulwari
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide">
                  {settings.subtitle}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1">
              <button
                onClick={() => navigateTo('home')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'home' ? 'text-amber-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => navigateTo('about')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'about' ? 'text-amber-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                About
              </button>

              {/* Programs Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProgramsDropdownOpen(!programsDropdownOpen)}
                  onMouseEnter={() => setProgramsDropdownOpen(true)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition flex items-center gap-1 ${
                    currentPage.includes('program') ? 'text-amber-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>Programs</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {programsDropdownOpen && (
                  <div
                    onMouseLeave={() => setProgramsDropdownOpen(false)}
                    className="absolute top-full left-0 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  >
                    <button
                      onClick={() => navigateTo('residential-program')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-800 hover:text-amber-400 flex items-center gap-2"
                    >
                      <Building className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="font-semibold">Residential Program</p>
                        <p className="text-[10px] text-slate-400">Stay + Deen + Modern</p>
                      </div>
                    </button>
                    <button
                      onClick={() => navigateTo('full-time-program')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-800 hover:text-amber-400 flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4 text-sky-400" />
                      <div>
                        <p className="font-semibold">Full-Time Program</p>
                        <p className="text-[10px] text-slate-400">Complete Day Schooling</p>
                      </div>
                    </button>
                    <button
                      onClick={() => navigateTo('short-time-program')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-800 hover:text-amber-400 flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="font-semibold">Short-Time Program</p>
                        <p className="text-[10px] text-slate-400">Arabic + Urdu Only</p>
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
                      ? 'text-amber-400 bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>Education</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {educationDropdownOpen && (
                  <div
                    onMouseLeave={() => setEducationDropdownOpen(false)}
                    className="absolute top-full left-0 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  >
                    <button
                      onClick={() => navigateTo('islamic-education')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-amber-400"
                    >
                      📖 Islamic Education
                    </button>
                    <button
                      onClick={() => navigateTo('modern-education')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-amber-400"
                    >
                      🔬 Modern Education
                    </button>
                    <button
                      onClick={() => navigateTo('curriculum')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-amber-400"
                    >
                      📋 Curriculum Details
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigateTo('classes')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'classes' ? 'text-amber-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Classes 1–8
              </button>

              <button
                onClick={() => navigateTo('fee-structure')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'fee-structure' ? 'text-amber-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Fee Structure
              </button>

              <button
                onClick={() => navigateTo('facilities')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'facilities' ? 'text-amber-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Facilities
              </button>

              <button
                onClick={() => navigateTo('gallery')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'gallery' ? 'text-amber-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Gallery
              </button>

              <button
                onClick={() => navigateTo('videos')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'videos' || currentPage === 'youtube-shorts' || currentPage === 'instagram-videos'
                    ? 'text-amber-400 bg-slate-800'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Videos
              </button>

              <button
                onClick={() => navigateTo('contact')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  currentPage === 'contact' ? 'text-amber-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Contact
              </button>
            </div>

            {/* Action Buttons & Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsAdmissionModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-md transition transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Admission 2025</span>
              </button>

              <button
                onClick={() => navigateTo('admin')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-semibold border border-slate-700 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>

              {/* Hamburger Button for Mobile & Tablets */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
                aria-label="Open Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto space-y-1 animate-in slide-in-from-top-4">
            <div className="p-3 bg-slate-900 rounded-xl mb-3 flex items-center justify-between border border-slate-800">
              <div>
                <p className="text-xs font-bold text-white">{settings.academyName}</p>
                <p className="text-[11px] text-amber-400">Phulwari Sharif, Patna</p>
              </div>
              <button
                onClick={() => {
                  setIsAdmissionModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold"
              >
                Apply Now
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => navigateTo('home')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'home' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                🏠 Home
              </button>
              <button
                onClick={() => navigateTo('about')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'about' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                ℹ️ About Academy
              </button>
              <button
                onClick={() => navigateTo('residential-program')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'residential-program' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                🏨 Residential Program
              </button>
              <button
                onClick={() => navigateTo('full-time-program')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'full-time-program' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                🏫 Full-Time Program
              </button>
              <button
                onClick={() => navigateTo('short-time-program')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'short-time-program' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                📖 Short-Time Program
              </button>
              <button
                onClick={() => navigateTo('classes')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'classes' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                🎒 Classes 1 to 8
              </button>
              <button
                onClick={() => navigateTo('fee-structure')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'fee-structure' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                💰 Fee Structure
              </button>
              <button
                onClick={() => navigateTo('admission')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'admission' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                📝 Admission Info
              </button>
              <button
                onClick={() => navigateTo('islamic-education')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'islamic-education' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                🕌 Islamic Education
              </button>
              <button
                onClick={() => navigateTo('modern-education')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'modern-education' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                🔬 Modern Education
              </button>
              <button
                onClick={() => navigateTo('facilities')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'facilities' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                🏢 Campus Facilities
              </button>
              <button
                onClick={() => navigateTo('curriculum')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'curriculum' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                📚 Curriculum
              </button>
              <button
                onClick={() => navigateTo('student-life')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'student-life' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                🌿 Student Life
              </button>
              <button
                onClick={() => navigateTo('gallery')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'gallery' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                🖼️ Photo Gallery
              </button>
              <button
                onClick={() => navigateTo('videos')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'videos' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                🎬 Academy Videos
              </button>
              <button
                onClick={() => navigateTo('youtube-shorts')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'youtube-shorts' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                ⚡ YouTube Shorts
              </button>
              <button
                onClick={() => navigateTo('instagram-videos')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'instagram-videos' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                📸 Instagram Reels
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg ${
                  currentPage === 'contact' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 bg-slate-900/50'
                }`}
              >
                📞 Contact Us
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => navigateTo('admin')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/30 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Management Portal</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
