// Helper utility to parse and process video URLs (YouTube, YouTube Shorts, Instagram Reels/Posts, Direct Videos)

export interface ParsedVideoInfo {
  type: 'youtube' | 'shorts' | 'instagram' | 'direct';
  videoId?: string;
  embedUrl: string;
  thumbnailUrl?: string;
  cleanUrl: string;
}

/**
 * Extracts YouTube Video ID from any standard YouTube URL or Short link
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const clean = url.trim();

  // youtube.com/watch?v=ID or youtube.com/watch?v=ID&other=1
  const watchMatch = clean.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&"'>\s]+)/i);
  if (watchMatch?.[1]) return watchMatch[1];

  // youtu.be/ID
  const shortMatch = clean.match(/youtu\.be\/([^?#\s]+)/i);
  if (shortMatch?.[1]) return shortMatch[1];

  // youtube.com/shorts/ID
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([^?#\s]+)/i);
  if (shortsMatch?.[1]) return shortsMatch[1];

  // youtube.com/embed/ID
  const embedMatch = clean.match(/youtube\.com\/embed\/([^?#\s]+)/i);
  if (embedMatch?.[1]) return embedMatch[1];

  return null;
}

/**
 * Extracts Instagram Reel/Post ID from any Instagram link
 */
export function extractInstagramId(url: string): { id: string | null; isReel: boolean } {
  if (!url) return { id: null, isReel: false };
  const clean = url.trim();

  // instagram.com/reel/ID or instagram.com/reels/ID
  const reelMatch = clean.match(/instagram\.com\/reels?\/([^/?#\s]+)/i);
  if (reelMatch?.[1]) return { id: reelMatch[1], isReel: true };

  // instagram.com/p/ID
  const postMatch = clean.match(/instagram\.com\/p\/([^/?#\s]+)/i);
  if (postMatch?.[1]) return { id: postMatch[1], isReel: false };

  // instagram.com/tv/ID
  const tvMatch = clean.match(/instagram\.com\/tv\/([^/?#\s]+)/i);
  if (tvMatch?.[1]) return { id: tvMatch[1], isReel: false };

  // instagr.am/p/ID
  const shortInstaMatch = clean.match(/instagr\.am\/(?:p|reel)\/([^/?#\s]+)/i);
  if (shortInstaMatch?.[1]) return { id: shortInstaMatch[1], isReel: true };

  return { id: null, isReel: false };
}

/**
 * Parse any video link and return complete embed information
 */
export function parseVideoUrl(url: string, declaredType?: 'youtube' | 'shorts' | 'instagram'): ParsedVideoInfo {
  if (!url) {
    return {
      type: 'youtube',
      embedUrl: '',
      cleanUrl: '',
    };
  }

  const trimmed = url.trim();

  // 1. Check YouTube
  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    const isShort = trimmed.includes('/shorts/') || declaredType === 'shorts';
    return {
      type: isShort ? 'shorts' : 'youtube',
      videoId: ytId,
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      cleanUrl: isShort ? `https://www.youtube.com/shorts/${ytId}` : `https://www.youtube.com/watch?v=${ytId}`,
    };
  }

  // 2. Check Instagram
  const insta = extractInstagramId(trimmed);
  if (insta.id) {
    const path = insta.isReel ? 'reel' : 'p';
    return {
      type: 'instagram',
      videoId: insta.id,
      embedUrl: `https://www.instagram.com/${path}/${insta.id}/embed/captioned/`,
      cleanUrl: `https://www.instagram.com/${path}/${insta.id}/`,
    };
  }

  // 3. Direct video files (mp4, webm, ogg, mov)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) || trimmed.startsWith('data:video/')) {
    return {
      type: 'direct',
      embedUrl: trimmed,
      cleanUrl: trimmed,
    };
  }

  // 4. Fallback: if user supplied an embed or link
  return {
    type: declaredType || 'youtube',
    embedUrl: trimmed,
    cleanUrl: trimmed,
  };
}
