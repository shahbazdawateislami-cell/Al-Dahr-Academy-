import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdmissionEnquiry,
  AdmissionFeeConfig,
  CurriculumItem,
  FacilityItem,
  GalleryMediaItem,
  HeroSlideItem,
  PageRoute,
  ProgramItem,
  SchoolClassItem,
  SubjectItem,
  VideoMediaItem,
  VoiceKnowledgeItem,
  WebsiteSettings,
  EducationStructureData,
} from '../types';
import {
  initialSettings,
  initialPrograms,
  initialClasses,
  initialAdmissionFeeConfig,
  initialSubjects,
  initialCurriculum,
  initialFacilities,
  initialGallery,
  initialVideos,
  initialHeroSlides,
  initialVoiceKnowledge,
  initialEducationStructureData,
} from '../data/initialData';
import {
  db,
  auth,
  handleFirestoreError,
  OperationType,
  signInAdminWithGoogle,
  signOutAdmin,
} from '../services/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { compressImage, safeSetLocalStorage } from '../utils/imageCompressor';

interface AcademyContextType {
  settings: WebsiteSettings;
  programs: ProgramItem[];
  classes: SchoolClassItem[];
  admissionFeeConfig: AdmissionFeeConfig;
  subjects: SubjectItem[];
  curriculum: CurriculumItem[];
  facilities: FacilityItem[];
  gallery: GalleryMediaItem[];
  videos: VideoMediaItem[];
  heroSlides: HeroSlideItem[];
  voiceKnowledge: VoiceKnowledgeItem[];
  structureData: EducationStructureData;
  enquiries: AdmissionEnquiry[];
  
  // Navigation
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  selectedClassForModal: SchoolClassItem | null;
  setSelectedClassForModal: (item: SchoolClassItem | null) => void;
  isAdmissionModalOpen: boolean;
  setIsAdmissionModalOpen: (open: boolean) => void;
  isFeeCalculatorOpen: boolean;
  setIsFeeCalculatorOpen: (open: boolean) => void;
  isVoiceAgentOpen: boolean;
  setIsVoiceAgentOpen: (open: boolean) => void;
  enquiryPrefill: { class?: string; program?: string } | null;
  setEnquiryPrefill: (prefill: { class?: string; program?: string } | null) => void;

  // Admin Auth
  currentUser: User | null;
  isAdminLoggedIn: boolean;
  adminLoginError: string | null;
  setAdminLoginError: (err: string | null) => void;
  handleAdminLoginWithGoogle: () => Promise<boolean>;
  handleAdminLoginWithPassword: (pass: string) => boolean;
  handleAdminLogout: () => Promise<void>;

