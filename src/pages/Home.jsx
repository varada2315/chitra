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

// 4 PINNED FEATURED STORIES DATA
const storiesData = [
  {
    id: 1,
    stepNum: "01 / 04",
    category: "Traditional Wedding Coverage",
    title: "Traditional Heritage Ceremonies",
    couple: "Edmond & Lauren",
    location: "Bozeman Hills, Montana",
    description: "Full sacred ritual coverage capturing emotional vows, intricate traditional attire, and grand evening celebrations with cinematic grace.",
    img: "assets/images/exp_weddings.png",
    vimeoId: "332887606"
  },
  {
    id: 2,
    stepNum: "02 / 04",
    category: "Destination Wedding Coverage",
    title: "Destination Coastal Vows",
    couple: "Luke & Anna",
    location: "Gallatin River, Wyoming",
    description: "Breathtaking destination films set against majestic mountains and oceans, capturing intimate promises and multi-day celebrations.",
    img: "assets/images/bio_couple.png",
    vimeoId: "1027095536"
  },
  {
    id: 3,
    stepNum: "03 / 04",
    category: "Pre-Wedding Coverage",
    title: "Cinematic Pre-Wedding Stories",
    couple: "Niko & Bryn",
    location: "Hawaiʻi Island",
    description: "Golden hour romance sessions weaving personal letters, candid laughter, and dramatic landscapes into an unforgettable prelude.",
    img: "assets/images/rainbow_couple.png",
    vimeoId: "746685962"
  },
  {
    id: 4,
    stepNum: "04 / 04",
    category: "Engagement & Anniversaries",
    title: "Milestones & Celebrations",
    couple: "Jeremy & Lauren",
    location: "Casa Del Mar, California",
    description: "Documenting proposals, engagement galas, and life milestones with timeless luxury and storytelling depth.",
    img: "assets/images/fav_couple.png",
    vimeoId: "749278985"
  }
];

