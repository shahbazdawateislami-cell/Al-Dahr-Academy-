import { AppLanguage } from './translations';
import { ProgramItem, SchoolClassItem, FacilityItem, SubjectItem, CurriculumItem, HeroSlideItem } from '../types';
import { initialPrograms, initialClasses, initialFacilities, initialSubjects, initialCurriculum } from './initialData';

export interface LocalizedProgramContent {
  name: string;
  classes: string;
  feeNote: string;
  description: string;
  features: string[];
}

export const PROGRAM_LOCALIZATIONS: Record<string, Record<AppLanguage, LocalizedProgramContent>> = {
  'prog-residential': {
    en: {
      name: 'Residential Program',
      classes: 'Class 1 to Class 8',
      feeNote: 'Starting from ₹2,700 / month (Includes Boarding + Education)',
      description:
        'A holistic boarding program offering 24/7 student care, structured Islamic routines, Tahajjud & Salah in congregation, comprehensive modern academics, nutritious halal meals, and dedicated mentor supervision.',
      features: [
        'Residential hostel stay with comfortable boarding',
        'Islamic education: Quran, Tajweed, Hifz & Sunnah routines',
        'Modern education: English, Math, Science & Computers',
        '24/7 Character building & personal mentorship',
        'Activity-based learning and sports physical routines',
        'Hygienic dining with nutritious meals & round-the-clock care',
      ],
    },
    roman: {
      name: 'Residential Program (Hostel)',
      classes: 'Class 1 se Class 8',
      feeNote: 'Starting ₹2,700 / mahana (Rehaish + Taleem + Khana)',
      description:
        '24 ghante dekhbhal, baqaeda Islami mamoolat, ba-jamaat namaz aur tahajjud, mukammal asri taleem, aur lazeez halal khane ke sath shandar boarding.',
      features: [
        'Aaram deh aur mehfooz hostel ki sahulat',
        'Islami taleem: Quran, Tajweed, Hifz aur Sunnat mamoolat',
        'Asri taleem: English, Maths, Science aur Computers',
        '24 ghante akhlaqi tarbiyat aur Asatiza ki nigrani',
        'Activity-based padhai aur sports physical routines',
        'Saaf suthra ghazai khana aur round-the-clock dekhbhal',
      ],
    },
    ur: {
      name: 'اقامتی شعبہ (ہاسٹل)',
      classes: 'درجہ اول تا ہشتم (کلاس 1 تا 8)',
      feeNote: 'شروع از ₹2,700 / ماہانہ (تعلیم + قیام و طعام)',
      description:
        '24 گھنٹے نگہداشت، باقاعدہ اسلامی معمولات، باجماعت نماز و تہجد، مکمل عصری تعلیم، اور غذائیت سے بھرپور حلال کھانوں کے ساتھ جامع اقامتی بورڈنگ۔',
      features: [
        'آرام دہ اور محفوظ اقامتی ہاسٹل کی سہولت',
        'اسلامی تعلیم: قرآن، تجوید، حفظ اور سنت کے مطابق معمولات',
        'عصری تعلیم: انگریزی، ریاضی، سائنس اور کمپیوٹر',
        '24 گھنٹے اخلاقی تربیت اور اساتذہ کی سرپرستی',
        'عملی سرگرمیوں پر مبنی تعلیم اور جسمانی کھیل',
        'معیاری و صحت بخش کھانا اور ہمہ وقت دیکھ بھال',
      ],
    },
    hi: {
      name: 'आवासीय (रेजिडेंशियल) प्रोग्राम',
      classes: 'कक्षा 1 से कक्षा 8',
      feeNote: 'प्रारंभ ₹2,700 / माह (आवास + भोजन + शिक्षा)',
      description:
        '24 घंटे छात्र देखभाल, अनुशासित इस्लामिक दिनचर्या, तहज्जुद व बाज़मात नमाज़, उत्कृष्ट आधुनिक शिक्षा, पौष्टिक हलाल भोजन और समर्पित शिक्षकों की निगरानी।',
      features: [
        'आरामदायक व सुरक्षित छात्रावास (हॉस्टल) में रहने की व्यवस्था',
        'इस्लामिक शिक्षा: कुरआन, तजवीद, हिफ़्ज़ व सुन्नत के अनुसार आचरण',
        'आधुनिक शिक्षा: अंग्रेजी, गणित, विज्ञान और कंप्यूटर',
        '24 घंटे व्यक्तिगत चरित्र निर्माण व नैतिक मार्गदर्शन',
        'गतिविधि-आधारित शिक्षा व शारीरिक खेलकूद',
        'स्वच्छ रसोई से पौष्टिक भोजन व 24 घंटे देखभाल',
      ],
    },
  },
  'prog-fulltime': {
    en: {
      name: 'Full-Time Program',
      classes: 'Class 1 to Class 8',
      feeNote: 'Starting from ₹900 / month',
      description:
        'Complete day schooling integrating rigorous Islamic learning and mainstream modern academics. Students spend the full day in learning, prayers, interactive science & language coaching.',
      features: [
        'Full-day comprehensive schooling schedule',
        'Daily Islamic lessons: Nazra, Duas & Hadith',
        'Modern syllabus aligned with state & national curriculum',
        'Character grooming, manners (Adab) & discipline',
        'Practical activity-based learning & spoken English',
        'Safe campus with dedicated teachers & supportive mentors',
      ],
    },
    roman: {
      name: 'Full-Time Program (Day School)',
      classes: 'Class 1 se Class 8',
      feeNote: 'Starting ₹900 / mahana',
      description:
        'Mukammal din ki schooling jisme mazboot Islami taleem aur standard modern taleem shamil hai. Din bhar taleem, namaz, science aur zuban dani ki practice.',
      features: [
        'Din bhar ka mukammal schooling schedule',
        'Rozana Islami sabaq: Nazra, Duas aur Hadith',
        'Modern syllabus state aur national curriculum ke mutabiq',
        'Akhlaq ki parwarish, adab aur zabt-o-nazm',
        'Activity-based sikhna aur spoken English',
        'Mehfooz campus aur mukhlis asatiza',
      ],
    },
    ur: {
      name: 'فل ٹائم شعبہ (ڈے اسکول)',
      classes: 'درجہ اول تا ہشتم (کلاس 1 تا 8)',
      feeNote: 'شروع از ₹900 / ماہانہ',
      description:
        'مکمل ڈے اسکولنگ ماڈل جس میں ٹھوس اسلامی تعلیم اور معیاری جدید اسکولنگ یکجا ہیں۔ طلبہ دن بھر تعلیم، باجماعت نماز، سائنس اور زبان دانی میں مصروف رہتے ہیں۔',
      features: [
        'دن بھر کا جامع اسکول شیڈول',
        'روزانہ اسلامی اسباق: ناظرہ، دعائیں اور احادیث',
        'جدید نصاب قومی و ریاستی تعلیمی فریم ورک کے عین مطابق',
        'اخلاقی تربیت، آدابِ زندگی اور نظم و ضبط',
        'عملی تدریسی سرگرمیاں اور انگریزی بول چال پر زور',
        'مخلص اساتذہ کی زیرِ نگرانی پرسکون تعلیمی ماحول',
      ],
    },
    hi: {
      name: 'फुल-टाइम प्रोग्राम (डे स्कूल)',
      classes: 'कक्षा 1 से कक्षा 8',
      feeNote: 'प्रारंभ ₹900 / माह',
      description:
        'संपूर्ण डे-स्कूलिंग व्यवस्था जिसमें मजबूत इस्लामिक तालीम और गुणवत्तापूर्ण आधुनिक शिक्षा का बेजोड़ समन्वय है। दिनभर पढ़ाई, नमाज़, विज्ञान और भाषा कौशल का प्रशिक्षण।',
      features: [
        'पूरे दिन का व्यवस्थित स्कूल टाइम-टेबल',
        'दैनिक इस्लामिक पाठ: नाज़िरा, दुआएं व हदीस',
        'राज्य व राष्ट्रीय पाठ्यक्रम के अनुरूप आधुनिक शिक्षा',
        'व्यक्तित्व विकास, शिष्टाचार (अदब) व अनुशासन',
        'गतिविधि आधारित पढ़ाई व बोलचाल अंग्रेजी',
        'समर्पित शिक्षकों व मेंटर्स की निगरानी में सुरक्षित कैंपस',
      ],
    },
  },
  'prog-shorttime': {
    en: {
      name: 'Short-Time Program',
      classes: 'Class 1 to Class 8',
      feeNote: '₹500 / month (Flat for all classes)',
      description:
        'Focused specialized module dedicated to Arabic language, Urdu literacy, and foundational Islamic learning for students seeking strong linguistic and spiritual grounding.',
      features: [
        'Arabic language reading, grammar & writing',
        'Urdu literacy, literature & handwriting',
        'Fundamental Islamic learning: Kalima, Namaz & Duas',
        'Flexible short-shift timings suitable for evening batches',
        'Tajweed correction and Noorani Qaida guidance',
        'Individual teacher attention and regular progress tracking',
      ],
    },
    roman: {
      name: 'Short-Time Program (Arabic & Urdu)',
      classes: 'Class 1 se Class 8',
      feeNote: '₹500 / mahana (Sabhi classes ke liye)',
      description:
        'Sirf Arabic zaban, Urdu parhna-likhna, aur bunyadi deeni taleem ka khas module jo talba ko mazboot roohani aur lisani bunyad deta hai.',
      features: [
        'Arabic zaban parhna, grammar aur likhna',
        'Urdu zaban, adab aur khush-khati',
        'Bunyadi deeni taleem: Kalma, Namaz aur Duas',
        'Subah ya sham ke asan auqat',
        'Tajweed ki durustgi aur Noorani Qaida guidance',
        'Har talib-e-ilm par khas tawajjo',
      ],
    },
    ur: {
      name: 'مختصر وقتی شعبہ (شارٹ ٹائم)',
      classes: 'درجہ اول تا ہشتم (کلاس 1 تا 8)',
      feeNote: '₹500 / ماہانہ (تمام کلاسز کے لیے یکساں)',
      description:
        'عربی زبان دانی، اردو خوانی و کتابت، اور بنیادی دینی تعلیم پر مبنی خصوصی مختصر وقتی کورس، جو مضبوط لسانی اور دینی بنیاد فراہم کرتا ہے۔',
      features: [
        'عربی پڑھنا، قواعد اور تحریر',
        'اردو زبان، املا، خوشخطی اور ادب',
        'بنیادی دینی تعلیمات: کلمہ، نماز اور روزمرہ دعائیں',
        'صبح یا شام کے آسان اوقات',
        'تجوید کی تصحیح اور نورانی قاعدہ کی باقاعدہ مشق',
        'ہر طالب علم پر انفرادی توجہ اور تعلیمی جانچ',
      ],
    },
    hi: {
      name: 'शॉर्ट-टाइम प्रोग्राम (अरबी व उर्दू)',
      classes: 'कक्षा 1 से कक्षा 8',
      feeNote: '₹500 / माह (सभी कक्षाओं के लिए)',
      description:
        'अरबी भाषा, उर्दू साक्षरता और बुनियादी इस्लामी शिक्षा पर केंद्रित विशेष प्रोग्राम, जो बच्चों को मजबूत भाषाई और आध्यात्मिक आधार प्रदान करता है।',
      features: [
        'अरबी भाषा पढ़ना, व्याकरण व लेखन',
        'उर्दू भाषा, साहित्य व सुलेख (हैंडराइटिंग)',
        'बुनियादी दीनी तालीम: कलमा, नमाज़ व दैनिक दुआएं',
        'सुबह या शाम के सुविधाजनक व लचीले समय',
        'तजवीद सुधार व नूरानी कायदा का मार्गदर्शन',
        'प्रत्येक छात्र पर व्यक्तिगत ध्यान व नियमित प्रगति रिपोर्ट',
      ],
    },
  },
};

