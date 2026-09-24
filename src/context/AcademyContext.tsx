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
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

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

    // Settings listener
    try {
      const unsub = onSnapshot(
        doc(db, 'settings', 'global'),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as WebsiteSettings;
            setSettings(data);
            localStorage.setItem('aldahr_settings', JSON.stringify(data));
          } else {
            setDoc(doc(db, 'settings', 'global'), initialSettings).catch(() => {});
          }
        },
        (err) => handleFirestoreError(err, OperationType.GET, 'settings/global')
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
            localStorage.setItem('aldahr_programs', JSON.stringify(items));
          } else {
            initialPrograms.forEach((p) => {
              setDoc(doc(db, 'programs', p.id), p).catch(() => {});
            });
          }
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'programs')
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
            localStorage.setItem('aldahr_classes', JSON.stringify(items));
          } else {
            initialClasses.forEach((c) => {
              setDoc(doc(db, 'classes', c.id), c).catch(() => {});
            });
          }
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'classes')
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
            localStorage.setItem('aldahr_fees', JSON.stringify(data));
          } else {
            setDoc(doc(db, 'feeConfig', 'current'), initialAdmissionFeeConfig).catch(() => {});
          }
        },
        (err) => handleFirestoreError(err, OperationType.GET, 'feeConfig/current')
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
            localStorage.setItem('aldahr_gallery', JSON.stringify(items));
          } else {
            initialGallery.forEach((g) => {
              setDoc(doc(db, 'gallery', g.id), g).catch(() => {});
            });
          }
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'gallery')
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
            items = items.map((item) => {
              if (item.id === 'vid-insta-1' && (item.url.includes('dummy') || item.url.includes('C8_dummy') || item.url !== 'https://www.instagram.com/reel/DcUPRfRsEij/')) {
                const updatedItem: VideoMediaItem = {
                  ...item,
                  title: 'Al-Dahr Academy Official Reel - Deen & Modern Education',
                  type: 'instagram',
                  url: 'https://www.instagram.com/reel/DcUPRfRsEij/',
                  videoId: 'DcUPRfRsEij',
                  thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80',
                  description: 'Al-Dahr Academy Phulwari Sharif Patna - Empowering young minds with Quran Tajweed, Islamic Tarbiyah & Modern CBSE Education. Watch our signature Instagram Reel highlighting student excellence.',
                  category: 'Instagram Reel',
                  isFeatured: true,
                  active: true,
                  order: 3,
                };
                setDoc(doc(db, 'videos', 'vid-insta-1'), updatedItem).catch(() => {});
                return updatedItem;
              }
              return item;
            });
            items.sort((a, b) => (a.order || 0) - (b.order || 0));
            setVideos(items);
            localStorage.setItem('aldahr_videos', JSON.stringify(items));
          } else {
            initialVideos.forEach((v) => {
              setDoc(doc(db, 'videos', v.id), v).catch(() => {});
            });
          }
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'videos')
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
            localStorage.setItem('aldahr_hero_slides', JSON.stringify(items));
          } else {
            initialHeroSlides.forEach((hs) => {
              setDoc(doc(db, 'heroSlides', hs.id), hs).catch(() => {});
            });
          }
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'heroSlides')
      );
      unsubs.push(unsub);
    } catch (e) {
      console.warn('Could not attach heroSlides listener', e);
    }

    // Voice Agent Knowledge listener
    try {
      const unsub = onSnapshot(
        collection(db, 'voiceAgentKnowledge'),
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as VoiceKnowledgeItem));
            setVoiceKnowledge(items);
            localStorage.setItem('aldahr_voice_knowledge', JSON.stringify(items));
          } else {
            initialVoiceKnowledge.forEach((vk) => {
              setDoc(doc(db, 'voiceAgentKnowledge', vk.id), vk).catch(() => {});
            });
          }
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'voiceAgentKnowledge')
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
            localStorage.setItem('aldahr_structure_data', JSON.stringify(data));
          } else {
            setDoc(doc(db, 'structure', 'current'), initialEducationStructureData).catch(() => {});
          }
        },
        (err) => handleFirestoreError(err, OperationType.GET, 'structure/current')
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
    const updated = { ...settings, ...newValues };
    setSettings(updated);
    localStorage.setItem('aldahr_settings', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'settings', 'global'), updated, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'settings/global');
    }
  };

  const saveProgram = async (program: ProgramItem) => {
    const exists = programs.some((p) => p.id === program.id);
    const updated = exists
      ? programs.map((p) => (p.id === program.id ? program : p))
      : [...programs, program];
    setPrograms(updated);
    localStorage.setItem('aldahr_programs', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'programs', program.id), program);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `programs/${program.id}`);
    }
  };

  const deleteProgram = async (id: string) => {
    const updated = programs.filter((p) => p.id !== id);
    setPrograms(updated);
    localStorage.setItem('aldahr_programs', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'programs', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `programs/${id}`);
    }
  };

  const saveClass = async (item: SchoolClassItem) => {
    const exists = classes.some((c) => c.id === item.id);
    const updated = exists
      ? classes.map((c) => (c.id === item.id ? item : c))
      : [...classes, item];
    updated.sort((a, b) => a.gradeNumber - b.gradeNumber);
    setClasses(updated);
    localStorage.setItem('aldahr_classes', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'classes', item.id), item);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `classes/${item.id}`);
    }
  };

  const deleteClass = async (id: string) => {
    const updated = classes.filter((c) => c.id !== id);
    setClasses(updated);
    localStorage.setItem('aldahr_classes', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'classes', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `classes/${id}`);
    }
  };

  const updateAdmissionFeeConfig = async (config: AdmissionFeeConfig) => {
    setAdmissionFeeConfig(config);
    localStorage.setItem('aldahr_fees', JSON.stringify(config));
    try {
      await setDoc(doc(db, 'feeConfig', 'current'), config);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'feeConfig/current');
    }
  };

  const saveSubject = async (item: SubjectItem) => {
    const exists = subjects.some((s) => s.id === item.id);
    const updated = exists
      ? subjects.map((s) => (s.id === item.id ? item : s))
      : [...subjects, item];
    setSubjects(updated);
    localStorage.setItem('aldahr_subjects', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'subjects', item.id), item);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `subjects/${item.id}`);
    }
  };

  const deleteSubject = async (id: string) => {
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    localStorage.setItem('aldahr_subjects', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'subjects', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `subjects/${id}`);
    }
  };

  const saveCurriculum = async (item: CurriculumItem) => {
    const exists = curriculum.some((c) => c.id === item.id);
    const updated = exists
      ? curriculum.map((c) => (c.id === item.id ? item : c))
      : [...curriculum, item];
    setCurriculum(updated);
    localStorage.setItem('aldahr_curriculum', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'curriculum', item.id), item);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `curriculum/${item.id}`);
    }
  };

  const deleteCurriculum = async (id: string) => {
    const updated = curriculum.filter((c) => c.id !== id);
    setCurriculum(updated);
    localStorage.setItem('aldahr_curriculum', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'curriculum', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `curriculum/${id}`);
    }
  };

  const saveFacility = async (item: FacilityItem) => {
    const exists = facilities.some((f) => f.id === item.id);
    const updated = exists
      ? facilities.map((f) => (f.id === item.id ? item : f))
      : [...facilities, item];
    setFacilities(updated);
    localStorage.setItem('aldahr_facilities', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'facilities', item.id), item);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `facilities/${item.id}`);
    }
  };

  const deleteFacility = async (id: string) => {
    const updated = facilities.filter((f) => f.id !== id);
    setFacilities(updated);
    localStorage.setItem('aldahr_facilities', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'facilities', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `facilities/${id}`);
    }
  };

  const saveGalleryItem = async (item: GalleryMediaItem) => {
    const exists = gallery.some((g) => g.id === item.id);
    const updated = exists
      ? gallery.map((g) => (g.id === item.id ? item : g))
      : [item, ...gallery];
    setGallery(updated);
    localStorage.setItem('aldahr_gallery', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'gallery', item.id), item);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `gallery/${item.id}`);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const updated = gallery.filter((g) => g.id !== id);
    setGallery(updated);
    localStorage.setItem('aldahr_gallery', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `gallery/${id}`);
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
    localStorage.setItem('aldahr_videos', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'videos', finalItem.id), finalItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `videos/${finalItem.id}`);
    }
  };

  const deleteVideoItem = async (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    localStorage.setItem('aldahr_videos', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `videos/${id}`);
    }
  };

  const saveHeroSlide = async (slide: HeroSlideItem) => {
    const exists = heroSlides.some((s) => s.id === slide.id);
    const updated = exists
      ? heroSlides.map((s) => (s.id === slide.id ? slide : s))
      : [...heroSlides, slide];
    updated.sort((a, b) => (a.order || 0) - (b.order || 0));
    setHeroSlides(updated);
    localStorage.setItem('aldahr_hero_slides', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'heroSlides', slide.id), slide);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `heroSlides/${slide.id}`);
    }
  };

  const deleteHeroSlide = async (id: string) => {
    const updated = heroSlides.filter((s) => s.id !== id);
    setHeroSlides(updated);
    localStorage.setItem('aldahr_hero_slides', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'heroSlides', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `heroSlides/${id}`);
    }
  };

  const saveVoiceKnowledge = async (item: VoiceKnowledgeItem) => {
    const exists = voiceKnowledge.some((vk) => vk.id === item.id);
    const updated = exists
      ? voiceKnowledge.map((vk) => (vk.id === item.id ? item : vk))
      : [item, ...voiceKnowledge];
    setVoiceKnowledge(updated);
    localStorage.setItem('aldahr_voice_knowledge', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'voiceAgentKnowledge', item.id), item);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `voiceAgentKnowledge/${item.id}`);
    }
  };

  const deleteVoiceKnowledge = async (id: string) => {
    const updated = voiceKnowledge.filter((vk) => vk.id !== id);
    setVoiceKnowledge(updated);
    localStorage.setItem('aldahr_voice_knowledge', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'voiceAgentKnowledge', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `voiceAgentKnowledge/${id}`);
    }
  };

  const updateEducationStructure = async (data: EducationStructureData) => {
    setStructureData(data);
    localStorage.setItem('aldahr_structure_data', JSON.stringify(data));
    try {
      await setDoc(doc(db, 'structure', 'current'), data);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'structure/current');
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
    localStorage.setItem('aldahr_enquiries', JSON.stringify(updated));

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
    localStorage.setItem('aldahr_enquiries', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'enquiries', id), { status }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `enquiries/${id}`);
    }
  };

  const deleteEnquiry = async (id: string) => {
    const updated = enquiries.filter((e) => e.id !== id);
    setEnquiries(updated);
    localStorage.setItem('aldahr_enquiries', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'enquiries', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `enquiries/${id}`);
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
