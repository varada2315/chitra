import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getStoredCategories,
  savePortfolioCategories,
  resetPortfolioCategories,
  uploadMedia,
  normalizeCategory,
  usePortfolioCategories,
  resolveAssetUrl
} from '../data/portfolioStore';

// Preset project assets for rapid selection
const PROJECT_PRESETS = [
  { url: 'assets/images/collage_closeup.webp', name: 'Collage Closeup', type: 'image' },
  { url: 'assets/images/exp_weddings.webp', name: 'Exp Weddings', type: 'image' },
  { url: 'assets/images/blog_dance.webp', name: 'Sangeet Dance', type: 'image' },
  { url: 'assets/images/hero_home.webp', name: 'Beachside Mandap', type: 'image' },
  { url: 'assets/images/blog_fence.webp', name: 'Rustic Couple Fence', type: 'image' },
  { url: 'assets/images/blog_walk.webp', name: 'Shore Walk', type: 'image' },
  { url: 'assets/images/fav_couple.webp', name: 'Intimate Couple Portrait', type: 'image' },
  { url: 'assets/images/rainbow_couple.webp', name: 'Rainbow Golden Hour', type: 'image' },
  { url: 'assets/images/blog_car.webp', name: 'Vintage Getaway Car', type: 'image' },
  { url: 'assets/images/collage_proposal.webp', name: 'Ring Proposal', type: 'image' },
  { url: 'assets/images/collage_smile.webp', name: 'Smiling Couple', type: 'image' },
  { url: 'assets/images/collage_piggyback.webp', name: 'Playful Sunset', type: 'image' },
  { url: 'assets/images/hero_meet_me.webp', name: 'Founder Candid', type: 'image' },
  { url: 'assets/images/meet_me_arch.webp', name: 'Heritage Arch', type: 'image' },
  { url: 'assets/images/bio_couple.webp', name: 'Editorial Couple', type: 'image' }
];

const VIDEO_PRESETS = [
  { videoType: 'vimeo', videoId: '332887606', title: 'Traditional Wedding Film', poster: 'assets/images/exp_weddings.webp' },
  { videoType: 'vimeo', videoId: '1027095536', title: 'Destination Wedding Film', poster: 'assets/images/bio_couple.webp' },
  { videoType: 'vimeo', videoId: '914290878', title: 'Pre-Wedding Cinematic Story', poster: 'assets/images/fav_couple.webp' },
  { videoType: 'vimeo', videoId: '382794147', title: 'Engagement Celebration Film', poster: 'assets/images/exp_couples.webp' },
  { videoType: 'vimeo', videoId: '891737638', title: 'Grand Ceremony Heritage', poster: 'assets/images/hero_home.webp' },
  { videoType: 'vimeo', videoId: '766281509', title: 'Destination Seaside Vows', poster: 'assets/images/hero_meet_me.webp' }
];

const STUDIO_PASSCODE = 'CW-7X9K-2026';
const AUTH_SESSION_KEY = 'cw_portal_session_v2';