export const CLASS_LOCALIZATIONS: Record<number, Record<AppLanguage, { name: string; gradeLabel: string; description: string }>> = {
  1: {
    en: { name: 'Class 1', gradeLabel: 'Grade 1', description: 'Foundational grade establishing phonics, primary numeracy, Arabic letter recognition, Noorani Qaida, and classroom etiquette.' },
    roman: { name: 'Class 1', gradeLabel: 'Darja 1', description: 'Bunyadi darja jo phonics, primary hisab, Arabic huroof, Noorani Qaida aur adab sikhata hai.' },
    ur: { name: 'درجہ اول (کلاس 1)', gradeLabel: 'درجہ اول', description: 'ابتدائی درجہ جو صوتیات، بنیادی اعداد، عربی حروف شناسی، نورانی قاعدہ اور کلاس کے آداب سکھاتا ہے۔' },
    hi: { name: 'कक्षा 1', gradeLabel: 'कक्षा 1', description: 'बुनियादी कक्षा जो भाषा ध्वनियां, प्राथमिक अंकगणित, अरबी अक्षर पहचान, नूरानी कायदा और कक्षा शिष्टाचार सिखाती है।' },
  },
  2: {
    en: { name: 'Class 2', gradeLabel: 'Grade 2', description: 'Building linguistic fluency in English and Urdu, beginning Quran Nazra with proper Makharij, and introductory science concepts.' },
    roman: { name: 'Class 2', gradeLabel: 'Darja 2', description: 'English aur Urdu mein rawani, makharij ke sath Nazra Quran ka aaghaz aur bunyadi science concepts.' },
    ur: { name: 'درجہ دوم (کلاس 2)', gradeLabel: 'درجہ دوم', description: 'انگریزی اور اردو میں روانی، مخارج کی درستی کے ساتھ ناظرہ قرآن کا آغاز اور بنیادی سائنسی تصورات۔' },
    hi: { name: 'कक्षा 2', gradeLabel: 'कक्षा 2', description: 'अंग्रेजी और उर्दू में प्रवाह, सही मख़ारिज के साथ नाज़िरा कुरआन की शुरुआत और प्रारंभिक विज्ञान की अवधारणाएं।' },
  },
  3: {
    en: { name: 'Class 3', gradeLabel: 'Grade 3', description: 'Structured academic growth with introduction to foundational grammar, multiplication, social studies, and deeper Islamic virtues.' },
    roman: { name: 'Class 3', gradeLabel: 'Darja 3', description: 'Structured taleemi taraqqi jisme bunyadi grammar, pahade, social studies aur gehri Islami tarbiyat shamil hai.' },
    ur: { name: 'درجہ سوم (کلاس 3)', gradeLabel: 'درجہ سوم', description: 'منظم تعلیمی پیش رفت جس میں بنیادی گرامر، ضرب کے پہاڑے، سماجی علوم اور اسلامی اخلاق شامل ہیں۔' },
    hi: { name: 'कक्षा 3', gradeLabel: 'कक्षा 3', description: 'व्यवस्थित शैक्षणिक प्रगति जिसमें बुनियादी व्याकरण, पहाड़े, सामाजिक विज्ञान और गहरे इस्लामिक संस्कार शामिल हैं।' },
  },
  4: {
    en: { name: 'Class 4', gradeLabel: 'Grade 4', description: 'Accelerated learning phase fostering independent reading, critical thinking, mathematical problem solving, and Quranic Tajweed mastery.' },
    roman: { name: 'Class 4', gradeLabel: 'Darja 4', description: 'Khud-mukhtar study, critical thinking, maths problems ka hal aur Quran Tajweed mein pukhtagi.' },
    ur: { name: 'درجہ چہارم (کلاس 4)', gradeLabel: 'درجہ چہارم', description: 'خود مختار مطالعہ، تنقیدی سوچ، حسابی مسائل کا حل اور قرآن پاک کی تجوید میں پختگی۔' },
    hi: { name: 'कक्षा 4', gradeLabel: 'कक्षा 4', description: 'स्वतंत्र अध्ययन, तार्किक सोच, गणितीय समस्या समाधान और कुरआन तजवीद में निपुणता।' },
  },
  5: {
    en: { name: 'Class 5', gradeLabel: 'Grade 5', description: 'Upper primary milestone preparing students for middle school with advanced logic, language comprehension, and Hifz readiness.' },
    roman: { name: 'Class 5', gradeLabel: 'Darja 5', description: 'Middle school ki tayyari jisme unchi logic, zuban ki samajh aur Hifz ki tayyari shamil hai.' },
    ur: { name: 'درجہ پنجم (کلاس 5)', gradeLabel: 'درجہ پنجم', description: 'مڈل اسکول کی تیاری کا مرحلہ جس میں اعلیٰ فہم و ادراک، ریاضیاتی استدلال اور حفظ کی تیاری شامل ہے۔' },
    hi: { name: 'कक्षा 5', gradeLabel: 'कक्षा 5', description: 'मिडिल स्कूल की तैयारी का चरण जिसमें उच्च तार्किक क्षमता, भाषा समझ और हिफ़्ज़ की तत्परता शामिल है।' },
  },
  6: {
    en: { name: 'Class 6', gradeLabel: 'Grade 6', description: 'Transition into middle school with differentiated sciences (Physics, Chemistry, Biology), introduction to IT and analytical Fiqh.' },
    roman: { name: 'Class 6', gradeLabel: 'Darja 6', description: 'Middle school ki shuruat, alag alag science topics, computer programming basics aur gehri Fiqh taleem.' },
    ur: { name: 'درجہ ششم (کلاس 6)', gradeLabel: 'درجہ ششم', description: 'مڈل اسکول کا آغاز، باقاعدہ سائنسی مضامین (فزکس، کیمسٹری، بائیولوجی کا تعارف)، جدید کمپیوٹر اور فقہی مسائل۔' },
    hi: { name: 'कक्षा 6', gradeLabel: 'कक्षा 6', description: 'मिडिल स्कूल की शुरुआत, पृथक विज्ञान विषय, कंप्यूटर प्रोग्रामिंग के आधार, और गहन इस्लामी न्यायशास्त्र (फ़िक़्ह)।' },
  },
  7: {
    en: { name: 'Class 7', gradeLabel: 'Grade 7', description: 'Advanced algebra, lab science, mature English essay composition, and thematic Quranic translation and contextual Hadith.' },
    roman: { name: 'Class 7', gradeLabel: 'Darja 7', description: 'Advanced algebra, science experiments, pukhta English essay writing aur muntakhab Quran tarjuma.' },
    ur: { name: 'درجہ ہفتم (کلاس 7)', gradeLabel: 'درجہ ہفتم', description: 'اعلیٰ الجبرا، سائنسی تجربات، پختہ انگریزی تحریر، اور قرآن پاک کے منتخب حصوں کے ترجمہ و مفاہیم۔' },
    hi: { name: 'कक्षा 7', gradeLabel: 'कक्षा 7', description: 'उन्नत बीजगणित, विज्ञान प्रयोगशाला प्रयोग, परिपक्व अंग्रेजी निबंध लेखन और चयनित कुरआन अनुवाद व समझ।' },
  },
  8: {
    en: { name: 'Class 8', gradeLabel: 'Grade 8', description: 'Graduating grade of middle school preparing learners for high school excellence, board exams, and exemplary Islamic leadership.' },
    roman: { name: 'Class 8', gradeLabel: 'Darja 8', description: 'Middle school ka aakhri darja, high school board exams ki mukammal tayyari aur shandar Islami shakhsiyat.' },
    ur: { name: 'درجہ ہشتم (کلاس 8)', gradeLabel: 'درجہ ہشتم', description: 'مڈل اسکول کا اختتامی گریجویشن درجہ، ہائی اسکول بورڈ امتحانات کی بھرپور تیاری، اور مکمل اسلامی شخصیت کی تعمیر۔' },
    hi: { name: 'कक्षा 8', gradeLabel: 'कक्षा 8', description: 'मिडिल स्कूल की अंतिम कक्षा, हाई स्कूल बोर्ड परीक्षा की पुख्ता तैयारी, नेतृत्व क्षमता व संपूर्ण इस्लामिक व्यक्तित्व निर्माण।' },
  },
};

