export type ProgramCode = 'residential' | 'full-time' | 'short-time' | string;

export interface ProgramItem {
  id: string;
  name: string;
  code: ProgramCode;
  description: string;
  classes: string;
  feeNote: string;
  features: string[];
  imageUrl: string;
  iconName: string;
  order: number;
  active: boolean;
}

export interface SchoolClassItem {
  id: string;
  name: string;
  gradeNumber: number;
  description: string;
  islamicCurriculum: string;
  modernCurriculum: string;
  subjects: string[];
  activities: string[];
  feeResidential: number;
  feeFullTime: number;
  feeShortTime: number;
  imageUrl?: string;
  active: boolean;
}

export interface FeeItemLine {
  id: string;
  label: string;
  amount: number;
  isOneTime: boolean;
  isRequired: boolean;
  description?: string;
}

export interface AdmissionFeeConfig {
  admissionFee: number;
  monthlyFee: number;
  dressFee: number;
  booksFee: number;
  additionalItems: FeeItemLine[];
  note: string;
}

export interface SubjectItem {
  id: string;
  title: string;
  type: 'islamic' | 'modern';
  description: string;
  iconName: string;
  imageUrl?: string;
  order: number;
}

export interface CurriculumItem {
  id: string;
  title: string;
  category: 'islamic' | 'modern' | 'character' | 'activity' | 'development';
  description: string;
  topics: string[];
  order: number;
}

export interface FacilityItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  imageUrl: string;
  order: number;
}

export interface GalleryMediaItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
  isFeatured: boolean;
  order: number;
}

export interface VideoMediaItem {
  id: string;
  title: string;
  type: 'youtube' | 'shorts' | 'instagram';
  url: string;
  videoId?: string;
  thumbnail?: string;
  description: string;
  category: string;
  isFeatured: boolean;
  active: boolean;
  order: number;
  date?: string;
}

export interface HeroSlideItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  primaryBtnText?: string;
  primaryBtnAction?: 'admission' | 'calculator' | 'contact' | 'classes' | 'programs';
  secondaryBtnText?: string;
  secondaryBtnAction?: 'about' | 'facilities' | 'programs' | 'contact' | 'calculator';
  active: boolean;
  order: number;
}

export interface VoiceKnowledgeItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: 'general' | 'admissions' | 'fees' | 'hostel' | 'syllabus' | 'contacts' | 'notice';
  active: boolean;
  createdAt?: string;
}

export interface AdmissionEnquiry {
  id: string;
  parentName: string;
  studentName: string;
  mobileNumber: string;
  whatsappNumber: string;
  studentClass: string;
  program: string;
  message: string;
  status: 'new' | 'contacted' | 'interested' | 'completed' | 'cancelled';
  createdAt: string;
  googleMeetLink?: string;
  userId?: string;
  userEmail?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface WebsiteSettings {
  academyName: string;
  subtitle: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  logoUrl: string;
  faviconUrl: string;
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  admissionOpen: boolean;
  admissionButtonText: string;
  announcement: string;
  showAnnouncement: boolean;
  footerText: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  primaryColorHex: string;
  secondaryColorHex: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export type PageRoute =
  | 'home'
  | 'about'
  | 'islamic-education'
  | 'modern-education'
  | 'residential-program'
  | 'full-time-program'
  | 'short-time-program'
  | 'classes'
  | 'fee-structure'
  | 'admission'
  | 'facilities'
  | 'curriculum'
  | 'student-life'
  | 'gallery'
  | 'videos'
  | 'youtube-shorts'
  | 'instagram-videos'
  | 'contact'
  | 'admission-enquiry'
  | 'privacy-policy'
  | 'terms-conditions'
  | 'admin';
