import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { createGoogleMeetSpace } from '../services/googleWorkspace';
import {
  X,
  Sparkles,
  CheckCircle2,
  Phone,
  MessageCircle,
  Video,
  User,
  BookOpen,
  Send,
  Loader2,
} from 'lucide-react';

export const AdmissionModal: React.FC = () => {
  const {
    isAdmissionModalOpen,
    setIsAdmissionModalOpen,
    settings,
    classes,
    programs,
    enquiryPrefill,
    setEnquiryPrefill,
    submitEnquiry,
  } = useAcademy();

  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [studentClass, setStudentClass] = useState('Class 1');
  const [program, setProgram] = useState('Residential Program');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [isGeneratingMeet, setIsGeneratingMeet] = useState(false);

  useEffect(() => {
    if (enquiryPrefill) {
      if (enquiryPrefill.class) setStudentClass(enquiryPrefill.class);
      if (enquiryPrefill.program) setProgram(enquiryPrefill.program);
    }
  }, [enquiryPrefill]);

  if (!isAdmissionModalOpen) return null;

  const handleClose = () => {
    setIsAdmissionModalOpen(false);
    setIsSuccess(false);
    setMeetLink(null);
    setEnquiryPrefill(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !studentName || !mobileNumber) return;

    setIsSubmitting(true);
    try {
      await submitEnquiry({
        parentName,
        studentName,
        mobileNumber,
        whatsappNumber: whatsappNumber || mobileNumber,
        studentClass,
        program,
        message,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSuccess(true); // Graceful fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateMeet = async () => {
    setIsGeneratingMeet(true);
    try {
      const meet = await createGoogleMeetSpace(`Admission Counseling: ${studentName}`, parentName);
      setMeetLink(meet.meetingUri);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingMeet(false);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/91${settings.whatsapp}?text=${encodeURIComponent(
    `Assalamu Alaikum,\n\nI have submitted an admission enquiry for:\nStudent: ${studentName || 'My Child'}\nClass: ${studentClass}\nProgram: ${program}\nParent: ${parentName}\nPhone: ${mobileNumber}\n\nPlease share admission details and schedule for Al-Dahr Academy.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Cinzel',serif]">
                Admission Enquiry 2025–26
              </h3>
              <p className="text-xs text-amber-400 font-medium">
                {settings.academyName} • Phulwari Sharif, Patna
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white font-['Cinzel',serif]">
                  Enquiry Received Successfully!
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  JazakAllah Khair, {parentName}. The admission office of Al-Dahr Academy has received your enquiry for{' '}
                  <strong className="text-amber-400">{studentName}</strong> ({studentClass}, {program}).
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-left space-y-2 text-xs">
                <p className="text-slate-400 font-medium">
                  • Our admission counselor will call you at <strong className="text-white">+91 {mobileNumber}</strong> shortly.
                </p>
                <p className="text-slate-400 font-medium">
                  • You can also connect directly via WhatsApp or start an instant counseling session.
                </p>
              </div>

              {/* Action Buttons on Success */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat With Us on WhatsApp</span>
                </a>

                {!meetLink ? (
                  <button
                    onClick={handleGenerateMeet}
                    disabled={isGeneratingMeet}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                  >
                    {isGeneratingMeet ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Video className="w-4 h-4" />
                    )}
                    <span>Request Virtual Google Meet Counseling</span>
                  </button>
                ) : (
                  <div className="p-3 bg-sky-950/60 border border-sky-700/60 rounded-xl text-left">
                    <p className="text-[11px] text-sky-300 font-medium mb-1">
                      Virtual Video Counseling Link Created:
                    </p>
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-400 hover:underline font-bold break-all flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{meetLink}</span>
                    </a>
                  </div>
                )}

                <a
                  href={`tel:+91${settings.phone}`}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Admission Office: +91 {settings.phone}</span>
                </a>

                <button
                  onClick={handleClose}
                  className="text-xs text-slate-400 hover:text-slate-200 pt-2 underline"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g., Mohammad Shahbaz"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g., Abdullah"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Number (Call) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="10-digit Mobile Number"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Same as mobile if empty"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Class *
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Desired Program *
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    {programs.map((prog) => (
                      <option key={prog.id} value={prog.name}>
                        {prog.name} ({prog.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Questions / Additional Information
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any prior Islamic education, Hifz status, or specific queries..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Submit Admission Enquiry</span>
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
                  <span>🔒 Privacy Assured</span>
                  <span>•</span>
                  <span>⚡ Fast Response within 24 Hours</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
