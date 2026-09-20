import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useLanguage } from '../context/LanguageContext';
import {
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';
import { getLocalizedSubject } from '../data/localizedData';

export const ModernEducationPage: React.FC = () => {
  const { subjects, setIsAdmissionModalOpen } = useAcademy();
  const { t, language } = useLanguage();

  const modernSubjects = subjects
    .filter((s) => s.type === 'modern')
    .map((s) => getLocalizedSubject(s, language));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
          {t('modern_page_badge', 'Standard Schooling & Pedagogy')}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel',serif] tracking-tight">
          {t('modern_page_title', 'Modern Academic Excellence')}
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          {t('modern_page_subtitle', 'Preparing students for the 21st century with analytical math, spoken English fluency, scientific curiosity, and computer literacy from Class 1 to 8.')}
        </p>
      </div>

      {/* Modern Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modernSubjects.map((subj) => (
          <div
            key={subj.id}
            className="p-6 rounded-2xl bg-slate-900 border border-sky-500/20 hover:border-sky-500/50 transition duration-300 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Cinzel',serif] text-white">
                {subj.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {subj.description}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 text-[11px] text-sky-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('sec_modern_desc', 'Aligned with State & National Educational Standards')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity-Based Pedagogy */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            {t('curriculum_page_badge', 'Teaching Methodology')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-white">
            {t('home_synthesis_title', 'Beyond Rote Memorization: Activity-Based Learning')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('home_synthesis_desc', 'Children learn best when they touch, experiment, observe, and discuss. Our modern classrooms prioritize conceptual mastery.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="text-sky-400 font-bold text-base font-['Cinzel',serif]">
              🔬 {language === 'ur' ? 'عملی سائنسی مشاہدات' : language === 'hi' ? 'प्रयोगात्मक विज्ञान' : 'Hands-On Science'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'ur'
                ? 'مقناطیس، پرزم اور کیمیائی مشاہدات کے ذریعے طبیعیات اور حیاتیات کی عملی فہم تا کہ سائنسی تصورات ہمیشہ کے لیے ذہن نشین ہو جائیں۔'
                : language === 'hi'
                ? 'चुंबक, प्रिज्म और प्रयोगात्मक मॉडलों द्वारा भौतिक व रसायन विज्ञान की अवधारणाओं को समझना ताकि ज्ञान हमेशा के लिए दृढ़ हो।'
                : language === 'roman'
                ? 'Experiments, magnets, biological plants aur chemical demonstration ke zariye asan aur dilchasp science padhai.'
                : 'Demonstrating physical laws with magnets, prisms, biological plant specimens, and chemical changes so concepts stick permanently.'}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="text-amber-400 font-bold text-base font-['Cinzel',serif]">
              🗣️ {language === 'ur' ? 'انگریزی بول چال کے حلقے' : language === 'hi' ? 'अंग्रेजी संभाषण अभ्यास' : 'Spoken English Circles'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'ur'
                ? 'انگریزی کا خوف ختم کرنے کے لیے روزمرہ گفتگو کی مشق، الفاظ کے ذخیرے میں اضافہ، تقریری مقابلے اور خود اعتمادی کی تربیت۔'
                : language === 'hi'
                ? 'अंग्रेजी के झिझक को दूर करने के लिए दैनिक बातचीत, शब्दावली अभ्यास और आत्मविश्वास के साथ बोलने का वातावरण।'
                : language === 'roman'
                ? 'Daily spoken practice, vocabulary drills aur speaking competitions ke zariye English bolne ki hichkichahat ko door karna.'
                : 'Overcoming the fear of English through daily conversational practice, vocabulary drills, speech competitions, and drama enactments.'}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="text-emerald-400 font-bold text-base font-['Cinzel',serif]">
              💻 {language === 'ur' ? 'کمپیوٹر و ڈیجیٹل آگاہی' : language === 'hi' ? 'कंप्यूटर व डिजिटल साक्षरता' : 'IT & Computer Literacy'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'ur'
                ? 'کی بورڈ ٹائپنگ، بنیادی سافٹ ویئر، دستاویزی مہارتیں اور اخلاقی انٹرنیٹ کے استعمال کے ذریعے طلبہ کو مستقبل کے لیے تیار کرنا۔'
                : language === 'hi'
                ? 'कीबोर्ड टाइपिंग, बेसिक सॉफ्टवेयर, कंप्यूटर कौशल और भविष्य की उच्च शिक्षा के लिए डिजिटल साक्षरता की सुदृढ़ नींव।'
                : language === 'roman'
                ? 'Typing skills, MS Office, basic computer operations aur ethical digital skills jo bachhon ko future ke liye tayyar karti hain.'
                : 'Teaching keyboard skills, document editing, logic building, and ethical internet usage to equip students for higher education.'}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-500/15 via-slate-900 to-sky-500/15 border border-sky-500/40 p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold font-['Cinzel',serif] text-white">
          {t('footer_give_child', 'Build Your Child’s Bright Future Today')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          {t('modern_page_subtitle', 'Classes 1 to 8 Admissions Open with modern academics & complete Islamic Tarbiyah.')}
        </p>
        <button
          onClick={() => setIsAdmissionModalOpen(true)}
          className="px-8 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-sm shadow-xl transition"
        >
          {t('hero_btn_apply', 'Apply for Admission')}
        </button>
      </div>
    </div>
  );
};