export const FACILITY_LOCALIZATIONS: Record<string, Record<AppLanguage, { title: string; description: string }>> = {
  'fac-1': {
    en: { title: 'Residential Hostel', description: 'Comfortable, well-ventilated boarding accommodations with 24/7 warden supervision, clean beds, study areas, and high security.' },
    roman: { title: 'Residential Hostel', description: 'Kushada, hawa-dar aur mehfooz hostel jahan 24 ghante warden ki nigrani, saaf bister aur security hai.' },
    ur: { title: 'اقامتی ہاسٹل', description: 'کشادہ، ہوادار اور محفوظ اقامتی ہاسٹل، جہاں 24 گھنٹے وارڈن کی نگرانی، صاف بستر، مطالعہ کی جگہیں اور مکمل حفاظت میسر ہے۔' },
    hi: { title: 'आवासीय छात्रावास (हॉस्टल)', description: 'आरामदायक, हवादार व सुरक्षित हॉस्टल जहां 24 घंटे वार्डन की देखरेख, स्वच्छ बिस्तर, अध्ययन क्षेत्र व सुरक्षा उपलब्ध है।' },
  },
  'fac-2': {
    en: { title: 'Islamic Learning Environment', description: 'Dedicated prayer hall (Musalla) for 5 daily congregational prayers, peaceful Quran recitation halls, and serene spiritual ambience.' },
    roman: { title: 'Islami Mahol Aur Musalla', description: '5 waqt ki ba-jamaat namaz ke liye khas hall, pur-sukoon tilawat ki jagah aur roohani mahol.' },
    ur: { title: 'اسلامی تعلیمی ماحول و مصلّیٰ', description: 'پانچوں وقت کی باجماعت نماز کے لیے مخصوص ہال (مصلّیٰ)، پرسکون تلاوت گاہیں اور پاکیزہ روحانی ماحول۔' },
    hi: { title: 'इस्लामिक प्रार्थना व अध्ययन स्थल', description: 'पांचों वक्त की बाज़मात नमाज़ हेतु विशाल मुसल्ला, शांत कुरआन तिलावत हॉल और पवित्र आध्यात्मिक माहौल।' },
  },
  'fac-3': {
    en: { title: 'Modern Classrooms', description: 'Spacious, well-lit smart classrooms equipped with teaching aids, ergonomic seating, and distraction-free educational setups.' },
    roman: { title: 'Modern Classrooms', description: 'Kushada aur teaching aids se aarasta smart classrooms jahan aaram-deh baithne aur concentrate karne ki jagah hai.' },
    ur: { title: 'جدید اسمارٹ کلاس رومز', description: 'روشن، کشادہ اور تدریسی آلات سے آراستہ کلاس رومز جہاں آرام دہ نشستیں اور یکسوئی سے پڑھائی کا انتظام ہے۔' },
    hi: { title: 'आधुनिक स्मार्ट कक्षाएं', description: 'उजालेदार, हवादार व आधुनिक शिक्षण उपकरणों से सुसज्जित कक्षाएं, जहां शांत व एकाग्र वातावरण में पढ़ाई होती है।' },
  },
  'fac-4': {
    en: { title: 'Science & Computer Learning', description: 'Interactive demonstration lab where students observe physical experiments, biological specimens, and basic IT computing.' },
    roman: { title: 'Science & Computer Lab', description: 'Interactive lab jahan bachhe science experiments aur basic computer IT skills seekhte hain.' },
    ur: { title: 'سائنس و کمپیوٹر لیب', description: 'طلبہ کے لیے عملی سائنس تجربات، ماڈلز اور بنیادی انفارمیشن ٹیکنالوجی و کمپیوٹر سکھانے کی لیب۔' },
    hi: { title: 'विज्ञान व कंप्यूटर लैब', description: 'इंटरैक्टिव लैब जहां छात्र वैज्ञानिक प्रयोगों, मॉडल्स और बुनियादी कंप्यूटर व आईटी कौशल का प्रत्यक्ष अभ्यास करते हैं।' },
  },
  'fac-5': {
    en: { title: 'Clean & Hygienic Dining', description: 'Spacious dining hall serving wholesome, nutritious, halal-certified breakfast, lunch, and dinner prepared in clean kitchens.' },
    roman: { title: 'Saaf Suthra Dining Hall', description: 'Kushada dining hall jahan rozana saaf suthre kitchen se fresh, taaza aur halal khana milta hai.' },
    ur: { title: 'صاف ستھرا ڈائننگ ہال', description: 'کشادہ ڈائننگ ہال جہاں روزانہ صاف ستھرے باورچی خانے سے تازہ، صحت بخش اور حلال ناشتہ، دوپہر اور رات کا کھانا فراہم کیا جاتا ہے۔' },
    hi: { title: 'स्वच्छ व पौष्टिक भोजनशाला', description: 'विशाल डाइनिंग हॉल जहां स्वच्छ रसोई से तैयार ताजा, पौष्टिक व 100% हलाल नाश्ता, दोपहर व रात का भोजन परोसा जाता है।' },
  },
  'fac-6': {
    en: { title: 'Sports & Physical Health', description: 'Safe outdoor play areas, volleyball, athletics, and supervised morning exercise routines to keep young bodies active and energetic.' },
    roman: { title: 'Khel Kood Aur Physical Health', description: 'Bachhon ki physical fitness, football, volleyball aur subah ki exercise ke liye ground.' },
    ur: { title: 'کھیل و جسمانی صحت کا میدان', description: 'طلبہ کی جسمانی تندرستی، دوڑ، فٹ بال، والی بال اور صبح کی ہلکی ورزش کے لیے محفوظ کھیل کا میدان۔' },
    hi: { title: 'खेलकूद व शारीरिक विकास मैदान', description: 'छात्रों के शारीरिक स्वास्थ्य, फुटबॉल, वॉलीबॉल व दैनिक सुबह के व्यायाम के लिए सुरक्षित खेल मैदान।' },
  },
};

