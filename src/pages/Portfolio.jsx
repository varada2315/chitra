import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Reactive Shared Portfolio & Gallery Data
import { usePortfolioCategories, resolveAssetUrl } from '../data/portfolioStore';

export default function Portfolio({ onNavigate }) {
  const { categories: portfolioCategories } = usePortfolioCategories();
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [activeOption, setActiveOption] = useState(1);
  const [activeCenterpieceIdx, setActiveCenterpieceIdx] = useState(0);
  const [activeVideoItem, setActiveVideoItem] = useState(null);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  // Open Gallery and push history state for smooth swipe-back support
  const openGallery = (item) => {
    setSelectedGallery(item);
    setActiveOption(item.option || 1);
    setActiveCenterpieceIdx(0);
    window.history.pushState(
      { page: 'portfolio', modal: 'gallery', galleryId: item.id },
      '',
      '/portfolio#gallery'
    );
  };

  // Close Gallery modal cleanly
  const closeGallery = () => {
    setSelectedGallery(null);
    setActiveVideoItem(null);
    setActiveLightboxImg(null);
    if (window.location.hash === '#gallery') {
      window.history.back();
    }
  };

  // Lock background scroll on both <body> and <html> whenever any modal is open
  const isAnyModalOpen = Boolean(selectedGallery || activeVideoItem || activeLightboxImg);

  useEffect(() => {
    if (isAnyModalOpen) {
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = origBodyOverflow || '';
        document.documentElement.style.overflow = origHtmlOverflow || '';
      };
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [isAnyModalOpen]);

  // Keep open gallery synchronized when categories update in real time
  useEffect(() => {
    if (selectedGallery && portfolioCategories) {
      const liveCat = portfolioCategories.find(c => c.id === selectedGallery.id);
      if (liveCat) setSelectedGallery(liveCat);
    }
  }, [portfolioCategories]);

  // Close modal when user swipes back or clicks browser back
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#gallery' && selectedGallery) {
        setSelectedGallery(null);
        setActiveVideoItem(null);
        setActiveLightboxImg(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeVideoItem) {
          setActiveVideoItem(null);
        } else if (activeLightboxImg) {
          setActiveLightboxImg(null);
        } else if (selectedGallery) {
          closeGallery();
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedGallery, activeVideoItem, activeLightboxImg]);

  return (
    <div className="portfolio-page-wrapper" style={{ background: '#0a0a0b', minHeight: '100vh', color: '#eae5db' }}>
      
      {/* 1. TOP HERO SECTION WITH QUOTE OVERLAY */}
      <section className="portfolio-hero" style={{ position: 'relative', width: '100%', height: 'clamp(75vh, 85vh, 920px)', overflow: 'hidden' }}>
        <motion.img 
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          src="assets/images/portfolio_hero.webp" 
          alt="Chitra Weddings Portfolio Hero"
          loading="eager"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 62%' }}
        />
        {/* Dark Gradient Overlay for Readability */}
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to bottom, rgba(10,10,11,0.35) 0%, rgba(10,10,11,0.1) 35%, rgba(10,10,11,0.3) 70%, rgba(10,10,11,0.88) 100%)' 
          }} 
        />

        {/* Left-Hand Side Hero Heading matching Home Page Section */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 6,
            padding: '0 var(--pad) clamp(3rem, 7vh, 5.5rem)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            boxSizing: 'border-box'
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="display"
            style={{
              fontSize: 'clamp(2.4rem, 7.2vw, 5.5rem)',
              lineHeight: 1.05,
              color: '#eae5db',
              margin: 0,
              maxWidth: '14ch',
              textShadow: '0 4px 24px rgba(0,0,0,0.85)'
            }}
          >
            Your love story deserves <br />to be told <em>beautifully.</em>
          </motion.h1>
        </div>
      </section>

      {/* 2. GRID OF COUPLE GALLERIES */}
      <section style={{ padding: 'clamp(4rem, 10vh, 7rem) var(--pad)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="portfolio-categories-grid">
            {portfolioCategories.map((item, index) => {
              const mediaList = item.media || [];
              const photosCount = mediaList.filter(m => m.type !== 'video').length || (item.photos?.length || 4);
              const videosCount = mediaList.filter(m => m.type === 'video').length;

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.025 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  onClick={() => openGallery(item)}
                  className="portfolio-category-card"
                >
                  <img
                    src={item.coverImg || item.img || item.photos?.[0]}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }}
                  />
                  
                  {/* Hover Dark Overlay & Title */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(10,10,11,0.68)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.5rem',
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.2em', color: '#eae5db', textTransform: 'uppercase' }}>
                      {item.displayTitle || item.title}
                    </span>
                    <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--brass)', marginTop: '0.6rem' }}>
                      View Gallery &rarr;
                    </span>
                  </motion.div>

                  {/* Subtitle tag at bottom */}
                  <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.2rem', right: '1.2rem', pointerEvents: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(234,229,219,0.95)', textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}>
                      {item.displayTitle || item.title}
                    </span>
                    <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.82rem', color: 'var(--brass)', textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}>
                      {photosCount} Photos {videosCount > 0 ? `• ${videosCount} Films` : ''}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Instagram CTA Button */}
          <div style={{ textAlign: 'center', marginTop: 'clamp(3.5rem, 7vh, 5.5rem)' }}>
            <a 
              href="https://www.instagram.com/chitra_weddings" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                padding: '0.85rem clamp(1.2rem, 3.5vw, 2.2rem)',
                borderRadius: '99px',
                border: '1px solid var(--brass)',
                background: 'rgba(179, 161, 128, 0.08)',
                color: '#eae5db',
                fontFamily: 'var(--sans)',
                fontSize: 'clamp(0.58rem, 1.8vw, 0.72rem)',
                fontWeight: 600,
                letterSpacing: 'clamp(0.1em, 0.4vw, 0.18em)',
                textTransform: 'uppercase',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                boxSizing: 'border-box',
                transition: 'all 0.35s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--brass)';
                e.currentTarget.style.color = '#131312';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(179, 161, 128, 0.08)';
                e.currentTarget.style.color = '#eae5db';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span style={{ whiteSpace: 'nowrap' }}>FOLLOW @CHITRA_WEDDINGS ON INSTAGRAM</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. ANIMATED GALLERY PREVIEWS MODAL (WITH MIXED IMAGES & VIDEOS) */}
      <AnimatePresence>
        {selectedGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 4000,
              background: 'rgba(10,10,11,0.96)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: (activeVideoItem || activeLightboxImg) ? 'hidden' : 'auto',
              overscrollBehavior: 'contain'
            }}
          >
            {/* Modal Navigation Bar */}
            <div className="portfolio-modal-nav">
              <div className="portfolio-modal-title-row">
                <div>
                  <span className="label" style={{ fontSize: '0.62rem' }}>CHITRA WEDDINGS</span>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', color: '#eae5db', margin: 0 }}>{selectedGallery.title}</h3>
                </div>

                <button 
                  onClick={closeGallery}
                  className="portfolio-modal-close-btn"
                  aria-label="Close modal"
                >
                  CLOSE ✕
                </button>
              </div>

              {/* Option Selector Toggle Buttons */}
              <div className="portfolio-modal-tabs">
                <button 
                  onClick={() => setActiveOption(1)}
                  className={`portfolio-tab-btn ${activeOption === 1 ? 'active' : ''}`}
                >
                  OPTION 1: MASONRY
                </button>
                <button 
                  onClick={() => setActiveOption(2)}
                  className={`portfolio-tab-btn ${activeOption === 2 ? 'active' : ''}`}
                >
                  OPTION 2: CENTERPIECE
                </button>
                <button 
                  onClick={() => setActiveOption(3)}
                  className={`portfolio-tab-btn ${activeOption === 3 ? 'active' : ''}`}
                >
                  OPTION 3: TRIPTYCH
                </button>
              </div>
            </div>

            {/* Modal Body Content depending on Active Option */}
            <div style={{ padding: 'clamp(1.5rem, 5vh, 3rem) var(--pad)', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
              
              {/* Common Gallery Items */}
              {(() => {
                const mediaItems = (selectedGallery.media && selectedGallery.media.length > 0)
                  ? selectedGallery.media
                  : (selectedGallery.photos || []).map((p, i) => ({
                      id: `legacy-${i}`,
                      type: 'image',
                      url: p,
                      title: `${selectedGallery.title} ${i + 1}`
                    }));

                return (
                  <>
                    {/* GALLERY OPTION 1: EDITORIAL MASONRY */}
                    {activeOption === 1 && (
                      <motion.div key="opt1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                          <h1 className="display" style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}>{selectedGallery.title}</h1>
                          <p className="muted" style={{ fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)', marginTop: '0.5rem' }}>{selectedGallery.sub}</p>
                        </div>

                        <div className="portfolio-modal-masonry-grid">
                          {mediaItems.map((item, idx) => {
                            const isVideo = item.type === 'video';
                            const isWide = idx % 3 === 0;
                            const isDirectVideo = isVideo && (item.videoType === 'direct' || !item.poster || item.url?.includes('assets/uploads/') || /\.(mp4|webm|mov)$/i.test(item.url));
                            const imgSrc = resolveAssetUrl(item.poster || 'assets/images/exp_weddings.webp');

                            return (
                              <div
                                key={item.id || idx}
                                className={isWide ? 'portfolio-masonry-wide' : ''}
                                style={{
                                  position: 'relative',
                                  borderRadius: '4px',
                                  overflow: 'hidden',
                                  aspectRatio: isWide ? '16/10' : '3/4',
                                  background: '#0d0d0f',
                                  cursor: 'pointer'
                                }}
                                onClick={() => {
                                  if (isVideo) {
                                    setActiveVideoItem(item);
                                  } else {
                                    setActiveLightboxImg(imgSrc);
                                  }
                                }}
                              >
                                {isDirectVideo ? (
                                  <video
                                    src={`${resolveAssetUrl(item.url)}#t=0.001`}
                                    preload="metadata"
                                    muted
                                    playsInline
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <img
                                    src={imgSrc}
                                    alt={item.title || `${selectedGallery.title} ${idx + 1}`}
                                    loading="lazy"
                                    decoding="async"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                                  />
                                )}

                                {/* Video Play Button Badge */}
                                {isVideo && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      inset: 0,
                                      background: 'rgba(0,0,0,0.3)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.5rem'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '54px',
                                        height: '54px',
                                        borderRadius: '50%',
                                        background: 'rgba(10, 10, 11, 0.85)',
                                        border: '1.5px solid var(--brass)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--brass)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
                                      }}
                                    >
                                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                      </svg>
                                    </div>
                                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#eae5db', textTransform: 'uppercase', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                                      Play Film ({item.videoType || 'Vimeo'})
                                    </span>
                                  </div>
                                )}

                                {/* Subtle caption bar */}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.8rem', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', pointerEvents: 'none' }}>
                                  <span style={{ fontSize: '0.76rem', color: '#eae5db', fontWeight: 500 }}>{item.title}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* GALLERY OPTION 2: ROMANTIC CENTERPIECE */}
                    {activeOption === 2 && (
                      <motion.div key="opt2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                          <h1 className="display" style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}>{selectedGallery.displayTitle || selectedGallery.title}</h1>
                          <p className="muted" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)', marginTop: '0.5rem' }}>{selectedGallery.sub}</p>
                        </div>

                        {(() => {
                          const currentCenter = mediaItems[activeCenterpieceIdx] || mediaItems[0];
                          const isCenterVideo = currentCenter.type === 'video';

                          return (
                            <div style={{ maxWidth: '750px', margin: '0 auto', width: '100%' }}>
                              {/* Main Centerpiece Frame */}
                              <div
                                style={{
                                  aspectRatio: '16/10',
                                  overflow: 'hidden',
                                  border: '1px solid var(--brass)',
                                  padding: '10px',
                                  borderRadius: '6px',
                                  position: 'relative',
                                  background: '#070708',
                                  cursor: 'pointer'
                                }}
                                onClick={() => {
                                  if (isCenterVideo) {
                                    setActiveVideoItem(currentCenter);
                                  } else {
                                    setActiveLightboxImg(currentCenter.url);
                                  }
                                }}
                              >
                                {isCenterVideo && (currentCenter.videoType === 'direct' || !currentCenter.poster || currentCenter.url?.includes('assets/uploads/') || /\.(mp4|webm|mov)$/i.test(currentCenter.url)) ? (
                                  <video
                                    src={`${resolveAssetUrl(currentCenter.url)}#t=0.001`}
                                    preload="metadata"
                                    muted
                                    playsInline
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }}
                                  />
                                ) : (
                                  <img
                                    src={resolveAssetUrl(isCenterVideo ? (currentCenter.poster || 'assets/images/exp_weddings.webp') : currentCenter.url)}
                                    alt={currentCenter.title || 'Centerpiece'}
                                    loading="lazy"
                                    decoding="async"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }}
                                  />
                                )}

                                {isCenterVideo && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      inset: 10,
                                      background: 'rgba(0,0,0,0.3)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.6rem'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: 'rgba(10, 10, 11, 0.85)',
                                        border: '1.5px solid var(--brass)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--brass)'
                                      }}
                                    >
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                      </svg>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: '#eae5db', textTransform: 'uppercase' }}>
                                      Play Film
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Title of active centerpiece */}
                              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.25rem', color: '#eae5db' }}>
                                  {currentCenter.title}
                                </h3>
                                {currentCenter.caption && (
                                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'rgba(234,229,219,0.6)', fontStyle: 'italic' }}>
                                    {currentCenter.caption}
                                  </p>
                                )}
                              </div>

                              {/* Additional Media Strip */}
                              {mediaItems.length > 1 && (
                                <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(70px, 1fr))`, gap: '0.75rem', marginTop: '1.5rem' }}>
                                  {mediaItems.map((m, idx) => {
                                    const isSelected = idx === activeCenterpieceIdx;
                                    const isVid = m.type === 'video';
                                    const isDirectVid = isVid && (m.videoType === 'direct' || !m.poster || m.url?.includes('assets/uploads/') || /\.(mp4|webm|mov)$/i.test(m.url));

                                    return (
                                      <div
                                        key={idx}
                                        onClick={() => setActiveCenterpieceIdx(idx)}
                                        style={{
                                          aspectRatio: '1',
                                          overflow: 'hidden',
                                          borderRadius: '4px',
                                          border: isSelected ? '2px solid var(--brass)' : '1px solid rgba(234,229,219,0.15)',
                                          cursor: 'pointer',
                                          opacity: isSelected ? 1 : 0.65,
                                          transition: 'all 0.2s ease',
                                          position: 'relative'
                                        }}
                                      >
                                        {isDirectVid ? (
                                          <video src={`${resolveAssetUrl(m.url)}#t=0.001`} preload="metadata" muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                          <img src={resolveAssetUrl(m.poster || (isVid ? 'assets/images/exp_weddings.webp' : m.url))} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        )}
                                        {isVid && (
                                          <div style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', borderRadius: '2px', padding: '1px 3px', fontSize: '0.55rem', color: 'var(--brass)' }}>
                                            ▶
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}

                    {/* GALLERY OPTION 3: TRIPTYCH STRIP */}
                    {activeOption === 3 && (
                      <motion.div key="opt3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                          <h1 className="display" style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}>{selectedGallery.displayTitle || selectedGallery.title}</h1>
                          <p className="muted" style={{ fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)', marginTop: '0.5rem' }}>{selectedGallery.sub}</p>
                        </div>

                        <div className="portfolio-modal-triptych-grid">
                          {/* Left Panel */}
                          <div
                            style={{ aspectRatio: '3/4', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer', position: 'relative' }}
                            onClick={() => {
                              const itm = mediaItems[0];
                              if (itm?.type === 'video') setActiveVideoItem(itm);
                              else if (itm?.url) setActiveLightboxImg(itm.url);
                            }}
                          >
                            {mediaItems[0]?.type === 'video' && (mediaItems[0]?.videoType === 'direct' || !mediaItems[0]?.poster || mediaItems[0]?.url?.includes('assets/uploads/') || /\.(mp4|webm|mov)$/i.test(mediaItems[0]?.url)) ? (
                              <video
                                src={`${resolveAssetUrl(mediaItems[0]?.url)}#t=0.001`}
                                preload="metadata"
                                muted
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <img
                                src={resolveAssetUrl(mediaItems[0]?.type === 'video' ? (mediaItems[0]?.poster || 'assets/images/exp_weddings.webp') : (mediaItems[0]?.url || selectedGallery.coverImg))}
                                alt={`${selectedGallery.title} left`}
                                loading="lazy"
                                decoding="async"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            )}
                            {mediaItems[0]?.type === 'video' && (
                              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '1.8rem', color: 'var(--brass)' }}>▶</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Center Brand Plaque */}
                          <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid var(--hair)', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                            <div className="mark">
                              <span className="mark-main">CHITRA</span>
                              <small className="mark-sub">WEDDINGS</small>
                            </div>
                            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brass)', marginTop: '1rem' }}>
                              {selectedGallery.title}
                            </span>
                          </div>

                          {/* Right Panel */}
                          <div
                            style={{ aspectRatio: '3/4', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer', position: 'relative' }}
                            onClick={() => {
                              const itm = mediaItems[1] || mediaItems[0];
                              if (itm?.type === 'video') setActiveVideoItem(itm);
                              else if (itm?.url) setActiveLightboxImg(itm.url);
                            }}
                          >
                            {(mediaItems[1] || mediaItems[0])?.type === 'video' && ((mediaItems[1] || mediaItems[0])?.videoType === 'direct' || !(mediaItems[1] || mediaItems[0])?.poster || (mediaItems[1] || mediaItems[0])?.url?.includes('assets/uploads/') || /\.(mp4|webm|mov)$/i.test((mediaItems[1] || mediaItems[0])?.url)) ? (
                              <video
                                src={`${resolveAssetUrl((mediaItems[1] || mediaItems[0])?.url)}#t=0.001`}
                                preload="metadata"
                                muted
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <img
                                src={resolveAssetUrl((mediaItems[1] || mediaItems[0])?.type === 'video' ? ((mediaItems[1] || mediaItems[0])?.poster || 'assets/images/exp_weddings.webp') : ((mediaItems[1] || mediaItems[0])?.url || selectedGallery.coverImg))}
                                alt={`${selectedGallery.title} right`}
                                loading="lazy"
                                decoding="async"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            )}
                            {mediaItems[1]?.type === 'video' && (
                              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '1.8rem', color: 'var(--brass)' }}>▶</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                );
              })()}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. CINEMATIC VIDEO LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeVideoItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideoItem(null)}
            onWheel={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 6000,
              background: 'rgba(5, 5, 6, 0.95)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(1rem, 4vw, 2.5rem)',
              overflowY: 'auto',
              overscrollBehavior: 'contain'
            }}
          >
            <div 
              style={{ maxWidth: '1000px', width: '100%', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)' }}>
                    CHITRA WEDDINGS CINEMA
                  </span>
                  <h3 style={{ margin: '0.2rem 0 0', fontFamily: 'var(--serif)', fontSize: '1.35rem', color: '#eae5db' }}>
                    {activeVideoItem.title || 'Wedding Film Highlight'}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveVideoItem(null)}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(234,229,219,0.3)',
                    color: '#eae5db',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em'
                  }}
                >
                  CLOSE ✕
                </button>
              </div>

              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/9',
                  background: '#000',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
                }}
              >
                {activeVideoItem.videoType === 'vimeo' && activeVideoItem.videoId ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${activeVideoItem.videoId}?autoplay=1&title=0&byline=0&portrait=0`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : activeVideoItem.videoType === 'youtube' && activeVideoItem.videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideoItem.videoId}?autoplay=1`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={resolveAssetUrl(activeVideoItem.url)}
                    controls
                    autoPlay
                    playsInline
                    poster={activeVideoItem.poster ? resolveAssetUrl(activeVideoItem.poster) : undefined}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. PHOTO LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeLightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImg(null)}
            onWheel={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 7000,
              background: 'rgba(5, 5, 6, 0.95)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(1rem, 4vw, 2.5rem)',
              cursor: 'zoom-out',
              overflowY: 'auto',
              overscrollBehavior: 'contain'
            }}
          >
            <div 
              style={{ maxWidth: '1000px', maxHeight: '90vh', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeLightboxImg}
                alt="Enlarged gallery photo"
                style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}
              />
              <button
                onClick={() => setActiveLightboxImg(null)}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
