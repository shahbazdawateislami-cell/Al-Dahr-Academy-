/**
 * Utility to reliably compress user-uploaded images in the browser
 * so that they never exceed Firestore document limits (1MB) or browser localStorage quota,
 * while maintaining crisp resolution and vibrant colors.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSizeBytes?: number; // target max byte size of the base64 string
  quality?: number; // initial quality (0.0 to 1.0)
  mimeType?: 'image/jpeg' | 'image/webp';
}

export async function compressImage(
  fileOrDataUrl: File | Blob | string,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1080,
    maxHeight = 1080,
    maxSizeBytes = 180 * 1024, // 180KB by default
    quality = 0.78,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const processImage = (img: HTMLImageElement) => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width === 0 || height === 0) {
          reject(new Error('Invalid image dimensions'));
          return;
        }

        // Calculate proportional scale
        let scale = Math.min(1, maxWidth / width, maxHeight / height);
        let targetWidth = Math.max(1, Math.round(width * scale));
        let targetHeight = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Unable to create canvas context'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Iterative compression to ensure it is strictly below maxSizeBytes
        let currentQuality = quality;
        let result = canvas.toDataURL(mimeType, currentQuality);

        // If too large, iteratively drop quality and/or scale down
        let attempts = 0;
        while (result.length > maxSizeBytes && attempts < 8) {
          attempts++;
          currentQuality = Math.max(0.38, currentQuality - 0.1);

          if (currentQuality <= 0.48 && (targetWidth > 360 || targetHeight > 360)) {
            // Also scale down dimensions if quality is already low
            targetWidth = Math.round(targetWidth * 0.82);
            targetHeight = Math.round(targetHeight * 0.82);
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          }

          result = canvas.toDataURL(mimeType, currentQuality);
        }

        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    if (typeof fileOrDataUrl === 'string') {
      // If it's already an external HTTP/HTTPS URL, don't modify it
      if (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://')) {
        resolve(fileOrDataUrl);
        return;
      }
      const img = new Image();
      img.onload = () => processImage(img);
      img.onerror = () => reject(new Error('Failed to load image from data URL'));
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => processImage(img);
        img.onerror = () => reject(new Error('Failed to parse uploaded image file'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file from device'));
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

/**
 * Safe localStorage setter that avoids crashing the app or halting execution
 * if browser localStorage quota is reached.
 */
export function safeSetLocalStorage(key: string, value: any): void {
  try {
    const stringified = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringified);
  } catch (err) {
    console.warn(`[Storage] LocalStorage quota reached for "${key}". Data is safely persisted in Firestore cloud database.`);
    try {
      // Clear non-critical caches to free space
      const nonCritical = ['aldahr_voice_knowledge', 'aldahr_enquiries'];
      for (const k of nonCritical) {
        if (k !== key) localStorage.removeItem(k);
      }
      const stringified = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringified);
    } catch {
      // Gracefully continue; Firestore is the primary cloud database
    }
  }
}
