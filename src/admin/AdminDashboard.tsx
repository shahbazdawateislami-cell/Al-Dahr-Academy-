import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  AdmissionEnquiry,
  ProgramItem,
  SchoolClassItem,
  WebsiteSettings,
  FacilityItem,
  SubjectItem,
  CurriculumItem,
  GalleryMediaItem,
  VideoMediaItem,
} from '../types';
import {
  createGoogleMeetSpace,
  createGoogleFormForAdmissions,
  addStudentToGoogleContacts,
} from '../services/googleWorkspace';
import {
  LayoutDashboard,
  Inbox,
  Settings,
  GraduationCap,
  School,
  Calculator,
  BookOpen,
  Building,
  Image as ImageIcon,
  Video,
  LogOut,
  Sparkles,
  Phone,
  MessageCircle,
  CheckCircle2,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  Download,
  Calendar,
  Layers,
  Search,
  Filter,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    settings,
    updateSettings,
    programs,
    saveProgram,
    deleteProgram,
    classes,
    saveClass,
    deleteClass,
    admissionFeeConfig,
    updateAdmissionFeeConfig,
    subjects,
    saveSubject,
    deleteSubject,
    curriculum,
    saveCurriculum,
    deleteCurriculum,
    facilities,
    saveFacility,
    deleteFacility,
    gallery,
    saveGalleryItem,
    deleteGalleryItem,
    videos,
    saveVideoItem,
    deleteVideoItem,
    enquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    resetAllToDefaults,
    isAdminLoggedIn,
    adminLoginError,
    handleAdminLoginWithGoogle,
    handleAdminLoginWithPassword,
    handleAdminLogout,
    setCurrentPage,
  } = useAcademy();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'enquiries'
    | 'settings'
    | 'programs'
    | 'classes'
    | 'fees'
    | 'subjects'
    | 'curriculum'
    | 'facilities'
    | 'gallery'
    | 'videos'
    | 'media'
    | 'workspace'
  >('dashboard');

  // Password login input state
  const [passcode, setPasscode] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // State for Settings Tab
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>(settings);

  // State for adding/editing a class
  const [editingClass, setEditingClass] = useState<SchoolClassItem | null>(null);

  // State for adding/editing a program
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);

  // State for adding new media items
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCat, setNewGalleryCat] = useState('Campus Life');

  // State for adding new video
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoType, setNewVideoType] = useState<'youtube' | 'shorts' | 'instagram'>('youtube');
  const [newVideoCat, setNewVideoCat] = useState('Academics');

  // Enquiries search & filter
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('all');

  // If not logged in, show the Admin Login Portal
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold font-['Cinzel',serif] text-white">
              Admin Management Portal
            </h1>
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              {settings.academyName} • Phulwari Sharif, Patna
            </p>
            <p className="text-xs text-slate-400">
              Sign in to manage admissions, website content, fees, and videos.
            </p>
          </div>

          {adminLoginError && (
            <div className="p-3 bg-red-950/60 border border-red-700/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{adminLoginError}</span>
            </div>
          )}

          {/* Option 1: Fast Passcode Sign-In */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdminLoginWithPassword(passcode);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter administrator passcode"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Authorized passcode: <code className="text-amber-400 font-mono">aldahr2025</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg transition active:scale-98"
            >
              Sign In with Passcode
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] text-slate-500 uppercase">Or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Option 2: Google Sign-In */}
          <button
            onClick={async () => {
              setIsLoggingIn(true);
              try {
                await handleAdminLoginWithGoogle();
              } catch (e) {
                // error handled in context
              } finally {
                setIsLoggingIn(false);
              }
            }}
            disabled={isLoggingIn}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition"
          >
            <span>Sign In with Google (Admin Account)</span>
          </button>

          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              ← Return to Academy Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.parentName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      enq.studentName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      enq.mobileNumber.includes(enquirySearch);
    const matchesStatus =
      enquiryStatusFilter === 'all' ? true : enq.status === enquiryStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-white">
                Al-Dahr Academy Admin Panel
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage website content, fees, classes, multimedia, and parent enquiries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            View Live Site
          </button>
          <button
            onClick={handleAdminLogout}
            className="px-4 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded-xl text-xs font-semibold border border-red-800/50 transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Admin Body: Horizontal Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'enquiries' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Enquiries ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'settings' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings & Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('programs')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'programs' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Programs ({programs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'classes' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <School className="w-4 h-4" />
          <span>Classes 1–8 ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'fees' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Fee Config</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'subjects' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Subjects ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('facilities')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'facilities' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Facilities ({facilities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'gallery' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Photo Gallery ({gallery.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'videos' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Videos & Shorts ({videos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('workspace')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'workspace' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Google Workspace</span>
        </button>
      </div>

      {/* TAB CONTENT: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Top Quick Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Total Enquiries</span>
              <p className="text-3xl font-black text-amber-400 font-['Cinzel',serif]">
                {enquiries.length}
              </p>
              <p className="text-[10px] text-emerald-400">
                {enquiries.filter((e) => e.status === 'new').length} New Pending
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Active Classes</span>
              <p className="text-3xl font-black text-sky-400 font-['Cinzel',serif]">
                {classes.length}
              </p>
              <p className="text-[10px] text-slate-400">Classes 1 to 8 Configured</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Programs</span>
              <p className="text-3xl font-black text-emerald-400 font-['Cinzel',serif]">
                {programs.length}
              </p>
              <p className="text-[10px] text-slate-400">Residential, Day & Short-time</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Media Items</span>
              <p className="text-3xl font-black text-purple-400 font-['Cinzel',serif]">
                {gallery.length + videos.length}
              </p>
              <p className="text-[10px] text-slate-400">
                {gallery.length} Photos, {videos.length} Videos
              </p>
            </div>
          </div>

          {/* Recent Enquiries & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white font-['Cinzel',serif]">
                  Recent Admission Enquiries
                </h2>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs text-amber-400 hover:underline"
                >
                  View All Enquiries →
                </button>
              </div>

              {enquiries.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                  No admission enquiries received yet. Submitted forms from the website will appear here in real time.
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.slice(0, 5).map((enq) => (
                    <div
                      key={enq.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {enq.studentName}
                          </span>
                          <span className="text-slate-400">
                            (Parent: {enq.parentName})
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              enq.status === 'new'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : enq.status === 'contacted'
                                ? 'bg-sky-500/20 text-sky-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>
                        <p className="text-slate-400 mt-0.5">
                          Target: <strong className="text-slate-300">{enq.studentClass}</strong> • {enq.program} • Phone: {enq.mobileNumber}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/91${enq.whatsappNumber || enq.mobileNumber}?text=${encodeURIComponent(
                            `Assalamu Alaikum ${enq.parentName}, this is from Al-Dahr Academy regarding admission for ${enq.studentName}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={`tel:+91${enq.mobileNumber}`}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="lg:col-span-4 rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white font-['Cinzel',serif]">
                Quick Administrator Controls
              </h2>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => {
                    updateSettings({ admissionOpen: !settings.admissionOpen });
                    showToast(
                      settings.admissionOpen
                        ? 'Admissions Closed temporarily'
                        : 'Admissions Opened for 2025–26'
                    );
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl border text-left flex items-center justify-between font-bold ${
                    settings.admissionOpen
                      ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                      : 'bg-red-950/60 border-red-700/60 text-red-300'
                  }`}
                >
                  <span>Admission Status:</span>
                  <span>{settings.admissionOpen ? 'OPEN (Active)' : 'CLOSED'}</span>
                </button>

                <button
                  onClick={() => {
                    updateSettings({ showAnnouncement: !settings.showAnnouncement });
                    showToast('Announcement visibility toggled');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between font-medium"
                >
                  <span>Announcement Banner:</span>
                  <span className="text-amber-400 font-bold">
                    {settings.showAnnouncement ? 'Visible' : 'Hidden'}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('fees')}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between font-medium"
                >
                  <span>Adjust Tuition / Boarding Fees</span>
                  <span className="text-amber-400 font-bold">Manage →</span>
                </button>

                <button
                  onClick={() => setActiveTab('videos')}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between font-medium"
                >
                  <span>Add YouTube Video / Shorts</span>
                  <span className="text-sky-400 font-bold">Upload →</span>
                </button>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={async () => {
                      if (window.confirm('Reset all website data to initial authentic Al-Dahr Academy defaults?')) {
                        await resetAllToDefaults();
                        showToast('Reset to default values successfully');
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-950 border border-red-900/40 text-red-400 hover:bg-red-950/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Everything to Default Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white">
                Admission Enquiries Management
              </h2>
              <p className="text-xs text-slate-400">
                Review, contact parents, mark statuses, and initiate counseling sessions.
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search parent, student, phone..."
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={enquiryStatusFilter}
                onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {filteredEnquiries.length === 0 ? (
            <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No matching enquiries found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-4 font-bold">Student & Parent</th>
                    <th className="py-3 px-4 font-bold">Class & Program</th>
                    <th className="py-3 px-4 font-bold">Contact Info</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-slate-850/60 transition">
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-white">{enq.studentName}</p>
                        <p className="text-[11px] text-slate-400">Parent: {enq.parentName}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-amber-400">{enq.studentClass}</span>
                        <p className="text-[10px] text-slate-400">{enq.program}</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="text-white font-medium">{enq.mobileNumber}</p>
                        {enq.message && (
                          <p className="text-[10px] text-slate-400 italic max-w-xs truncate">
                            "{enq.message}"
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={enq.status}
                          onChange={(e) => {
                            updateEnquiryStatus(enq.id, e.target.value as any);
                            showToast(`Status updated to ${e.target.value}`);
                          }}
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            enq.status === 'new'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : enq.status === 'contacted'
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="interested">Interested</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                        <a
                          href={`https://wa.me/91${enq.whatsappNumber || enq.mobileNumber}?text=${encodeURIComponent(
                            `Assalamu Alaikum ${enq.parentName}, this is Al-Dahr Academy regarding admission for ${enq.studentName}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg inline-flex items-center"
                          title="WhatsApp Parent"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={async () => {
                            await addStudentToGoogleContacts(enq);
                            showToast(`Contact saved/vcard downloaded for ${enq.studentName}`);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg inline-flex items-center"
                          title="Save to Contacts / Download VCard"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete enquiry from ${enq.parentName}?`)) {
                              await deleteEnquiry(enq.id);
                              showToast('Enquiry removed');
                            }
                          }}
                          className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg inline-flex items-center"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: WEBSITE SETTINGS & BRANDING */}
      {activeTab === 'settings' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white">
              Website Settings, Contacts & Branding
            </h2>
            <p className="text-xs text-slate-400">
              Update academy name, phone numbers, WhatsApp, address, announcement bar, and hero text without touching code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Academy Full Name
              </label>
              <input
                type="text"
                value={settingsForm.academyName}
                onChange={(e) => setSettingsForm({ ...settingsForm, academyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={settingsForm.subtitle}
                onChange={(e) => setSettingsForm({ ...settingsForm, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={settingsForm.tagline}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Admission Hotline Phone
              </label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                WhatsApp Phone Number
              </label>
              <input
                type="text"
                value={settingsForm.whatsapp}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={settingsForm.email}
                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">
                Physical Campus Address
              </label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">
                Google Maps Embed URL
              </label>
              <input
                type="text"
                value={settingsForm.googleMapsUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-[11px]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">
                Top Announcement Bar Message
              </label>
              <input
                type="text"
                value={settingsForm.announcement}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">
                Hero Banner Image URL
              </label>
              <input
                type="text"
                value={settingsForm.heroImageUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroImageUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-[11px]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">
                Hero Description Paragraph
              </label>
              <textarea
                rows={3}
                value={settingsForm.heroDescription}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={async () => {
                await updateSettings(settingsForm);
                showToast('Website Settings Saved Successfully!');
              }}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xl flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Website Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PROGRAMS */}
      {activeTab === 'programs' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white">
                Academic Programs Management
              </h2>
              <p className="text-xs text-slate-400">
                Residential, Full-Time, and Short-Time offerings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white font-['Cinzel',serif]">{prog.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                    {prog.code}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3">{prog.description}</p>
                <p className="text-xs font-bold text-amber-400">{prog.feeNote}</p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setEditingProgram(prog)}
                    className="text-xs text-sky-400 hover:underline font-semibold"
                  >
                    Edit Program
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingProgram && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4">
              <h3 className="text-lg font-bold font-['Cinzel',serif] text-white">
                Edit: {editingProgram.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingProgram.name}
                    onChange={(e) =>
                      setEditingProgram({ ...editingProgram, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Fee Note</label>
                  <input
                    type="text"
                    value={editingProgram.feeNote}
                    onChange={(e) =>
                      setEditingProgram({ ...editingProgram, feeNote: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingProgram.description}
                    onChange={(e) =>
                      setEditingProgram({ ...editingProgram, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditingProgram(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await saveProgram(editingProgram);
                    setEditingProgram(null);
                    showToast('Program updated successfully');
                  }}
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Save Program
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: CLASSES 1 TO 8 */}
      {activeTab === 'classes' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white">
                Classes 1 to 8 Management
              </h2>
              <p className="text-xs text-slate-400">
                Adjust residential, full-time, and short-time fees or syllabi for each class.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white font-['Cinzel',serif]">{cls.name}</h3>
                  <span className="text-xs text-amber-400 font-bold">Grade {cls.gradeNumber}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-slate-400">
                    Residential: <strong className="text-amber-400">₹{cls.feeResidential}/mo</strong>
                  </p>
                  <p className="text-slate-400">
                    Full-Time: <strong className="text-sky-400">₹{cls.feeFullTime}/mo</strong>
                  </p>
                  <p className="text-slate-400">
                    Short-Time: <strong className="text-emerald-400">₹{cls.feeShortTime}/mo</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between">
                  <button
                    onClick={() => setEditingClass(cls)}
                    className="text-xs font-semibold text-amber-400 hover:underline"
                  >
                    Edit Fees & Syllabus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingClass && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4">
              <h3 className="text-lg font-bold font-['Cinzel',serif] text-white">
                Edit {editingClass.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Residential Monthly Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={editingClass.feeResidential}
                    onChange={(e) =>
                      setEditingClass({ ...editingClass, feeResidential: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Full-Time Monthly Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={editingClass.feeFullTime}
                    onChange={(e) =>
                      setEditingClass({ ...editingClass, feeFullTime: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Short-Time Monthly Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={editingClass.feeShortTime}
                    onChange={(e) =>
                      setEditingClass({ ...editingClass, feeShortTime: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-semibold text-slate-300 mb-1">
                    Islamic Curriculum Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editingClass.islamicCurriculum}
                    onChange={(e) =>
                      setEditingClass({ ...editingClass, islamicCurriculum: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-semibold text-slate-300 mb-1">
                    Modern Academic Curriculum Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editingClass.modernCurriculum}
                    onChange={(e) =>
                      setEditingClass({ ...editingClass, modernCurriculum: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await saveClass(editingClass);
                    setEditingClass(null);
                    showToast(`${editingClass.name} updated successfully!`);
                  }}
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Save Class Details
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: FEE CONFIG */}
      {activeTab === 'fees' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white">
              Initial Admission Fee & Calculator Configuration
            </h2>
            <p className="text-xs text-slate-400">
              Set the breakdown values used by the website and admission fee calculator.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                One-Time Admission Fee (₹)
              </label>
              <input
                type="number"
                value={admissionFeeConfig.admissionFee}
                onChange={(e) =>
                  updateAdmissionFeeConfig({
                    ...admissionFeeConfig,
                    admissionFee: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Advance Monthly Fee (Standard reference) (₹)
              </label>
              <input
                type="number"
                value={admissionFeeConfig.monthlyFee}
                onChange={(e) =>
                  updateAdmissionFeeConfig({
                    ...admissionFeeConfig,
                    monthlyFee: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Dress / Uniform Kit (2 sets) (₹)
              </label>
              <input
                type="number"
                value={admissionFeeConfig.dressFee}
                onChange={(e) =>
                  updateAdmissionFeeConfig({
                    ...admissionFeeConfig,
                    dressFee: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Books & Curriculum Materials Fee (₹)
              </label>
              <input
                type="number"
                value={admissionFeeConfig.booksFee}
                onChange={(e) =>
                  updateAdmissionFeeConfig({
                    ...admissionFeeConfig,
                    booksFee: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">
                Fee Explanatory Note (displayed to parents)
              </label>
              <input
                type="text"
                value={admissionFeeConfig.note}
                onChange={(e) =>
                  updateAdmissionFeeConfig({
                    ...admissionFeeConfig,
                    note: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Admission Sum calculated:</span>
            <span className="text-xl font-bold text-amber-400 font-['Cinzel',serif]">
              ₹
              {(
                admissionFeeConfig.admissionFee +
                admissionFeeConfig.monthlyFee +
                admissionFeeConfig.dressFee +
                admissionFeeConfig.booksFee
              ).toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => showToast('Fee configuration updated and live!')}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Fee Configuration</span>
          </button>
        </div>
      )}

      {/* TAB CONTENT: GALLERY */}
      {activeTab === 'gallery' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white">
              Photo Gallery Manager
            </h2>
            <p className="text-xs text-slate-400">
              Add campus photos, classroom activities, and sports images.
            </p>
          </div>

          {/* Add photo form */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Add New Photo to Gallery</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                placeholder="Image Title (e.g., Morning Assembly)"
                value={newGalleryTitle}
                onChange={(e) => setNewGalleryTitle(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
              <input
                type="text"
                placeholder="Image URL (Unsplash or direct image link)"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
              <select
                value={newGalleryCat}
                onChange={(e) => setNewGalleryCat(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              >
                <option value="Campus Life">Campus Life</option>
                <option value="Islamic Studies">Islamic Studies</option>
                <option value="Academic">Academic</option>
                <option value="Residential">Residential</option>
                <option value="Sports">Sports</option>
                <option value="Events">Events</option>
              </select>
            </div>
            <button
              onClick={async () => {
                if (!newGalleryUrl || !newGalleryTitle) return;
                await saveGalleryItem({
                  id: 'gal-' + Date.now(),
                  title: newGalleryTitle,
                  category: newGalleryCat,
                  imageUrl: newGalleryUrl,
                  caption: newGalleryTitle,
                  isFeatured: true,
                  order: gallery.length + 1,
                });
                setNewGalleryTitle('');
                setNewGalleryUrl('');
                showToast('Photo added to gallery!');
              }}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photo</span>
            </button>
          </div>

          {/* Current Gallery List */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gallery.map((g) => (
              <div
                key={g.id}
                className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden space-y-2 p-2"
              >
                <div className="h-32 rounded-xl overflow-hidden bg-black">
                  <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-semibold text-white truncate max-w-[120px]">{g.title}</span>
                  <button
                    onClick={() => deleteGalleryItem(g.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: VIDEOS & SHORTS */}
      {activeTab === 'videos' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white">
              Videos, YouTube Shorts & Instagram Reels Manager
            </h2>
            <p className="text-xs text-slate-400">
              Add YouTube videos, short recitations, and social media reels.
            </p>
          </div>

          {/* Add video form */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Add New Video / Short</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                placeholder="Video Title"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white sm:col-span-2"
              />
              <select
                value={newVideoType}
                onChange={(e) => setNewVideoType(e.target.value as any)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              >
                <option value="youtube">YouTube Video</option>
                <option value="shorts">YouTube Short</option>
                <option value="instagram">Instagram Reel</option>
              </select>
              <input
                type="text"
                placeholder="Category (e.g. Quran)"
                value={newVideoCat}
                onChange={(e) => setNewVideoCat(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
              <input
                type="text"
                placeholder="Video or Reel URL (e.g. https://youtube.com/watch?v=...)"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white sm:col-span-4 font-mono text-[11px]"
              />
            </div>
            <button
              onClick={async () => {
                if (!newVideoTitle || !newVideoUrl) return;
                await saveVideoItem({
                  id: 'vid-' + Date.now(),
                  title: newVideoTitle,
                  type: newVideoType,
                  url: newVideoUrl,
                  description: newVideoTitle,
                  category: newVideoCat,
                  isFeatured: true,
                  active: true,
                  order: videos.length + 1,
                });
                setNewVideoTitle('');
                setNewVideoUrl('');
                showToast('Video added to website!');
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Video</span>
            </button>
          </div>

          {/* Current Videos List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {videos.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 uppercase text-[10px]">
                    {v.type}
                  </span>
                  <button
                    onClick={() => deleteVideoItem(v.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-bold text-white line-clamp-2">{v.title}</h4>
                <p className="text-[11px] text-slate-400 font-mono truncate">{v.url}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SUBJECTS */}
      {activeTab === 'subjects' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white">
            Subjects Management (Islamic & Modern)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                      sub.type === 'islamic'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-sky-500/20 text-sky-400'
                    }`}
                  >
                    {sub.type}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{sub.title}</h4>
                <p className="text-slate-400 line-clamp-2">{sub.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: FACILITIES */}
      {activeTab === 'facilities' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white">
            Campus Facilities Management
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {facilities.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
              >
                <div className="h-28 rounded-xl overflow-hidden bg-black">
                  <img src={f.imageUrl} alt={f.title} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-white text-sm">{f.title}</h4>
                <p className="text-slate-400 line-clamp-2">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: GOOGLE WORKSPACE */}
      {activeTab === 'workspace' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white">
              Google Workspace Integrations
            </h2>
            <p className="text-xs text-slate-400">
              Integrate Google Forms for evaluations, Google Meet for parent video counseling, and Google Contacts for student phonebook sync.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Google Meet */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Google Meet Counseling</h3>
              <p className="text-slate-400">
                Generate instant counseling video links to share with out-of-town parents for admission interviews.
              </p>
              <button
                onClick={async () => {
                  const space = await createGoogleMeetSpace('Al-Dahr Admission Counseling', 'Admin');
                  alert(`Meeting link generated:\n${space.meetingUri}`);
                }}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Meet Link</span>
              </button>
            </div>

            {/* Google Forms */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Google Forms Admissions</h3>
              <p className="text-slate-400">
                Create or open the Al-Dahr Academy comprehensive student assessment test form.
              </p>
              <button
                onClick={async () => {
                  const form = await createGoogleFormForAdmissions();
                  window.open(form.responderUri, '_blank');
                }}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Google Form</span>
              </button>
            </div>

            {/* Google Contacts */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Export Student Contacts</h3>
              <p className="text-slate-400">
                Export all {enquiries.length} parent admission enquiries into a single VCard (.vcf) address book.
              </p>
              <button
                onClick={() => {
                  if (enquiries.length === 0) {
                    alert('No enquiries to export yet.');
                    return;
                  }
                  let combinedVcard = '';
                  enquiries.forEach((enq) => {
                    combinedVcard += `BEGIN:VCARD\nVERSION:3.0\nFN:${enq.studentName} (Parent: ${enq.parentName})\nTEL;TYPE=CELL:${enq.mobileNumber}\nNOTE:Al-Dahr Academy - ${enq.studentClass} (${enq.program})\nEND:VCARD\n`;
                  });
                  const blob = new Blob([combinedVcard], { type: 'text/vcard;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `AlDahr_All_Enquiries_${Date.now()}.vcf`;
                  a.click();
                  showToast('VCF Contacts Downloaded!');
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export All Contacts</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
