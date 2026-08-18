import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    img: "assets/images/collage_closeup.png",
    quote: "Chitra Weddings captured moments we didn't even realize were happening. Our film and photos leave a lasting legacy for our family.",
    author: "Adarsh & Team Client"
  },
  {
    img: "assets/images/collage_smile.png",
    quote: "They alleviated all our stress on the day, capturing the essence of our unique love story so we could simply be present in the joy of our union.",
    author: "Luke & Anna"
  },
  {
    img: "assets/images/collage_piggyback.png",
    quote: "Masterful storytellers. From pre-wedding to the traditional ceremony, every memory was beautifully told.",
    author: "Matt & Leslie"
  }
];

// Reusable Count-Up Animated Number Component
function AnimatedNumber({ end, decimals = 0, duration = 1.6 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime = null;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = eased * end;

            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(end);
            }
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [end, decimals, duration]);

  return <span ref={elementRef}>{displayValue.toFixed(decimals)}</span>;
}

// 4 PINNED FEATURED PORTFOLIO STORIES DATA FROM PORTFOLIO SECTION
const storiesData = [
  {
    id: 1,
    stepNum: "01 / 04",
    category: "TRADITIONAL COVERAGE",
    title: "Traditional Coverage",
    couple: "Edmond & Lauren",
    location: "Chitra Weddings Full Coverage",
    description: "Full sacred ritual coverage capturing emotional vows, intricate traditional attire, and grand evening celebrations with cinematic grace.",
    img: "assets/images/collage_closeup.png",
    vimeoId: "332887606"
  },
  {
    id: 2,
    stepNum: "02 / 04",
    category: "DESTINATION WEDDINGS",
    title: "Destination Weddings",
    couple: "Luke & Anna",
    location: "Global Destination Vows",
    description: "Breathtaking destination films set against majestic mountains and oceans, capturing intimate promises and multi-day celebrations.",
    img: "assets/images/blog_dance.png",
    vimeoId: "1027095536"
  },
  {
    id: 3,
    stepNum: "03 / 04",
    category: "PRE WEDDING SESSION",
    title: "Pre Wedding Session",
    couple: "Niko & Bryn",
    location: "Cinematic Pre-Wedding Stories",
    description: "Golden hour romance sessions weaving personal letters, candid laughter, and dramatic landscapes into an unforgettable prelude.",
    img: "assets/images/blog_fence.png",
    vimeoId: "891737638"
  },
  {
    id: 4,
    stepNum: "04 / 04",
    category: "ENGAGEMENT COVERAGE",
    title: "Engagement Coverage",
    couple: "Jeremy & Lauren",
    location: "Special Celebration Session",
    description: "Documenting proposals, engagement galas, and life milestones with timeless luxury and storytelling depth.",
    img: "assets/images/blog_car.png",
    vimeoId: "766281509"
  }
];