export const SUBJECT_LOCALIZATIONS: Record<string, Record<AppLanguage, { title: string; description: string }>> = {
  'subj-1': {
    en: { title: "Qur'an & Tajweed", description: 'Systematic recitation instruction adhering to Makharij, rules of Noon/Meem Sakin, and phonetic beauty.' },
    roman: { title: 'Quran Aur Tajweed', description: 'Makharij aur Tajweed ke qawaid ke mutabiq sahih aur khubsurat Quran tilawat ki taleem.' },
    ur: { title: 'قرآن مجید و تجوید', description: 'مخارج اور تجوید کے مستند قواعد کے مطابق ترتیل اور خوش الحانی کے ساتھ قرآن پاک کی تعلیم۔' },
    hi: { title: 'कुरआन मजीद व तजवीद', description: 'मखारिज और तजवीद के शुद्ध नियमों के अनुसार सही व सुंदर कुरआन पाठ की व्यवस्था।' },
  },
  'subj-2': {
    en: { title: "Hifz-e-Qur'an", description: 'Structured memorization track with daily revision (Sabaq, Sabqi, and Manzil) under certified Hafiz instructors.' },
    roman: { title: 'Hifz-e-Quran Track', description: 'Daily Sabaq, Sabqi aur Manzil ke nizaam ke sath sanad-yafta Hafiz Asatiza ki dekhbhal mein hifz.' },
    ur: { title: 'حفظِ قرآن کریم', description: 'سند یافتہ حفاظ اساتذہ کی زیر نگرانی روزانہ سبق، سبقی اور منزل کے منظم نظام کے ساتھ حفظ۔' },
    hi: { title: 'हिफ़्ज़-ए-कुरआन मजीद', description: 'प्रमाणित हाफ़िज़ शिक्षकों की देखरेख में दैनिक सबक़, सबक़ी व मंज़िल के साथ हिफ़्ज़ व्यवस्था।' },
  },
  'subj-3': {
    en: { title: 'Hadith & Sunnah', description: 'Study of authentic prophetic traditions from Riyad-us-Saliheen and 40 Nawawi with practical life application.' },
    roman: { title: 'Hadees Aur Sunnat', description: 'Sahih Ahadees ki roshni mein roza-marrah ki zindagi ke adab aur Sunnat e Nabawi ki taleem.' },
    ur: { title: 'حدیث و سنتِ نبوی', description: 'مستند احادیثِ مبارکہ کا مطالعہ، روزمرہ زندگی میں سنت نبوی کا نفاذ اور اخلاق کی آبیاری۔' },
    hi: { title: 'हदीस व सुन्नत की तालीम', description: 'प्रामाणिक हदीसों का अध्ययन और दैनिक जीवन में सुन्नत-ए-नबवी पर अमल करने का प्रशिक्षण।' },
  },
  'subj-4': {
    en: { title: 'Seerah & Islamic History', description: 'Inspiring journey through the life of the Prophet Muhammad (PBUH) and the golden civilizational eras.' },
    roman: { title: 'Seerat-un-Nabi Aur Tareekh-e-Islam', description: 'Huzoor Akram (SAW) ki mubarak zindagi aur Sahaba-e-Kiram ke roshan waqiaat se sabaq.' },
    ur: { title: 'سیرت النبیؐ و اسلامی تاریخ', description: 'حضور اکرم ﷺ کی حیات طیبہ، خلفائے راشدین اور صحابہ کرام کے تابناک واقعات سے رہنمائی۔' },
    hi: { title: 'सीरत-उन-नबी व इस्लामी इतिहास', description: 'हज़रत मुहम्मद (सल्ल.) का पावन जीवन चरित्र और सहाबा-ए-किराम के प्रेरणादायक जीवन प्रसंग।' },
  },
  'subj-5': {
    en: { title: 'Kalima, Duas & Daily Practice', description: 'Memorization and understanding of 6 Kalimas, essential Masnoon prayers for every occasion of life.' },
    roman: { title: 'Chhah Kalimay Aur Masnoon Duayein', description: '6 Kalimas, subah o shaam ki Masnoon duayein aur roza marrah ke Islami mamoolat.' },
    ur: { title: 'کلمات، مسنون دعائیں و معمولات', description: 'چھ کلمات کا معانی کے ساتھ حفظ، نماز کے بعد اور دن رات کی مسنون دعاؤں کی مشق۔' },
    hi: { title: 'कलमे, मसनून दुआएं व आचरण', description: 'छह कलमे, सुबह-शाम की आवश्यक मसनून दुआएं और जीवन के हर अवसर के नबवी आचरण का अभ्यास।' },
  },
  'subj-6': {
    en: { title: 'Islamic Manners & Character Building', description: 'Active training in honesty, respect for parents and teachers, cleanliness, and self-restraint (Adab & Akhlaq).' },
    roman: { title: 'Islami Adab Aur Akhlaqi Tarbiyat', description: 'Walidain aur Asatiza ka ehtaram, sachai, safai nisf iman aur behtareen akhlaq.' },
    ur: { title: 'آداب، اخلاق و تربیت', description: 'والدین اور اساتذہ کا احترام، صداقت، امانت، طہارت اور اعلیٰ اسلامی اخلاق کی عملی تربیت۔' },
    hi: { title: 'इस्लामिक शिष्टाचार व नैतिक चरित्र', description: 'माता-पिता व शिक्षकों का सम्मान, सत्यनिष्ठा, स्वच्छता और उच्च नैतिक मूल्यों का दैनिक अभ्यास।' },
  },
  'subj-7': {
    en: { title: 'English Language & Literature', description: 'Holistic mastery of phonics, reading fluency, grammar, creative writing, and public spoken communication.' },
    roman: { title: 'English Language Aur Spoken', description: 'English bolchal, reading fluency, grammar, essay writing aur vocabulary ki mukammal tayyari.' },
    ur: { title: 'انگریزی زبان و بول چال', description: 'روانی کے ساتھ انگریزی بول چال، پڑھائی، گرامر، فہم اور تحریری صلاحیتوں کی ہمہ جہت تربیت۔' },
    hi: { title: 'अंग्रेजी भाषा व संभाषण (Spoken English)', description: 'ध्वनि विज्ञान (Phonics), धाराप्रवाह पठन, व्याकरण, निबंध लेखन व धाराप्रवाह अंग्रेजी संभाषण।' },
  },
  'subj-8': {
    en: { title: 'Mathematics', description: 'Strong foundation in mental arithmetic, logic, geometry, algebra, and real-world computational problem-solving.' },
    roman: { title: 'Riyazi (Mathematics)', description: 'Hisaab, mental maths, logic, geometry, tables aur competitive exam level ki mathematical skills.' },
    ur: { title: 'ریاضی و حسابی فہم', description: 'بنیادی و جدید حساب، ذہنی ریاضی، جیومیٹری اور مسابقتی امتحانات کے مسائل کا حل۔' },
    hi: { title: 'गणित व तार्किक क्षमता', description: 'मानसिक अंकगणित, ज्यामिति, बीजगणित और व्यावहारिक समस्या-समाधान का सुदृढ़ आधार।' },
  },
  'subj-9': {
    en: { title: 'Science & Practical Labs', description: 'Inquiry-based exploration of Physics, Chemistry, and Biology through hands-on experiments and observation.' },
    roman: { title: 'Science Aur Practical Labs', description: 'Physics, Chemistry aur Biology ke tajarbaat, models aur practical demonstration.' },
    ur: { title: 'سائنس و تجرباتی مشاہدات', description: 'طبیعیات، کیمیا اور حیاتیات کی عملی تجربات اور ماڈلز کے ذریعے جدید سائنسی تعلیم۔' },
    hi: { title: 'विज्ञान व प्रयोगात्मक प्रयोगशाला', description: 'भौतिक, रसायन व जीव विज्ञान की अवधारणाओं को व्यावहारिक प्रयोगों व मॉडलों द्वारा समझना।' },
  },
  'subj-10': {
    en: { title: 'Social Studies & Geography', description: 'Comprehensive understanding of geography, Indian constitution, civics, and civilizational history.' },
    roman: { title: 'Social Studies Aur Geography', description: 'Hindustan ka aaeen, geography, tareekh aur civics ki ahem aur dilchasp maloomat.' },
    ur: { title: 'سماجی علوم و جغرافیہ', description: 'بھارتی آئین، شہریت، تاریخ، جغرافیہ اور ملکی ترقیاتی نظام کا جامع مطالعہ۔' },
    hi: { title: 'सामाजिक विज्ञान व भूगोल', description: 'भारतीय संविधान, नागरिक शास्त्र, इतिहास व भूगोल का व्यापक और सुरुचिपूर्ण अध्ययन।' },
  },
  'subj-11': {
    en: { title: 'Urdu Language & Literature', description: 'Deep appreciation of Urdu poetry, prose, accurate orthography, and classical literary expression.' },
    roman: { title: 'Urdu Zaban Aur Adab', description: 'Urdu imla, insha-pardazi, nazm o nasr, shairi aur adabi zaoq ki taraqqi.' },
    ur: { title: 'اردو زبان و شائستہ ادب', description: 'صحیح املا، انشا پردازی، نظم و نثر، خوشخطی اور شائستہ اردو زبان کا اعلیٰ ذوق۔' },
    hi: { title: 'उर्दू भाषा व सुरुचिपूर्ण साहित्य', description: 'शुद्ध वर्तनी, सुलेख (खुशखती), गद्य व पद्य का समृद्ध ज्ञान व उत्कृष्ट साहित्यिक समझ।' },
  },
  'subj-12': {
    en: { title: 'General Knowledge & Computers', description: 'Digital literacy, computer basics, current affairs, logic puzzles, and global awareness.' },
    roman: { title: 'Computer Taleem Aur GK', description: 'Computer keyboard, MS Office, typing, digital skills aur aalmi waqiaat ki maloomat.' },
    ur: { title: 'کمپیوٹر تعلیم و عمومی معلومات', description: 'ڈیجیٹل مہارت، بنیادی کمپیوٹر، دستاویزات، جدید انفارمیشن ٹیکنالوجی اور حالات حاضرہ۔' },
    hi: { title: 'कंप्यूटर साक्षरता व सामान्य ज्ञान', description: 'डिजिटल कौशल, कंप्यूटर बेसिक्स, तार्किक पहेलियां और देश-विदेश के समसामयिक ज्ञान की शिक्षा।' },
  },
};