function FeaturedStoriesStepSection({ onNavigate, onOpenVideo }) {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const isCooldownRef = useRef(false);

  activeIdxRef.current = activeIdx;

  // Intercept wheel events to lock page scroll until all 4 cards have flipped
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleWheel = (e) => {
      const rect = section.getBoundingClientRect();
      const delta = e.deltaY;
      const current = activeIdxRef.current;

      // Check if section top is aligned with screen top
      const isAtTop = Math.abs(rect.top) <= 50;

      // Scrolling down into section: snap section to top if close
      if (delta > 0 && rect.top > 0 && rect.top <= window.innerHeight * 0.4 && current < 3) {
        e.preventDefault();
        window.scrollTo({ top: window.scrollY + rect.top, behavior: 'smooth' });
        return;
      }

      // If section is aligned at top:
      if (isAtTop) {
        // Scrolling down & not yet on Card 4 (index 3) -> LOCK scroll & FLIP card
        if (delta > 0 && current < storiesData.length - 1) {
          e.preventDefault();
          if (isCooldownRef.current) return;
          isCooldownRef.current = true;
          setActiveIdx(current + 1);
          setTimeout(() => { isCooldownRef.current = false; }, 480);
        }
        // Scrolling up & not yet on Card 1 (index 0) -> LOCK scroll & FLIP card back
        else if (delta < 0 && current > 0) {
          e.preventDefault();
          if (isCooldownRef.current) return;
          isCooldownRef.current = true;
          setActiveIdx(current - 1);
          setTimeout(() => { isCooldownRef.current = false; }, 480);
        }
        // On boundary (Card 4 scrolling down or Card 1 scrolling up) -> UNLOCK scroll!
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const activeStory = storiesData[activeIdx];

  // 3D tilt hover for active frame
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <section 
      ref={sectionRef} 
      style={{ 
        position: 'relative', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden', 
        background: '#0a0a0b',
        borderTop: '1px solid var(--hair)',
        borderBottom: '1px solid var(--hair)',
        padding: '2rem 0'
      }}
    >
      <div className="featured-stories-sticky-frame" style={{ maxWidth: '1250px', width: '100%', padding: '0 var(--pad)', display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)', gap: '4rem', alignItems: 'center' }}>
        
        {/* LEFT COLUMN: STORY DETAILS */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Step Counter & Progress Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
            <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.2rem', color: 'var(--brass)' }}>
              {activeStory.stepNum}
            </span>
            <div style={{ flex: 1, height: '2px', background: 'var(--hair)' }}>
              <div style={{ width: `${((activeIdx + 1) / storiesData.length) * 100}%`, height: '100%', background: 'var(--brass)', transition: 'width 0.45s ease' }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Category Tag */}
              <span className="label" style={{ color: 'var(--brass)', display: 'block', marginBottom: '0.6rem' }}>
                {activeStory.category}
              </span>

              {/* Main Story Title */}
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 3.8vw, 3.4rem)', lineHeight: 1.1, color: '#eae5db', marginBottom: '0.8rem' }}>
                {activeStory.title}
              </h2>

              {/* Couple Names & Location */}
              <div style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '1rem' }}>
                {activeStory.couple} <span className="tick">·</span> {activeStory.location}
              </div>

              {/* Description Narrative */}
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--bone-70)', marginBottom: '1.5rem', maxWidth: '42ch' }}>
                {activeStory.description}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" onClick={() => onNavigate('films')}>
                  <span>Watch Full Film</span>
                </button>

                <button 
                  onClick={() => onOpenVideo(activeStory.vimeoId)}
                  style={{ background: 'none', border: 'none', color: 'var(--brass)', fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Quick Preview &rarr;
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Step Buttons */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '2rem' }}>
            {storiesData.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveIdx(idx)}
                style={{
                  height: '4px',
                  width: idx === activeIdx ? '36px' : '14px',
                  background: idx === activeIdx ? 'var(--brass)' : 'rgba(234,229,219,0.2)',
                  borderRadius: '2px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Jump to Story ${idx + 1}`}
              />
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: 3D CARD FLIP ANIMATION */}
        <div style={{ perspective: '1200px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory.id}
              initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -90, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
              className="veil in"
            >
              <div 
                className="feature-frame"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => onOpenVideo(activeStory.vimeoId)}
                role="button"
                tabIndex="0"
                style={{ cursor: 'pointer', borderRadius: '4px', overflow: 'hidden' }}
              >
                <img src={activeStory.img} alt={activeStory.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* Camera Focus Brackets */}
                <span className="brk tl" aria-hidden="true"></span>
                <span className="brk tr" aria-hidden="true"></span>
                <span className="brk bl" aria-hidden="true"></span>
                <span className="brk br" aria-hidden="true"></span>
                
                <div className="shade"></div>
                
                <div className="playbtn">
                  <svg width="22" height="24" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5v19l17-9.5L1 1.5z" stroke="#EAE5DB" strokeWidth="1.2" fill="none" />
                  </svg>
                </div>
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

  return (
    <div className="page-content-wrapper">
      {/* Film Grain Overlay */}
      <div className="grain" aria-hidden="true"></div>

      {/* 1. HERO SECTION */}
      <div className="hero-wrap">
        <header className="hero">
          <div className="media" style={{ overflow: 'hidden', position: 'absolute', inset: 0 }}>
            <iframe 
              src="https://player.vimeo.com/video/332887606?autoplay=1&loop=1&title=0&byline=0&portrait=0&muted=1&background=1"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100vw',
                height: '56.25vw',
                minHeight: '100vh',
                minWidth: '177.77vh',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                border: 'none',
                opacity: 0.85
              }}
              title="Hero Wedding Video Background"
            />
          </div>
          
          <div className="bar-top" aria-hidden="true"></div>
          <div className="bar-bot" aria-hidden="true"></div>
          
          <div className="content">
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
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
            <p className="greet-line">
              <span className="greet-lede">Creating one Memory at a Time</span>
              <em className="greet-em">· Limited number of Weddings.</em>
              <button className="greet-cta" onClick={() => onNavigate('contact')}>
                Enquire Now<span className="greet-uline"></span>
              </button>
            </p>
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
      </section>

      {/* 4. SECTION 03: STATS (ANIMATED FRAMER MOTION COUNT UP) */}
      <section className="sec" style={{ paddingTop: "2rem" }}>
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

          <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.36 }} className="stat">
            <span className="num">Chitra</span>
            <span className="label">Weddings</span>
          </motion.div>
        </div>
      </section>

      {/* 5. SECTION 04: THE CRAFT & LEGACY */}
      <section className="sec on-bone">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="sec-head">
          <span className="n">03</span>
          <span className="label">Our Legacy</span>
        </motion.div>

        <div className="ed-grid">
          <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="display">
            Crafting Timeless<br /><em>Love Stories.</em>
          </motion.h2>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="body-lg">At Chitra Weddings, we craft timeless wedding stories that not only capture the essence of your love but also leave a lasting legacy for generations to come.</p>
            <p className="muted" style={{ marginTop: "1.4rem" }}>Our expert photographers and cinematographers weave a narrative that is as much about the beauty of the moment as it is about the beauty of your love story. By choosing us, you're trusting the telling of your most cherished memories to masterful storytellers.</p>
          </motion.div>
        </div>

        <div className="pillars">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="pillar">
            <span className="n">i.</span>
            <h3>Traditional &amp; Destination</h3>
            <p className="muted">Full coverage for traditional ceremonies and destination celebrations worldwide, tailored to your love story.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="pillar">
            <span className="n">ii.</span>
            <h3>Free Engagement Offer</h3>
            <p className="muted">Get Engagement Coverage Free with Full Traditional Coverage or Destination Wedding Coverage.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="pillar">
            <span className="n">iii.</span>
            <h3>Timeless Legacy</h3>
            <p className="muted">Immortalizing your most precious moments so you can simply be present in the joy of your union.</p>
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
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen 
              title="Wedding Film Preview"
            ></iframe>
          )}
        </div>
      </div>

    </div>
  );
}
