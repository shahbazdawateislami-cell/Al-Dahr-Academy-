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
              onClick={() => setActiveVideoToPlay(vid)}
              className="rounded-3xl bg-[#071330] border border-blue-900/60 overflow-hidden flex flex-col justify-between group hover:border-amber-500/80 transition duration-300 shadow-xl cursor-pointer"
            >
              {/* Video Card Preview & Thumbnail */}
              <div
                className={`relative ${
                  vid.type === 'shorts' || vid.type === 'instagram' ? 'h-80 sm:h-96' : 'h-56 sm:h-64'
                } overflow-hidden bg-slate-950 group/thumb`}
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition duration-500"
                  />
                ) : (
                  <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center gap-3 ${
                    vid.type === 'instagram'
                      ? 'bg-gradient-to-tr from-amber-600 via-pink-600 to-purple-800'
                      : 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900'
                  }`}>
                    {vid.type === 'instagram' ? (
                      <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                        <Play className="w-10 h-10 text-white fill-white" />
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-red-600/30 border border-red-500/50">
                        <Play className="w-10 h-10 text-red-400 fill-red-400" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-white tracking-wide drop-shadow line-clamp-1">
                      {vid.title}
                    </span>
                  </div>
                )}

                {/* Glowing Center Play Overlay */}
                <div className="absolute inset-0 bg-slate-950/40 group-hover/thumb:bg-slate-950/20 transition duration-300 flex items-center justify-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition transform group-hover/thumb:scale-110 ${
                      vid.type === 'instagram'
                        ? 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white'
                        : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    <Play className={`w-6 h-6 ml-0.5 ${vid.type === 'instagram' ? 'fill-white' : 'fill-slate-950'}`} />
                  </div>
                </div>

                {/* Badge Top Left */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/90 text-[10px] font-extrabold uppercase tracking-wider text-amber-400 border border-amber-400/40 shadow-lg pointer-events-none">
                  {vid.type === 'youtube'
                    ? 'YouTube Video'
                    : vid.type === 'shorts'
                    ? '⚡ YouTube Short'
                    : '📷 Instagram Reel'}
                </div>

                {vid.category && (
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/90 text-[10px] text-sky-300 font-bold border border-blue-800/80 pointer-events-none">
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
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {vid.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-blue-900/60 flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-400 group-hover:text-amber-300 inline-flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Click to Play Video</span>
                  </div>

                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <span>In-App Player</span>
                  </span>
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
