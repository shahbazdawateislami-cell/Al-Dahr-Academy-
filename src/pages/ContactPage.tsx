import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { getLocalizedClass, getLocalizedProgram } from '../data/localizedData';

export const ContactPage: React.FC = () => {
  const { settings, submitEnquiry, classes, programs } = useAcademy();
  const { t, language } = useLanguage();

  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [studentClass, setStudentClass] = useState('Class 1');
  const [program, setProgram] = useState('Residential Program');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !studentName || !mobileNumber) return;

    setIsSubmitting(true);
    try {
      await submitEnquiry({
        parentName,
        studentName,
        mobileNumber,
        whatsappNumber: mobileNumber,
        studentClass,
        program,
        message,
      });
      setSubmittedSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmittedSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappHref = `https://wa.me/91${settings.whatsapp}?text=${encodeURIComponent(
    `Assalamu Alaikum, I would like to enquire about admission at ${settings.academyName}, Phulwari Sharif, Patna.`
  )}`;

  const localizedClasses = classes.map((c) => getLocalizedClass(c, language));
  const localizedPrograms = programs.map((p) => getLocalizedProgram(p, language));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          {t('contact_badge', 'Reach Us')}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel',serif] tracking-tight">
          {t('contact_title', 'Contact & Campus Visit')}
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          {t('contact_subtitle', 'We welcome parents and guardians to visit our campus in Phulwari Sharif, Patna. Call or message us directly for immediate admission support.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold font-['Cinzel',serif] text-white">
              {t('contact_info_title', 'Academy Contact Information')}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">{t('contact_campus_loc', 'Campus Location')}:</p>
                  <p className="text-slate-300 mt-0.5">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">{t('contact_phone_title', 'Admission Phone Number')}:</p>
                  <a
                    href={`tel:+91${settings.phone}`}
                    className="text-amber-400 font-bold hover:underline block mt-0.5"
                  >
                    +91 {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">{t('contact_whatsapp_title', 'WhatsApp Helpline')}:</p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold hover:underline block mt-0.5"
                  >
                    +91 {settings.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">{t('contact_email_title', 'Email Address')}:</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-slate-300 hover:text-white block mt-0.5 truncate"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">{t('contact_hours_title', 'Office & Visiting Hours')}:</p>
                  <p className="text-slate-300 mt-0.5">8:00 AM – 5:00 PM (Mon – Sat)</p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:+91${settings.phone}`}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{t('btn_call_now', 'Call Now')}</span>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('btn_whatsapp_enquiry', 'WhatsApp')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Direct Enquiry Form */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-['Cinzel',serif] text-white">
              {t('contact_form_title', 'Send Direct Admission Enquiry')}
            </h2>
          </div>

          {submittedSuccess ? (
            <div className="p-6 bg-slate-950 rounded-2xl border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">{t('form_success_title', 'Enquiry Submitted!')}</h3>
              <p className="text-xs text-slate-300">
                {t('form_success_desc', 'Thank you. Our representative will call you shortly.')}
              </p>
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="px-4 py-2 bg-slate-800 rounded-lg text-xs text-slate-300 hover:text-white"
              >
                {t('btn_submit_another', 'Submit Another Query')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('form_parent_name', 'Parent / Guardian Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder={t('form_parent_placeholder', 'Enter your full name')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('form_student_name', 'Student Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={t('form_student_placeholder', "Student's name")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('form_mobile_number', 'Mobile Number *')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder={t('form_mobile_placeholder', '10-digit number')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('form_target_class', 'Target Class *')}
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    {localizedClasses.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('form_program_preference', 'Program *')}
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    {localizedPrograms.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('form_message_remarks', 'Message / Remarks')}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('form_message_placeholder', 'Ask about boarding facilities, admission exam dates, or special queries...')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{t('form_submit_btn', 'Send Admission Enquiry')}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Embedded Google Map */}
      <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white font-['Cinzel',serif]">
              {t('contact_map_title', 'Google Maps Location')}
            </p>
            <p className="text-[11px] text-amber-400">{settings.address}</p>
          </div>
          <a
            href="https://maps.google.com/?q=Phulwari+Sharif+Patna"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sky-400 hover:underline font-semibold"
          >
            {t('contact_map_open', 'Open in Google Maps App →')}
          </a>
        </div>
        <div className="h-80 sm:h-96 w-full">
          <iframe
            title="Al-Dahr Academy Map Location"
            src={settings.googleMapsUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};
