import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Couple gallery data mapped to Chitra Weddings services
const coupleGrid = [
  { id: 1, title: 'TRADITIONAL COVERAGE', img: 'assets/images/collage_closeup.png', sub: 'Chitra Weddings Full Coverage', option: 1 },
  { id: 2, title: 'DESTINATION WEDDINGS', img: 'assets/images/blog_dance.png', sub: 'Global Destination Vows', option: 2 },
  { id: 3, title: 'PRE WEDDING SESSION', img: 'assets/images/blog_fence.png', sub: 'Cinematic Pre-Wedding Stories', option: 3 },
  { id: 4, title: 'ENGAGEMENT COVERAGE', img: 'assets/images/blog_car.png', sub: 'Special Celebration Session', option: 1 },
  { id: 5, title: 'BIRTHDAY & ANNIVERSARIES', img: 'assets/images/exp_weddings.png', sub: 'Cherished Life Milestones', option: 3 },
  { id: 6, title: 'SUNSET PORTRAITS', img: 'assets/images/rainbow_couple.png', sub: 'Golden Hour Embraces', option: 2 },
  { id: 7, title: 'HERITAGE CEREMONIES', img: 'assets/images/fav_couple.png', sub: 'Timeless Traditional Rituals', option: 1 },
  { id: 8, title: 'FAMILY CELEBRATIONS', img: 'assets/images/exp_families.png', sub: 'Joyful Moments Captured', option: 2 },
  { id: 9, title: 'COASTAL WEDDINGS', img: 'assets/images/exp_couples.png', sub: 'Breathtaking Destination Shots', option: 3 }
];

const carouselPhotos = [
  'assets/images/insta_1.png',
  'assets/images/insta_2.png',
  'assets/images/insta_3.png',
  'assets/images/insta_4.png',
  'assets/images/insta_5.png',
  'assets/images/collage_tennis.png'
];

