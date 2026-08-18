import React, { useState } from 'react';
import { motion } from 'framer-motion';

const vlogsList = [
  {
    vimeoId: "332887606",
    img: "assets/images/contact_hero.png",
    num: "01",
    title: "Behind the Lens: Royal Mandap Setup in Puri",
    category: "Wedding BTS",
    duration: "12:45",
    desc: "A complete step-by-step vlog capturing the floral decoration, camera rigs, and mandap lighting for an authentic Indian wedding."
  },
  {
    vimeoId: "1027095536",
    img: "assets/images/author_portrait.png",
    num: "02",
    title: "Day in the Life of a Destination Wedding Photographer",
    category: "Destination Vlogs",
    duration: "15:20",
    desc: "Travel with our crew to coastal Odisha as we shoot sunrise couple portraits and manage multi-day wedding schedules."
  },
  {
    vimeoId: "914290878",
    img: "assets/images/fav_couple.png",
    num: "03",
    title: "Our 2026 Cinema Gear Setup: Cameras & Lenses",
    category: "Gear & Craft",
    duration: "09:50",
    desc: "An in-depth breakdown of the Leica, Fujifilm, and Sony cameras, prime lenses, and audio gear we use for high-end wedding films."
  },
  {
    vimeoId: "382794147",
    img: "assets/images/exp_weddings.png",
    num: "04",
    title: "How We Direct Real Couples: Pre-Wedding Vlog",
    category: "Pre-Wedding Stories",
    duration: "11:15",
    desc: "Watch how we create natural, candidate moments and candid movement during outdoor pre-wedding couple sessions."
  },
  {
    vimeoId: "891737638",
    img: "assets/images/hero_home.png",
    num: "05",
    title: "Traditional Sangeet & Haldi Ceremony BTS",
    category: "Wedding BTS",
    duration: "14:05",
    desc: "High energy, colors, and live music — see how our team handles dual-camera coverage during crowded Haldi celebrations."
  },
  {
    vimeoId: "766281509",
    img: "assets/images/rainbow_couple.png",
    num: "06",
    title: "Cinematic Color Grading & Post-Production Vlog",
    category: "Gear & Craft",
    duration: "18:30",
    desc: "An inside look at our editing workflow: tone curves, film grain, and audio design for rich cinematic wedding trailers."
  }
];

const categories = ["All Vlogs", "Wedding BTS", "Destination Vlogs", "Gear & Craft", "Pre-Wedding Stories"];

