import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { GalleryMediaItem } from '../types';
import { X, Sparkles, Camera, ZoomIn } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery } = useAcademy();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryMediaItem | null>(null);

  const categories = ['All', ...Array.from(new Set(gallery.map((g) => g.category)))];

  const filteredItems =
    selectedCategory === 'All'
      ? gallery
      : gallery.filter((g) => g.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          Visual Memories
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel',serif] tracking-tight">
          Academy Photo Gallery
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          A glimpse into life at Al-Dahr Academy — from early morning Quranic halqahs to lively science labs and sports grounds.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveImage(item)}
            className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden cursor-pointer group hover:border-amber-500/50 transition duration-300 shadow-lg flex flex-col justify-between"
          >
            <div className="relative h-56 overflow-hidden bg-slate-950">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <div className="p-2.5 rounded-full bg-slate-900/90 text-amber-400 shadow-xl">
                  <ZoomIn className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                {item.category}
              </div>
            </div>

            <div className="p-4 space-y-1">
              <h3 className="text-sm font-bold text-white font-['Cinzel',serif] group-hover:text-amber-400 transition">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Image Preview Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-950/80 text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            <div className="p-6 space-y-2 bg-slate-950 border-t border-slate-800">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                {activeImage.category}
              </span>
              <h3 className="text-lg font-bold text-white font-['Cinzel',serif]">
                {activeImage.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
