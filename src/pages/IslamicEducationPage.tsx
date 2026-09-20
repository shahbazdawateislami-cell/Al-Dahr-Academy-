import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { getLocalizedSubject } from '../data/localizedData';

export const IslamicEducationPage: React.FC = () => {
  const { subjects, setIsAdmissionModalOpen } = useAcademy();
  const { t, language } = useLanguage();

  const islamicSubjects = subjects
    .filter((s) => s.type === 'islamic')
    .map((s) => getLocalizedSubject(s, language));

  const dailyIslamicRoutine = [
    {
      time: '04:30 AM',
      event:
        language === 'ur'
          ? 'تہجد و باجماعت نمازِ فجر مصلی میں'
          : language === 'hi'
          ? 'तहज्जुद व बाज़मात नमाज़-ए-फ़ज्र'
          : language === 'roman'
          ? 'Tahajjud aur ba-jamaat Fajr namaz'
          : 'Tahajjud & Fajr Prayer in Musalla',
    },
    {
      time: '05:30 AM',
      event:
        language === 'ur'
          ? 'صبح کی تلاوتِ قرآن و حفظ کا سبق'
          : language === 'hi'
          ? 'सुबह की कुरआन तिलावत व सबक़'
          : language === 'roman'
          ? 'Subah ki Quran tilawat aur Sabaq'
          : 'Morning Quran Recitation & Hifz Sabaq',
    },
    {
      time: '07:30 AM',
      event:
        language === 'ur'
          ? 'مسنون دعائیں و صحت بخش ناشتہ'
          : language === 'hi'
          ? 'मसनून दुआएं व पौष्टिक नाश्ता'
          : language === 'roman'
          ? 'Sunnah masnoon duayein aur nashta'
          : 'Sunnah Morning Duas & Healthy Breakfast',
    },
    {
      time: '01:15 PM',
      event:
        language === 'ur'
          ? 'باجماعت نمازِ ظہر و آدابِ زندگی کی نشست'
          : language === 'hi'
          ? 'बाज़मात नमाज़-ए-ज़ुहर व इस्लामी आचरण'
          : language === 'roman'
          ? 'Ba-jamaat Zuhr namaz aur deeni majlis'
          : 'Zuhr Congregation & Sunnah Manners circle',
    },
    {
      time: '04:45 PM',
      event:
        language === 'ur'
          ? 'نمازِ عصر و احادیث مبارکہ کا مطالعہ'
          : language === 'hi'
          ? 'नमाज़-ए-असर व हदीस का पाठ'
          : language === 'roman'
          ? 'Asr namaz aur Hadees-e-Mubaraka sabaq'
          : 'Asr Prayer followed by Hadith reading',
    },
    {
      time: '06:15 PM',
      event:
        language === 'ur'
          ? 'نمازِ مغرب و منزل و سبقی کی دہرائی'
          : language === 'hi'
          ? 'नमाज़-ए-मग़रिब व मंज़िल दोहराना'
          : language === 'roman'
          ? 'Maghrib namaz aur Manzil revision'
          : 'Maghrib Prayer & Quran Manzil revision',
    },
    {
      time: '08:00 PM',
      event:
        language === 'ur'
          ? 'نمازِ عشاء، سونے کی دعائیں و آرام'
          : language === 'hi'
          ? 'नमाज़-ए-इशा, रात की दुआएं व शयन'
          : language === 'roman'
          ? 'Isha namaz, sone ki duayein aur aaram'
          : 'Isha Prayer, Night Duas & peaceful sleep',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          {t('islamic_page_badge', 'Sacred Sciences & Tarbiyah')}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel',serif] tracking-tight">
          {t('islamic_page_title', 'Islamic Education & Spiritual Excellence')}
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          {t('islamic_page_subtitle', "Rooting young hearts in the Qur'an, authentic Sunnah, and noble character from Class 1 through Class 8 under certified Islamic scholars.")}
        </p>
      </div>

      {/* Islamic Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {islamicSubjects.map((subj) => (
          <div
            key={subj.id}
            className="p-6 rounded-2xl bg-slate-900 border border-amber-500/20 hover:border-amber-500/50 transition duration-300 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Cinzel',serif] text-white">
                {subj.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {subj.description}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('classes_primary_foundation', 'Integral Part of All Classes 1 to 8')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Spiritual Routine */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            {t('islamic_daily_routine', 'Daily Routine')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-white">
            {t('islamic_daily_routine', 'Daily Congregational Routine of a Residential Student')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('home_synthesis_desc', 'A structured daily rhythm designed to instill spiritual punctuality, self-discipline, and enduring peace of mind.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dailyIslamicRoutine.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-slate-900 text-amber-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-400">{item.time}</p>
                <p className="text-xs text-slate-200 font-medium mt-0.5">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/15 border border-amber-500/40 p-8 text-center space-y-4">
        <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="text-2xl font-bold font-['Cinzel',serif] text-white">
          {t('footer_admissions_open', 'Enroll in Our Islamic & Hifz Programs')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          {t('footer_classes_desc', "Admissions are open for Residential, Full-Time, and Short-Time batches. Secure your child's spiritual foundation today.")}
        </p>
        <button
          onClick={() => setIsAdmissionModalOpen(true)}
          className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-xl transition"
        >
          {t('hero_btn_apply', 'Apply for Admission 2025–26')}
        </button>
      </div>
    </div>
  );
};