export default function Vlogs({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState("All Vlogs");
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxBoot, setLightboxBoot] = useState(false);
  const [lightboxLit, setLightboxLit] = useState(false);

  const filteredVlogs = activeCategory === "All Vlogs" 
    ? vlogsList 
    : vlogsList.filter(vlog => vlog.category === activeCategory);

  const openVlog = (vimeoId) => {
    setActiveVideo(vimeoId);
    setLightboxBoot(true);
    setLightboxLit(false);
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      setLightboxLit(true);
      setLightboxBoot(false);
    }, 500);
  };

  const closeVlog = () => {
    setActiveVideo(null);
    setLightboxLit(false);
    setLightboxBoot(false);
    document.body.style.overflow = '';
  };

  return (
    <div className="page-content-wrapper">
      <main className="spotlight">
        
        {/* Page Hero Header with Split Visual Card */}
        <header className="page-hero" style={{ paddingBottom: '2rem' }}>
          <div className="vlogs-hero-grid">
            <div style={{ textAlign: 'left' }}>
              <span className="label rv">Chitra Weddings — Vlogs</span>
              <h1 className="display" data-split style={{ textAlign: 'left' }}>
                Behind the lens,<br />&amp; <em>unfiltered stories.</em>
              </h1>
              <p className="muted body-lg rv d1" style={{ maxWidth: '48ch', marginTop: '1.8rem', textAlign: 'left' }}>
                Explore our filmmaking vlogs, behind-the-scenes moments, gear breakdowns, and real wedding day stories.
              </p>
            </div>

            {/* Right Side Editorial Filmmaker Photo Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                border: '1px solid rgba(179, 161, 128, 0.25)',
                maxHeight: '440px'
              }}
            >
              <img 
                src="assets/images/vlogs_hero.png" 
                alt="Behind the Scenes Filmmaking Chitra Weddings" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10,10,11,0.85) 0%, transparent 60%)'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '1.4rem',
                left: '1.5rem',
                right: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--bone)', fontSize: '1rem' }}>
                  Filmmaking &amp; BTS
                </span>
                <span style={{
                  background: 'rgba(179, 161, 128, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'var(--brass)',
                  border: '1px solid rgba(179, 161, 128, 0.4)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '99px',
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  fontFamily: 'var(--sans)',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}>
                  CHITRA CREW
                </span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Category Filters */}
        <section className="sec" style={{ paddingTop: '1rem', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? 'var(--brass)' : 'rgba(234, 229, 219, 0.06)',
                  color: activeCategory === cat ? '#131312' : 'var(--bone-70)',
                  border: '1px solid ' + (activeCategory === cat ? 'var(--brass)' : 'rgba(234, 229, 219, 0.15)'),
                  padding: '0.6rem 1.4rem',
                  borderRadius: '99px',
                  fontFamily: 'var(--sans)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s var(--ease)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Vlogs Grid */}
        <section className="sec" style={{ paddingTop: '1rem' }}>
          <div className="films-duo">
            {filteredVlogs.map((vlog, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
                style={{ perspective: '1000px' }}
              >
                <div className="veil">
                  <div 
                    className="feature-frame"
                    onClick={() => openVlog(vlog.vimeoId)}
                    role="button"
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openVlog(vlog.vimeoId);
                      }
                    }}
                    aria-label={`Watch ${vlog.title}`}
                  >
                    <img src={vlog.img} alt={vlog.title} />
                    
                    <span className="brk tl" aria-hidden="true"></span>
                    <span className="brk tr" aria-hidden="true"></span>
                    <span className="brk bl" aria-hidden="true"></span>
                    <span className="brk br" aria-hidden="true"></span>
                    
                    <div className="shade"></div>

                    {/* Duration badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      background: 'rgba(10, 10, 11, 0.85)',
                      backdropFilter: 'blur(10px)',
                      color: 'var(--brass)',
                      padding: '0.3rem 0.7rem',
                      borderRadius: '6px',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--sans)',
                      letterSpacing: '0.12em',
                      fontWeight: 600,
                      zIndex: 3,
                      border: '1px solid rgba(179, 161, 128, 0.3)'
                    }}>
                      ▶ {vlog.duration}
                    </div>

                    <div className="playbtn">
                      <svg width="18" height="20" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5v19l17-9.5L1 1.5z" stroke="#EAE5DB" strokeWidth="1.2" fill="none" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="film-meta rv" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
                  <div>
                    <span className="label" style={{ color: 'var(--brass)', display: 'block', marginBottom: '0.3rem' }}>
                      {vlog.num}. {vlog.category}
                    </span>
                    <button className="names" onClick={() => openVlog(vlog.vimeoId)} style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)', textAlign: 'left' }}>
                      {vlog.title}
                    </button>
                    <p style={{ fontSize: '0.85rem', color: 'var(--bone-70)', lineHeight: '1.55', marginTop: '0.5rem', maxWidth: '42ch' }}>
                      {vlog.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quiet CTA Section */}
        <section className="cta-quiet">
          <span className="label rv">Your Wedding Story Belongs in Cinema</span>
          <h2 className="display rv d1">Let's <em>Capture</em> Your Vows.</h2>
          <div className="rule rv d1" aria-hidden="true" style={{ width: '64px', height: '1px', background: 'var(--brass)', margin: '1.2rem 0' }}></div>
          <a className="btn rv d2" href="#contact" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('contact'); }}>
            <span>Enquire Now</span>
          </a>
        </section>

      </main>

      {/* Cinematic Vimeo Lightbox Modal */}
      <div 
        className={`lightbox ${activeVideo ? 'open' : ''} ${lightboxBoot ? 'boot' : ''} ${lightboxLit ? 'lit' : ''}`} 
        onClick={(e) => { if (e.target.classList.contains('lightbox')) closeVlog(); }}
        aria-hidden={!activeVideo}
      >
        <button className="close" onClick={closeVlog}>Close ✕</button>
        <div className="box">
          {activeVideo && (
            <iframe 
              src={`https://player.vimeo.com/video/${activeVideo}?autoplay=1&title=0&byline=0&portrait=0`}
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen 
              title="Chitra Vlog"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
}