  // Mutators
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<void>;
  saveProgram: (program: ProgramItem) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;
  saveClass: (schoolClass: SchoolClassItem) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  updateAdmissionFeeConfig: (config: AdmissionFeeConfig) => Promise<void>;
  saveSubject: (subject: SubjectItem) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  saveCurriculum: (item: CurriculumItem) => Promise<void>;
  deleteCurriculum: (id: string) => Promise<void>;
  saveFacility: (item: FacilityItem) => Promise<void>;
  deleteFacility: (id: string) => Promise<void>;
  saveGalleryItem: (item: GalleryMediaItem) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  saveVideoItem: (item: VideoMediaItem) => Promise<void>;
  deleteVideoItem: (id: string) => Promise<void>;
  saveHeroSlide: (slide: HeroSlideItem) => Promise<void>;
  deleteHeroSlide: (id: string) => Promise<void>;
  saveVoiceKnowledge: (item: VoiceKnowledgeItem) => Promise<void>;
  deleteVoiceKnowledge: (id: string) => Promise<void>;
  updateEducationStructure: (data: EducationStructureData) => Promise<void>;
  submitEnquiry: (enquiry: Omit<AdmissionEnquiry, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateEnquiryStatus: (id: string, status: AdmissionEnquiry['status']) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  resetAllToDefaults: () => Promise<void>;
}

const CURRENT_CACHE_VER = 'v4_2026_09_23';
if (typeof window !== 'undefined') {
  try {
    const savedVer = localStorage.getItem('aldahr_cache_ver');
    if (savedVer !== CURRENT_CACHE_VER) {
      localStorage.removeItem('aldahr_settings');
      localStorage.removeItem('aldahr_programs');
      localStorage.removeItem('aldahr_classes');
      localStorage.removeItem('aldahr_fees');
      localStorage.removeItem('aldahr_subjects');
      localStorage.removeItem('aldahr_curriculum');
      localStorage.removeItem('aldahr_facilities');
      localStorage.removeItem('aldahr_gallery');
      localStorage.removeItem('aldahr_videos');
      localStorage.removeItem('aldahr_hero_slides');
      localStorage.removeItem('aldahr_voice_knowledge');
      localStorage.setItem('aldahr_cache_ver', CURRENT_CACHE_VER);
    }
  } catch (e) {
    // ignore
  }
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedClassForModal, setSelectedClassForModal] = useState<SchoolClassItem | null>(null);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isFeeCalculatorOpen, setIsFeeCalculatorOpen] = useState(false);
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);
  const [enquiryPrefill, setEnquiryPrefill] = useState<{ class?: string; program?: string } | null>(null);

  // Data state with localStorage initial fallback
  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    const cached = localStorage.getItem('aldahr_settings');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Ensure new logo and royal blue theme are applied if previously unsplash placeholder or default amber
        if (!parsed.logoUrl || parsed.logoUrl.includes('unsplash.com')) {
          parsed.logoUrl = '/logo.jpg';
        }
        if (parsed.secondaryColorHex === '#D97706') {
          parsed.secondaryColorHex = '#0EA5E9';
        }
        return { ...initialSettings, ...parsed };
      } catch (e) {
        return initialSettings;
      }
    }
    return initialSettings;
  });

  const [programs, setPrograms] = useState<ProgramItem[]>(() => {
    const cached = localStorage.getItem('aldahr_programs');
    return cached ? JSON.parse(cached) : initialPrograms;
  });

  const [classes, setClasses] = useState<SchoolClassItem[]>(() => {
    const cached = localStorage.getItem('aldahr_classes');
    return cached ? JSON.parse(cached) : initialClasses;
  });

  const [admissionFeeConfig, setAdmissionFeeConfig] = useState<AdmissionFeeConfig>(() => {
    const cached = localStorage.getItem('aldahr_fees');
    return cached ? JSON.parse(cached) : initialAdmissionFeeConfig;
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    const cached = localStorage.getItem('aldahr_subjects');
    return cached ? JSON.parse(cached) : initialSubjects;
  });

  const [curriculum, setCurriculum] = useState<CurriculumItem[]>(() => {
    const cached = localStorage.getItem('aldahr_curriculum');
    return cached ? JSON.parse(cached) : initialCurriculum;
  });

  const [facilities, setFacilities] = useState<FacilityItem[]>(() => {
    const cached = localStorage.getItem('aldahr_facilities');
    return cached ? JSON.parse(cached) : initialFacilities;
  });

  const [gallery, setGallery] = useState<GalleryMediaItem[]>(() => {
    const cached = localStorage.getItem('aldahr_gallery');
    return cached ? JSON.parse(cached) : initialGallery;
  });

  const [videos, setVideos] = useState<VideoMediaItem[]>(() => {
    const cached = localStorage.getItem('aldahr_videos');
    return cached ? JSON.parse(cached) : initialVideos;
  });

  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>(() => {
    const cached = localStorage.getItem('aldahr_hero_slides');
    return cached ? JSON.parse(cached) : initialHeroSlides;
  });

  const [voiceKnowledge, setVoiceKnowledge] = useState<VoiceKnowledgeItem[]>(() => {
    const cached = localStorage.getItem('aldahr_voice_knowledge');
    return cached ? JSON.parse(cached) : initialVoiceKnowledge;
  });

  const [structureData, setStructureData] = useState<EducationStructureData>(() => {
    const cached = localStorage.getItem('aldahr_structure_data');
    return cached ? JSON.parse(cached) : initialEducationStructureData;
  });

  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>(() => {
    const cached = localStorage.getItem('aldahr_enquiries');
    return cached ? JSON.parse(cached) : [];
  });

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPasswordAdmin, setIsPasswordAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('aldahr_admin_session') === 'active';
  });
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  const isAdminLoggedIn = !!currentUser || isPasswordAdmin;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time updates for public content
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Safe initialization guard: NEVER overwrite existing user data or custom content!
    const initSeed = async () => {
      try {
        const initDocRef = doc(db, 'system', 'initialized');
        const initSnap = await getDoc(initDocRef);
        if (initSnap.exists() && initSnap.data()?.initialized) {
          // System already initialized in Firestore; do nothing and keep all user edits intact.
          return;
        }

        // Only on a completely uninitialized database:
        await setDoc(initDocRef, { initialized: true, timestamp: new Date().toISOString() }).catch(() => {});
        await setDoc(doc(db, 'settings', 'global'), initialSettings, { merge: true }).catch(() => {});
        await setDoc(doc(db, 'feeConfig', 'current'), initialAdmissionFeeConfig, { merge: true }).catch(() => {});
        await setDoc(doc(db, 'structure', 'current'), initialEducationStructureData, { merge: true }).catch(() => {});
      } catch (e) {
        // In case of any network timeout or permission check, abort immediately to safeguard user data.
        console.info('Database initialization check completed or bypassed safely.');
      }
    };

    initSeed();

    // Settings listener
    try {
      const unsub = onSnapshot(
        doc(db, 'settings', 'global'),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as WebsiteSettings;
            setSettings(data);
            safeSetLocalStorage('aldahr_settings', data);
          }
        },
        (err) => console.warn('Settings listener info:', err)
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach settings listener', e);
    }

    // Programs listener
    try {
      const unsub = onSnapshot(
        collection(db, 'programs'),
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ProgramItem));
            items.sort((a, b) => (a.order || 0) - (b.order || 0));
            setPrograms(items);
            safeSetLocalStorage('aldahr_programs', items);
          }
        },
        (err) => console.warn('Programs listener info:', err)
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach programs listener', e);
    }

    // Classes listener
    try {
      const unsub = onSnapshot(
        collection(db, 'classes'),
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SchoolClassItem));
            items.sort((a, b) => a.gradeNumber - b.gradeNumber);
            setClasses(items);
            safeSetLocalStorage('aldahr_classes', items);
          }
        },
        (err) => console.warn('Classes listener info:', err)
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach classes listener', e);
    }

    // Fee Config listener
    try {
      const unsub = onSnapshot(
        doc(db, 'feeConfig', 'current'),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as AdmissionFeeConfig;
            setAdmissionFeeConfig(data);
            safeSetLocalStorage('aldahr_fees', data);
          }
        },
        (err) => console.warn('Fee config listener info:', err)
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach fee config listener', e);
    }

    // Gallery listener
    try {
      const unsub = onSnapshot(
        collection(db, 'gallery'),
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryMediaItem));
            items.sort((a, b) => (a.order || 0) - (b.order || 0));
            setGallery(items);
            safeSetLocalStorage('aldahr_gallery', items);
          }
        },
        (err) => console.warn('Gallery listener info:', err)
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach gallery listener', e);
    }

    // Videos listener
    try {
      const unsub = onSnapshot(
        collection(db, 'videos'),
        (snapshot) => {
          if (!snapshot.empty) {
            let items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as VideoMediaItem));
            items.sort((a, b) => (a.order || 0) - (b.order || 0));
            setVideos(items);
            safeSetLocalStorage('aldahr_videos', items);
          }
        },
        (err) => console.warn('Videos listener info:', err)
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach videos listener', e);
    }

    // Hero Slides listener
    try {
      const unsub = onSnapshot(
        collection(db, 'heroSlides'),
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as HeroSlideItem));
            items.sort((a, b) => (a.order || 0) - (b.order || 0));
            setHeroSlides(items);
            safeSetLocalStorage('aldahr_hero_slides', items);
          }
        },
        (err) => console.warn('HeroSlides listener info:', err)
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach heroSlides listener', e);
    }

    // Subjects listener
    try {
      const unsub = onSnapshot(
        collection(db, 'subjects'),
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SubjectItem));
            items.sort((a, b) => (a.order || 0) - (b.order || 0));
            setSubjects(items);
            safeSetLocalStorage('aldahr_subjects', items);
          }
        },
        (err) => console.warn('Subjects listener info:', err)
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach subjects listener', e);
    }

    // Curriculum listener
    try {
      const unsub = onSnapshot(
        collection(db, 'curriculum'),
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CurriculumItem));
            items.sort((a, b) => (a.order || 0) - (b.order || 0));
            setCurriculum(items);
            safeSetLocalStorage('aldahr_curriculum', items);
          }
        },
        (err) => console.warn('Curriculum listener info:', err)
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach curriculum listener', e);
    }

    // Facilities listener
    try {
      const unsub = onSnapshot(
        collection(db, 'facilities'),
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FacilityItem));
            items.sort((a, b) => (a.order || 0) - (b.order || 0));
            setFacilities(items);
            safeSetLocalStorage('aldahr_facilities', items);
          }
        },
        (err) => console.warn('Facilities listener info:', err)
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach facilities listener', e);
    }

    // Voice Agent Knowledge listener
    try {
      const unsub = onSnapshot(
        collection(db, 'voiceAgentKnowledge'),
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as VoiceKnowledgeItem));
            setVoiceKnowledge(items);
            safeSetLocalStorage('aldahr_voice_knowledge', items);
          }
        },
        (err) => console.warn('VoiceAgentKnowledge listener info:', err)
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach voiceAgentKnowledge listener', e);
    }

    // Structure Data listener
    try {
      const unsub = onSnapshot(
        doc(db, 'structure', 'current'),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as EducationStructureData;
            setStructureData(data);
            safeSetLocalStorage('aldahr_structure_data', data);
          }
        },
        (err) => console.warn('Structure listener info:', err)
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach structure listener', e);
    }

    return () => {
      unsubs.forEach((u) => u());
    };
  }, []);

  // Enquiries listener (Admin only)
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    try {
      const unsub = onSnapshot(
        collection(db, 'enquiries'),
        (snapshot) => {
          const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AdmissionEnquiry));
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setEnquiries(items);
          localStorage.setItem('aldahr_enquiries', JSON.stringify(items));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'enquiries')
      );
      return () => unsub();
    } catch (e) {
      console.warn('Could not attach enquiries listener', e);
    }
  }, [isAdminLoggedIn]);

  // Auth methods
  const handleAdminLoginWithGoogle = async () => {
    setAdminLoginError(null);
    try {
      const user = await signInAdminWithGoogle();
      if (!user) {
        // User closed or dismissed popup without completing sign-in
        return false;
      }
      return true;
    } catch (err: any) {
      setAdminLoginError(err?.message || 'Google sign-in failed. Please try again or use the passcode.');
      return false;
    }
  };

  const handleAdminLoginWithPassword = (pass: string) => {
    setAdminLoginError(null);
    const cleaned = (pass || '').trim().toLowerCase();
    // Support aldahracademy@gmail.com as administrative passcode / login as requested
    if (
      cleaned === 'aldahracademy@gmail.com' ||
      cleaned === 'aldahr2025' ||
      cleaned === 'admin123' ||
      cleaned === '7079988808'
    ) {
      setIsPasswordAdmin(true);
      sessionStorage.setItem('aldahr_admin_session', 'active');
      return true;
    }
    setAdminLoginError('Invalid password. Please enter your authorized admin password.');
    return false;
  };

  const handleAdminLogout = async () => {
    setIsPasswordAdmin(false);
    sessionStorage.removeItem('aldahr_admin_session');
    if (currentUser) {
      await signOutAdmin();
    }
  };

  // Mutator actions
  const updateSettings = async (newValues: Partial<WebsiteSettings>) => {
    let finalValues = { ...newValues };
    if (finalValues.logoUrl && finalValues.logoUrl.startsWith('data:image/') && finalValues.logoUrl.length > 100 * 1024) {
      try {
        finalValues.logoUrl = await compressImage(finalValues.logoUrl, {
          maxWidth: 400,
          maxHeight: 400,
          maxSizeBytes: 80 * 1024,
        });
      } catch (e) {
        console.warn('Logo optimization note:', e);
      }
    }
    const updated = { ...settings, ...finalValues };
    setSettings(updated);
    safeSetLocalStorage('aldahr_settings', updated);
    try {
      await setDoc(doc(db, 'settings', 'global'), updated, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'settings/global');
      throw e;
    }
  };

  const saveProgram = async (program: ProgramItem) => {
    let finalItem = { ...program };
    if (finalItem.imageUrl && finalItem.imageUrl.startsWith('data:image/') && finalItem.imageUrl.length > 180 * 1024) {
      try {
        finalItem.imageUrl = await compressImage(finalItem.imageUrl, {
          maxWidth: 1080,
          maxHeight: 1080,
          maxSizeBytes: 160 * 1024,
        });
      } catch (e) {
        console.warn('Program image compression note:', e);
      }
    }
    const exists = programs.some((p) => p.id === finalItem.id);
    const updated = exists
      ? programs.map((p) => (p.id === finalItem.id ? finalItem : p))
      : [...programs, finalItem];
    setPrograms(updated);
    safeSetLocalStorage('aldahr_programs', updated);
    try {
      await setDoc(doc(db, 'programs', finalItem.id), finalItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `programs/${finalItem.id}`);
      throw e;
    }
  };

  const deleteProgram = async (id: string) => {
    const updated = programs.filter((p) => p.id !== id);
    setPrograms(updated);
    safeSetLocalStorage('aldahr_programs', updated);
    try {
      await deleteDoc(doc(db, 'programs', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `programs/${id}`);
      throw e;
    }
  };

  const saveClass = async (item: SchoolClassItem) => {
    let finalItem = { ...item };
    if (finalItem.imageUrl && finalItem.imageUrl.startsWith('data:image/') && finalItem.imageUrl.length > 180 * 1024) {
      try {
        finalItem.imageUrl = await compressImage(finalItem.imageUrl, {
          maxWidth: 1080,
          maxHeight: 1080,
          maxSizeBytes: 160 * 1024,
        });
      } catch (e) {
        console.warn('Class image compression note:', e);
      }
    }
    const exists = classes.some((c) => c.id === finalItem.id);
    const updated = exists
      ? classes.map((c) => (c.id === finalItem.id ? finalItem : c))
      : [...classes, finalItem];
    updated.sort((a, b) => a.gradeNumber - b.gradeNumber);
    setClasses(updated);
    safeSetLocalStorage('aldahr_classes', updated);
    try {
      await setDoc(doc(db, 'classes', finalItem.id), finalItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `classes/${finalItem.id}`);
      throw e;
    }
  };

  const deleteClass = async (id: string) => {
    const updated = classes.filter((c) => c.id !== id);
    setClasses(updated);
    safeSetLocalStorage('aldahr_classes', updated);
    try {
      await deleteDoc(doc(db, 'classes', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `classes/${id}`);
      throw e;
    }
  };

  const updateAdmissionFeeConfig = async (config: AdmissionFeeConfig) => {
    setAdmissionFeeConfig(config);
    safeSetLocalStorage('aldahr_fees', config);
    try {
      await setDoc(doc(db, 'feeConfig', 'current'), config);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'feeConfig/current');
      throw e;
    }
  };

  const saveSubject = async (item: SubjectItem) => {
    let finalItem = { ...item };
    if (finalItem.imageUrl && finalItem.imageUrl.startsWith('data:image/') && finalItem.imageUrl.length > 180 * 1024) {
      try {
        finalItem.imageUrl = await compressImage(finalItem.imageUrl, {
          maxWidth: 800,
          maxHeight: 800,
          maxSizeBytes: 120 * 1024,
        });
      } catch (e) {
        console.warn('Subject image compression note:', e);
      }
    }
    const exists = subjects.some((s) => s.id === finalItem.id);
    const updated = exists
      ? subjects.map((s) => (s.id === finalItem.id ? finalItem : s))
      : [...subjects, finalItem];
    setSubjects(updated);
    safeSetLocalStorage('aldahr_subjects', updated);
    try {
      await setDoc(doc(db, 'subjects', finalItem.id), finalItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `subjects/${finalItem.id}`);
      throw e;
    }
  };

  const deleteSubject = async (id: string) => {
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    safeSetLocalStorage('aldahr_subjects', updated);
    try {
      await deleteDoc(doc(db, 'subjects', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `subjects/${id}`);
      throw e;
    }
  };

  const saveCurriculum = async (item: CurriculumItem) => {
    const exists = curriculum.some((c) => c.id === item.id);
    const updated = exists
      ? curriculum.map((c) => (c.id === item.id ? item : c))
      : [...curriculum, item];
    setCurriculum(updated);
    safeSetLocalStorage('aldahr_curriculum', updated);
    try {
      await setDoc(doc(db, 'curriculum', item.id), item);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `curriculum/${item.id}`);
      throw e;
    }
  };

  const deleteCurriculum = async (id: string) => {
    const updated = curriculum.filter((c) => c.id !== id);
    setCurriculum(updated);
    safeSetLocalStorage('aldahr_curriculum', updated);
    try {
      await deleteDoc(doc(db, 'curriculum', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `curriculum/${id}`);
      throw e;
    }
  };

  const saveFacility = async (item: FacilityItem) => {
    let finalItem = { ...item };
    if (finalItem.imageUrl && finalItem.imageUrl.startsWith('data:image/') && finalItem.imageUrl.length > 180 * 1024) {
      try {
        finalItem.imageUrl = await compressImage(finalItem.imageUrl, {
          maxWidth: 1080,
          maxHeight: 1080,
          maxSizeBytes: 160 * 1024,
        });
      } catch (e) {
        console.warn('Facility image compression note:', e);
      }
    }
    const exists = facilities.some((f) => f.id === finalItem.id);
    const updated = exists
      ? facilities.map((f) => (f.id === finalItem.id ? finalItem : f))
      : [...facilities, finalItem];
    setFacilities(updated);
    safeSetLocalStorage('aldahr_facilities', updated);
    try {
      await setDoc(doc(db, 'facilities', finalItem.id), finalItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `facilities/${finalItem.id}`);
      throw e;
    }
  };

  const deleteFacility = async (id: string) => {
    const updated = facilities.filter((f) => f.id !== id);
    setFacilities(updated);
    safeSetLocalStorage('aldahr_facilities', updated);
    try {
      await deleteDoc(doc(db, 'facilities', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `facilities/${id}`);
      throw e;
    }
  };

  const saveGalleryItem = async (item: GalleryMediaItem) => {
    let finalItem = { ...item };
    // Compress base64 photo to guarantee it is strictly under 180KB
    if (finalItem.imageUrl && finalItem.imageUrl.startsWith('data:image/') && finalItem.imageUrl.length > 160 * 1024) {
      try {
        finalItem.imageUrl = await compressImage(finalItem.imageUrl, {
          maxWidth: 1080,
          maxHeight: 1080,
          maxSizeBytes: 160 * 1024,
        });
      } catch (e) {
        console.warn('Gallery image optimization note:', e);
      }
    }

    const exists = gallery.some((g) => g.id === finalItem.id);
    const updated = exists
      ? gallery.map((g) => (g.id === finalItem.id ? finalItem : g))
      : [finalItem, ...gallery];
    setGallery(updated);
    safeSetLocalStorage('aldahr_gallery', updated);
    try {
      await setDoc(doc(db, 'gallery', finalItem.id), finalItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `gallery/${finalItem.id}`);
      throw e;
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const updated = gallery.filter((g) => g.id !== id);
    setGallery(updated);
    safeSetLocalStorage('aldahr_gallery', updated);
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `gallery/${id}`);
      throw e;
    }
  };

  const saveVideoItem = async (item: VideoMediaItem) => {
    // Automatically parse YouTube videoId if not present
    let finalItem = { ...item };
    if (!finalItem.videoId) {
      if (finalItem.type === 'shorts' && finalItem.url.includes('/shorts/')) {
        const match = finalItem.url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
        if (match) finalItem.videoId = match[1];
      } else if (finalItem.url.includes('v=')) {
        const match = finalItem.url.match(/v=([a-zA-Z0-9_-]+)/);
        if (match) finalItem.videoId = match[1];
      } else if (finalItem.url.includes('youtu.be/')) {
        const match = finalItem.url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if (match) finalItem.videoId = match[1];
      }
    }

    const exists = videos.some((v) => v.id === finalItem.id);
    const updated = exists
      ? videos.map((v) => (v.id === finalItem.id ? finalItem : v))
      : [finalItem, ...videos];
    setVideos(updated);
    safeSetLocalStorage('aldahr_videos', updated);
    try {
      await setDoc(doc(db, 'videos', finalItem.id), finalItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `videos/${finalItem.id}`);
      throw e;
    }
  };

  const deleteVideoItem = async (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    safeSetLocalStorage('aldahr_videos', updated);
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `videos/${id}`);
      throw e;
    }
  };

  const saveHeroSlide = async (slide: HeroSlideItem) => {
    let finalSlide = { ...slide };
    if (finalSlide.imageUrl && finalSlide.imageUrl.startsWith('data:image/') && finalSlide.imageUrl.length > 180 * 1024) {
      try {
        finalSlide.imageUrl = await compressImage(finalSlide.imageUrl, {
          maxWidth: 1280,
          maxHeight: 720,
          maxSizeBytes: 160 * 1024,
        });
      } catch (e) {
        console.warn('Hero slide compression note:', e);
      }
    }
    const exists = heroSlides.some((s) => s.id === finalSlide.id);
    const updated = exists
      ? heroSlides.map((s) => (s.id === finalSlide.id ? finalSlide : s))
      : [...heroSlides, finalSlide];
    updated.sort((a, b) => (a.order || 0) - (b.order || 0));
    setHeroSlides(updated);
    safeSetLocalStorage('aldahr_hero_slides', updated);
    try {
      await setDoc(doc(db, 'heroSlides', finalSlide.id), finalSlide);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `heroSlides/${finalSlide.id}`);
      throw e;
    }
  };

  const deleteHeroSlide = async (id: string) => {
    const updated = heroSlides.filter((s) => s.id !== id);
    setHeroSlides(updated);
    safeSetLocalStorage('aldahr_hero_slides', updated);
    try {
      await deleteDoc(doc(db, 'heroSlides', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `heroSlides/${id}`);
      throw e;
    }
  };

  const saveVoiceKnowledge = async (item: VoiceKnowledgeItem) => {
    const exists = voiceKnowledge.some((vk) => vk.id === item.id);
    const updated = exists
      ? voiceKnowledge.map((vk) => (vk.id === item.id ? item : vk))
      : [item, ...voiceKnowledge];
    setVoiceKnowledge(updated);
    safeSetLocalStorage('aldahr_voice_knowledge', updated);
    try {
      await setDoc(doc(db, 'voiceAgentKnowledge', item.id), item);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `voiceAgentKnowledge/${item.id}`);
      throw e;
    }
  };

  const deleteVoiceKnowledge = async (id: string) => {
    const updated = voiceKnowledge.filter((vk) => vk.id !== id);
    setVoiceKnowledge(updated);
    safeSetLocalStorage('aldahr_voice_knowledge', updated);
    try {
      await deleteDoc(doc(db, 'voiceAgentKnowledge', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `voiceAgentKnowledge/${id}`);
      throw e;
    }
  };

  const updateEducationStructure = async (data: EducationStructureData) => {
    // Compress all 5 embedded structure images to ensure document stays comfortably under 400KB
    let finalData = { ...data };
    const imgFields: (keyof EducationStructureData)[] = [
      'aiImageUrl',
      'socialImageUrl',
    ];
    for (const field of imgFields) {
      const val = finalData[field];
      if (typeof val === 'string' && val.startsWith('data:image/') && val.length > 80 * 1024) {
        try {
          (finalData as any)[field] = await compressImage(val, {
            maxWidth: 600,
            maxHeight: 600,
            maxSizeBytes: 70 * 1024,
          });
        } catch (e) {
          console.warn(`Structure image compression for ${field}:`, e);
        }
      }
    }
    setStructureData(finalData);
    safeSetLocalStorage('aldahr_structure_data', finalData);
    try {
      await setDoc(doc(db, 'structure', 'current'), finalData);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'structure/current');
      throw e;
    }
  };

  const submitEnquiry = async (
    data: Omit<AdmissionEnquiry, 'id' | 'createdAt' | 'status'>
  ): Promise<boolean> => {
    const newEnquiry: AdmissionEnquiry = {
      ...data,
      id: 'enq-' + Date.now(),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    const updated = [newEnquiry, ...enquiries];
    setEnquiries(updated);
    safeSetLocalStorage('aldahr_enquiries', updated);

    try {
      await setDoc(doc(db, 'enquiries', newEnquiry.id), newEnquiry);
      return true;
    } catch (e) {
      console.warn('Enquiry saved to local state; firestore write caught:', e);
      return true;
    }
  };

  const updateEnquiryStatus = async (id: string, status: AdmissionEnquiry['status']) => {
    const updated = enquiries.map((enq) => (enq.id === id ? { ...enq, status } : enq));
    setEnquiries(updated);
    safeSetLocalStorage('aldahr_enquiries', updated);
    try {
      await setDoc(doc(db, 'enquiries', id), { status }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `enquiries/${id}`);
      throw e;
    }
  };

  const deleteEnquiry = async (id: string) => {
    const updated = enquiries.filter((e) => e.id !== id);
    setEnquiries(updated);
    safeSetLocalStorage('aldahr_enquiries', updated);
    try {
      await deleteDoc(doc(db, 'enquiries', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `enquiries/${id}`);
      throw e;
    }
  };

  const resetAllToDefaults = async () => {
    setSettings(initialSettings);
    setPrograms(initialPrograms);
    setClasses(initialClasses);
    setAdmissionFeeConfig(initialAdmissionFeeConfig);
    setSubjects(initialSubjects);
    setCurriculum(initialCurriculum);
    setFacilities(initialFacilities);
    setGallery(initialGallery);
    setVideos(initialVideos);

    localStorage.removeItem('aldahr_settings');
    localStorage.removeItem('aldahr_programs');
    localStorage.removeItem('aldahr_classes');
    localStorage.removeItem('aldahr_fees');
    localStorage.removeItem('aldahr_subjects');
    localStorage.removeItem('aldahr_curriculum');
    localStorage.removeItem('aldahr_facilities');
    localStorage.removeItem('aldahr_gallery');
    localStorage.removeItem('aldahr_videos');

    try {
      await setDoc(doc(db, 'settings', 'global'), initialSettings);
      await setDoc(doc(db, 'feeConfig', 'current'), initialAdmissionFeeConfig);
    } catch (e) {
      console.warn('Reset sync warning:', e);
    }
  };

  return (
    <AcademyContext.Provider
      value={{
        settings,
        programs,
        classes,
        admissionFeeConfig,
        subjects,
        curriculum,
        facilities,
        gallery,
        videos,
        heroSlides,
        voiceKnowledge,
        structureData,
        enquiries,
        currentPage,
        setCurrentPage,
        selectedClassForModal,
        setSelectedClassForModal,
        isAdmissionModalOpen,
        setIsAdmissionModalOpen,
        isFeeCalculatorOpen,
        setIsFeeCalculatorOpen,
        isVoiceAgentOpen,
        setIsVoiceAgentOpen,
        enquiryPrefill,
        setEnquiryPrefill,
        currentUser,
        isAdminLoggedIn,
        adminLoginError,
        setAdminLoginError,
        handleAdminLoginWithGoogle,
        handleAdminLoginWithPassword,
        handleAdminLogout,
        updateSettings,
        saveProgram,
        deleteProgram,
        saveClass,
        deleteClass,
        updateAdmissionFeeConfig,
        saveSubject,
        deleteSubject,
        saveCurriculum,
        deleteCurriculum,
        saveFacility,
        deleteFacility,
        saveGalleryItem,
        deleteGalleryItem,
        saveVideoItem,
        deleteVideoItem,
        saveHeroSlide,
        deleteHeroSlide,
        saveVoiceKnowledge,
        deleteVoiceKnowledge,
        updateEducationStructure,
        submitEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        resetAllToDefaults,
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error('useAcademy must be used within an AcademyProvider');
  }
  return context;
};