export const CURRICULUM_LOCALIZATIONS: Record<string, Record<AppLanguage, { title: string; description: string; topics: string[] }>> = {
  'cur-1': {
    en: {
      title: 'Islamic Curriculum',
      description: 'A deeply rooted curriculum designed to nurture firm faith (Iman), pure worship (Ibadah), and high morals (Akhlaq).',
      topics: [
        "Qur'an Nazra with accurate Tajweed and articulation points",
        'Hifz track with rigorous Manzil retention system',
        'Memorization of 40 fundamental Hadith with everyday meaning',
        'Islamic jurisprudence (Fiqh) regarding Taharah, Salah, Roza, and Zakat',
        'Seerah of the Prophet (PBUH) and stories of the Sahaba',
      ],
    },
    roman: {
      title: 'Islami Curriculum Aur Nisab',
      description: 'Pukhta Eeman, Ibadat aur ba-kirdar Akhlaq banane ke liye tayyar kiya gaya behtareen deeni nisab.',
      topics: [
        'Quran Nazra makharij aur tajweed ke sath',
        'Hifz track aur manzil dohrayi ka pukhta nizaam',
        '40 ahem Ahadees ka hifz aur tarjuma',
        'Taharat, Namaz, Roza aur Fiqh ke zaroori masail',
        'Seerat-un-Nabi (SAW) aur Sahaba-e-Kiram ke waqiaat',
      ],
    },
    ur: {
      title: 'اسلامی نصاب و دینی تعلیم',
      description: 'پختہ ایمان، باقاعدہ عبادت اور اعلیٰ اخلاق کی آبیاری کے لیے ترتیب دیا گیا جامع دینی نصاب۔',
      topics: [
        'قرآن مجید ناظرہ درست مخارج اور تجوید کے ساتھ',
        'حفظ قرآن مع منظم دور اور منزل کی پختگی',
        '40 اہم احادیث مبارکہ کا حفظ اور عملی فہم',
        'فقہ: طہارت، نماز، روزہ اور بنیادی احکام و مسائل',
        'سیرت النبی ﷺ اور صحابہ کرامؓ کے تابناک نقوش',
      ],
    },
    hi: {
      title: 'इस्लामिक पाठ्यक्रम व दीनी तालीम',
      description: 'सुदृढ़ ईमान, नियमित इबादत और उच्च नैतिक चरित्र निर्माण के लिए तैयार किया गया संपूर्ण दीनी पाठ्यक्रम।',
      topics: [
        'कुरआन मजीद नाज़िरा शुद्ध मखारिज व तजवीद के साथ',
        'हिफ़्ज़-ए-कुरआन व मंज़िल दोहराने की पुख्ता व्यवस्था',
        '40 प्रमुख हदीसों का हिफ़्ज़ व व्यावहारिक अर्थ',
        'फ़िक़्ह: तहारत, नमाज़, रोज़ा व दैनिक आवश्यक मसाइल',
        'सीरत-उन-नबी (सल्ल.) व सहाबा-ए-किराम का प्रेरणादायक इतिहास',
      ],
    },
  },
  'cur-2': {
    en: {
      title: 'Modern Academic Curriculum',
      description: 'High-standard modern schooling curriculum aligned with standard national school frameworks for competitive future readiness.',
      topics: [
        'Comprehensive English literacy, phonetics, and conversational speaking',
        'Mathematics: Number systems, commercial math, geometry, and problem-solving',
        'Science: General science with practical experiment workshops',
        'Social Studies: Indian history, geography, and civic responsibility',
        'Computer & IT foundations with hands-on lab sessions',
      ],
    },
    roman: {
      title: 'Asri / Modern Academic Nisab',
      description: 'National board standards ke mutabiq asri taleem jo bachhon ko future competition ke liye tayyar karti hai.',
      topics: [
        'English speaking, reading comprehension aur creative writing',
        'Mathematics: Arithmetic, geometry, algebra aur reasoning',
        'Science: Practical demonstration aur lab experiments',
        'Social Studies: Geography, civics aur tareekh',
        'Computers: Typing, MS Office aur digital literacy',
      ],
    },
    ur: {
      title: 'عصری و جدید تعلیمی نصاب',
      description: 'قومی تعلیمی معیارات سے ہم آہنگ جدید نصاب جو طلبہ کو مسابقتی دنیا میں سرخرو کرنے کے لیے تیار کرتا ہے۔',
      topics: [
        'روانی کے ساتھ انگریزی بول چال، قواعد اور فہم',
        'ریاضی: بنیادی و توسیعی حساب، الجبرا، جیومیٹری اور استدلال',
        'سائنس: نظریاتی و عملی تجربات کے ساتھ سائنسی آگاہی',
        'سماجی علوم: تاریخ، جغرافیہ اور شہریت کے بنیادی اصول',
        'کمپیوٹر سائنس: بنیادی آپریٹنگ، ٹائپنگ اور معلوماتی ٹیکنالوجی',
      ],
    },
    hi: {
      title: 'आधुनिक अकादमिक पाठ्यक्रम',
      description: 'राष्ट्रीय शैक्षिक मानकों के अनुरूप आधुनिक शिक्षा जो छात्रों को प्रतियोगी भविष्य के लिए सक्षम बनाती है।',
      topics: [
        'धाराप्रवाह अंग्रेजी संभाषण, व्याकरण व रचनात्मक लेखन',
        'गणित: अंकगणित, बीजगणित, ज्यामिति व तार्किक क्षमता',
        'विज्ञान: प्रयोगात्मक अभ्यास व वैज्ञानिक अवधारणाएं',
        'सामाजिक विज्ञान: इतिहास, भूगोल व नागरिक शास्त्र',
        'कंप्यूटर शिक्षा: टाइपिंग, बेसिक सॉफ्टवेयर व डिजिटल कौशल',
      ],
    },
  },
};

