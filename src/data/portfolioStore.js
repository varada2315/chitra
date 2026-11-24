// Portfolio Data Store & Reactive Synchronization for Chitra Weddings
import { useState, useEffect } from 'react';
import initialCategories from './portfolioData.json';

const STORAGE_KEY = 'chitra_portfolio_data_v2';
const EVENT_NAME = 'chitra_portfolio_updated';

export function resolveAssetUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('/')
  ) {
    return url;
  }
  return `/${url}`;
}

// Format helper: ensure each category has both media array and photos array
export function normalizeCategory(cat) {
  const media = (cat.media && Array.isArray(cat.media) && cat.media.length > 0)
    ? cat.media.map(m => ({
        ...m,
        url: resolveAssetUrl(m.url),
        poster: m.poster ? resolveAssetUrl(m.poster) : undefined,
        thumbnail: m.thumbnail ? resolveAssetUrl(m.thumbnail) : undefined
      }))
    : (cat.photos || []).map((url, idx) => ({
        id: `${cat.id || 'cat'}-media-${idx}`,
        type: 'image',
        url: resolveAssetUrl(typeof url === 'string' ? url : url.url),
        title: `${cat.title || 'Portfolio'} ${idx + 1}`,
        caption: ''
      }));

  // Maintain backward-compatible array of image URLs
  const photos = media.map(m => (m.type === 'video' ? (m.poster || m.thumbnail || resolveAssetUrl(cat.coverImg)) : m.url)).filter(Boolean);
  const cover = resolveAssetUrl(cat.coverImg) || photos[0] || '/assets/images/collage_closeup.webp';

  return {
    ...cat,
    media,
    photos: photos.length > 0 ? photos : [cover],
    coverImg: cover,
    img: resolveAssetUrl(cat.img) || cover
  };
}

export function normalizeCategories(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeCategory);
}

// In-memory cache
let cachedCategories = null;

// Read from LocalStorage or Defaults
export function getStoredCategories() {
  if (cachedCategories) return cachedCategories;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedCategories = normalizeCategories(parsed);
        return cachedCategories;
      }
    }
  } catch (err) {
    console.warn('[PortfolioStore] Failed to read from localStorage:', err);
  }

  cachedCategories = normalizeCategories(initialCategories);
  return cachedCategories;
}

// Save categories to LocalStorage and Server API
export async function savePortfolioCategories(categories) {
  const normalized = normalizeCategories(categories);
  cachedCategories = normalized;

  // 1. Immediate client storage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (err) {
    console.warn('[PortfolioStore] LocalStorage set failed:', err);
  }

  // 2. Dispatch custom event for real-time reactivity in all open components
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: normalized }));

  // 3. Persist to Server if API is available
  try {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized)
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, serverSaved: true, message: 'Saved to server and local storage' };
    }
  } catch (err) {
    console.info('[PortfolioStore] Server API not reachable (running client-only mode):', err.message);
  }

  return { success: true, serverSaved: false, message: 'Saved to local browser storage' };
}

// Reset back to factory defaults
export async function resetPortfolioCategories() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }

  cachedCategories = normalizeCategories(initialCategories);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: cachedCategories }));

  try {
    await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(initialCategories)
    });
  } catch (e) {
    // ignore
  }

  return cachedCategories;
}

// Fetch from server on startup if available
export async function syncFromServer() {
  try {
    const res = await fetch('/api/portfolio');
    if (res.ok) {
      const serverData = await res.json();
      if (Array.isArray(serverData) && serverData.length > 0) {
        const normalized = normalizeCategories(serverData);
        cachedCategories = normalized;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: normalized }));
        return normalized;
      }
    }
  } catch (e) {
    // offline or static preview
  }
  return getStoredCategories();
}

// Helper: compress image file in browser
export function compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.88) {
  return new Promise((resolve, reject) => {
    // If it's a video file, don't compress via canvas
    if (file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = () => resolve({ dataUrl: reader.result, name: file.name, type: file.type });
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
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
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({ dataUrl, name: file.name, type: 'image/jpeg' });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Upload file to server via direct streaming with real-time progress
export async function uploadMedia(file, onProgress) {
  try {
    const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|avi|mkv|m4v)$/i.test(file.name);

    // 1. Direct Binary Streaming Upload via XHR (fastest, zero RAM buffering, real-time progress)
    return await new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const safeFilename = encodeURIComponent(file.name);

      xhr.open('POST', `/api/upload?filename=${safeFilename}`);
      xhr.setRequestHeader('x-filename', safeFilename);
      xhr.setRequestHeader('Content-Type', file.type || (isVideo ? 'video/mp4' : 'application/octet-stream'));

      if (onProgress && xhr.upload) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText);
            if (json.url) {
              resolve({ success: true, url: json.url, name: file.name });
              return;
            }
          } catch (e) {}
        }

        // For small images only, attempt Base64 JSON fallback if direct stream fails
        if (!isVideo && file.size < 8 * 1024 * 1024) {
          try {
            const { dataUrl } = await compressImage(file);
            const fallbackRes = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filename: file.name, data: dataUrl })
            });
            if (fallbackRes.ok) {
              const resJson = await fallbackRes.json();
              if (resJson.url) {
                resolve({ success: true, url: resJson.url, name: file.name });
                return;
              }
            }
            // Offline dataUrl fallback for images only
            resolve({ success: true, url: dataUrl, name: file.name });
            return;
          } catch (err) {}
        }

        let errMsg = `Upload failed with status ${xhr.status}`;
        try {
          const errJson = JSON.parse(xhr.responseText);
          if (errJson.error) errMsg = errJson.error;
        } catch (_) {}
        resolve({ success: false, error: errMsg });
      };

      xhr.onerror = () => {
        resolve({ success: false, error: 'Network error during upload. Please verify connection and try again.' });
      };

      xhr.ontimeout = () => {
        resolve({ success: false, error: 'Upload timed out. Try with a smaller file or faster network.' });
      };

      xhr.send(file);
    });
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// React Hook for auto-refreshing portfolio state
export function usePortfolioCategories() {
  const [categories, setCategories] = useState(() => getStoredCategories());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Sync from server on mount
    syncFromServer().then((data) => {
      if (data) setCategories(data);
      setIsReady(true);
    });

    // 2. Listen to custom in-page events
    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCategories(e.detail);
      }
    };

    // 3. Listen to cross-tab storage changes
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCategories(normalizeCategories(parsed));
          }
        } catch (err) {
          // ignore
        }
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return { categories, isReady };
}
