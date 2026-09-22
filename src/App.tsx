import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileQuickBar } from './components/MobileQuickBar';
import { AdmissionModal } from './components/AdmissionModal';
import { FeeCalculatorModal } from './components/FeeCalculatorModal';
import { ClassDetailsModal } from './components/ClassDetailsModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { IslamicEducationPage } from './pages/IslamicEducationPage';
import { ModernEducationPage } from './pages/ModernEducationPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ClassesPage } from './pages/ClassesPage';
import { FeeStructurePage } from './pages/FeeStructurePage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { GalleryPage } from './pages/GalleryPage';
import { VideosPage } from './pages/VideosPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPages } from './pages/PolicyPages';
import { AdminDashboard } from './admin/AdminDashboard';

const MainContent: React.FC = () => {
  const { currentPage } = useAcademy();
  const { isRTL } = useLanguage();

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'islamic-education':
        return <IslamicEducationPage />;
      case 'modern-education':
        return <ModernEducationPage />;
      case 'residential-program':
        return <ProgramsPage initialCode="residential" />;
      case 'full-time-program':
        return <ProgramsPage initialCode="full-time" />;
      case 'short-time-program':
        return <ProgramsPage initialCode="short-time" />;
      case 'classes':
        return <ClassesPage />;
      case 'fee-structure':
        return <FeeStructurePage />;
      case 'admission':
      case 'admission-enquiry':
        return <ContactPage />;
      case 'student-life':
      case 'facilities':
        return <FacilitiesPage />;
      case 'curriculum':
        return <CurriculumPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'videos':
        return <VideosPage initialFilter="all" />;
      case 'youtube-shorts':
        return <VideosPage initialFilter="shorts" />;
      case 'instagram-videos':
        return <VideosPage initialFilter="instagram" />;
      case 'contact':
        return <ContactPage />;
      case 'privacy-policy':
        return <PolicyPages type="privacy" />;
      case 'terms-conditions':
        return <PolicyPages type="terms" />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif] w-full max-w-full overflow-x-hidden"
    >
      {/* Global Navigation */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1 pb-20 md:pb-8 w-full max-w-full overflow-x-hidden">
        {renderCurrentView()}
      </main>

      {/* Global Modals */}
      <AdmissionModal />
      <FeeCalculatorModal />
      <ClassDetailsModal />

      {/* Sticky Mobile Quick Contact & Action Bar */}
      <MobileQuickBar />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AcademyProvider>
      <LanguageProvider>
        <MainContent />
        <Analytics />
      </LanguageProvider>
    </AcademyProvider>
  );
}