export function getLocalizedProgram(prog: ProgramItem, lang: AppLanguage): ProgramItem {
  const loc = PROGRAM_LOCALIZATIONS[prog.id]?.[lang];
  if (!loc) return prog;
  return {
    ...prog,
    name: loc.name,
    classes: loc.classes,
    feeNote: loc.feeNote,
    description: loc.description,
    features: loc.features,
  };
}

export function getLocalizedClass(cls: SchoolClassItem, lang: AppLanguage): SchoolClassItem {
  const loc = CLASS_LOCALIZATIONS[cls.gradeNumber]?.[lang];
  if (!loc) return cls;
  return {
    ...cls,
    name: loc.name,
    description: loc.description,
  };
}

export function getLocalizedFacility(fac: FacilityItem, lang: AppLanguage): FacilityItem {
  const loc = FACILITY_LOCALIZATIONS[fac.id]?.[lang];
  if (!loc) return fac;
  return {
    ...fac,
    title: loc.title,
    description: loc.description,
  };
}

export function getLocalizedSubject(subj: SubjectItem, lang: AppLanguage): SubjectItem {
  const loc = SUBJECT_LOCALIZATIONS[subj.id]?.[lang];
  if (!loc) return subj;
  return {
    ...subj,
    title: loc.title,
    description: loc.description,
  };
}