export default function Portfolio({ onNavigate }) {
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [activeOption, setActiveOption] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % (carouselPhotos.length - 2));
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + (carouselPhotos.length - 2)) % (carouselPhotos.length - 2));
  };

  return (
    <div className="portfolio-page-wrapper" style={{ background: '#0a0a0b', minHeight: '100vh', color: '#eae5db' }}>
      
      {/* 1. TOP HERO SECTION */}
      <section className="portfolio-hero" style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
        <motion.img 
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          src="assets/images/bio_couple.png" 
          alt="Chitra Weddings Portfolio Hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to bottom, rgba(10,10,11,0.2) 0%, rgba(10,10,11,0.7) 100%)' 
          }} 
        />
      </section>



      {/* 3. TESTIMONIAL QUOTE BANNER */}
      <section style={{ background: '#0a0a0b', borderTop: '1px solid var(--hair)', borderBottom: '1px solid var(--hair)', padding: 'clamp(4rem, 9vh, 6rem) var(--pad)', textAlign: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <blockquote style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)', lineHeight: 1.45, color: '#eae5db', marginBottom: '1.5rem' }}>
            "YOUR LOVE STORY DESERVES TO BE TOLD BEAUTIFULLY. CHITRA WEDDINGS ALLEVIATES THE STRESS AND ENSURES CHERISHED MEMORIES FOR A LIFETIME."
          </blockquote>
          <cite style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--brass)', fontStyle: 'normal' }}>
            - CHITRA WEDDINGS
          </cite>
        </motion.div>
      </section>

      {/* 4. 3x3 GRID OF COUPLE GALLERIES */}
      <section style={{ padding: 'clamp(4rem, 10vh, 7rem) var(--pad)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {coupleGrid.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => { setSelectedGallery(item); setActiveOption(item.option); }}
                style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', cursor: 'pointer', background: '#16161a' }}
              >
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }} />
                
                {/* Hover Dark Overlay & Title */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(10,10,11,0.65)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.2em', color: '#eae5db', textTransform: 'uppercase' }}>
                    {item.title}
                  </span>
                  <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--brass)', marginTop: '0.5rem' }}>
                    View Gallery &rarr;
                  </span>
                </motion.div>

                {/* Subtitle tag at bottom */}
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', pointerEvents: 'none' }}>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(234,229,219,0.9)', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                    {item.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CAROUSEL SLIDER */}
      <section style={{ borderTop: '1px solid var(--hair)', padding: '4rem var(--pad)', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={handlePrevCarousel}
            aria-label="Previous photos"
            style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--hair)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', color: '#eae5db', cursor: 'pointer', background: 'transparent' }}
          >
            &larr;
          </button>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <motion.div 
              animate={{ x: `-${carouselIndex * 33.33}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', gap: '1.5rem' }}
            >
              {carouselPhotos.map((photo, i) => (
                <div key={i} style={{ flex: '0 0 calc(33.333% - 1rem)', aspectRatio: '3/4', overflow: 'hidden' }}>
                  <img src={photo} alt={`Carousel item ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </motion.div>
          </div>

          <button 
            onClick={handleNextCarousel}
            aria-label="Next photos"
            style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--hair)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', color: '#eae5db', cursor: 'pointer', background: 'transparent' }}
          >
            &rarr;
          </button>
        </div>
      </section>

      {/* 6. ANIMATED GALLERY PREVIEWS MODAL (3 GALLERY OPTIONS) */}
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
              overflowY: 'auto'
            }}
          >
            {/* Modal Navigation Bar */}
            <div style={{ padding: '1.5rem var(--pad)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--hair)', position: 'sticky', top: 0, background: '#0a0a0b', zIndex: 10 }}>
              <div>
                <span className="label">CHITRA WEDDINGS</span>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', color: '#eae5db', margin: 0 }}>{selectedGallery.title}</h3>
              </div>

              {/* Option Selector Toggle Buttons */}
              <div style={{ display: 'flex', gap: '0.8rem', background: 'rgba(234,229,219,0.08)', padding: '0.3rem', borderRadius: '99px' }}>
                <button 
                  onClick={() => setActiveOption(1)}
                  style={{ padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', background: activeOption === 1 ? 'var(--brass)' : 'transparent', color: activeOption === 1 ? '#131312' : '#eae5db', transition: 'all 0.3s', border: 'none' }}
                >
                  OPTION 1: MASONRY
                </button>
                <button 
                  onClick={() => setActiveOption(2)}
                  style={{ padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', background: activeOption === 2 ? 'var(--brass)' : 'transparent', color: activeOption === 2 ? '#131312' : '#eae5db', transition: 'all 0.3s', border: 'none' }}
                >
                  OPTION 2: CENTERPIECE
                </button>
                <button 
                  onClick={() => setActiveOption(3)}
                  style={{ padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', background: activeOption === 3 ? 'var(--brass)' : 'transparent', color: activeOption === 3 ? '#131312' : '#eae5db', transition: 'all 0.3s', border: 'none' }}
                >
                  OPTION 3: TRIPTYCH
                </button>
              </div>

              <button 
                onClick={() => setSelectedGallery(null)}
                style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--bone-70)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                CLOSE ✕
              </button>
            </div>

            {/* Modal Body Content depending on Active Option */}
            <div style={{ padding: '3rem var(--pad)', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
              
              {/* GALLERY OPTION 1: EDITORIAL MASONRY */}
              {activeOption === 1 && (
                <motion.div key="opt1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 className="display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>{selectedGallery.title}</h1>
                    <p className="muted" style={{ fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: '1.2rem', marginTop: '0.5rem' }}>{selectedGallery.sub}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    <img src={selectedGallery.img} alt="Detail 1" style={{ gridColumn: 'span 2', aspectRatio: '16/10', width: '100%', objectFit: 'cover' }} />
                    <img src="assets/images/insta_2.png" alt="Detail 2" style={{ aspectRatio: '3/4', width: '100%', objectFit: 'cover' }} />
                    <img src="assets/images/insta_3.png" alt="Detail 3" style={{ aspectRatio: '3/4', width: '100%', objectFit: 'cover' }} />
                    <img src="assets/images/insta_4.png" alt="Detail 4" style={{ gridColumn: 'span 2', aspectRatio: '16/10', width: '100%', objectFit: 'cover' }} />
                  </div>
                </motion.div>
              )}

              {/* GALLERY OPTION 2: ROMANTIC CENTERPIECE */}
              {activeOption === 2 && (
                <motion.div key="opt2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span className="label">CHITRA WEDDINGS</span>
                    <h1 className="display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginTop: '0.5rem' }}>{selectedGallery.title}</h1>
                    <p className="muted" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.2rem', marginTop: '0.5rem' }}>{selectedGallery.sub}</p>
                  </div>

                  <div style={{ maxWidth: '650px', margin: '0 auto' }}>
                    <div style={{ aspectRatio: '4/5', overflow: 'hidden', border: '1px solid var(--brass)', padding: '10px' }}>
                      <img src={selectedGallery.img} alt="Centerpiece portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* GALLERY OPTION 3: TRIPTYCH STRIP */}
              {activeOption === 3 && (
                <motion.div key="opt3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 className="display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>{selectedGallery.title}</h1>
                    <p className="muted" style={{ fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: '1.2rem', marginTop: '0.5rem' }}>{selectedGallery.sub}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                      <img src={selectedGallery.img} alt="Triptych left" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid var(--hair)', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="mark">
                        <span className="mark-main">CHITRA</span>
                        <small className="mark-sub">WEDDINGS</small>
                      </div>
                    </div>

                    <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                      <img src="assets/images/insta_5.png" alt="Triptych right" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
