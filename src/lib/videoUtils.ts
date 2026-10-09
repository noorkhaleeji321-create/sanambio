export interface ParsedVideo {
  type: 'youtube' | 'vimeo' | 'drive' | 'loom' | 'direct';
  embedUrl?: string;
  directUrl?: string;
  thumbnailUrl?: string;
  platformLabel: string;
}

/**
 * Normalizes any image URL (including Google Drive, Dropbox, etc.) to ensure it displays properly in <img> tags.
 */
export function formatImageUrl(url: string | undefined | null, fallback = 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/happy_active_elderly.jpg'): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Google Drive Image link conversion
  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i) || trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }

  // Dropbox direct link
  if (trimmed.includes('dropbox.com')) {
    return trimmed.replace('?dl=0', '?raw=1').replace('&dl=0', '&raw=1');
  }

  return trimmed;
}

/**
 * Parses any video URL (YouTube, Vimeo, Google Drive, Loom, direct MP4/WebM)
 */
export function parseVideoUrl(url: string | undefined | null): ParsedVideo {
  if (!url || typeof url !== 'string') {
    return {
      type: 'direct',
      directUrl: '',
      platformLabel: 'غير محدد'
    };
  }

  let trimmed = url.trim();

  // If user pasted iframe HTML tag like <iframe src="...">, extract the src URL
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    trimmed = iframeMatch[1].trim();
  }

  // 1. YouTube (Standard, Shorts, youtu.be, embed, live, v, watch)
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      platformLabel: 'YouTube'
    };
  }

  // 2. Vimeo
  const vimeoMatch = trimmed.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i
  );
  if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) {
    const vimeoId = vimeoMatch[3] || vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      platformLabel: 'Vimeo'
    };
  }

  // 3. Google Drive
  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i) || 
                     trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i) || 
                     trimmed.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      directUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
      thumbnailUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
      platformLabel: 'Google Drive'
    };
  }

  // 4. Loom
  const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
  if (loomMatch && loomMatch[1]) {
    return {
      type: 'loom',
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}?autoplay=1`,
      platformLabel: 'Loom'
    };
  }

  // 5. Direct Video File (Supabase Storage, MP4, WebM, OGG, blob, base64)
  const isSupabase = trimmed.includes('supabase.co/storage') || trimmed.includes('store_media');
  return {
    type: 'direct',
    directUrl: trimmed,
    platformLabel: isSupabase 
      ? 'Supabase Storage ☁️' 
      : trimmed.startsWith('data:') 
        ? 'فيديو مرفوع محلياً' 
        : 'ملف فيديو مباشر (MP4/WebM)'
  };
}

/**
 * Compresses an image File using HTML5 Canvas to ensure base64 strings remain compact (<200KB)
 * for instant, error-free sync with Supabase database.
 */
export function compressImageFile(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const resultStr = e.target?.result as string;
      if (!resultStr) {
        resolve('');
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(resultStr);
        }
      };
      img.onerror = () => resolve(resultStr);
      img.src = resultStr;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