export default function AdminPortfolio({ onNavigate }) {
  // Authentication state - never auto-unlocks from URL; requires explicit 1-click or passcode login
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chitra_admin_auth');
      return sessionStorage.getItem(AUTH_SESSION_KEY) === 'active';
    }
    return false;
  });
  const [passcode, setPasscode] = useState(STUDIO_PASSCODE);
  const [passcodeError, setPasscodeError] = useState('');

  // Main data state
  const { categories: initialStoreCategories } = usePortfolioCategories();
  const [categories, setCategories] = useState(() => getStoredCategories());
  const [activeCatIndex, setActiveCatIndex] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters & Views
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all' | 'image' | 'video'
  const [viewMode, setViewMode] = useState('manager'); // 'manager' | 'preview'

  // Modals
  const [mediaModal, setMediaModal] = useState(null); // { mode: 'add' | 'edit', type: 'image' | 'video', item?: obj, index?: number }
  const [catModal, setCatModal] = useState(null); // { mode: 'add' | 'edit' }
  const [libraryModal, setLibraryModal] = useState(false);
  const [backupModal, setBackupModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeVideoTest, setActiveVideoTest] = useState(null);

  // Sync when initial load arrives
  useEffect(() => {
    if (initialStoreCategories && initialStoreCategories.length > 0 && !isDirty) {
      setCategories(initialStoreCategories);
    }
  }, [initialStoreCategories, isDirty]);

  // Check if any modal is active
  const isAnyModalOpen = Boolean(
    mediaModal || catModal || libraryModal || backupModal || deleteConfirm !== null || activeVideoTest
  );

  // Lock background scroll completely when any modal is open
  useEffect(() => {
    if (isAnyModalOpen) {
      const origOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = origOverflow || '';
        document.documentElement.style.overflow = origHtmlOverflow || '';
      };
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [isAnyModalOpen]);

  // Clean up body overflow when leaving the admin page
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const authenticateSession = () => {
    localStorage.removeItem('chitra_admin_auth');
    sessionStorage.setItem(AUTH_SESSION_KEY, 'active');
    setIsAuthenticated(true);
    setPasscodeError('');
    showToast('Welcome to Chitra Weddings Portfolio Studio');
  };

  // Auth handler
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (passcode.trim() === STUDIO_PASSCODE) {
      authenticateSession();
    } else {
      setPasscodeError('Incorrect passcode. Please use the passcode displayed above.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chitra_admin_auth');
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
    showToast('Signed out of Portfolio Studio', 'info');
  };

  const currentCategory = categories[activeCatIndex] || categories[0];

  // ==========================================
  // CATEGORY OPERATIONS
  // ==========================================
  const handleSaveCategories = async (newCats = categories) => {
    const res = await savePortfolioCategories(newCats);
    setIsDirty(false);
    showToast(res.message || 'Portfolio published successfully!');
  };

  const updateCurrentCategory = (updater) => {
    const updated = categories.map((cat, idx) => {
      if (idx !== activeCatIndex) return cat;
      const modified = typeof updater === 'function' ? updater(cat) : { ...cat, ...updater };
      return normalizeCategory(modified);
    });
    setCategories(updated);
    setIsDirty(false);
    savePortfolioCategories(updated);
  };

  const handleAddCategory = (newCat) => {
    const created = normalizeCategory({
      id: newCat.id || `gallery-${Date.now()}`,
      stepNum: `0${categories.length + 1} / 0${categories.length + 1}`,
      num: `0${categories.length + 1}`,
      category: `0${categories.length + 1}. ${newCat.title}`,
      title: newCat.title,
      displayTitle: (newCat.title || '').toUpperCase(),
      sub: newCat.sub || 'Your love stories captured.',
      option: Number(newCat.option || 1),
      coverImg: newCat.coverImg || 'assets/images/collage_closeup.webp',
      img: newCat.coverImg || 'assets/images/collage_closeup.webp',
      media: [
        {
          id: `media-${Date.now()}-1`,
          type: 'image',
          url: newCat.coverImg || 'assets/images/collage_closeup.webp',
          title: 'Cover Photo',
          caption: ''
        }
      ]
    });
    const updated = [...categories, created];
    setCategories(updated);
    setActiveCatIndex(updated.length - 1);
    setIsDirty(false);
    savePortfolioCategories(updated);
    setCatModal(null);
    showToast(`Created new gallery: ${newCat.title}`);
  };

  const handleDeleteCategory = (index) => {
    if (categories.length <= 1) {
      showToast('You must have at least one portfolio category.', 'error');
      return;
    }
    const title = categories[index]?.title;
    const filtered = categories.filter((_, idx) => idx !== index);
    setCategories(filtered);
    setActiveCatIndex(Math.max(0, index - 1));
    setIsDirty(false);
    savePortfolioCategories(filtered);
    setDeleteConfirm(null);
    showToast(`Deleted category: ${title}`, 'info');
  };

  const handleReorderCategory = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;
    const cloned = [...categories];
    const [moved] = cloned.splice(index, 1);
    cloned.splice(target, 0, moved);
    setCategories(cloned);
    setActiveCatIndex(target);
    setIsDirty(false);
    savePortfolioCategories(cloned);
  };

  // ==========================================
  // MEDIA OPERATIONS (IMAGES & VIDEOS)
  // ==========================================
  const handleSaveMediaItem = (itemData) => {
    if (!currentCategory) return;
    const currentMedia = [...(currentCategory.media || [])];

    if (mediaModal.mode === 'edit' && typeof mediaModal.index === 'number') {
      // Edit existing image or video
      currentMedia[mediaModal.index] = {
        ...currentMedia[mediaModal.index],
        ...itemData
      };
      showToast(`Updated ${itemData.type === 'video' ? 'video' : 'image'}`);
    } else {
      // Add new image or video
      const newItem = {
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ...itemData
      };
      currentMedia.push(newItem);
      showToast(`Added new ${itemData.type === 'video' ? 'video' : 'image'} to ${currentCategory.title}`);
    }

    updateCurrentCategory((cat) => ({
      ...cat,
      media: currentMedia
    }));

    setMediaModal(null);
  };

  const handleDeleteMediaItem = (index) => {
    if (!currentCategory) return;
    const currentMedia = [...(currentCategory.media || [])];
    if (currentMedia.length <= 1) {
      showToast('Each category should keep at least one image or video.', 'error');
      return;
    }
    const item = currentMedia[index];
    currentMedia.splice(index, 1);

    updateCurrentCategory((cat) => ({
      ...cat,
      media: currentMedia,
      // If deleted item was the cover, fallback to first remaining item
      coverImg: cat.coverImg === item.url || cat.coverImg === item.poster ? (currentMedia[0]?.url || currentMedia[0]?.poster) : cat.coverImg
    }));

    showToast('Media removed');
  };

  const handleMoveMediaItem = (index, direction) => {
    if (!currentCategory) return;
    const currentMedia = [...(currentCategory.media || [])];
    const target = index + direction;
    if (target < 0 || target >= currentMedia.length) return;

    const [moved] = currentMedia.splice(index, 1);
    currentMedia.splice(target, 0, moved);

    updateCurrentCategory((cat) => ({
      ...cat,
      media: currentMedia
    }));
  };

  const handleSetCover = (item) => {
    const coverUrl = item.type === 'video' ? (item.poster || item.url) : item.url;
    updateCurrentCategory((cat) => ({
      ...cat,
      coverImg: coverUrl,
      img: coverUrl
    }));
    showToast(`Set as cover image for ${currentCategory.title}`);
  };

  // Batch Image Upload
  const handleBatchUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    showToast(`Uploading ${files.length} images...`, 'info');
    const newItems = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadMedia(file);
      if (res.success) {
        newItems.push({
          id: `media-${Date.now()}-${i}`,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: res.url,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
          caption: ''
        });
      }
    }

    if (newItems.length > 0) {
      updateCurrentCategory((cat) => ({
        ...cat,
        media: [...(cat.media || []), ...newItems]
      }));
      showToast(`Successfully added ${newItems.length} images!`);
    } else {
      showToast('Could not process selected files', 'error');
    }

    e.target.value = '';
  };

  // Add from Project Library Preset
  const handleAddFromLibrary = (preset) => {
    if (!currentCategory) return;
    const newItem = {
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: preset.type || 'image',
      url: preset.url || preset.poster,
      videoType: preset.videoType,
      videoId: preset.videoId,
      poster: preset.poster,
      title: preset.title || preset.name,
      caption: ''
    };

    updateCurrentCategory((cat) => ({
      ...cat,
      media: [...(cat.media || []), newItem]
    }));

    showToast(`Added ${preset.name || preset.title} to gallery`);
  };

  // ==========================================
  // BACKUP & RESTORE
  // ==========================================
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(categories, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chitra_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported portfolio JSON backup');
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(normalizeCategory);
          setCategories(normalized);
          setActiveCatIndex(0);
          setIsDirty(true);
          showToast('Imported portfolio data! Click "Publish Changes" to save.');
        } else {
          showToast('Invalid portfolio JSON structure', 'error');
        }
      } catch (err) {
        showToast('Error parsing JSON file: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Are you sure you want to reset all portfolio categories back to original defaults?')) {
      const reset = await resetPortfolioCategories();
      setCategories(reset);
      setActiveCatIndex(0);
      setIsDirty(false);
      showToast('Reset to original Chitra portfolio data');
    }
  };

  // ==========================================
  // RENDER: PASSCODE LOCK SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0a0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          color: '#eae5db',
          fontFamily: 'var(--sans)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            maxWidth: '440px',
            width: '100%',
            background: 'rgba(18, 18, 20, 0.94)',
            border: '1px solid rgba(179, 161, 128, 0.28)',
            borderRadius: '12px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.85)'
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--brass)' }}>
              CHITRA WEDDINGS
            </span>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.1rem', margin: '0.4rem 0 0.2rem', color: '#eae5db' }}>
              Portfolio Studio
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'rgba(234, 229, 219, 0.65)', margin: 0 }}>
              Authorized editor for portfolio imagery &amp; cinematic videos
            </p>
          </div>

          {/* PASSCODE DISPLAYED CLEARLY OUTSIDE FOR 1-CLICK ACCESS */}
          <div
            style={{
              background: 'rgba(179, 161, 128, 0.12)',
              border: '1px solid var(--brass)',
              borderRadius: '8px',
              padding: '1.25rem 1rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brass)', display: 'block', fontWeight: 600 }}>
              🔑 STUDIO ACCESS PASSWORD
            </span>
            <div style={{ fontFamily: 'monospace', fontSize: '1.45rem', fontWeight: 700, color: '#eae5db', letterSpacing: '0.14em', margin: '0.4rem 0 0.95rem' }}>
              {STUDIO_PASSCODE}
            </div>
            <button
              type="button"
              onClick={authenticateSession}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--brass)',
                color: '#0a0a0b',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(179, 161, 128, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              ⚡ 1-Click Login
            </button>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(234,229,219,0.7)', display: 'block', marginBottom: '0.35rem' }}>
                Or Sign In With Password
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter password displayed above"
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(179, 161, 128, 0.35)',
                  background: '#0d0d0f',
                  color: '#eae5db',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {passcodeError && (
              <div style={{ color: '#ff6b6b', fontSize: '0.8rem', textAlign: 'left' }}>
                {passcodeError}
              </div>
            )}

            <button
              type="submit"
              style={{
                padding: '0.8rem',
                borderRadius: '6px',
                border: '1px solid rgba(234,229,219,0.2)',
                background: 'rgba(234,229,219,0.06)',
                color: '#eae5db',
                fontWeight: 600,
                fontSize: '0.82rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
          </form>

          <div style={{ marginTop: '1.6rem', paddingTop: '1.1rem', borderTop: '1px solid rgba(234,229,219,0.1)' }}>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('home')}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(234,229,219,0.55)',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              &larr; Return to Website
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filtered media items for display
  const rawMedia = currentCategory?.media || [];
  const filteredMedia = rawMedia.filter((item) => {
    if (mediaFilter === 'image') return item.type !== 'video';
    if (mediaFilter === 'video') return item.type === 'video';
    return true;
  });

  return (
    <div style={{ background: '#0a0a0b', minHeight: '100vh', color: '#eae5db', fontFamily: 'var(--sans)', paddingBottom: '6rem' }}>
      
      {/* 1. TOP STUDIO HEADER */}
      <header
        style={{
          borderBottom: '1px solid rgba(234, 229, 219, 0.12)',
          background: 'rgba(10, 10, 11, 0.95)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          padding: '0.9rem clamp(1rem, 3.5vw, 2.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', color: 'var(--brass)', fontWeight: 600 }}>CHITRA</span>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#eae5db', opacity: 0.8 }}>WEDDINGS</span>
              <span style={{ fontSize: '0.62rem', background: 'rgba(179, 161, 128, 0.18)', color: 'var(--brass)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(179, 161, 128, 0.3)' }}>
                PORTFOLIO STUDIO
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'rgba(234,229,219,0.5)', marginTop: '0.1rem' }}>
              Editing: Portfolio Galleries &bull; Mixed Images &amp; Videos
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* View toggle */}
          <div style={{ display: 'inline-flex', background: 'rgba(234,229,219,0.06)', borderRadius: '6px', padding: '3px', border: '1px solid rgba(234,229,219,0.1)' }}>
            <button
              onClick={() => setViewMode('manager')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '4px',
                border: 'none',
                background: viewMode === 'manager' ? 'var(--brass)' : 'transparent',
                color: viewMode === 'manager' ? '#0a0a0b' : '#eae5db',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                cursor: 'pointer'
              }}
            >
              MEDIA MANAGER
            </button>
            <button
              onClick={() => setViewMode('preview')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '4px',
                border: 'none',
                background: viewMode === 'preview' ? 'var(--brass)' : 'transparent',
                color: viewMode === 'preview' ? '#0a0a0b' : '#eae5db',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                cursor: 'pointer'
              }}
            >
              LIVE PREVIEW
            </button>
          </div>



          {/* Save Button */}
          <button
            onClick={() => handleSaveCategories()}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '6px',
              border: 'none',
              background: isDirty ? '#d4af37' : 'rgba(234,229,219,0.15)',
              color: isDirty ? '#0a0a0b' : 'rgba(234,229,219,0.6)',
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              cursor: isDirty ? 'pointer' : 'default',
              boxShadow: isDirty ? '0 0 16px rgba(212, 175, 55, 0.5)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            {isDirty ? 'PUBLISH CHANGES ★' : 'ALL CHANGES SAVED'}
          </button>

          <button
            onClick={() => onNavigate && onNavigate('home')}
            title="Return to Public Website"
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid rgba(234,229,219,0.15)',
              background: 'transparent',
              color: 'rgba(234,229,219,0.7)',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            Website ↗
          </button>

          <button
            onClick={handleLogout}
            title="Lock Studio"
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid rgba(234,229,219,0.15)',
              background: 'transparent',
              color: 'rgba(234,229,219,0.6)',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            Lock 🔒
          </button>
        </div>
      </header>

      {/* Unsaved changes notice bar */}
      {isDirty && (
        <div
          style={{
            background: 'linear-gradient(90deg, #b3a180 0%, #d4af37 100%)',
            color: '#0a0a0b',
            padding: '0.45rem 1.5rem',
            textAlign: 'center',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}
        >
          <span>You have unsaved changes in your portfolio.</span>
          <button
            onClick={() => handleSaveCategories()}
            style={{
              background: '#0a0a0b',
              color: '#fff',
              border: 'none',
              padding: '0.2rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Publish Now
          </button>
        </div>
      )}

      {/* Main Container */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem clamp(1rem, 3.5vw, 2.5rem)' }}>
        
        {/* 2. CATEGORY TABS SELECTOR & MANAGEMENT */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brass)' }}>
              PORTFOLIO GALLERIES / CATEGORIES ({categories.length})
            </span>
          </div>

          {/* Category Tabs Pill Bar */}
          <div
            style={{
              display: 'flex',
              gap: '0.6rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              scrollbarWidth: 'thin'
            }}
          >
            {categories.map((cat, idx) => {
              const isActive = idx === activeCatIndex;
              const count = cat.media?.length || cat.photos?.length || 0;
              const videoCount = (cat.media || []).filter((m) => m.type === 'video').length;

              return (
                <div
                  key={cat.id || idx}
                  onClick={() => setActiveCatIndex(idx)}
                  style={{
                    background: isActive ? 'rgba(179, 161, 128, 0.18)' : 'rgba(234, 229, 219, 0.04)',
                    border: isActive ? '1px solid var(--brass)' : '1px solid rgba(234, 229, 219, 0.1)',
                    borderRadius: '8px',
                    padding: '0.7rem 1.1rem',
                    cursor: 'pointer',
                    minWidth: '180px',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '0.2rem' }}>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      {videoCount > 0 && (
                        <span style={{ fontSize: '0.6rem', background: 'rgba(212, 175, 55, 0.2)', color: 'var(--brass)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                          🎬 {videoCount}
                        </span>
                      )}
                      <span style={{ fontSize: '0.62rem', color: 'rgba(234,229,219,0.6)' }}>
                        {count} items
                      </span>
                    </div>
                  </div>
                  <h4 style={{ margin: '0.2rem 0 0.1rem', fontSize: '0.95rem', color: isActive ? '#fff' : '#eae5db', fontWeight: 600 }}>
                    {cat.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(234,229,219,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.sub || 'No description'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. ACTIVE CATEGORY HEADER & DETAILS BAR */}
        {currentCategory && (
          <div
            style={{
              background: 'rgba(18, 18, 20, 0.8)',
              border: '1px solid rgba(234, 229, 219, 0.12)',
              borderRadius: '10px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              {/* Category Cover Thumbnail */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid var(--brass)',
                  flexShrink: 0
                }}
              >
                <img
                  src={currentCategory.coverImg || currentCategory.img || currentCategory.photos?.[0]}
                  alt="Category Cover"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', margin: 0, color: '#eae5db' }}>
                    {currentCategory.title}
                  </h2>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', background: 'rgba(234,229,219,0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--brass)' }}>
                    LAYOUT: OPTION {currentCategory.option || 1}
                  </span>
                </div>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'rgba(234, 229, 219, 0.6)' }}>
                  {currentCategory.sub} &bull; Display Heading: <strong>{currentCategory.displayTitle}</strong>
                </p>
              </div>
            </div>

            {/* Category Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleReorderCategory(activeCatIndex, -1)}
                disabled={activeCatIndex === 0}
                title="Move Gallery Left"
                style={{
                  padding: '0.4rem 0.7rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(234,229,219,0.15)',
                  background: 'transparent',
                  color: activeCatIndex === 0 ? 'rgba(234,229,219,0.2)' : '#eae5db',
                  cursor: activeCatIndex === 0 ? 'default' : 'pointer'
                }}
              >
                &larr; Move
              </button>
              <button
                onClick={() => handleReorderCategory(activeCatIndex, 1)}
                disabled={activeCatIndex === categories.length - 1}
                title="Move Gallery Right"
                style={{
                  padding: '0.4rem 0.7rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(234,229,219,0.15)',
                  background: 'transparent',
                  color: activeCatIndex === categories.length - 1 ? 'rgba(234,229,219,0.2)' : '#eae5db',
                  cursor: activeCatIndex === categories.length - 1 ? 'default' : 'pointer'
                }}
              >
                Move &rarr;
              </button>
              <button
                onClick={() => setCatModal({ mode: 'edit', cat: currentCategory })}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(234,229,219,0.2)',
                  background: 'rgba(234,229,219,0.06)',
                  color: '#eae5db',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Edit Details
              </button>
              <button
                onClick={() => setDeleteConfirm(activeCatIndex)}
                disabled={categories.length <= 1}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  background: 'rgba(255, 107, 107, 0.08)',
                  color: '#ff8585',
                  fontSize: '0.74rem',
                  cursor: categories.length <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* 4. MEDIA MANAGER VIEW */}
        {viewMode === 'manager' && currentCategory && (
          <div>
            {/* Media Action Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.25rem'
              }}
            >
              {/* Media Filter Tabs */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[
                  { id: 'all', label: `All Media (${rawMedia.length})` },
                  { id: 'image', label: `Photos (${rawMedia.filter((m) => m.type !== 'video').length})` },
                  { id: 'video', label: `Videos (${rawMedia.filter((m) => m.type === 'video').length})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setMediaFilter(f.id)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '4px',
                      border: mediaFilter === f.id ? '1px solid var(--brass)' : '1px solid rgba(234,229,219,0.1)',
                      background: mediaFilter === f.id ? 'rgba(179,161,128,0.15)' : 'transparent',
                      color: mediaFilter === f.id ? 'var(--brass)' : 'rgba(234,229,219,0.7)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Add Buttons */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setMediaModal({ mode: 'add', type: 'image' })}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid var(--brass)',
                    background: 'var(--brass)',
                    color: '#0a0a0b',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>+ Add Photo</span>
                </button>

                <button
                  onClick={() => setMediaModal({ mode: 'add', type: 'video' })}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(179, 161, 128, 0.4)',
                    background: 'rgba(179, 161, 128, 0.12)',
                    color: '#eae5db',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>🎬 + Add Video</span>
                </button>


              </div>
            </div>

            {/* Media Items Grid */}
            {filteredMedia.length === 0 ? (
              <div
                style={{
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  background: 'rgba(18,18,20,0.4)',
                  borderRadius: '8px',
                  border: '1px dashed rgba(234,229,219,0.15)'
                }}
              >
                <p style={{ margin: 0, color: 'rgba(234,229,219,0.6)', fontSize: '0.9rem' }}>
                  No media items match the selected filter.
                </p>
                <button
                  onClick={() => setMediaFilter('all')}
                  style={{
                    marginTop: '0.8rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--brass)',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Show all media &rarr;
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.25rem'
                }}
              >
                {filteredMedia.map((item, idx) => {
                  const isVideo = item.type === 'video';
                  const isCover = (currentCategory.coverImg === item.url) || (isVideo && currentCategory.coverImg === item.poster);
                  const displayThumb = isVideo ? (item.poster || item.thumbnail || 'assets/images/exp_weddings.webp') : item.url;
                  const originalIndex = rawMedia.indexOf(item);

                  return (
                    <motion.div
                      key={item.id || idx}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        background: 'rgba(18, 18, 20, 0.9)',
                        border: isCover ? '1px solid var(--brass)' : '1px solid rgba(234, 229, 219, 0.1)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                      }}
                    >
                      {/* Media Thumbnail Container */}
                      <div style={{ position: 'relative', width: '100%', height: '190px', background: '#000', overflow: 'hidden' }}>
                        {isVideo && (item.videoType === 'direct' || !item.poster || item.url?.includes('assets/uploads/') || /\.(mp4|webm|mov)$/i.test(item.url)) ? (
                          <video
                            src={`${resolveAssetUrl(item.url)}#t=0.001`}
                            preload="metadata"
                            muted
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <img
                            src={resolveAssetUrl(displayThumb)}
                            alt={item.title || 'Portfolio item'}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}

                        {/* Top Badges */}
                        <div style={{ position: 'absolute', top: '0.6rem', left: '0.6rem', display: 'flex', gap: '0.4rem', zIndex: 2 }}>
                          {isVideo ? (
                            <span style={{ background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(4px)', color: 'var(--brass)', border: '1px solid rgba(179,161,128,0.4)', fontSize: '0.62rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                              🎬 VIDEO ({item.videoType || 'vimeo'})
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(4px)', color: '#eae5db', border: '1px solid rgba(234,229,219,0.2)', fontSize: '0.62rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                              📷 PHOTO
                            </span>
                          )}
                          {isCover && (
                            <span style={{ background: 'var(--brass)', color: '#0a0a0b', fontSize: '0.62rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                              ★ COVER
                            </span>
                          )}
                        </div>

                        {/* Video Play Overlay button */}
                        {isVideo && (
                          <div
                            onClick={() => setActiveVideoTest(item)}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(0,0,0,0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <div
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: 'rgba(10, 10, 11, 0.8)',
                                border: '1px solid var(--brass)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--brass)'
                              }}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Content & Details */}
                      <div style={{ padding: '0.9rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                            <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#eae5db', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.title || (isVideo ? 'Cinematic Video' : 'Untitled Photo')}
                            </h4>
                            <span style={{ fontSize: '0.65rem', color: 'rgba(234,229,219,0.4)' }}>
                              #{originalIndex + 1}
                            </span>
                          </div>
                          {item.caption && (
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.74rem', color: 'rgba(234,229,219,0.55)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.caption}
                            </p>
                          )}
                          {isVideo && (
                            <p style={{ margin: '0.3rem 0 0', fontSize: '0.68rem', color: 'var(--brass)' }}>
                              {item.videoType?.toUpperCase()}: {item.videoId || item.url}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons Row */}
                        <div style={{ marginTop: '0.9rem', paddingTop: '0.7rem', borderTop: '1px solid rgba(234,229,219,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <button
                              onClick={() => handleMoveMediaItem(originalIndex, -1)}
                              disabled={originalIndex === 0}
                              title="Move Earlier"
                              style={{
                                padding: '0.3rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid rgba(234,229,219,0.15)',
                                background: 'transparent',
                                color: originalIndex === 0 ? 'rgba(234,229,219,0.2)' : '#eae5db',
                                cursor: originalIndex === 0 ? 'default' : 'pointer',
                                fontSize: '0.7rem'
                              }}
                            >
                              &uarr;
                            </button>
                            <button
                              onClick={() => handleMoveMediaItem(originalIndex, 1)}
                              disabled={originalIndex === rawMedia.length - 1}
                              title="Move Later"
                              style={{
                                padding: '0.3rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid rgba(234,229,219,0.15)',
                                background: 'transparent',
                                color: originalIndex === rawMedia.length - 1 ? 'rgba(234,229,219,0.2)' : '#eae5db',
                                cursor: originalIndex === rawMedia.length - 1 ? 'default' : 'pointer',
                                fontSize: '0.7rem'
                              }}
                            >
                              &darr;
                            </button>
                          </div>

                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            {!isCover && (
                              <button
                                onClick={() => handleSetCover(item)}
                                title="Set as Gallery Cover"
                                style={{
                                  padding: '0.3rem 0.55rem',
                                  borderRadius: '4px',
                                  border: '1px solid rgba(179,161,128,0.4)',
                                  background: 'rgba(179,161,128,0.08)',
                                  color: 'var(--brass)',
                                  fontSize: '0.68rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Set Cover
                              </button>
                            )}

                            <button
                              onClick={() => setMediaModal({ mode: 'edit', type: isVideo ? 'video' : 'image', item, index: originalIndex })}
                              style={{
                                padding: '0.3rem 0.65rem',
                                borderRadius: '4px',
                                border: '1px solid rgba(234,229,219,0.2)',
                                background: 'rgba(234,229,219,0.08)',
                                color: '#eae5db',
                                fontSize: '0.68rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteMediaItem(originalIndex)}
                              style={{
                                padding: '0.3rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid rgba(255,107,107,0.3)',
                                background: 'rgba(255,107,107,0.08)',
                                color: '#ff8585',
                                fontSize: '0.68rem',
                                cursor: 'pointer'
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. LIVE PREVIEW VIEW */}
        {viewMode === 'preview' && currentCategory && (
          <div style={{ background: '#0e0e11', border: '1px solid rgba(234,229,219,0.12)', borderRadius: '12px', padding: '2rem', minHeight: '600px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)' }}>
                LIVE PREVIEW
              </span>
              <h1 className="display" style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)', margin: '0.5rem 0' }}>
                {currentCategory.title}
              </h1>
              <p style={{ fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'rgba(234,229,219,0.7)', margin: 0 }}>
                {currentCategory.sub}
              </p>
            </div>

            {/* Layout based on currentCategory.option */}
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: currentCategory.option === 3 ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {rawMedia.map((m, idx) => {
                  const isVideo = m.type === 'video';
                  const isDirectVideo = isVideo && (m.videoType === 'direct' || !m.poster || m.url?.includes('assets/uploads/') || /\.(mp4|webm|mov)$/i.test(m.url));
                  const resolvedUrl = resolveAssetUrl(m.url);
                  const posterUrl = m.poster ? resolveAssetUrl(m.poster) : '';

                  return (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        aspectRatio: idx % 3 === 0 ? '16/10' : '3/4',
                        background: '#000',
                        border: '1px solid rgba(234,229,219,0.1)'
                      }}
                    >
                      {isDirectVideo ? (
                        <video
                          src={`${resolvedUrl}#t=0.001`}
                          preload="metadata"
                          muted
                          playsInline
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <img
                          src={posterUrl || resolvedUrl}
                          alt={m.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                      {isVideo && (
                        <div
                          onClick={() => setActiveVideoTest(m)}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(10,10,11,0.85)', border: '1px solid var(--brass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brass)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.8rem', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', pointerEvents: 'none' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#eae5db' }}>{m.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          MODAL: ADD / EDIT PHOTO OR VIDEO
      ======================================================== */}
      <AnimatePresence>
        {mediaModal && (
          <MediaEditorModal
            modalState={mediaModal}
            onClose={() => setMediaModal(null)}
            onSave={handleSaveMediaItem}
          />
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL: ADD / EDIT CATEGORY
      ======================================================== */}
      <AnimatePresence>
        {catModal && (
          <CategoryEditorModal
            modalState={catModal}
            onClose={() => setCatModal(null)}
            onSave={(data) => {
              if (catModal.mode === 'edit') {
                updateCurrentCategory(data);
                setCatModal(null);
                showToast('Updated gallery details');
              } else {
                handleAddCategory(data);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL: ASSET LIBRARY PICKER
      ======================================================== */}
      <AnimatePresence>
        {libraryModal && (
          <AssetLibraryModal
            onClose={() => setLibraryModal(false)}
            onSelect={(item) => {
              handleAddFromLibrary(item);
              setLibraryModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL: BACKUP & EXPORT / IMPORT TOOLS
      ======================================================== */}
      <AnimatePresence>
        {backupModal && (
          <BackupModal
            categories={categories}
            onClose={() => setBackupModal(false)}
            onExport={handleExportJson}
            onImport={handleImportJson}
            onReset={handleResetDefaults}
          />
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL: VIDEO PLAYER TEST
      ======================================================== */}
      <AnimatePresence>
        {activeVideoTest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setActiveVideoTest(null); }}
            onWheel={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 5000,
              background: 'rgba(0,0,0,0.92)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: 'clamp(0.75rem, 3vh, 2rem) clamp(0.75rem, 3vw, 1.5rem)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            <div 
              style={{ maxWidth: '900px', width: '100%', margin: 'auto 0', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.8rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#eae5db', fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' }}>{activeVideoTest.title}</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--brass)' }}>
                    {activeVideoTest.videoType?.toUpperCase()}: {activeVideoTest.videoId || activeVideoTest.url}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideoTest(null)}
                  aria-label="Close video test preview"
                  style={{
                    background: 'rgba(234,229,219,0.1)',
                    border: '1px solid rgba(234,229,219,0.25)',
                    color: '#eae5db',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    flexShrink: 0
                  }}
                >
                  <span>CLOSE</span>
                  <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>✕</span>
                </button>
              </div>

              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                {activeVideoTest.videoType === 'vimeo' && activeVideoTest.videoId ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${activeVideoTest.videoId}?autoplay=1&title=0&byline=0&portrait=0`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : activeVideoTest.videoType === 'youtube' && activeVideoTest.videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideoTest.videoId}?autoplay=1`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={resolveAssetUrl(activeVideoTest.url)}
                    controls
                    autoPlay
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL: DELETE CONFIRMATION
      ======================================================== */}
      {deleteConfirm !== null && (
        <div
          onWheel={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 6000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overscrollBehavior: 'contain'
          }}
        >
          <div style={{ background: '#121214', border: '1px solid rgba(234,229,219,0.2)', borderRadius: '8px', padding: '2rem', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 0.8rem', color: '#eae5db' }}>Delete Gallery Category?</h3>
            <p style={{ margin: '0 0 1.5rem', color: 'rgba(234,229,219,0.7)', fontSize: '0.85rem' }}>
              Are you sure you want to delete <strong>{categories[deleteConfirm]?.title}</strong>? All media items inside will be removed from this category.
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{ padding: '0.6rem 1.2rem', borderRadius: '4px', border: '1px solid rgba(234,229,219,0.2)', background: 'transparent', color: '#eae5db', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(deleteConfirm)}
                style={{ padding: '0.6rem 1.2rem', borderRadius: '4px', border: 'none', background: '#ff6b6b', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: toast.type === 'error' ? '#991b1b' : toast.type === 'info' ? '#1e293b' : '#143825',
              border: `1px solid ${toast.type === 'error' ? '#f87171' : toast.type === 'info' ? '#64748b' : '#34d399'}`,
              color: '#fff',
              padding: '0.85rem 1.4rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 500,
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <span>{toast.type === 'error' ? '⚠️' : '✓'}</span>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ====================================================================
// SUB-COMPONENT: MEDIA EDITOR MODAL (PHOTO OR VIDEO)
// ====================================================================
function MediaEditorModal({ modalState, onClose, onSave }) {
  const { mode, type: initialType, item } = modalState;
  const [mediaType, setMediaType] = useState(item?.type || initialType || 'image');

  // Common fields
  const [title, setTitle] = useState(item?.title || '');
  const [caption, setCaption] = useState(item?.caption || '');

  // Image specific
  const [url, setUrl] = useState(item?.url || '');

  // Video specific: clean & direct (upload video + cover photo)
  const getInitialVideoUrl = () => {
    if (!item) return '';
    if (item.url) return item.url;
    if (item.videoType === 'vimeo' && item.videoId) return `https://vimeo.com/${item.videoId}`;
    if (item.videoType === 'youtube' && item.videoId) return `https://www.youtube.com/watch?v=${item.videoId}`;
    return '';
  };

  const [videoUrl, setVideoUrl] = useState(getInitialVideoUrl);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewError, setPreviewError] = useState(false);
  const [fitMode, setFitMode] = useState('contain'); // 'contain' displays complete photo without crop
  const [isEnlarged, setIsEnlarged] = useState(false);

  // Auto-reset preview error when inputs change
  useEffect(() => {
    setPreviewError(false);
  }, [url, videoUrl, mediaType]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const res = await uploadMedia(file);
    setUploadingImage(false);

    if (res.success) {
      setUrl(res.url);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
    } else {
      alert('Upload failed: ' + (res.error || 'Unknown error'));
    }
    e.target.value = '';
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    setUploadProgress(0);

    const res = await uploadMedia(file, (percent) => {
      setUploadProgress(percent);
    });

    setUploadingVideo(false);
    setUploadProgress(0);

    if (res.success) {
      setVideoUrl(res.url);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
    } else {
      alert('Video upload failed: ' + (res.error || 'Unknown error'));
    }
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mediaType === 'image') {
      if (!url.trim()) {
        alert('Please provide an image URL or upload an image.');
        return;
      }
      onSave({
        type: 'image',
        title: title.trim() || 'Wedding Photo',
        caption: caption.trim(),
        url: url.trim()
      });
      return;
    }

    if (mediaType === 'video') {
      const trimmedVideo = videoUrl.trim();
      if (!trimmedVideo) {
        alert('Please upload a video file or enter a video link.');
        return;
      }

      // Auto-detect provider if user pasted Vimeo or YouTube link, otherwise direct video
      let detectedType = 'direct';
      let detectedId = '';

      if (trimmedVideo.includes('vimeo.com/')) {
        const match = trimmedVideo.match(/vimeo\.com\/(\d+)/);
        if (match) {
          detectedType = 'vimeo';
          detectedId = match[1];
        }
      } else if (trimmedVideo.includes('youtube.com/') || trimmedVideo.includes('youtu.be/')) {
        const match = trimmedVideo.match(/(?:youtu\.be\/|v=)([\w-]+)/);
        if (match) {
          detectedType = 'youtube';
          detectedId = match[1];
        }
      }

      const defaultPoster = detectedType === 'youtube' && detectedId
        ? `https://img.youtube.com/vi/${detectedId}/maxresdefault.jpg`
        : (item?.poster || 'assets/images/exp_weddings.webp');

      onSave({
        type: 'video',
        title: title.trim() || 'Cinematic Video',
        caption: caption.trim(),
        url: trimmedVideo,
        videoType: detectedType,
        videoId: detectedId || undefined,
        poster: defaultPoster
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5000,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 3vh, 2rem) clamp(0.75rem, 3vw, 1.5rem)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background: '#121215',
          border: '1px solid rgba(179,161,128,0.3)',
          borderRadius: '12px',
          maxWidth: '580px',
          width: '100%',
          maxHeight: 'min(92vh, 92dvh)',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto 0',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Sticky Header with prominent Close Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid rgba(234,229,219,0.12)',
            background: '#16161a',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            flexShrink: 0
          }}
        >
          <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', color: '#eae5db' }}>
            {mode === 'edit' ? 'Edit Existing Media' : 'Add New Media Item'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'rgba(234,229,219,0.1)',
              border: '1px solid rgba(234,229,219,0.25)',
              color: '#eae5db',
              borderRadius: '6px',
              padding: '0.45rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              flexShrink: 0
            }}
          >
            <span>CLOSE</span>
            <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>✕</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, margin: 0, overflow: 'hidden' }}>
          {/* Scrollable Form Body */}
          <div style={{ padding: '1.4rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.1rem', overscrollBehavior: 'contain' }}>
            {/* Media Type Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(234,229,219,0.06)', padding: '4px', borderRadius: '6px' }}>
              <button
                type="button"
                onClick={() => setMediaType('image')}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: mediaType === 'image' ? 'var(--brass)' : 'transparent',
                  color: mediaType === 'image' ? '#0a0a0b' : '#eae5db',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                📷 Image
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: mediaType === 'video' ? 'var(--brass)' : 'transparent',
                  color: mediaType === 'video' ? '#0a0a0b' : '#eae5db',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                🎬 Cinematic Video
              </button>
            </div>
          
          {/* Title & Caption */}
          <div>
            <label style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(234,229,219,0.7)', display: 'block', marginBottom: '0.3rem' }}>
              Title / Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mandap Moments, Cinematic Teaser"
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: '6px',
                border: '1px solid rgba(234,229,219,0.2)',
                background: '#0a0a0b',
                color: '#eae5db',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(234,229,219,0.7)', display: 'block', marginBottom: '0.3rem' }}>
              Subtitle / Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Traditional Vedic Rituals, Sunset Session"
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: '6px',
                border: '1px solid rgba(234,229,219,0.2)',
                background: '#0a0a0b',
                color: '#eae5db',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Conditional: PHOTO INPUT */}
          {mediaType === 'image' && (
            <div>
              <label style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(234,229,219,0.7)', display: 'block', marginBottom: '0.3rem' }}>
                Image Source
              </label>

              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem' }}>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste URL or assets/images/... path"
                  style={{
                    flex: 1,
                    padding: '0.7rem 0.9rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(234,229,219,0.2)',
                    background: '#0a0a0b',
                    color: '#eae5db',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <label
                  style={{
                    padding: '0.7rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid var(--brass)',
                    background: 'rgba(179,161,128,0.12)',
                    color: 'var(--brass)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Quick image preset buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'rgba(234,229,219,0.4)', alignSelf: 'center' }}>Presets:</span>
                {['assets/images/collage_closeup.webp', 'assets/images/exp_weddings.webp', 'assets/images/blog_dance.webp', 'assets/images/hero_home.webp', 'assets/images/fav_couple.webp'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setUrl(p)}
                    style={{
                      background: 'rgba(234,229,219,0.06)',
                      border: '1px solid rgba(234,229,219,0.1)',
                      color: 'rgba(234,229,219,0.7)',
                      fontSize: '0.62rem',
                      padding: '0.2rem 0.45rem',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    {p.split('/').pop()}
                  </button>
                ))}
              </div>

              {/* Interactive High-Fidelity Image Preview */}
              {url && (
                <div style={{ marginTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brass)', fontWeight: 600 }}>
                      Image Preview
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}
                        style={{
                          background: 'rgba(234,229,219,0.08)',
                          border: '1px solid rgba(234,229,219,0.2)',
                          color: '#eae5db',
                          fontSize: '0.65rem',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {fitMode === 'contain' ? 'Fit Whole Photo ✓' : 'Crop & Fill'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEnlarged(true)}
                        style={{
                          background: 'rgba(179,161,128,0.12)',
                          border: '1px solid var(--brass)',
                          color: 'var(--brass)',
                          fontSize: '0.65rem',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        🔍 Enlarge
                      </button>
                    </div>
                  </div>

                  <div
                    onClick={() => setIsEnlarged(true)}
                    title="Click to view full size"
                    style={{
                      width: '100%',
                      height: '240px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid rgba(179,161,128,0.3)',
                      background: '#070709',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      cursor: 'zoom-in'
                    }}
                  >
                    <img
                      src={resolveAssetUrl(url)}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: fitMode,
                        display: previewError ? 'none' : 'block'
                      }}
                      onError={() => setPreviewError(true)}
                    />
                    {previewError && (
                      <div style={{ color: '#ff8585', fontSize: '0.78rem', textAlign: 'center', padding: '1rem' }}>
                        Unable to load image from "{url}". Please verify the path or upload a file.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Conditional: VIDEO INPUT (UPLOAD VIDEO + COVER PHOTO ONLY) */}
          {mediaType === 'video' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {/* 1. Upload Video */}
              <div>
                <label style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(234,229,219,0.7)', display: 'block', marginBottom: '0.35rem' }}>
                  Video File or URL
                </label>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="assets/uploads/... or paste video link"
                    style={{
                      flex: 1,
                      padding: '0.7rem 0.9rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(234,229,219,0.2)',
                      background: '#0a0a0b',
                      color: '#eae5db',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <label
                    style={{
                      padding: '0.7rem 1.1rem',
                      borderRadius: '6px',
                      border: '1px solid var(--brass)',
                      background: 'rgba(179,161,128,0.12)',
                      color: 'var(--brass)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: uploadingVideo ? 'wait' : 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      opacity: uploadingVideo ? 0.8 : 1
                    }}
                  >
                    {uploadingVideo ? (uploadProgress > 0 ? `Uploading ${uploadProgress}%...` : 'Uploading...') : 'Upload Video'}
                    <input
                      type="file"
                      accept="video/*"
                      disabled={uploadingVideo}
                      onChange={handleVideoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {uploadingVideo && (
                  <div style={{ marginTop: '0.5rem', width: '100%', background: 'rgba(234,229,219,0.1)', borderRadius: '99px', height: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        background: 'var(--brass)',
                        transition: 'width 0.2s ease'
                      }}
                    />
                  </div>
                )}
                {videoUrl && (
                  <div style={{ marginTop: '0.35rem', fontSize: '0.72rem', color: 'rgba(234,229,219,0.6)' }}>
                    ✓ Selected video: {videoUrl.split('/').pop()}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Fullscreen Enlarge Lightbox for Modal */}
          {isEnlarged && url && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsEnlarged(false);
              }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 7000,
                background: 'rgba(5,5,6,0.96)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                cursor: 'zoom-out'
              }}
            >
              <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
                <img
                  src={resolveAssetUrl(url)}
                  alt="Enlarged"
                  style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEnlarged(false);
                  }}
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: 0,
                    background: 'none',
                    border: 'none',
                    color: '#eae5db',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  CLOSE ✕
                </button>
              </div>
            </div>
          )}

          </div>

          {/* Sticky Form Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '0.8rem',
              padding: '1rem 1.4rem',
              borderTop: '1px solid rgba(234,229,219,0.1)',
              background: '#16161a',
              justifyContent: 'flex-end',
              flexShrink: 0
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.2rem',
                borderRadius: '6px',
                border: '1px solid rgba(234,229,219,0.2)',
                background: 'transparent',
                color: '#eae5db',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.65rem 1.4rem',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--brass)',
                color: '#0a0a0b',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              {mode === 'edit' ? 'Save Changes' : 'Add to Gallery'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ====================================================================
// SUB-COMPONENT: CATEGORY EDITOR MODAL
// ====================================================================
function CategoryEditorModal({ modalState, onClose, onSave }) {
  const { mode, cat } = modalState;
  const [title, setTitle] = useState(cat?.title || '');
  const [displayTitle, setDisplayTitle] = useState(cat?.displayTitle || '');
  const [sub, setSub] = useState(cat?.sub || '');
  const [stepNum, setStepNum] = useState(cat?.stepNum || '01 / 03');
  const [option, setOption] = useState(cat?.option || 1);
  const [coverImg, setCoverImg] = useState(cat?.coverImg || 'assets/images/collage_closeup.webp');

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!displayTitle || displayTitle === title.toUpperCase()) {
      setDisplayTitle(val.toUpperCase());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title.');
      return;
    }

    onSave({
      ...(cat || {}),
      title: title.trim(),
      displayTitle: displayTitle.trim() || title.trim().toUpperCase(),
      sub: sub.trim(),
      stepNum: stepNum.trim(),
      option: Number(option),
      coverImg: coverImg.trim(),
      img: coverImg.trim()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5000,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 3vh, 2rem) clamp(0.75rem, 3vw, 1.5rem)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background: '#121215',
          border: '1px solid rgba(179,161,128,0.3)',
          borderRadius: '12px',
          maxWidth: '540px',
          width: '100%',
          maxHeight: 'min(92vh, 92dvh)',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto 0',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Sticky Header with prominent, accessible Close Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid rgba(234,229,219,0.12)',
            background: '#16161a',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            flexShrink: 0
          }}
        >
          <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', color: '#eae5db' }}>
            {mode === 'edit' ? 'Edit Gallery Details' : 'Create New Portfolio Category'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'rgba(234,229,219,0.1)',
              border: '1px solid rgba(234,229,219,0.25)',
              color: '#eae5db',
              borderRadius: '6px',
              padding: '0.45rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              flexShrink: 0
            }}
          >
            <span>CLOSE</span>
            <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>✕</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, margin: 0, overflow: 'hidden' }}>
          {/* Scrollable Form Body */}
          <div style={{ padding: '1.4rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overscrollBehavior: 'contain' }}>
            <div>
              <label style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(234,229,219,0.7)', display: 'block', marginBottom: '0.3rem' }}>
                Gallery Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Destination Weddings, Haldi Moments"
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(234,229,219,0.2)',
                  background: '#0a0a0b',
                  color: '#eae5db',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(234,229,219,0.7)', display: 'block', marginBottom: '0.3rem' }}>
                Display Title (Uppercase)
              </label>
              <input
                type="text"
                value={displayTitle}
                onChange={(e) => setDisplayTitle(e.target.value)}
                placeholder="e.g. DESTINATION WEDDINGS"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(234,229,219,0.2)',
                  background: '#0a0a0b',
                  color: '#eae5db',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(234,229,219,0.7)', display: 'block', marginBottom: '0.3rem' }}>
                Subtitle / Tagline
              </label>
              <input
                type="text"
                value={sub}
                onChange={(e) => setSub(e.target.value)}
                placeholder="e.g. Your love stories captured across oceans."
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(234,229,219,0.2)',
                  background: '#0a0a0b',
                  color: '#eae5db',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(234,229,219,0.7)', display: 'block', marginBottom: '0.3rem' }}>
                Layout Style
              </label>
              <select
                value={option}
                onChange={(e) => setOption(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(234,229,219,0.2)',
                  background: '#0a0a0b',
                  color: '#eae5db',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value={1}>Option 1: Editorial Masonry</option>
                <option value={2}>Option 2: Romantic Centerpiece</option>
                <option value={3}>Option 3: Triptych Strip</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(234,229,219,0.7)', display: 'block', marginBottom: '0.3rem' }}>
                Cover Image URL
              </label>
              <input
                type="text"
                value={coverImg}
                onChange={(e) => setCoverImg(e.target.value)}
                placeholder="assets/images/collage_closeup.webp"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(234,229,219,0.2)',
                  background: '#0a0a0b',
                  color: '#eae5db',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Sticky Action Footer */}
          <div
            style={{
              display: 'flex',
              gap: '0.8rem',
              padding: '1rem 1.4rem',
              borderTop: '1px solid rgba(234,229,219,0.1)',
              background: '#16161a',
              justifyContent: 'flex-end',
              flexShrink: 0
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.2rem',
                borderRadius: '6px',
                border: '1px solid rgba(234,229,219,0.2)',
                background: 'transparent',
                color: '#eae5db',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.65rem 1.4rem',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--brass)',
                color: '#0a0a0b',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              {mode === 'edit' ? 'Update Details' : 'Create Gallery'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ====================================================================
// SUB-COMPONENT: ASSET LIBRARY MODAL
// ====================================================================
function AssetLibraryModal({ onClose, onSelect }) {
  const [tab, setTab] = useState('photos');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5000,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 3vh, 2rem) clamp(0.75rem, 3vw, 1.5rem)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#121215',
          border: '1px solid rgba(179,161,128,0.3)',
          borderRadius: '12px',
          maxWidth: '850px',
          width: '100%',
          maxHeight: 'min(92vh, 92dvh)',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto 0',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '1.1rem 1.4rem', borderBottom: '1px solid rgba(234,229,219,0.1)', background: '#16161a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.8rem', flexShrink: 0 }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: '#eae5db' }}>Chitra Weddings Asset Library</h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'rgba(234,229,219,0.6)' }}>
              Click any photo or film to immediately add it to your active gallery.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close asset library"
            style={{
              background: 'rgba(234,229,219,0.1)',
              border: '1px solid rgba(234,229,219,0.25)',
              color: '#eae5db',
              borderRadius: '6px',
              padding: '0.45rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              flexShrink: 0
            }}
          >
            <span>CLOSE</span>
            <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>✕</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '1rem', padding: '0.8rem 1.5rem', borderBottom: '1px solid rgba(234,229,219,0.08)' }}>
          <button
            onClick={() => setTab('photos')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: tab === 'photos' ? '2px solid var(--brass)' : '2px solid transparent',
              color: tab === 'photos' ? 'var(--brass)' : 'rgba(234,229,219,0.6)',
              fontWeight: 600,
              fontSize: '0.82rem',
              paddingBottom: '0.4rem',
              cursor: 'pointer'
            }}
          >
            Project Photos ({PROJECT_PRESETS.length})
          </button>
          <button
            onClick={() => setTab('videos')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: tab === 'videos' ? '2px solid var(--brass)' : '2px solid transparent',
              color: tab === 'videos' ? 'var(--brass)' : 'rgba(234,229,219,0.6)',
              fontWeight: 600,
              fontSize: '0.82rem',
              paddingBottom: '0.4rem',
              cursor: 'pointer'
            }}
          >
            Cinematic Films ({VIDEO_PRESETS.length})
          </button>
        </div>

        {/* Grid Container */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {tab === 'photos' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
              {PROJECT_PRESETS.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelect(p)}
                  style={{
                    borderRadius: '6px',
                    overflow: 'hidden',
                    background: '#0a0a0b',
                    border: '1px solid rgba(234,229,219,0.15)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brass)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(234,229,219,0.15)'}
                >
                  <div style={{ aspectRatio: '4/3', width: '100%', overflow: 'hidden' }}>
                    <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '0.6rem' }}>
                    <span style={{ fontSize: '0.74rem', color: '#eae5db', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--brass)' }}>+ Add Photo</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.2rem' }}>
              {VIDEO_PRESETS.map((v, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelect({ ...v, type: 'video' })}
                  style={{
                    borderRadius: '6px',
                    overflow: 'hidden',
                    background: '#0a0a0b',
                    border: '1px solid rgba(234,229,219,0.15)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brass)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(234,229,219,0.15)'}
                >
                  <div style={{ aspectRatio: '16/9', width: '100%', position: 'relative' }}>
                    <img src={v.poster} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.2rem' }}>▶</span>
                    </div>
                  </div>
                  <div style={{ padding: '0.6rem' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#eae5db', display: 'block' }}>
                      {v.title}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--brass)' }}>Vimeo #{v.videoId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ====================================================================
// SUB-COMPONENT: BACKUP & DATA TOOLS MODAL
// ====================================================================
function BackupModal({ categories, onClose, onExport, onImport, onReset }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    const code = `// Shared Portfolio & Gallery Data - Single Source of Truth for Chitra Weddings
export const portfolioCategories = ${JSON.stringify(categories, null, 2)};

export default portfolioCategories;
`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5000,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 3vh, 2rem) clamp(0.75rem, 3vw, 1.5rem)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#121215',
          border: '1px solid rgba(179,161,128,0.3)',
          borderRadius: '12px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: 'min(92vh, 92dvh)',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto 0',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.1rem 1.4rem', borderBottom: '1px solid rgba(234,229,219,0.1)', background: '#16161a', flexShrink: 0 }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: '#eae5db' }}>
            Portfolio Data Tools &amp; Backup
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'rgba(234,229,219,0.1)',
              border: '1px solid rgba(234,229,219,0.25)',
              color: '#eae5db',
              borderRadius: '6px',
              padding: '0.45rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              flexShrink: 0
            }}
          >
            <span>CLOSE</span>
            <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>✕</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '1.4rem', overflowY: 'auto', flex: 1, overscrollBehavior: 'contain' }}>
          
          {/* 1. Export JSON */}
          <div style={{ background: 'rgba(234,229,219,0.04)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(234,229,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#eae5db' }}>Export Portfolio Backup</h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: 'rgba(234,229,219,0.6)' }}>Download a .json file of all galleries and media</p>
            </div>
            <button
              onClick={onExport}
              style={{ padding: '0.5rem 0.9rem', borderRadius: '4px', border: '1px solid var(--brass)', background: 'rgba(179,161,128,0.12)', color: 'var(--brass)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Export JSON &darr;
            </button>
          </div>

          {/* 2. Import JSON */}
          <div style={{ background: 'rgba(234,229,219,0.04)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(234,229,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#eae5db' }}>Restore from Backup</h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: 'rgba(234,229,219,0.6)' }}>Upload a previously exported .json file</p>
            </div>
            <label style={{ padding: '0.5rem 0.9rem', borderRadius: '4px', border: '1px solid rgba(234,229,219,0.2)', background: 'rgba(234,229,219,0.08)', color: '#eae5db', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
              Import JSON &uarr;
              <input type="file" accept=".json,application/json" onChange={onImport} style={{ display: 'none' }} />
            </label>
          </div>

          {/* 3. Copy Code */}
          <div style={{ background: 'rgba(234,229,219,0.04)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(234,229,219,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#eae5db' }}>Copy JS Code</h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: 'rgba(234,229,219,0.6)' }}>Copy formatted portfolioData.js code snippet</p>
            </div>
            <button
              onClick={copyCode}
              style={{ padding: '0.5rem 0.9rem', borderRadius: '4px', border: '1px solid rgba(234,229,219,0.2)', background: 'rgba(234,229,219,0.08)', color: '#eae5db', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              {copied ? 'Copied! ✓' : 'Copy Code 📋'}
            </button>
          </div>

          {/* 4. Reset Defaults */}
          <div style={{ background: 'rgba(255,107,107,0.04)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255,107,107,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#ff8585' }}>Reset to Factory Defaults</h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: 'rgba(255,107,107,0.7)' }}>Restores initial Wedding, Pre Wedding &amp; Engagement galleries</p>
            </div>
            <button
              onClick={onReset}
              style={{ padding: '0.5rem 0.9rem', borderRadius: '4px', border: '1px solid #ff6b6b', background: 'transparent', color: '#ff8585', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Reset ↺
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
