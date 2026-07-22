import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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

export default function About({ onNavigate }) {
  return (
    <div className="about-page-wrapper" style={{ background: '#0a0a0b', color: '#eae5db', overflowX: 'hidden' }}>
      
      {/* 1. TOP HERO SECTION */}
      <section className="about-hero" style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
        <motion.img 
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          src="assets/images/hero_meet_me.png" 
          alt="Adarsh Tripathy - Chitra Weddings"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to bottom, rgba(10,10,11,0.15) 0%, rgba(10,10,11,0.65) 100%)' 
          }} 
        />
      </section>

      {/* 2. AUTHENTIC BIO SECTION */}
      <section style={{ background: '#eae5db', color: '#131312', padding: 'clamp(4rem, 9vh, 7rem) var(--pad)' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 5fr) minmax(0, 3fr)', gap: '2.5rem', alignItems: 'center' }}>
          
          {/* Left Vertical Portrait Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ borderRadius: '160px 160px 0 0', overflow: 'hidden', aspectRatio: '3/4', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
          >
            <img src="assets/images/bio_couple.png" alt="Adarsh Tripathy Chitra Weddings" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          {/* Center Narrative Paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span style={{ fontFamily: 'var(--sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(19,19,18,0.55)', display: 'block', marginBottom: '0.8rem' }}>
              ABOUT CHITRA WEDDINGS · ADARSH TRIPATHY
            </span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', lineHeight: 1.05, textTransform: 'uppercase', marginBottom: '1.8rem', color: '#131312' }}>
              YOUR LOVE STORY DESERVES TO BE TOLD <em style={{ fontStyle: 'italic', fontWeight: 400 }}>BEAUTIFULLY</em>
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(19,19,18,0.72)', marginBottom: '1.2rem' }}>
              At Chitra Weddings, we craft timeless wedding stories that not only capture the essence of your love but also leave a lasting legacy for generations to come. Our expert photographers and cinematographers weave a narrative that is as much about the beauty of the moment as it is about the beauty of your love story.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(19,19,18,0.72)', marginBottom: '1.2rem' }}>
              As a couple embarking on their special day, navigating through the day brings so many things to take care of, leaving limited time to focus on what truly matters - your love story. Chitra Weddings alleviates this stress, capturing the essence of your unique love story, ensuring cherished memories for a lifetime.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(19,19,18,0.72)' }}>
              By choosing us, you're not just hiring a photographer – you're entrusting the telling of your most cherished memories to masterful storytellers.
            </p>
          </motion.div>

          {/* Right Two Stacked Side Photos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ borderRadius: '120px 120px 0 0', overflow: 'hidden', aspectRatio: '4/5' }}
            >
              <img src="assets/images/meet_me_side_1.png" alt="Traditional wedding moment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ borderRadius: '120px 120px 0 0', overflow: 'hidden', aspectRatio: '4/5' }}
            >
              <img src="assets/images/meet_me_side_2.png" alt="Pre wedding moment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          </div>

        </div>
      </section>

      {/* 3. MISSION & VISION SECTION */}
      <section style={{ position: 'relative', background: '#101012', padding: 'clamp(5rem, 11vh, 8rem) var(--pad)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none' }}>
          <img src="assets/images/fav_couple.png" alt="Background detail" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 6fr) minmax(0, 5fr)', gap: '3rem', alignItems: 'center' }}>
          
          {/* Animated Stats Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
            
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: '#eae5db', width: '120px', flex: 'none', lineHeight: 1 }}>
                <AnimatedNumber end={2.5} decimals={1} /> <sup style={{ fontSize: '0.45em', color: 'var(--brass)' }}>+</sup>
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--bone-70)', lineHeight: 1.6 }}>Number of children we have. Myloh, Josephine &amp; our newest addition who will join us this May</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: '#eae5db', width: '120px', flex: 'none', lineHeight: 1 }}>
                <AnimatedNumber end={63} /> <sup style={{ fontSize: '0.45em', color: 'var(--brass)' }}>+</sup>
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--bone-70)', lineHeight: 1.6 }}>Average number of hours spent staring at my computer each week</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: '#eae5db', width: '120px', flex: 'none', lineHeight: 1 }}>
                <AnimatedNumber end={10} /> <sup style={{ fontSize: '0.45em', color: 'var(--brass)' }}>+</sup>
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--bone-70)', lineHeight: 1.6 }}>Number of dogs I'd have if our house allowed it. Would love to get some chickens some day!</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: '#eae5db', width: '120px', flex: 'none', lineHeight: 1 }}>
                <AnimatedNumber end={9} /> <sup style={{ fontSize: '0.45em', color: 'var(--brass)' }}>+</sup>
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--bone-70)', lineHeight: 1.6 }}>Number of times I've re-read the entire Harry Potter series. Muggles wouldn't understand ;)</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: '#eae5db', width: '120px', flex: 'none', lineHeight: 1 }}>
                <AnimatedNumber end={14} /> <sup style={{ fontSize: '0.45em', color: 'var(--brass)' }}>+</sup>
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--bone-70)', lineHeight: 1.6 }}>Number of years I've spent doing what I love and documenting your stories</p>
            </motion.div>

          </div>

          {/* Right Giant Vertical Headline */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'right' }}
          >
            <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)', lineHeight: 0.95, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#eae5db' }}>
              OUR<br />MISSION<br />&amp; VISION<br />PROMISE
            </h2>
          </motion.div>

        </div>
      </section>

      {/* 4. REVIEW QUOTE BANNER */}
      <section style={{ background: '#eae5db', color: '#131312', padding: 'clamp(4rem, 8vh, 6rem) var(--pad)', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ maxWidth: '850px', margin: '0 auto' }}>
          <blockquote style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', lineHeight: 1.45, textTransform: 'uppercase', marginBottom: '2rem' }}>
            "CHITRA WEDDINGS WAS INCREDIBLE TO WORK WITH! THEY ALLEVIATED ALL OUR STRESS AND CAPTURED OUR DAY SO BEAUTIFULLY THAT WE CAN RELIVE THE JOY FOR A LIFETIME!"
          </blockquote>
          <button 
            onClick={() => onNavigate && onNavigate('contact')} 
            className="btn" 
            style={{ borderColor: '#131312', color: '#131312' }}
          >
            <span>LET'S START YOUR JOURNEY</span>
          </button>
        </motion.div>
      </section>

      {/* 5. SERVICES AT A GLANCE SECTION */}
      <section style={{ background: '#1b1a17', padding: 'clamp(5rem, 11vh, 8rem) var(--pad)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)', gap: '4rem', alignItems: 'center' }}>
          
          <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div style={{ borderRadius: '180px 180px 0 0', overflow: 'hidden', aspectRatio: '3/4', border: '1px solid var(--hair)' }}>
              <img src="assets/images/rainbow_couple.png" alt="Chitra Weddings Services" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '3rem', color: '#eae5db' }}>
              OUR LUXURY SERVICES
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem 2rem' }}>
              
              <div>
                <span className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>TRADITIONAL COVERAGE</span>
                <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#eae5db' }}>FULL TRADITIONAL WEDDINGS</span>
              </div>

              <div>
                <span className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>DESTINATION COVERAGE</span>
                <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#eae5db' }}>DESTINATION WEDDINGS</span>
              </div>

              <div>
                <span className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>PRE WEDDING</span>
                <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#eae5db' }}>CINEMATIC PRE-WEDDING</span>
              </div>

              <div>
                <span className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>CELEBRATIONS</span>
                <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#eae5db' }}>ENGAGEMENT &amp; ANNIVERSARIES</span>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* 6. GOLD CALL TO ACTION BAR */}
      <section style={{ background: '#a49372', color: '#131312', padding: '2.5rem var(--pad)', textAlign: 'center' }}>
        <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            FREE ENGAGEMENT COVERAGE WITH TRADITIONAL &amp; DESTINATION PACKAGES!
          </h3>
          <button 
            onClick={() => onNavigate && onNavigate('contact')}
            style={{ background: '#131312', color: '#eae5db', padding: '0.9rem 2.2rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}
          >
            ENQUIRE NOW!
          </button>
        </div>
      </section>

      {/* 7. INSTAGRAM FOOTER STRIP */}
      <section style={{ background: '#0a0a0b', padding: '4rem var(--pad) 2rem', borderTop: '1px solid var(--hair)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
            <img src="assets/images/insta_1.png" alt="Chitra Weddings 1" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            <img src="assets/images/insta_2.png" alt="Chitra Weddings 2" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            <img src="assets/images/insta_3.png" alt="Chitra Weddings 3" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            <img src="assets/images/insta_4.png" alt="Chitra Weddings 4" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            <img src="assets/images/insta_5.png" alt="Chitra Weddings 5" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
          </div>

          <span className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>WEDDING PHOTOGRAPHY &amp; VIDEOGRAPHY</span>
          <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: '2.5rem', letterSpacing: '0.4em', textIndent: '0.4em', marginBottom: '1.2rem' }}>CHITRA WEDDINGS</h2>
          <p className="muted" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            SPECIALIZING IN TRADITIONAL, DESTINATION &amp; PRE-WEDDING COVERAGE
          </p>

        </div>
      </section>
    </div>
  );
}
