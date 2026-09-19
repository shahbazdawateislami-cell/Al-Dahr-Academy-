import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { VideoMediaItem } from '../types';
import {
  Play,
  Video,
  Sparkles,
  ExternalLink,
  X,
  Instagram,
  Youtube,
} from 'lucide-react';

interface VideosPageProps {
  initialFilter?: 'all' | 'youtube' | 'shorts' | 'instagram';
}

export const VideosPage: React.FC<VideosPageProps> = ({ initialFilter = 'all' }) => {
  const { videos } = useAcademy();
  const [filter, setFilter] = useState<'all' | 'youtube' | 'shorts' | 'instagram'>(initialFilter);
  const [activeVideoToPlay, setActiveVideoToPlay] = useState<VideoMediaItem | null>(null);

  const filteredVideos = videos
    .filter((v) => v.active)
    .filter((v) => (filter === 'all' ? true : v.type === filter));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
          Media Hub
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel',serif] tracking-tight">
          Academy Videos, Shorts & Reels
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Watch campus walkthroughs, student Quran recitations, classroom activities, and admissions announcements.
        </p>
      </div>

      {/* Media Type Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition border ${
            filter === 'all'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          All Media ({videos.filter((v) => v.active).length})
        </button>

        <button
          onClick={() => setFilter('youtube')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition border flex items-center gap-2 ${
            filter === 'youtube'
              ? 'bg-red-600 text-white border-red-500 shadow-md'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Youtube className="w-4 h-4" />
          <span>YouTube Videos ({videos.filter((v) => v.active && v.type === 'youtube').length})</span>
        </button>

        <button
          onClick={() => setFilter('shorts')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition border flex items-center gap-2 ${
            filter === 'shorts'
              ? 'bg-red-700 text-white border-red-600 shadow-md'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span>⚡ YouTube Shorts ({videos.filter((v) => v.active && v.type === 'shorts').length})</span>
        </button>

        <button
          onClick={() => setFilter('instagram')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition border flex items-center gap-2 ${
            filter === 'instagram'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-500 shadow-md'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Instagram className="w-4 h-4" />
          <span>Instagram Videos ({videos.filter((v) => v.active && v.type === 'instagram').length})</span>
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((vid) => (
          <div
            key={vid.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition duration-300 shadow-xl"
          >
            {/* Thumbnail / Embed container */}
            <div
              onClick={() => setActiveVideoToPlay(vid)}
              className={`relative ${
                vid.type === 'shorts' ? 'h-72' : 'h-52'
              } overflow-hidden bg-slate-950 cursor-pointer`}
            >
              {vid.thumbnail ? (
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-950">
                  <Play className="w-12 h-12 text-slate-700" />
                </div>
              )}

              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition ${
                    vid.type === 'instagram'
                      ? 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  <Play className="w-6 h-6 ml-0.5" />
                </div>
              </div>

              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/90 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-slate-700">
                {vid.type === 'youtube'
                  ? 'YouTube Video'
                  : vid.type === 'shorts'
                  ? '⚡ YouTube Short'
                  : '📷 Instagram Reel'}
              </div>

              {vid.category && (
                <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-md bg-slate-950/80 text-[10px] text-slate-300 font-medium">
                  {vid.category}
                </div>
              )}
            </div>

            {/* Content info */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-['Cinzel',serif] group-hover:text-amber-400 transition line-clamp-2">
                  {vid.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {vid.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveVideoToPlay(vid)}
                  className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Video</span>
                </button>

                <a
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideoToPlay && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveVideoToPlay(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-950/80 text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative bg-black w-full" style={{ paddingBottom: activeVideoToPlay.type === 'shorts' ? '120%' : '56.25%' }}>
              {activeVideoToPlay.videoId ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoToPlay.videoId}?autoplay=1&rel=0`}
                  title={activeVideoToPlay.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <Play className="w-16 h-16 text-amber-400" />
                  <p className="text-sm text-slate-300 max-w-md">
                    Click below to open and watch on {activeVideoToPlay.type === 'instagram' ? 'Instagram' : 'YouTube'}:
                  </p>
                  <a
                    href={activeVideoToPlay.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2"
                  >
                    <span>Watch Media Directly</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-950 space-y-2 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white font-['Cinzel',serif]">
                {activeVideoToPlay.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeVideoToPlay.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