function FeaturedStoriesStepSection({ onNavigate, onOpenVideo }) {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const activeIdxRef = useRef(0);
  const isCooldownRef = useRef(false);
  const touchStartRef = useRef(null);

  activeIdxRef.current = activeIdx;

  // Reset inline video playback when changing active story
  useEffect(() => {
    setIsPlayingInline(false);
  }, [activeIdx]);
  // Intercept wheel & scroll events ONLY on Desktop view (window.innerWidth > 768)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return; // Disable scroll/wheel locking animation on mobile phone view

    const section = sectionRef.current;
    if (!section) return;

    let lastScrollY = window.scrollY;

    // Detect scroll direction to automatically select story 04/04 when scrolling up into section
    const handleScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const rect = section.getBoundingClientRect();

      // If user is scrolling UP from lower sections into this section:
      if (currentScrollY < lastScrollY && rect.top < window.innerHeight * 0.5 && rect.bottom > 0) {
        if (rect.top <= 10 && rect.top >= -100 && activeIdxRef.current === 0) {
          setActiveIdx(storiesData.length - 1);
        }
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScrollDirection, { passive: true });

    const handleWheel = (e) => {
      const sec = sectionRef.current;
      if (!sec) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 12) return;

      const rect = sec.getBoundingClientRect();
      const current = activeIdxRef.current;
      const isPinnedAtTop = Math.abs(rect.top) <= 70;

      // 1. DOWNWARD SCROLL: Step through 01 -> 02 -> 03 -> 04
      if (delta > 0) {
        // Snap section to top if entering from above
        if (rect.top > 0 && rect.top <= window.innerHeight * 0.45 && current < storiesData.length - 1) {
          e.preventDefault();
          window.scrollTo({ top: window.scrollY + rect.top, behavior: 'smooth' });
          return;
        }

        // Lock scroll and step forward until last photo (04/04) is reached
        if (isPinnedAtTop && current < storiesData.length - 1) {
          e.preventDefault();
          if (isCooldownRef.current) return;
          isCooldownRef.current = true;
          setActiveIdx(current + 1);
          setTimeout(() => { isCooldownRef.current = false; }, 520);
        }
      } 
      // 2. UPWARD SCROLL: Step back 04 -> 03 -> 02 -> 01
      else if (delta < 0) {
        // Snap section to top if entering from below
        if (rect.top < 0 && rect.bottom >= window.innerHeight * 0.5 && current > 0) {
          e.preventDefault();
          window.scrollTo({ top: window.scrollY + rect.top, behavior: 'smooth' });
          return;
        }

        // Lock scroll and step backward until first photo (01/04) is reached
        if (isPinnedAtTop && current > 0) {
          e.preventDefault();
          if (isCooldownRef.current) return;
          isCooldownRef.current = true;
          setActiveIdx(current - 1);
          setTimeout(() => { isCooldownRef.current = false; }, 520);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('scroll', handleScrollDirection);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Horizontal Touch Swipe Handlers for Mobile & Tablet
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    touchStartRef.current = null;
    const current = activeIdxRef.current;

    if (isCooldownRef.current) return;

    // ONLY trigger on horizontal swipe gestures (Math.abs(dx) > Math.abs(dy))
    // Leaves normal vertical page scrolling uninhibited on mobile screens!
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) && dt < 600) {
      if (dx < -30 && current < storiesData.length - 1) {
        isCooldownRef.current = true;
        setActiveIdx(current + 1);
        setTimeout(() => { isCooldownRef.current = false; }, 450);
      } else if (dx > 30 && current > 0) {
        isCooldownRef.current = true;
        setActiveIdx(current - 1);
        setTimeout(() => { isCooldownRef.current = false; }, 450);
      }
    }
  };

  const handleNext = () => {
    if (activeIdx < storiesData.length - 1) {
      setActiveIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      setActiveIdx(prev => prev - 1);
    }
  };

  const activeStory = storiesData[activeIdx];

  // 3D tilt hover for active frame
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <section 
      ref={sectionRef} 
      className="featured-stories-sec"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="featured-stories-sticky-frame">
        
        {/* LEFT COLUMN: STORY DETAILS & CATEGORY NAVIGATION TABS */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          
          {/* Category Navigation Pills */}
          <div 
            className="coverage-tabs-bar" 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.4rem', 
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              marginBottom: '1.2rem',
              paddingBottom: '0.2rem'
            }}
          >
            {storiesData.map((s, idx) => {
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveIdx(idx)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.62rem',
                    fontFamily: 'var(--sans)',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    borderRadius: '99px',
                    border: idx === activeIdx ? '1px solid var(--brass)' : '1px solid rgba(234,229,219,0.18)',
                    background: idx === activeIdx ? 'var(--brass)' : 'rgba(234,229,219,0.05)',
                    color: idx === activeIdx ? '#131312' : '#eae5db',
                    cursor: 'pointer',
                    transition: 'all 0.35s ease'
                  }}
                  aria-label={`Navigate to ${s.category}`}
                >
                  {s.category}
                </button>
              );
            })}
          </div>

          {/* Step Counter, Progress Bar & Arrow Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '1.2rem', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.15rem', color: 'var(--brass)', lineHeight: 1, flexShrink: 0 }}>
              {activeStory.stepNum}
            </span>

            <div style={{ flex: 1, minWidth: '20px', height: '2px', background: 'var(--hair)', overflow: 'hidden' }}>
              <div style={{ width: `${((activeIdx + 1) / storiesData.length) * 100}%`, height: '100%', background: 'var(--brass)', transition: 'width 0.45s ease' }} />
            </div>

            {/* Prev / Next Slide Arrow Buttons */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
              <button
                onClick={handlePrev}
                disabled={activeIdx === 0}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid rgba(234,229,219,0.25)',
                  background: activeIdx > 0 ? 'rgba(234,229,219,0.08)' : 'transparent',
                  color: activeIdx > 0 ? '#eae5db' : 'rgba(234,229,219,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: activeIdx > 0 ? 'pointer' : 'default',
                  transition: 'all 0.33s ease'
                }}
                aria-label="Previous Slide"
              >
                ‹
              </button>
              <button
                onClick={handleNext}
                disabled={activeIdx === storiesData.length - 1}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid rgba(234,229,219,0.25)',
                  background: activeIdx < storiesData.length - 1 ? 'rgba(234,229,219,0.08)' : 'transparent',
                  color: activeIdx < storiesData.length - 1 ? '#eae5db' : 'rgba(234,229,219,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: activeIdx < storiesData.length - 1 ? 'pointer' : 'default',
                  transition: 'all 0.33s ease'
                }}
                aria-label="Next Slide"
              >
                ›
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
            >
              {/* Main Story Title */}
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1, color: '#eae5db', marginBottom: '1rem', wordBreak: 'break-word', fontWeight: 400 }}>
                {activeStory.title}
              </h2>

              {/* Couple Names & Location */}
              <div style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '1.2rem', wordBreak: 'break-word' }}>
                {activeStory.couple} <span className="tick">·</span> {activeStory.location}
              </div>

              {/* Description Narrative */}
              <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--bone-70)', marginBottom: '1.8rem', maxWidth: '46ch' }}>
                {activeStory.description}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" onClick={() => onNavigate('portfolio')}>
                  <span>View Portfolio</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: SMOOTH SCALING & FADE CARD TRANSITION WITH PORTFOLIO IMAGES */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="veil in"
            >
              <div 
                className="feature-frame"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => onNavigate('portfolio')}
                role="button"
                tabIndex="0"
                style={{ cursor: 'pointer', borderRadius: '6px', overflow: 'hidden', width: '100%', boxSizing: 'border-box', aspectRatio: '16 / 10', position: 'relative' }}
              >
                <img src={activeStory.img} alt={activeStory.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', display: 'block' }} />
                
                {/* Camera Focus Brackets */}
                <span className="brk tl" aria-hidden="true"></span>
                <span className="brk tr" aria-hidden="true"></span>
                <span className="brk bl" aria-hidden="true"></span>
                <span className="brk br" aria-hidden="true"></span>
                
                <div className="shade"></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

export default function Home({ onNavigate }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxLit, setLightboxLit] = useState(false);

  // Vimeo Lightbox handlers
  const openVideoModal = (vimeoId) => {
    setActiveVideo(vimeoId);
    setLightboxLit(true);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setActiveVideo(null);
    setLightboxLit(false);
    document.body.style.overflow = '';
  };

  // Auto-slide effect for Testimonials
  useEffect(() => {
    setProgressWidth(0);
    const intervalTime = 6000;
    
    let startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / intervalTime) * 100);
      setProgressWidth(pct);
    }, 50);

    const slideTimer = setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, intervalTime);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(slideTimer);
    };
  }, [activeSlide]);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const kwTouchStartRef = useRef(null);

  const handleKwTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    kwTouchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  };

  const handleKwTouchEnd = (e) => {
    if (!kwTouchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - kwTouchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - kwTouchStartRef.current.y;
    const dt = Date.now() - kwTouchStartRef.current.time;
    kwTouchStartRef.current = null;

    if ((Math.abs(dx) > 25 || Math.abs(dy) > 25) && dt < 600) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx < -25) {
          handleNext();
        } else if (dx > 25) {
          handlePrev();
        }
      }
    }
  };

  return (
    <div className="page-content-wrapper">
      {/* Film Grain Overlay */}
      <div className="grain" aria-hidden="true"></div>

      {/* 1. HERO SECTION */}
      <div className="hero-wrap">
        <header className="hero">
          <div className="media" style={{ overflow: 'hidden', position: 'absolute', inset: 0, background: '#0a0a0b' }}>
            <motion.div
              initial={{ scale: 1.28, opacity: 0.5 }}
              animate={{ scale: 1.08, opacity: 0.9 }}
              transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden' }}
            >
              <iframe 
                src="https://player.vimeo.com/video/332887606?autoplay=1&loop=1&title=0&byline=0&portrait=0&muted=1&background=1"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="hero-vimeo-iframe"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  height: 'max(170vh, 200vw)',
                  width: 'calc(max(170vh, 200vw) * 1.7778)',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  border: 'none'
                }}
                title="Hero Wedding Video Background"
              />
            </motion.div>
          </div>

          <div className="content">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="hero-est-location"
            >
              EST. PURI, ODISHA
            </motion.span>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="display"
            >
              Memories that feel<br />like <em>the moments felt.</em>
            </motion.h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hero-foot hero-foot--greet"
          >
            <div className="greet-line" onClick={() => onNavigate('contact')} style={{ cursor: 'pointer' }}>
              <span className="hero-bottom-cta-text">
                <span className="hero-label-unified">Limited Dates</span>
                <span className="hero-bottom-divider">|</span>
                <span className="hero-label-unified hero-bottom-enquire">Enquire Now</span>
              </span>
            </div>
          </motion.div>
        </header>
      </div>

      {/* 2. SECTION 01: STEP-LOCKED 3D FLIP 4 FEATURED STORIES SECTION */}
      <FeaturedStoriesStepSection onNavigate={onNavigate} onOpenVideo={openVideoModal} />

      {/* 3. SECTION 02: KIND WORDS (SLIDER) */}
      <section className="sec on-bone">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="sec-head"
        >
          <span className="n">02</span>
          <span className="label">Kind Words</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="kw-stage"
          onTouchStart={handleKwTouchStart}
          onTouchEnd={handleKwTouchEnd}
        >
          <div className="kw-track">
            {slides.map((slide, index) => (
              <div key={index} className={`kw-slide ${index === activeSlide ? 'is-active' : ''}`}>
                <div className="kw-photo">
                  <img src={slide.img} alt={`${slide.author} portrait`} width="1280" height="1600" />
                </div>
                <div className="kw-text">
                  <blockquote>{slide.quote}</blockquote>
                  <div className="kw-rule" aria-hidden="true"></div>
                  <cite className="label">{slide.author}</cite>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="kw-foot">
          <span className="kw-progress" aria-hidden="true">
            <i style={{ transform: `scaleX(${progressWidth / 100})` }}></i>
          </span>

          <div className="kw-controls">
            <button className="kw-arrow kw-prev" onClick={handlePrev} aria-label="Previous testimonial">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 1L1 6l5 5M1 6h15" stroke="#131312" strokeWidth="1.2" />
              </svg>
            </button>

            <div className="kw-dots">
              {slides.map((_, index) => (
                <button 
                  key={index} 
                  className={`kw-dot ${index === activeSlide ? 'is-active' : ''}`} 
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Testimonial ${index + 1}`}
                ></button>
              ))}
            </div>

            <button className="kw-arrow kw-next" onClick={handleNext} aria-label="Next testimonial">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1l5 5-5 5M15 6H0" stroke="#131312" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 4. SECTION 03: STATS (ANIMATED FRAMER MOTION COUNT UP) */}
      <section className="sec stats-sec">
        <div className="stats">
          <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="stat">
            <span className="num"><AnimatedNumber end={200} /><sup>+</sup></span>
            <span className="label">Love Stories Told</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.12 }} className="stat">
            <span className="num"><AnimatedNumber end={10} /><sup>yrs</sup></span>
            <span className="label">Masterful Storytellers</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.24 }} className="stat">
            <span className="num"><AnimatedNumber end={5.0} decimals={1} /><sup>★</sup></span>
            <span className="label">Luxury Ratings</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.36 }} className="stat stat-brand">
            <div className="mark">
              <span className="mark-main">CHITRA</span>
              <small className="mark-sub">WEDDINGS</small>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. SECTION 04: SERVICES & PACKAGES */}
      <section className="sec on-bone packages-sec" id="services-packages">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.7 }} 
          className="sec-head"
        >
          <span className="n">04</span>
          <span className="label">Our Packages</span>
        </motion.div>

        {/* Section Intro Headline & Description */}
        <div className="packages-intro">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }} 
            className="display packages-title"
          >
            Curated Collections for <em>Your Sacred Day.</em>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, delay: 0.1 }} 
            className="body-lg packages-desc"
          >
            We offer bespoke wedding photography and cinematography packages designed to capture every unscripted emotion, traditional ceremony, and grand celebration with timeless elegance.
          </motion.p>
        </div>

        {/* Package Cards Grid */}
        <div className="packages-grid">
          {/* Card 1: Traditional & Ceremony */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            whileHover={{ y: -8 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }} 
            className="pkg-card"
          >
            <div className="pkg-badge">Most Popular</div>
            <span className="pkg-num">01</span>
            <h3 className="pkg-name">Traditional Wedding Collection</h3>
            <p className="pkg-tag">Complete Multi-Day Ritual &amp; Ceremony Coverage</p>

            <ul className="pkg-features">
              <li>Full-day photography &amp; 4K cinematography</li>
              <li>Traditional ritual coverage &amp; candid portraiture</li>
              <li>Cinematic feature film + teaser trailer</li>
              <li>High-resolution edited digital gallery</li>
              <li><strong style={{ color: 'var(--brass-dark)' }}>Bonus:</strong> Free Engagement Session Included</li>
            </ul>

            <div className="pkg-foot">
              <button className="pkg-btn" onClick={() => onNavigate('contact')}>
                <span>Enquire Package</span>
              </button>
            </div>
          </motion.div>

          {/* Card 2: Destination Wedding */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            whileHover={{ y: -8 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6, delay: 0.15 }} 
            className="pkg-card pkg-card--featured"
          >
            <div className="pkg-badge pkg-badge--gold">Signature</div>
            <span className="pkg-num">02</span>
            <h3 className="pkg-name">Destination Storytelling</h3>
            <p className="pkg-tag">Worldwide Travel &amp; Multi-Event Celebrations</p>

            <ul className="pkg-features">
              <li>Multi-day destination coverage anywhere worldwide</li>
              <li>Aerial 4K drone cinematography &amp; dual team shooters</li>
              <li>Extended documentary film + social highlight reel</li>
              <li>Handcrafted luxury leather keepsake heirloom album</li>
              <li>Pre-wedding portrait session at destination location</li>
            </ul>

            <div className="pkg-foot">
              <button className="pkg-btn pkg-btn--gold" onClick={() => onNavigate('contact')}>
                <span>Enquire Package</span>
              </button>
            </div>
          </motion.div>

          {/* Card 3: Pre-Wedding & Engagement */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            whileHover={{ y: -8 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.6, delay: 0.3 }} 
            className="pkg-card"
          >
            <span className="pkg-num">03</span>
            <h3 className="pkg-name">Pre-Wedding &amp; Intimate</h3>
            <p className="pkg-tag">Editorial Couple Sessions &amp; Milestones</p>

            <ul className="pkg-features">
              <li>Half-day or full-day editorial concept shoot</li>
              <li>Cinematic 4K romantic teaser film</li>
              <li>Multiple outfit transitions &amp; scenic locations</li>
              <li>Color-graded fine art digital image collection</li>
              <li>Customized digital invite video teaser</li>
            </ul>

            <div className="pkg-foot">
              <button className="pkg-btn" onClick={() => onNavigate('contact')}>
                <span>Enquire Package</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Brand Banner Message & Prominent CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }} 
          className="packages-banner"
        >
          <p className="packages-banner-msg">
            "We create your dream wedding stories."
          </p>
          
          <button className="btn packages-cta-btn" onClick={() => onNavigate('contact')}>
            <span>LET'S START YOUR JOURNEY →</span>
          </button>
        </motion.div>
      </section>

      {/* 5. SECTION 05: OUR LEGACY (ABOUT ME / FOUNDER INTRODUCTION) */}
      <section className="sec on-bone legacy-sec">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="sec-head">
          <span className="n">05</span>
          <span className="label">Our Legacy</span>
        </motion.div>

        <div className="legacy-about-grid">
          {/* Left Column: Founder Professional Portrait Photo */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }} 
            className="legacy-about-photo-wrap"
          >
            <div className="legacy-about-photo">
              <img 
                src="assets/images/hero_meet_me.png" 
                alt="Adarsh Tripathy - Founder & Lead Cinematographer" 
                loading="lazy"
                width="800"
                height="1000"
              />
            </div>
          </motion.div>

          {/* Right Column: Founder Welcome & Introduction Text */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, delay: 0.1 }}
            className="legacy-about-content"
          >
            <h2 className="display legacy-about-title">
              Hello, I'm <em>Adarsh Tripathy.</em>
            </h2>
            
            <p className="body-lg legacy-about-lead">
              Welcome to Chitra Weddings. Over the past decade, my calling has been preserving the quiet glances, unscripted tears, and radiant celebrations that define your most sacred day.
            </p>

            <p className="muted legacy-about-body">
              We believe wedding cinema and photography should never feel staged or distant—it should preserve the true essence of how your moments felt. Every film and photograph we create is crafted as an enduring heirloom, built to echo through generations.
            </p>

            <div className="legacy-about-signature">
              <span className="sig-name">Adarsh Tripathy</span>
              <span className="sig-title">Founder &amp; Lead Cinematographer</span>
            </div>

            <div className="legacy-about-action">
              <button className="btn btn--outline" onClick={() => onNavigate('about')}>
                <span>Meet Adarsh</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. SECTION 05: THE TRAILER CTA */}
      <section className="home-trailer in-view" aria-label="Special Offer" style={{ position: 'relative', overflow: 'hidden' }}>
        <motion.img initial={{ scale: 1.15 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} src="assets/images/review_bg.png" alt="Couple kissing sunset" loading="lazy" />
        <div className="tr-veil" aria-hidden="true"></div>
        <div className="tr-content">
          <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="tr-cred">
            <span className="tr-s1">Special Offer <span className="tick">·</span> Free Engagement Coverage with Full Traditional / Destination Package</span>
            <span className="tr-s2">the one day</span>
            <span className="tr-s3">you'll want to <em style={{ fontStyle: 'italic' }}>live twice.</em></span>
            <span className="tr-s4">
              <button className="btn" onClick={() => onNavigate('contact')}>
                <span>Let's Start Your Journey</span>
              </button>
            </span>
          </motion.div>
        </div>
      </section>

      {/* Cinematic Vimeo Video Modal Overlay */}
      <div 
        className={`lightbox ${activeVideo ? 'open' : ''} ${lightboxLit ? 'lit' : ''}`} 
        onClick={(e) => { if (e.target.classList.contains('lightbox')) closeVideoModal(); }}
        aria-hidden={!activeVideo}
      >
        <button className="close" onClick={closeVideoModal}>Close ✕</button>
        <div className="box">
          {activeVideo && (
            <iframe 
              src={`https://player.vimeo.com/video/${activeVideo}?autoplay=1&title=0&byline=0&portrait=0`}
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
              allowFullScreen 
              title="Wedding Film Preview"
            ></iframe>
          )}
        </div>
      </div>

    </div>
  );
}
