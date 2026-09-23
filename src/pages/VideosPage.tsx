import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { VideoMediaItem } from '../types';
import {
  Play,
  ExternalLink,
  Instagram,
  Youtube,
} from 'lucide-react';
import { parseVideoUrl } from '../utils/videoUtils';
import { VideoModal } from '../components/VideoModal';

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
          Watch campus walkthroughs, student Quran recitations, classroom activities, and admissions announcements directly in-app.
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
        {filteredVideos.map((vid) => {
          const parsed = parseVideoUrl(vid.url, vid.type);
          const thumb = vid.thumbnail || parsed.thumbnailUrl;

          return (
            <div
              key={vid.id}
              className="rounded-3xl bg-[#071330] border border-blue-900/60 overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition duration-300 shadow-xl"
            >
              {/* Thumbnail / Embed container */}
              <div
                onClick={() => setActiveVideoToPlay(vid)}
                className={`relative ${
                  vid.type === 'shorts' || vid.type === 'instagram' ? 'h-72' : 'h-52'
                } overflow-hidden bg-slate-950 cursor-pointer`}
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 gap-2">
                    {vid.type === 'instagram' ? (
                      <Instagram className="w-10 h-10 text-pink-400" />
                    ) : (
                      <Youtube className="w-10 h-10 text-red-500" />
                    )}
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Click to Play</span>
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

                <div className="pt-3 border-t border-blue-900/60 flex items-center justify-between">
                  <button
                    onClick={() => setActiveVideoToPlay(vid)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Play In-App</span>
                  </button>

                  <a
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal Player Popup */}
      <VideoModal
        video={activeVideoToPlay}
        onClose={() => setActiveVideoToPlay(null)}
      />
    </div>
  );
};
