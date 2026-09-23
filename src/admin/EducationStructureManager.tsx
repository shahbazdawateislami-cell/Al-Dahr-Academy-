import React, { useState, useRef } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { EducationStructureData, EducationSubjectPill } from '../types';
import {
  BookOpen,
  GraduationCap,
  Cpu,
  Youtube,
  Users,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  Upload,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

interface EducationStructureManagerProps {
  showToast?: (msg: string) => void;
}

export const EducationStructureManager: React.FC<EducationStructureManagerProps> = ({ showToast: propShowToast }) => {
  const { structureData, updateEducationStructure } = useAcademy();
  const [formData, setFormData] = useState<EducationStructureData>(structureData);
  const [activeSubTab, setActiveSubTab] = useState<'modern' | 'islamic' | 'ai' | 'social' | 'pillars'>('modern');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const aiFileInputRef = useRef<HTMLInputElement>(null);
  const socialFileInputRef = useRef<HTMLInputElement>(null);

  const notifyToast = (msg: string) => {
    setToastMessage(msg);
    if (propShowToast) propShowToast(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async () => {
    await updateEducationStructure(formData);
    notifyToast('Education Structure successfully updated & published live!');
  };

  const processImageFile = (file: File, callback: (base64Url: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notifyToast('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDimension = 1280;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          callback(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          callback(event.target?.result as string);
        }
        notifyToast('Image uploaded successfully from device gallery!');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Helper mutators for Modern subjects
  const addModernSubject = () => {
    setFormData((prev) => ({
      ...prev,
      modernSubjects: [
        ...prev.modernSubjects,
        { title: 'New Subject', desc: 'Subject description', color: 'border-blue-400/70 bg-[#030d29]/90 text-blue-200' },
      ],
    }));
  };

  const removeModernSubject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      modernSubjects: prev.modernSubjects.filter((_, i) => i !== index),
    }));
  };

  const updateModernSubject = (index: number, field: keyof EducationSubjectPill, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.modernSubjects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, modernSubjects: updated };
    });
  };

  // Helper mutators for Islamic subjects
  const addIslamicSubject = () => {
    setFormData((prev) => ({
      ...prev,
      islamicSubjects: [
        ...prev.islamicSubjects,
        { title: 'New Islamic Module', desc: 'Module description', badge: 'Deen' },
      ],
    }));
  };

  const removeIslamicSubject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      islamicSubjects: prev.islamicSubjects.filter((_, i) => i !== index),
    }));
  };

  const updateIslamicSubject = (index: number, field: keyof EducationSubjectPill, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.islamicSubjects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, islamicSubjects: updated };
    });
  };

  // Helper mutators for AI Skills
  const addAiSkill = () => {
    setFormData((prev) => ({
      ...prev,
      aiSkills: [...prev.aiSkills, 'New AI Skill ⚡'],
    }));
  };

  const removeAiSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      aiSkills: prev.aiSkills.filter((_, i) => i !== index),
    }));
  };

  const updateAiSkill = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.aiSkills];
      updated[index] = value;
      return { ...prev, aiSkills: updated };
    });
  };

  // Helper mutators for Social Skills
  const addSocialSkill = () => {
    setFormData((prev) => ({
      ...prev,
      socialSkills: [...prev.socialSkills, 'New Social Media Skill 🚀'],
    }));
  };

  const removeSocialSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialSkills: prev.socialSkills.filter((_, i) => i !== index),
    }));
  };

  const updateSocialSkill = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.socialSkills];
      updated[index] = value;
      return { ...prev, socialSkills: updated };
    });
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs shadow-2xl flex items-center gap-2 border border-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#031536] via-[#092257] to-[#031536] border border-sky-500/40 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Academic Structure Manager</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Cinzel',serif]">
            Website Education Structure & Sections Control
          </h2>
          <p className="text-xs text-sky-200/80">
            Customize Modern Education, Islamic Education & Hifz, AI & Social Masterclasses, and Character Pillars shown under the Carousel.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-xl transition flex items-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Publish Changes Live</span>
        </button>
      </div>

      {/* Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'modern', label: '1. Modern Education', icon: GraduationCap },
          { id: 'islamic', label: '2. Islamic Education & Hifz', icon: BookOpen },
          { id: 'ai', label: '3. AI Master Class', icon: Cpu },
          { id: 'social', label: '4. Social Media Master Class', icon: Youtube },
          { id: 'pillars', label: '5. Tarbiyah & Hostel Pillars', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border-sky-400/60 shadow-lg'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB TAB 1: MODERN EDUCATION */}
      {activeSubTab === 'modern' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-sky-300 uppercase mb-1">Section Title</label>
              <input
                type="text"
                value={formData.modernTitle}
                onChange={(e) => setFormData({ ...formData, modernTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:border-sky-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-sky-300 uppercase mb-1">Section Badge Tag</label>
              <input
                type="text"
                value={formData.modernBadge}
                onChange={(e) => setFormData({ ...formData, modernBadge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:border-sky-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Pillar Status Badge</label>
              <select
                value={formData.modernStatus || 'active'}
                onChange={(e) => setFormData({ ...formData, modernStatus: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-xs font-bold focus:border-emerald-400 outline-none"
              >
                <option value="active">Active (🟢 Show Green Active Badge)</option>
                <option value="coming-soon">Coming Soon (🟡 Show Coming Soon Badge)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sky-300 uppercase mb-1">Section Description</label>
            <textarea
              rows={2}
              value={formData.modernDescription}
              onChange={(e) => setFormData({ ...formData, modernDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-sky-400 outline-none"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Core Subjects ({formData.modernSubjects.length})
              </h3>
              <button
                onClick={addModernSubject}
                className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/40 hover:bg-sky-500/30 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Subject</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {formData.modernSubjects.map((subject, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group">
                  <button
                    onClick={() => removeModernSubject(idx)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1 opacity-75 group-hover:opacity-100 transition"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">Subject Name</label>
                    <input
                      type="text"
                      value={subject.title}
                      onChange={(e) => updateModernSubject(idx, 'title', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-sky-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">Short Description</label>
                    <input
                      type="text"
                      value={subject.desc}
                      onChange={(e) => updateModernSubject(idx, 'desc', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium focus:border-sky-400 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: ISLAMIC EDUCATION & HIFZ */}
      {activeSubTab === 'islamic' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase mb-1">Section Title</label>
              <input
                type="text"
                value={formData.islamicTitle}
                onChange={(e) => setFormData({ ...formData, islamicTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase mb-1">Section Badge Tag</label>
              <input
                type="text"
                value={formData.islamicBadge}
                onChange={(e) => setFormData({ ...formData, islamicBadge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Pillar Status Badge</label>
              <select
                value={formData.islamicStatus || 'active'}
                onChange={(e) => setFormData({ ...formData, islamicStatus: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-xs font-bold focus:border-emerald-400 outline-none"
              >
                <option value="active">Active (🟢 Show Green Active Badge)</option>
                <option value="coming-soon">Coming Soon (🟡 Show Coming Soon Badge)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-300 uppercase mb-1">Section Description</label>
            <textarea
              rows={2}
              value={formData.islamicDescription}
              onChange={(e) => setFormData({ ...formData, islamicDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-emerald-400 outline-none"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Deeni & Hifz Modules ({formData.islamicSubjects.length})
              </h3>
              <button
                onClick={addIslamicSubject}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 hover:bg-emerald-500/30 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Islamic Module</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {formData.islamicSubjects.map((subject, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group">
                  <button
                    onClick={() => removeIslamicSubject(idx)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1 opacity-75 group-hover:opacity-100 transition"
                    title="Delete Module"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase">Module Title</label>
                      <input
                        type="text"
                        value={subject.title}
                        onChange={(e) => updateIslamicSubject(idx, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-emerald-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase">Badge Label</label>
                      <input
                        type="text"
                        value={subject.badge || ''}
                        onChange={(e) => updateIslamicSubject(idx, 'badge', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 text-xs font-bold focus:border-emerald-400 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">Description</label>
                    <input
                      type="text"
                      value={subject.desc}
                      onChange={(e) => updateIslamicSubject(idx, 'desc', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-200 text-xs font-medium focus:border-emerald-400 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: AI MASTER CLASS */}
      {activeSubTab === 'ai' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-sky-300 uppercase mb-1">Section Title</label>
              <input
                type="text"
                value={formData.aiTitle}
                onChange={(e) => setFormData({ ...formData, aiTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:border-sky-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-sky-300 uppercase mb-1">Section Badge Tag</label>
              <input
                type="text"
                value={formData.aiBadge}
                onChange={(e) => setFormData({ ...formData, aiBadge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:border-sky-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase mb-1">Pillar Status Badge</label>
              <select
                value={formData.aiStatus || 'coming-soon'}
                onChange={(e) => setFormData({ ...formData, aiStatus: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-xs font-bold focus:border-amber-400 outline-none"
              >
                <option value="coming-soon">Coming Soon (🟡 Show Coming Soon Badge)</option>
                <option value="active">Active (🟢 Show Green Active Badge)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sky-300 uppercase mb-1">Section Description</label>
            <textarea
              rows={2}
              value={formData.aiDescription}
              onChange={(e) => setFormData({ ...formData, aiDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-sky-400 outline-none"
            />
          </div>

          {/* AI Banner Image Control */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-white uppercase flex items-center justify-between">
              <span>Card Background Image (Robotic AI Control Image)</span>
              <span className="text-[10px] text-sky-400 font-semibold">Upload Photo from Gallery / Device</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Image URL or upload below"
                value={formData.aiImageUrl}
                onChange={(e) => setFormData({ ...formData, aiImageUrl: e.target.value })}
                className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono outline-none"
              />
              <button
                type="button"
                onClick={() => aiFileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 transition"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Photo</span>
              </button>
              <input
                ref={aiFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    processImageFile(file, (url) => setFormData((prev) => ({ ...prev, aiImageUrl: url })));
                  }
                }}
              />
            </div>
          </div>

          {/* AI Skill Pills */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                AI Skill Pills ({formData.aiSkills.length})
              </h3>
              <button
                onClick={addAiSkill}
                className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/40 hover:bg-sky-500/30 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill Pill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {formData.aiSkills.map((skill, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateAiSkill(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold outline-none"
                  />
                  <button
                    onClick={() => removeAiSkill(idx)}
                    className="text-red-400 hover:text-red-300 p-1 shrink-0"
                    title="Remove Pill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 4: SOCIAL MEDIA MASTER CLASS */}
      {activeSubTab === 'social' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Section Title</label>
              <input
                type="text"
                value={formData.socialTitle}
                onChange={(e) => setFormData({ ...formData, socialTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:border-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Section Badge Tag</label>
              <input
                type="text"
                value={formData.socialBadge}
                onChange={(e) => setFormData({ ...formData, socialBadge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:border-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase mb-1">Pillar Status Badge</label>
              <select
                value={formData.socialStatus || 'coming-soon'}
                onChange={(e) => setFormData({ ...formData, socialStatus: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-xs font-bold focus:border-amber-400 outline-none"
              >
                <option value="coming-soon">Coming Soon (🟡 Show Coming Soon Badge)</option>
                <option value="active">Active (🟢 Show Green Active Badge)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Section Description</label>
            <textarea
              rows={2}
              value={formData.socialDescription}
              onChange={(e) => setFormData({ ...formData, socialDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-amber-400 outline-none"
            />
          </div>

          {/* Social Banner Image Control */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-white uppercase flex items-center justify-between">
              <span>Card Background Image (Smartphone Social Burst Image)</span>
              <span className="text-[10px] text-amber-400 font-semibold">Upload Photo from Gallery / Device</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Image URL or upload below"
                value={formData.socialImageUrl}
                onChange={(e) => setFormData({ ...formData, socialImageUrl: e.target.value })}
                className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono outline-none"
              />
              <button
                type="button"
                onClick={() => socialFileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 transition"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Photo</span>
              </button>
              <input
                ref={socialFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    processImageFile(file, (url) => setFormData((prev) => ({ ...prev, socialImageUrl: url })));
                  }
                }}
              />
            </div>
          </div>

          {/* Social Skill Pills */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Social Media Skill Pills ({formData.socialSkills.length})
              </h3>
              <button
                onClick={addSocialSkill}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/40 hover:bg-amber-500/30 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill Pill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {formData.socialSkills.map((skill, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateSocialSkill(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold outline-none"
                  />
                  <button
                    onClick={() => removeSocialSkill(idx)}
                    className="text-red-400 hover:text-red-300 p-1 shrink-0"
                    title="Remove Pill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 5: TARBIYAH PILLARS */}
      {activeSubTab === 'pillars' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Academic, Hostel & Tarbiyah Pillars (Row 4 Cards)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.secondaryPillars.map((pillar, pIdx) => (
              <div key={pillar.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-[10px] text-amber-300 font-bold uppercase mb-1">
                    Pillar Title
                  </label>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => {
                        const updated = [...prev.secondaryPillars];
                        updated[pIdx] = { ...updated[pIdx], title: val };
                        return { ...prev, secondaryPillars: updated };
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold outline-none"
                  />
                </div>

                {pillar.id === 'values' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-sky-300 font-bold uppercase mb-1">Deen Tagline</label>
                      <input
                        type="text"
                        value={pillar.taglineDeen || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.secondaryPillars];
                            updated[pIdx] = { ...updated[pIdx], taglineDeen: val };
                            return { ...prev, secondaryPillars: updated };
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sky-200 text-xs font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-emerald-300 font-bold uppercase mb-1">Duniya Tagline</label>
                      <input
                        type="text"
                        value={pillar.taglineDuniya || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.secondaryPillars];
                            updated[pIdx] = { ...updated[pIdx], taglineDuniya: val };
                            return { ...prev, secondaryPillars: updated };
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-200 text-xs font-bold outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">
                      Bullet Features ({pillar.bullets.length})
                    </label>
                    <button
                      onClick={() => {
                        setFormData((prev) => {
                          const updated = [...prev.secondaryPillars];
                          updated[pIdx] = {
                            ...updated[pIdx],
                            bullets: [...updated[pIdx].bullets, 'New Feature Point'],
                          };
                          return { ...prev, secondaryPillars: updated };
                        });
                      }}
                      className="text-[10px] font-bold text-sky-400 hover:underline"
                    >
                      + Add Bullet
                    </button>
                  </div>

                  <div className="space-y-2">
                    {pillar.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => {
                              const updated = [...prev.secondaryPillars];
                              const bArr = [...updated[pIdx].bullets];
                              bArr[bIdx] = val;
                              updated[pIdx] = { ...updated[pIdx], bullets: bArr };
                              return { ...prev, secondaryPillars: updated };
                            });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium outline-none"
                        />
                        <button
                          onClick={() => {
                            setFormData((prev) => {
                              const updated = [...prev.secondaryPillars];
                              updated[pIdx] = {
                                ...updated[pIdx],
                                bullets: updated[pIdx].bullets.filter((_, i) => i !== bIdx),
                              };
                              return { ...prev, secondaryPillars: updated };
                            });
                          }}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Action Bar at Bottom */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-800">
        <p className="text-xs text-slate-400">
          All edits saved here immediately sync to Firestore and refresh live for all website visitors.
        </p>
        <button
          onClick={handleSave}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-xl transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Publish Changes Live</span>
        </button>
      </div>
    </div>
  );
};
