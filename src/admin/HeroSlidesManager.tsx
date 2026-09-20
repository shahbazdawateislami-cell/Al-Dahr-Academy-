import React, { useState, useRef } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { HeroSlideItem } from '../types';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Upload,
  Sparkles,
  Eye,
  EyeOff,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const HeroSlidesManager: React.FC<{ showToast: (msg: string) => void }> = ({ showToast }) => {
  const { heroSlides, saveHeroSlide, deleteHeroSlide } = useAcademy();

  const [editingSlide, setEditingSlide] = useState<HeroSlideItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for new / edit slide
  const [formData, setFormData] = useState<Omit<HeroSlideItem, 'id'>>({
    title: '',
    subtitle: '',
    badge: 'WELCOME TO AL-DAHR ACADEMY',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=85',
    primaryBtnText: 'Admission 2025–26',
    primaryBtnAction: 'admission',
    secondaryBtnText: 'Explore Programs',
    secondaryBtnAction: 'programs',
    active: true,
    order: (heroSlides.length || 0) + 1,
  });

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      badge: 'WELCOME TO AL-DAHR ACADEMY',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=85',
      primaryBtnText: 'Admission 2025–26',
      primaryBtnAction: 'admission',
      secondaryBtnText: 'Explore Programs',
      secondaryBtnAction: 'programs',
      active: true,
      order: heroSlides.length + 1,
    });
  };

  const handleStartEdit = (slide: HeroSlideItem) => {
    setEditingSlide(slide);
    setIsAddingNew(false);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      badge: slide.badge || 'WELCOME TO AL-DAHR ACADEMY',
      imageUrl: slide.imageUrl,
      primaryBtnText: slide.primaryBtnText || 'Admission 2025–26',
      primaryBtnAction: slide.primaryBtnAction || 'admission',
      secondaryBtnText: slide.secondaryBtnText || 'Explore Programs',
      secondaryBtnAction: slide.secondaryBtnAction || 'programs',
      active: slide.active,
      order: slide.order,
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingSlide(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      showToast('Kripya Title aur Image URL dono fill karein');
      return;
    }

    const slideToSave: HeroSlideItem = {
      ...formData,
      id: editingSlide ? editingSlide.id : 'slide-' + Date.now(),
    };

    await saveHeroSlide(slideToSave);
    showToast(editingSlide ? 'Slide successfully update ho gayi!' : 'Nayi Slide successfully add ho gayi!');
    handleCancel();
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Kya aap is slide ko delete karna chahte hain: "${title}"?`)) {
      await deleteHeroSlide(id);
      showToast('Slide delete ho gayi');
    }
  };

  const handleToggleActive = async (slide: HeroSlideItem) => {
    await saveHeroSlide({ ...slide, active: !slide.active });
    showToast(`Slide ${!slide.active ? 'Active' : 'Inactive'} ho gayi`);
  };

  // Image upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Kripya valid image file select karein');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDimension = 1600;
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
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        setFormData((prev) => ({ ...prev, imageUrl: compressedBase64 }));
        showToast('Photo successfully select ho gayi!');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Quick Unsplash Presets
  const presets = [
    { label: 'Islamic Hifz', url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1600&auto=format&fit=crop&q=85' },
    { label: 'Campus Students', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=85' },
    { label: 'Science & Books', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&auto=format&fit=crop&q=85' },
    { label: 'Hostel & Building', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=85' },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-['Cinzel',serif]">
              Hero Carousel Slider Manager
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              {heroSlides.length} Slides
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Home page par automatic chalne wale slider ki photos, titles, aur action buttons ko yahan se manage karein.
          </p>
        </div>

        {!isAddingNew && !editingSlide && (
          <button
            onClick={handleStartAdd}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nayi Slide Add Karein</span>
          </button>
        )}
      </div>

      {/* Add / Edit Slide Form */}
      {(isAddingNew || editingSlide) && (
        <div className="bg-slate-900 border-2 border-amber-500/50 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white font-['Cinzel',serif]">
                {editingSlide ? 'Slide Edit Karein' : 'Nayi Slide Add Karein'}
              </h3>
            </div>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Top Badge Text (e.g. WELCOME TO AL-DAHR ACADEMY)
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="WELCOME TO AL-DAHR ACADEMY"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Order / Sequence Number
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Main Headline / Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Start Your Beautiful And Bright Future"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Nurturing sacred Islamic Tarbiyah, Hifz-e-Quran, and modern academics..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Image URL & Upload */}
            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">
                Background Slide Image * (Photo select karein ya URL enter karein)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl border border-slate-700 font-bold flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Photo from Device</span>
                </button>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-slate-400">Quick Image Presets:</span>
                {presets.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: p.url })}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Preview */}
              {formData.imageUrl && (
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-700 mt-3">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs text-amber-400 font-bold">Image Preview: {formData.title || 'Slide Title'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons Setup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400">Primary Button (Left)</span>
                <div>
                  <label className="text-slate-400 text-[11px]">Button Text</label>
                  <input
                    type="text"
                    value={formData.primaryBtnText}
                    onChange={(e) => setFormData({ ...formData, primaryBtnText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px]">Button Click Action</label>
                  <select
                    value={formData.primaryBtnAction}
                    onChange={(e) => setFormData({ ...formData, primaryBtnAction: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  >
                    <option value="admission">Open Admission Modal Form</option>
                    <option value="calculator">Open Fee Calculator</option>
                    <option value="classes">Go to Classes Page</option>
                    <option value="programs">Go to Programs Page</option>
                    <option value="contact">Go to Contact Page</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-sky-400">Secondary Button (Right)</span>
                <div>
                  <label className="text-slate-400 text-[11px]">Button Text</label>
                  <input
                    type="text"
                    value={formData.secondaryBtnText}
                    onChange={(e) => setFormData({ ...formData, secondaryBtnText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px]">Button Click Action</label>
                  <select
                    value={formData.secondaryBtnAction}
                    onChange={(e) => setFormData({ ...formData, secondaryBtnAction: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  >
                    <option value="programs">Go to Programs Page</option>
                    <option value="facilities">Go to Facilities Page</option>
                    <option value="calculator">Open Fee Calculator</option>
                    <option value="about">Go to About Academy Page</option>
                    <option value="contact">Go to Contact Page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Switch */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="activeSlide"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
              <label htmlFor="activeSlide" className="text-slate-300 font-semibold cursor-pointer">
                Slide is Active (Website par dikhayein)
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-950/50"
              >
                <Save className="w-4 h-4" />
                <span>Save Slide</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of Existing Slides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {heroSlides.map((slide) => (
          <div
            key={slide.id}
            className={`rounded-3xl border overflow-hidden bg-slate-900 flex flex-col justify-between transition-all duration-300 ${
              slide.active ? 'border-slate-800 shadow-xl' : 'border-slate-800/40 opacity-60'
            }`}
          >
            {/* Image Preview */}
            <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

              {/* Status & Order Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 text-amber-400 border border-amber-400/30 text-[11px] font-bold">
                  Order #{slide.order}
                </span>
                <button
                  onClick={() => handleToggleActive(slide)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition ${
                    slide.active
                      ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                      : 'bg-rose-950/90 text-rose-300 border border-rose-500/50'
                  }`}
                >
                  {slide.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{slide.active ? 'Active' : 'Hidden'}</span>
                </button>
              </div>
            </div>

            {/* Slide Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-sky-400 tracking-wider">
                  {slide.badge || 'WELCOME TO AL-DAHR ACADEMY'}
                </span>
                <h4 className="text-base font-bold text-white font-['Cinzel',serif] line-clamp-2 mt-0.5">
                  {slide.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {slide.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                    Btn: {slide.primaryBtnText || 'Apply'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                    Btn: {slide.secondaryBtnText || 'Explore'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(slide)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition"
                    title="Edit Slide"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id, slide.title)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
