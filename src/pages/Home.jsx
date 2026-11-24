import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    img: "/Photo%202%20replace.JPG.jpeg",
    objectPosition: "center 14%",
    quote: "Choosing Chitra Weddings to capture our big day was the best decision we made. From the small, intimate glances to the grand celebrations, they didn't just take photos—they captured the entire soul of our wedding. Looking through the gallery feels like reliving the day all over again. They have a magical way of being everywhere at once without ever being intrusive. If you want your wedding memories to feel like a work of art, look no further !!",
    author: "BIJAY BHARATI & SOUMYA"
  },
  {
    img: "assets/images/testimonial_soumya_kajol.webp",
    quote: "Had a wonderful experience with Chitra Weddings! The team was professional, friendly, and very creative. Highly recommended for anyone looking for a reliable and skilled photography team!!",
    author: "SOUMYA & KAJOL"
  },
  {
    img: "assets/images/testimonial_priya_ashish.webp",
    quote: "Chitra Weddings did an absolutely outstanding job capturing every beautiful moment of our special day. Their team was incredibly professional, creative, and patient throughout. They didn’t just click pictures — they told a story. Every frame is filled with emotion, detail, and artistry. We could clearly see the effort and passion they put into their work, and we’re so grateful for how they made us feel comfortable in front of the camera. If you're looking for someone to capture memories that last a lifetime, Chitra Weddings is the one. Thank you for making our wedding unforgettable! Thank you Adarsh and team💖",
    author: "PRIYA & ASHISH"
  },
  {
    img: "assets/images/testimonial_shashikant_swikruti.webp",
    quote: "Best wedding event to cover your big day . The owner specially put all his dedication for best output. One of the best photography in puri i recommend everyone without second thought. Even my family members are now fan of this group . Specially Adarsh bhai bunu bhai chitta bhai and complete team . Best one 👍",
    author: "SHASHIKANT & SWIKRUTI"
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

// 3 FEATURED PORTFOLIO CATEGORIES (WEDDING, PRE WEDDING, ENGAGEMENT) IMPORTED FROM SHARED DATA
import { usePortfolioCategories } from '../data/portfolioStore';

function FeaturedStoriesStepSection({ onNavigate, onOpenVideo }) {
  const { categories: storiesData } = usePortfolioCategories();
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const isCooldownRef = useRef(false);
  const touchStartRef = useRef(null);
  const verticalTouchStartRef = useRef(null);

  activeIdxRef.current = activeIdx;

  // Reset photo index when active category changes
  useEffect(() => {
    setPhotoIdx(0);
  }, [activeIdx]);

  // Auto-advance vertical photo slideshow every 3.5 seconds
  useEffect(() => {
    if (!storiesData || storiesData.length === 0) return;
    const currentStory = storiesData[activeIdx] || storiesData[0];
    const currentPhotos = currentStory?.photos || [];
    if (!currentPhotos || currentPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setPhotoIdx((prev) => (prev + 1) % currentPhotos.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [activeIdx, storiesData]);

  // Intercept wheel & scroll events ONLY on Desktop view (window.innerWidth > 768)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    const section = sectionRef.current;
    if (!section) return;

    let lastScrollY = window.scrollY;

    const handleScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const rect = section.getBoundingClientRect();

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

      // 1. DOWNWARD SCROLL: Step through 01 -> 02 -> 03
      if (delta > 0) {
        if (rect.top > 0 && rect.top <= window.innerHeight * 0.45 && current < storiesData.length - 1) {
          e.preventDefault();
          window.scrollTo({ top: window.scrollY + rect.top, behavior: 'smooth' });
          return;
        }

        if (isPinnedAtTop && current < storiesData.length - 1) {
          e.preventDefault();
          if (isCooldownRef.current) return;
          isCooldownRef.current = true;
          setActiveIdx(current + 1);
          setTimeout(() => { isCooldownRef.current = false; }, 520);
        }
      }
      // 2. UPWARD SCROLL: Step back 03 -> 02 -> 01
      else if (delta < 0) {
        if (rect.top < 0 && rect.bottom >= window.innerHeight * 0.5 && current > 0) {
          e.preventDefault();
          window.scrollTo({ top: window.scrollY + rect.top, behavior: 'smooth' });
          return;
        }

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

  // Horizontal Touch Swipe Handlers for Mobile to switch categories
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

  // Vertical Touch Swipe for inside the vertical photo frame
  const handleVerticalTouchStart = (e) => {
    if (e.touches.length === 1) {
      verticalTouchStartRef.current = e.touches[0].clientY;
    }
  };

  const handleVerticalTouchEnd = (e) => {
    if (verticalTouchStartRef.current !== null && e.changedTouches.length === 1) {
      const diffY = verticalTouchStartRef.current - e.changedTouches[0].clientY;
      const len = activeStory.photos.length;
      if (diffY > 40) {
        // Swipe up -> next vertical photo
        setPhotoIdx((prev) => (prev + 1) % len);
      } else if (diffY < -40) {
        // Swipe down -> previous vertical photo
        setPhotoIdx((prev) => (prev - 1 + len) % len);
      }
      verticalTouchStartRef.current = null;
    }
  };

  const handleNext = () => {
    if (activeIdx < storiesData.length - 1) {
      setActiveIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      setActiveIdx((prev) => prev - 1);
    }
  };

  const safeIdx = Math.min(activeIdx, Math.max(0, (storiesData?.length || 1) - 1));
  const activeStory = storiesData?.[safeIdx] || storiesData?.[0];

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -5;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 5;
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
      <div className="featured-stories-card-container">

        {/* Creative Box Heading: 01 - Portfolio */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="sec-head creative-box-head"
        >
          <span className="n">01</span>
          <span className="sec-head-sep" aria-hidden="true">—</span>
          <span className="label">Portfolio</span>
        </motion.div>

        {/* 1. THREE COLUMNS / TABS: WEDDING | PRE WEDDING | ENGAGEMENT */}
        <div className="category-tabs-row" role="tablist" aria-label="Portfolio Category Tabs">
          {storiesData.map((s, idx) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={idx === activeIdx}
              onClick={() => setActiveIdx(idx)}
              className={`category-tab-btn ${idx === activeIdx ? 'active' : ''}`}
            >
              {s.category}
            </button>
          ))}
        </div>

        {/* 2. PROGRESS BAR & 01 / 03 COUNTER */}
        <div className="category-counter-row">
          <span className="category-counter-num">{activeStory.stepNum}</span>

          <div className="category-progress-track">
            <div
              className="category-progress-bar"
              style={{ width: `${((activeIdx + 1) / storiesData.length) * 100}%` }}
            />
          </div>

          <div className="category-arrow-btns">
            <button
              onClick={handlePrev}
              disabled={activeIdx === 0}
              className="category-arrow-btn"
              aria-label="Previous Category"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              disabled={activeIdx === storiesData.length - 1}
              className="category-arrow-btn"
              aria-label="Next Category"
            >
              ›
            </button>
          </div>
        </div>

        {/* 3. CLEAN SECTION TITLE (NO DESCRIPTION PARAGRAPH) */}
        <div className="category-title-wrap">
          <AnimatePresence mode="wait">
            <motion.h2
              key={activeStory.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="category-main-title"
            >
              {activeStory.title}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* 4. VERTICAL PHOTO SLIDESHOW CONNECTED TO GALLERY */}
        <div
          className="vertical-slideshow-frame"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleVerticalTouchStart}
          onTouchEnd={handleVerticalTouchEnd}
          onClick={() => onNavigate('portfolio')}
          role="button"
          tabIndex="0"
          aria-label={`Open ${activeStory.title} Gallery in Portfolio`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeStory.id}-${photoIdx}`}
              initial={{ opacity: 0, y: 25, scale: 1.04 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="vertical-slide-img-wrap"
            >
              <img
                src={activeStory.photos[photoIdx]}
                alt={`${activeStory.title} photo ${photoIdx + 1}`}
                className="vertical-slide-img"
              />
            </motion.div>
          </AnimatePresence>

          {/* Camera Focus Brackets */}
          <span className="brk tl" aria-hidden="true"></span>
          <span className="brk tr" aria-hidden="true"></span>
          <span className="brk bl" aria-hidden="true"></span>
          <span className="brk br" aria-hidden="true"></span>

          {/* Vertical Slide Indicators */}
          <div className="vertical-slide-dots" aria-hidden="true">
            {activeStory.photos.map((_, pIdx) => (
              <button
                key={pIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotoIdx(pIdx);
                }}
                className={`vertical-slide-dot ${pIdx === photoIdx ? 'active' : ''}`}
                aria-label={`Go to photo ${pIdx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default function Home({ onNavigate }) {
  const heroVideoRef = useRef(null);
  const [isPhoneView, setIsPhoneView] = useState(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(max-width: 768px)').matches;
    }
    return false;
  });
  const [activeSlide, setActiveSlide] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxLit, setLightboxLit] = useState(false);

  // Track responsive viewport breakpoint (<= 768px = Phone View -> Reel.mp4, > 768px = Desktop View -> Wide.mp4)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e) => setIsPhoneView(e.matches);

    setIsPhoneView(mql.matches);
    if (mql.addEventListener) {
      mql.addEventListener('change', handleMediaChange);
      return () => mql.removeEventListener('change', handleMediaChange);
    }
    mql.addListener(handleMediaChange);
    return () => mql.removeListener(handleMediaChange);
  }, []);

  // Guarantee hero video autoplay on all browsers (including Brave & mobile) and across viewport switches
  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.defaultMuted = true;
      heroVideoRef.current.muted = true;
      const playPromise = heroVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Hero video autoplay fallback:", err);
        });
      }
    }
  }, [isPhoneView]);

  // Package tier toggle state (default: 'signature' for Traditional Wedding)
  const [pkg1Tier, setPkg1Tier] = useState('signature');
  const [pkg2Tier, setPkg2Tier] = useState('signature');
  const [pkg3Tier, setPkg3Tier] = useState('signature');

  // Vimeo Lightbox handlers with browser history swipe-back support
  const openVideoModal = (vimeoId) => {
    setActiveVideo(vimeoId);
    setLightboxLit(true);
    document.body.style.overflow = 'hidden';
    window.history.pushState(
      { page: 'home', modal: 'video', vimeoId },
      '',
      window.location.pathname + '#video'
    );
  };

  const closeVideoModal = () => {
    setActiveVideo(null);
    setLightboxLit(false);
    document.body.style.overflow = '';
    if (window.location.hash === '#video') {
      window.history.back();
    }
  };

  // Close video modal on browser back / swipe back or Escape key
  useEffect(() => {
    const handleVideoPop = () => {
      if (window.location.hash !== '#video' && activeVideo) {
        setActiveVideo(null);
        setLightboxLit(false);
        document.body.style.overflow = '';
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeVideo) {
        closeVideoModal();
      }
    };

    window.addEventListener('popstate', handleVideoPop);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleVideoPop);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeVideo]);

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
      {/* 1. HERO SECTION */}
      <div className="hero-wrap">
        <header className="hero">
          <div className="media" style={{ overflow: 'hidden', position: 'absolute', inset: 0, background: '#0a0a0b' }}>
            <motion.div
              initial={{ scale: 1.08, opacity: 0.92 }}
              animate={{ scale: 1.02, opacity: 1 }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden' }}
            >
              <video
                ref={heroVideoRef}
                key={isPhoneView ? 'reel-a9b2633' : 'wide'}
                src={isPhoneView ? '/Reel.mp4?v=a9b2633' : '/Wide.mp4'}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="hero-background-video"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100%',
                  height: '100%',
                  minWidth: '100%',
                  minHeight: '100%',
                  transform: 'translate(-50%, -50%)',
                  objectFit: 'cover',
                  pointerEvents: 'none',
                  border: 'none'
                }}
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
              Memories that feel <br />like <em>the moments felt.</em>
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
          <button className="kw-arrow kw-prev" onClick={handlePrev} aria-label="Previous testimonial">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1L1 6l5 5M1 6h15" stroke="#131312" strokeWidth="1.2" />
            </svg>
          </button>

          <div className="kw-track">
            {slides.map((slide, index) => (
              <div key={index} className={`kw-slide ${index === activeSlide ? 'is-active' : ''}`}>
                <div className="kw-photo">
                  <img
                    src={slide.img}
                    alt={`${slide.author} portrait`}
                    width="1280"
                    height="1600"
                    style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
                  />
                </div>
                <div className="kw-text">
                  <blockquote>{slide.quote}</blockquote>
                  <div className="kw-rule" aria-hidden="true"></div>
                  <cite className="label">{slide.author}</cite>
                </div>
              </div>
            ))}
          </div>

          <button className="kw-arrow kw-next" onClick={handleNext} aria-label="Next testimonial">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1l5 5-5 5M15 6H0" stroke="#131312" strokeWidth="1.2" />
            </svg>
          </button>
        </motion.div>

        <div className="kw-foot">
          <span className="kw-progress" aria-hidden="true">
            <i style={{ transform: `scaleX(${progressWidth / 100})` }}></i>
          </span>

          <div className="kw-controls">
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
          </div>
        </div>
      </section>

      {/* 4. SECTION 03: STATS (ANIMATED FRAMER MOTION COUNT UP) */}
      <section className="sec stats-sec">
        <div className="stats">
          <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="stat">
            <span className="num"><AnimatedNumber end={100} /><span className="stat-plus">+</span></span>
            <span className="label">Love Stories</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.12 }} className="stat">
            <span className="num"><AnimatedNumber end={7} /><sup>yrs</sup></span>
            <span className="label">Masterful Storytellers</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.24 }} className="stat">
            <span className="num"><AnimatedNumber end={5.0} decimals={1} /><sup>★</sup></span>
            <span className="label">Luxury Ratings</span>
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
            <span className="pkg-num">01</span>
            <h3 className="pkg-name">Traditional Wedding</h3>
            <p className="pkg-tag">Complete Multi-Day Ritual &amp; Ceremony Coverage</p>

            {/* Essential / Signature Toggle */}
            <div className="pkg-toggle-bar">
              <button
                type="button"
                className={`pkg-toggle-btn ${pkg1Tier === 'essential' ? 'is-active' : ''}`}
                onClick={() => setPkg1Tier('essential')}
              >
                ESSENTIAL
              </button>
              <button
                type="button"
                className={`pkg-toggle-btn ${pkg1Tier === 'signature' ? 'is-active' : ''}`}
                onClick={() => setPkg1Tier('signature')}
              >
                SIGNATURE
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={pkg1Tier}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                style={{ flexGrow: 1 }}
              >
                <ul className="pkg-features">
                  {pkg1Tier === 'signature' ? (
                    <>
                      <li>Full cinematic coverage with candid and aerial coverage for all events (5 days of coverage).</li>
                      <li>Story-driven shoot for wedding film.</li>
                      <li>10+ minute wedding film.</li>
                      <li>Full wedding documentary film with teaser.</li>
                      <li>Acrylic cover album with box and bag.</li>
                      <li>Same-day reels (for limited events).</li>
                      <li>All photo sharing — immediate photo sharing during the event.</li>
                      <li>All raw data provided through hard disk.</li>
                      <li>Optional engagement add-ons available.</li>
                    </>
                  ) : (
                    <>
                      <li>Full cinematic coverage with limited candid and aerial coverage (5 days of coverage).</li>
                      <li>Full documentary film.</li>
                      <li>Hardcover album with a leather bag.</li>
                      <li>All photos shared through the cloud.</li>
                      <li>2 reels from events.</li>
                      <li>Optional engagement coverage add-on available.</li>
                    </>
                  )}
                </ul>
              </motion.div>
            </AnimatePresence>

            <div className="pkg-foot">
              <div className="pkg-price-tag">
                {pkg1Tier === 'signature' ? '₹2,40,000' : '₹1,80,000'}
              </div>
              <button 
                type="button" 
                className="pkg-book-btn" 
                onClick={() => onNavigate('contact')}
                aria-label="Book Traditional Wedding"
              >
                <span>Book Now</span>
                <span aria-hidden="true">→</span>
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
            <span className="pkg-num">02</span>
            <h3 className="pkg-name">Destination Wedding</h3>
            <p className="pkg-tag">Destination Travel &amp; Multi-Event Celebrations</p>

            {/* Essential / Signature Toggle */}
            <div className="pkg-toggle-bar">
              <button
                type="button"
                className={`pkg-toggle-btn ${pkg2Tier === 'essential' ? 'is-active' : ''}`}
                onClick={() => setPkg2Tier('essential')}
              >
                ESSENTIAL
              </button>
              <button
                type="button"
                className={`pkg-toggle-btn ${pkg2Tier === 'signature' ? 'is-active' : ''}`}
                onClick={() => setPkg2Tier('signature')}
              >
                SIGNATURE
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={pkg2Tier}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                style={{ flexGrow: 1 }}
              >
                <ul className="pkg-features">
                  {pkg2Tier === 'signature' ? (
                    <>
                      <li>Full cinematic coverage with candid and aerial coverage for all events (2 days' coverage).</li>
                      <li>15+ minute wedding film.</li>
                      <li>Story-driven shoot for wedding films.</li>
                      <li>Full wedding documentary film with teaser.</li>
                      <li>Acrylic cover album with acrylic box and leather bag.</li>
                      <li>All photo sharing for all events.</li>
                      <li>All raw data provided through hard disk.</li>
                      <li>4 reels from events (including same-day reels).</li>
                    </>
                  ) : (
                    <>
                      <li>Full cinematic coverage with candid and aerial coverage for all events (2 days' coverage).</li>
                      <li>15+ minute wedding film.</li>
                      <li>Story-driven shoot for wedding film.</li>
                      <li>Full wedding documentary film.</li>
                      <li>Acrylic cover album with box and leather bag (20 sheets).</li>
                      <li>All photos delivered through the cloud.</li>
                      <li>Optional engagement coverage: 2 reels from events.</li>
                    </>
                  )}
                </ul>
              </motion.div>
            </AnimatePresence>

            <div className="pkg-foot">
              <div className="pkg-price-tag">
                {pkg2Tier === 'signature' ? '₹2,80,000' : '₹2,00,000'}
              </div>
              <button 
                type="button" 
                className="pkg-book-btn" 
                onClick={() => onNavigate('contact')}
                aria-label="Book Destination Wedding"
              >
                <span>Book Now</span>
                <span aria-hidden="true">→</span>
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
            <h3 className="pkg-name">Pre-Wedding &amp; Engagement</h3>
            <p className="pkg-tag">Editorial Couple Sessions &amp; Milestones</p>

            {/* Essential / Signature Toggle */}
            <div className="pkg-toggle-bar">
              <button
                type="button"
                className={`pkg-toggle-btn ${pkg3Tier === 'essential' ? 'is-active' : ''}`}
                onClick={() => setPkg3Tier('essential')}
              >
                ESSENTIAL
              </button>
              <button
                type="button"
                className={`pkg-toggle-btn ${pkg3Tier === 'signature' ? 'is-active' : ''}`}
                onClick={() => setPkg3Tier('signature')}
              >
                SIGNATURE
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={pkg3Tier}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                style={{ flexGrow: 1 }}
              >
                <ul className="pkg-features">
                  {pkg3Tier === 'signature' ? (
                    <>
                      <li>Cinematic videography and professional/editorial photography.</li>
                      <li>Aerial coverage.</li>
                      <li>Pre-wedding/engagement film.</li>
                      <li>Wedding countdown post.</li>
                      <li>2 reels.</li>
                      <li>Up to 80 selective photos retouching.</li>
                    </>
                  ) : (
                    <>
                      <li>Cinematic videography with professional editorial photography.</li>
                      <li>Pre-wedding/engagement film.</li>
                      <li>Up to 10 selective photo retouches.</li>
                      <li>One reel for social media.</li>
                    </>
                  )}
                </ul>
              </motion.div>
            </AnimatePresence>

            <div className="pkg-foot">
              <div className="pkg-price-tag">
                {pkg3Tier === 'signature' ? '₹35,000' : '₹25,000'}
              </div>
              <button 
                type="button" 
                className="pkg-book-btn" 
                onClick={() => onNavigate('contact')}
                aria-label="Book Pre-Wedding & Engagement"
              >
                <span>Book Now</span>
                <span aria-hidden="true">→</span>
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
            "Your love story deserves to be told beautifully."
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
                src="/1794905891532.png"
                alt="Adarsh Tripathy - Founder & Lead Photographer"
                loading="lazy"
                decoding="async"
                width="1792"
                height="2400"
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
              <span className="sig-title">Founder &amp; Lead Photographer</span>
            </div>

            <div className="legacy-about-action" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
              <button className="btn btn--outline" onClick={() => onNavigate('about')}>
                <span>Meet Adarsh</span>
              </button>
            </div>

            {/* Social Media Connectors */}
            <div className="legacy-social-connectors" aria-label="Connect with Founder">
              <span className="legacy-social-label">Connect:</span>
              <div className="legacy-social-links">
                <a href="https://www.instagram.com/the_direct_or" target="_blank" rel="noopener noreferrer" className="legacy-social-btn" aria-label="Instagram @the_direct_or" title="Instagram @the_direct_or">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://wa.me/918093844489" target="_blank" rel="noopener noreferrer" className="legacy-social-btn" aria-label="WhatsApp +91 8093844489" title="WhatsApp +91 8093844489">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </a>
                <a href="https://youtube.com/@artofweddingbyadarsh?si=Squya-1JjyoMxHd2" target="_blank" rel="noopener noreferrer" className="legacy-social-btn" aria-label="YouTube @artofweddingbyadarsh" title="YouTube @artofweddingbyadarsh">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/share/1EtQF3LBcH" target="_blank" rel="noopener noreferrer" className="legacy-social-btn" aria-label="Facebook" title="Facebook — Adarsh Tripathy">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. SECTION 05: THE TRAILER CTA */}
      <section className="home-trailer in-view" aria-label="Special Offer" style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          className="tr-backdrop"
          src="/lts%20start%20your%20journey.jpg.jpeg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
        <div className="tr-hero-frame">
          <motion.img
            className="tr-hero-img"
            initial={{ opacity: 0.9, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            src="/lts%20start%20your%20journey.jpg.jpeg"
            alt="Traditional Indian Wedding Ceremony"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="tr-veil" aria-hidden="true"></div>
        <div className="tr-content">
          <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="tr-cred">
            <span className="tr-s1">Special Offer <span className="tick">·</span> Free Engagement Coverage with Full Traditional / Destination Package</span>
            <span className="tr-s2">the one day</span>
            <span className="tr-s3">you'll want to live twice.</span>
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
