import React, { useEffect } from 'react';
import { VideoMediaItem } from '../types';
import { X, ExternalLink, Play, Youtube, Instagram, Sparkles } from 'lucide-react';
import { parseVideoUrl } from '../utils/videoUtils';

interface VideoModalProps {
  video: VideoMediaItem | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (video) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  const parsed = parseVideoUrl(video.url, video.type);
  const isShortOrReel = video.type === 'shorts' || video.type === 'instagram' || parsed.type === 'instagram' || parsed.type === 'shorts';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className={`relative w-full ${isShortOrReel ? 'max-w-md' : 'max-w-4xl'} bg-[#071330] border border-blue-800/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]`}>
        {/* Header Bar */}
        <div className="px-4 py-3 bg-[#050e26] border-b border-blue-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {parsed.type === 'instagram' ? (
              <span className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shrink-0 shadow">
                <Instagram className="w-4 h-4" />
              </span>
            ) : (
              <span className="p-1.5 rounded-lg bg-red-600 text-white shrink-0 shadow">
                <Youtube className="w-4 h-4" />
              </span>
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate font-['Cinzel',serif]">
                {video.title}
              </h3>
              <p className="text-[10px] text-sky-300 font-medium truncate">
                {video.category || 'Al-Dahr Academy Media'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-rose-600 transition shadow cursor-pointer active:scale-95"
            aria-label="Close Video Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative bg-black w-full flex-1 flex items-center justify-center overflow-hidden min-h-[320px]">
          {parsed.type === 'direct' ? (
            <video
              src={parsed.embedUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full max-h-[70vh] object-contain"
            />
          ) : parsed.type === 'instagram' && parsed.videoId ? (
            <div className="w-full h-full min-h-[480px] max-h-[72vh] flex items-center justify-center bg-black overflow-hidden py-2">
              <iframe
                src={`https://www.instagram.com/reel/${parsed.videoId}/embed/`}
                className="w-full h-full border-0 min-h-[480px] max-w-[420px]"
                title={video.title}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : parsed.videoId || parsed.embedUrl ? (
            <div className={`relative w-full ${isShortOrReel ? 'aspect-[9/16] max-h-[72vh] max-w-[400px] mx-auto' : 'aspect-video'}`}>
              <iframe
                className="absolute inset-0 w-full h-full border-0"
                src={`https://www.youtube-nocookie.com/embed/${parsed.videoId || ''}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="p-8 text-center space-y-3">
              <Play className="w-12 h-12 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-300">Video cannot be loaded directly.</p>
            </div>
          )}
        </div>

        {/* Footer info & In-App Security Note */}
        <div className="p-4 bg-[#050e26] border-t border-blue-900/80 flex items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-300 line-clamp-1 max-w-lg">
            {video.description || video.title}
          </p>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Al-Dahr Academy Player</span>
          </div>
        </div>
      </div>
    </div>
  );
};