export function getLocalizedCurriculum(cur: CurriculumItem, lang: AppLanguage): CurriculumItem {
  const loc = CURRICULUM_LOCALIZATIONS[cur.id]?.[lang];
  if (!loc) return cur;
  return {
    ...cur,
    title: loc.title,
    description: loc.description,
    topics: loc.topics,
  };
}

export const HERO_SLIDE_LOCALIZATIONS: Record<string, Record<AppLanguage, { badge: string; title: string; subtitle: string; primaryBtnText: string; secondaryBtnText: string }>> = {
  'slide-1': {
    en: { badge: 'WELCOME TO AL-DAHR ACADEMY', title: 'Start Your Beautiful And Bright Future', subtitle: 'Nurturing sacred Islamic Tarbiyah, Hifz-e-Quran, and modern school academics in Phulwari Sharif, Patna. Enrolling Classes 1 to 8.', primaryBtnText: 'Admission 2025–26', secondaryBtnText: 'Explore Programs' },
    roman: { badge: 'AL-DAHR ACADEMY MEIN KHUSH-AAMDEED', title: 'Apne Bachhe Ka Roshan Aur Shandar Mustaqbil Shuru Karein', subtitle: 'Phulwari Sharif, Patna mein Quran Hifz, Tajweed, Deeni Tarbiyah aur CBSE Level Modern Education. Class 1 se 8 tak Dakhle Shuru.', primaryBtnText: 'Admission 2025–26', secondaryBtnText: 'Programs Dekhein' },
    ur: { badge: 'الداھر اکیڈمی میں خوش آمدید', title: 'اپنے بچوں کا روشن اور شاندار مستقبل شروع کریں', subtitle: 'پھلواری شریف، پٹنہ میں حفظِ قرآن، تجوید، دینی تربیت اور معیاری عصری اسکولنگ۔ کلاس 1 تا 8 کے داخلے جاری ہیں۔', primaryBtnText: 'آن لائن داخلہ 2025–26', secondaryBtnText: 'پروگرامز دیکھیں' },
    hi: { badge: 'अल-दहर एकेडमी में हार्दिक स्वागत है', title: 'अपने बच्चे का उज्ज्वल व सुंदर भविष्य शुरू करें', subtitle: 'फुलवारी शरीफ, पटना में पवित्र कुरआन हिफ़्ज़, तजवीद, दीनी तरबियत व आधुनिक सीबीएसई शिक्षा। कक्षा 1 से 8 में प्रवेश प्रारंभ।', primaryBtnText: 'प्रवेश 2025–26', secondaryBtnText: 'प्रोग्राम देखें' },
  },
  'slide-2': {
    en: { badge: 'ISLAMIC EDUCATION & HIFZ-E-QURAN', title: 'Rooted In The Holy Qur’an, Tajweed & Sunnah', subtitle: 'Experienced certified Asatizah providing step-by-step Quran memorization, Arabic language, and 5-time prayer discipline in our peaceful Musalla.', primaryBtnText: 'Islamic Syllabus', secondaryBtnText: 'Campus Facilities' },
    roman: { badge: 'ISLAMI TALEEM AUR HIFZ-E-QURAN', title: 'Quran-o-Sunnat Aur Tajweed Ki Roshni', subtitle: 'Sanad-yafta Asatiza ki dekhbhal mein Quran Hifz, Arabic zaban aur 5 waqt ki ba-jamaat namaz ki tarbiyah.', primaryBtnText: 'Islami Nisab', secondaryBtnText: 'Campus Sahuliyat' },
    ur: { badge: 'اسلامی تعلیم اور حفظِ قرآن کریم', title: 'قرآن و سنت، تجوید اور اخلاقی تربیت کا مرکز', subtitle: 'سند یافتہ اساتذہ کی زیر نگرانی حفظِ قرآن، عربی زبان اور پانچوں وقت کی باجماعت نماز کا باضابطہ اہتمام۔', primaryBtnText: 'اسلامی نصاب', secondaryBtnText: 'کیمپس سہولیات' },
    hi: { badge: 'इस्लामिक शिक्षा व हिफ़्ज़-ए-कुरआन', title: 'पवित्र कुरआन, तजवीद व सुन्नत पर आधारित शिक्षा', subtitle: 'प्रमाणित हाफ़िज़ शिक्षकों की देखरेख में कुरआन हिफ़्ज़, अरबी भाषा व 5 समय की बाज़मात नमाज़ का प्रशिक्षण।', primaryBtnText: 'इस्लामिक पाठ्यक्रम', secondaryBtnText: 'कैंपस सुविधाएं' },
  },
  'slide-3': {
    en: { badge: 'MODERN EDUCATION & SCIENTIFIC TEMPER', title: 'Equipping Young Minds With English, Science & Math', subtitle: 'Comprehensive CBSE-standard academic curriculum, spoken English workshops, computer technology, and smart classroom pedagogy for grades 1 to 8.', primaryBtnText: 'View Academic Subjects', secondaryBtnText: 'Fee Calculator' },
    roman: { badge: 'MODERN TALEEM AUR SCIENCE', title: 'English, Science Aur Maths Mein Aala Kamyaabi', subtitle: 'CBSE standard school syllabus, Spoken English, Computer technology aur smart classrooms class 1 se 8 tak.', primaryBtnText: 'Subjects Dekhein', secondaryBtnText: 'Fee Calculator' },
    ur: { badge: 'جدید عصری تعلیم و سائنسی علوم', title: 'انگریزی، سائنس اور ریاضی میں اعلیٰ تعلیمی معیار', subtitle: 'سی بی ایس ای نصاب کے مطابق عصری اسکولنگ، اسپوکن انگلش، کمپیوٹر اور اسمارٹ کلاس رومز درجہ اول تا ہشتم۔', primaryBtnText: 'تعلیمی مضامین دیکھیں', secondaryBtnText: 'فیس کیلکولیٹر' },
    hi: { badge: 'आधुनिक शिक्षा व वैज्ञानिक दृष्टिकोण', title: 'अंग्रेजी, गणित व विज्ञान में उच्च कोटि की दक्षता', subtitle: 'सीबीएसई मानक पाठ्यक्रम, स्पोकन इंग्लिश वर्कशॉप, कंप्यूटर तकनीक व स्मार्ट क्लासरूम शिक्षण कक्षा 1 से 8 तक।', primaryBtnText: 'विषय देखें', secondaryBtnText: 'फीस कैलकुलेटर' },
  },
  'slide-4': {
    en: { badge: 'HOLISTIC RESIDENTIAL BOARDING', title: 'A Safe, Disciplined & Loving Campus Home', subtitle: '24/7 dedicated mentors, clean hygienic dormitories, nutritious halal dining, Tahajjud awakenings, and regular evening sports activities.', primaryBtnText: 'Apply For Residential', secondaryBtnText: 'Contact Office' },
    roman: { badge: 'RESIDENTIAL HOSTEL SAHULAT', title: 'Mehfooz, Ba-Zabt Aur Shafiq Boarding Home', subtitle: '24 ghante asatiza ki dekhbhal, saaf suthra hostel, lazeez halal khana, Tahajjud aur sham ke sports.', primaryBtnText: 'Hostel Admission Form', secondaryBtnText: 'Rabta Karein' },
    ur: { badge: 'مکمل اقامتی ہاسٹل سہولت', title: 'محفوظ، باضابطہ اور شفقت سے بھرپور تعلیمی گھر', subtitle: '24 گھنٹے اساتذہ کی سرپرستی، صاف ستھرا ہاسٹل، غذائیت سے بھرپور حلال کھانا، تہجد کا اہتمام اور شام کے کھیل۔', primaryBtnText: 'اقامتی داخلہ فارم', secondaryBtnText: 'دفتر سے رابطہ کریں' },
    hi: { badge: 'संपूर्ण आवासीय छात्रावास (हॉस्टल)', title: 'सुरक्षित, अनुशासित व स्नेही कैंपस वातावरण', subtitle: '24 घंटे शिक्षकों का मार्गदर्शन, स्वच्छ हॉस्टल, पौष्टिक हलाल भोजन, तहज्जुद का अभ्यास व शाम के खेलकूद।', primaryBtnText: 'आवासीय प्रवेश फॉर्म', secondaryBtnText: 'कार्यालय से संपर्क' },
  },
};

export function getLocalizedHeroSlide(slide: HeroSlideItem, lang: AppLanguage): HeroSlideItem {
  const loc = HERO_SLIDE_LOCALIZATIONS[slide.id]?.[lang];
  if (!loc) return slide;
  return {
    ...slide,
    badge: loc.badge,
    title: loc.title,
    subtitle: loc.subtitle,
    primaryBtnText: loc.primaryBtnText,
    secondaryBtnText: loc.secondaryBtnText,
  };
}
