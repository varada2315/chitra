import React from 'react';
import { motion } from 'framer-motion';

// Easily editable Author Data for future updates
const authorData = {
  name: "Adarsh Tripathy",
  role: "Founder & Lead Photographer",
  experienceYears: "12+",
  location: "Bhubaneswar, Odisha, India",
  
  // Section Headers
  badge: "MEET THE PHOTOGRAPHER",
  headingMain: "About the",
  headingItalic: "Author",

  // Personal Introduction
  introTitle: "Hello, I'm Adarsh Tripathy",
  introText: "Welcome to CHITRA Weddings. For over a decade, I have dedicated my life to documenting love stories that feel honest, intimate, and cinematic. What began as a deep fascination with light and human connection has evolved into a wedding photography house built on trust, artistry, and emotional authenticity.",

  // Creative Philosophy
  philosophyTitle: "My Creative Philosophy",
  philosophyText: "I believe the most breathtaking wedding moments are never staged. They happen naturally — in quiet stolen glances between the couple, unscripted tears of joy from parents, and the vibrant energy of family celebrations. My goal is to capture your day as it unfolds, preserving the true soul of your celebration without interrupting its natural rhythm.",

  // The Journey & Vision
  journeyTitle: "The Journey & Vision",
  journeyText: "Over the years, I have had the honor of documenting over 100+ weddings across Odisha. And I feel every couple brings a distinct energy that inspires my craft.",

  // Message to Visitors & Couples
  messageTitle: "A Personal Message to You",
  messageText: "When you look back at your wedding photographs or watch your film 20 years from now, I want you to feel the exact warmth, butterflies, and emotional magic of that moment. You are not just hiring a photographer — you are trusting us with your legacy.",

  // Contact / Sign-off
  signoff: "Warm regards,",
  brand: "CHITRA Weddings"
};

export default function About({ onNavigate }) {
  return (
    <div className="about-page-wrapper" style={{ background: '#0a0a0b', color: '#eae5db', overflowX: 'hidden' }}>
      
      {/* 1. TOP HERO SECTION (LEFT-ALIGNED EDITORIAL BANNER) */}
      <section className="about-hero">
        <img
          src="assets/images/about_hero.webp"
          alt=""
          aria-hidden="true"
          decoding="async"
          className="about-hero-ambient"
        />
        <div className="about-hero-veil" aria-hidden="true" />

        <div className="about-hero-inner">
          <div className="about-hero-copy">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ 
                fontSize: '0.72rem', 
                letterSpacing: '0.32em', 
                textTransform: 'uppercase', 
                color: 'var(--brass)', 
                fontFamily: 'var(--sans)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.6rem',
                textAlign: 'left'
              }}
            >
              FOUNDER &amp; LEAD PHOTOGRAPHER
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ 
                fontFamily: 'var(--serif)', 
                fontSize: 'clamp(2.6rem, 6.2vw, 5rem)', 
                color: 'var(--bone)', 
                lineHeight: 1.05,
                fontWeight: 400,
                marginBottom: '0.4rem',
                textAlign: 'left'
              }}
            >
              Adarsh <em>Tripathy</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="about-hero-sub"
            >
              {authorData.experienceYears} Years &middot; 100+ Weddings &middot; {authorData.location}
            </motion.p>
            {/* Founder's Personal Social Media Links */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: '1.35rem'
              }}
            >
              <a 
                href="https://www.instagram.com/the_direct_or" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="foot-social-btn" 
                aria-label="Instagram @the_direct_or" 
                title="Instagram @the_direct_or"
                style={{ width: '42px', height: '42px', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(234, 229, 219, 0.25)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              <a 
                href="https://wa.me/918093844489" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="foot-social-btn" 
                aria-label="WhatsApp +91 8093844489" 
                title="WhatsApp +91 8093844489"
                style={{ width: '42px', height: '42px', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(234, 229, 219, 0.25)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>

              <a 
                href="https://youtube.com/@artofweddingbyadarsh?si=Squya-1JjyoMxHd2" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="foot-social-btn" 
                aria-label="YouTube @artofweddingbyadarsh" 
                title="YouTube @artofweddingbyadarsh"
                style={{ width: '42px', height: '42px', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(234, 229, 219, 0.25)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
                </svg>
              </a>

              <a 
                href="https://www.facebook.com/share/1EtQF3LBcH" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="foot-social-btn" 
                aria-label="Facebook" 
                title="Facebook — Adarsh Tripathy"
                style={{ width: '42px', height: '42px', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(234, 229, 219, 0.25)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="about-hero-media"
          >
            <motion.img
              initial={{ scale: 1.07 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              src="assets/images/about_hero.webp"
              alt="Adarsh Tripathy — Founder & Lead Photographer, Chitra Weddings"
              width="1188"
              height="1600"
              decoding="async"
              loading="eager"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. AUTHENTIC NARRATIVE INTRO SECTION (LEFT-ALIGNED) */}
      <section style={{ background: '#eae5db', color: '#131312', padding: 'clamp(4rem, 9vh, 7rem) var(--pad)', textAlign: 'left' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* Right Narrative Paragraphs - Left Aligned */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ textAlign: 'left' }}
          >
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', lineHeight: 1.05, textTransform: 'uppercase', marginBottom: '1.8rem', color: '#131312', textAlign: 'left' }}>
              YOUR LOVE STORY DESERVES TO BE TOLD <em style={{ fontStyle: 'italic', fontWeight: 400 }}>BEAUTIFULLY</em>
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(19,19,18,0.72)', marginBottom: '1.2rem', textAlign: 'left' }}>
              At Chitra Weddings, we craft timeless wedding stories that not only capture the essence of your love but also leave a lasting legacy for generations to come. Our expert photographers and cinematographers weave a narrative that is as much about the beauty of the moment as it is about the beauty of your love story.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(19,19,18,0.72)', marginBottom: '1.2rem', textAlign: 'left' }}>
              As a couple embarking on your special day, navigating through the celebrations brings so many things to handle. Chitra Weddings alleviates this stress, capturing the essence of your unique bond, ensuring cherished memories for a lifetime.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(19,19,18,0.72)', textAlign: 'left' }}>
              By choosing us, you're not just hiring a photographer — you're entrusting the telling of your most cherished memories to passionate storytellers.
            </p>
          </motion.div>

        </div>
      </section>

      {/* 3. NEW "ABOUT THE AUTHOR" / "MEET THE PHOTOGRAPHER" SECTION (LEFT-ALIGNED) */}
      <section style={{ position: 'relative', background: '#0a0a0b', padding: 'clamp(5rem, 11vh, 8rem) var(--pad)', textAlign: 'left' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          
          {/* Glassmorphic Luxury Container Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              background: 'rgba(234, 229, 219, 0.025)',
              border: '1px solid rgba(234, 229, 219, 0.12)',
              borderRadius: '24px',
              padding: 'clamp(2.5rem, 6vh, 4.5rem) clamp(1.8rem, 5vw, 3.8rem)',
              backdropFilter: 'blur(25px)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6)',
              textAlign: 'left'
            }}
          >
            <div style={{ textAlign: 'left' }}>

                {/* Editable Section 1: Introduction */}
                <div style={{ marginBottom: '1.6rem', textAlign: 'left' }}>
                  <h3 style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '0.5rem', textAlign: 'left' }}>
                    {authorData.introTitle}
                  </h3>
                  <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--bone-70)', textAlign: 'left' }}>
                    {authorData.introText}
                  </p>
                </div>

                {/* Editable Section 2: Creative Philosophy */}
                <div style={{ marginBottom: '1.6rem', textAlign: 'left' }}>
                  <h3 style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '0.5rem', textAlign: 'left' }}>
                    {authorData.philosophyTitle}
                  </h3>
                  <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--bone-70)', textAlign: 'left' }}>
                    {authorData.philosophyText}
                  </p>
                </div>

                {/* Editable Section 3: Journey & Vision */}
                <div style={{ marginBottom: '1.6rem', textAlign: 'left' }}>
                  <h3 style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '0.5rem', textAlign: 'left' }}>
                    {authorData.journeyTitle}
                  </h3>
                  <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--bone-70)', textAlign: 'left' }}>
                    {authorData.journeyText}
                  </p>
                </div>

                {/* Editable Section 4: Personal Message to Couples */}
                <div style={{ marginBottom: '2.2rem', textAlign: 'left' }}>
                  <h3 style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '0.5rem', textAlign: 'left' }}>
                    {authorData.messageTitle}
                  </h3>
                  <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--bone-70)', textAlign: 'left' }}>
                    {authorData.messageText}
                  </p>
                </div>

                {/* Signature & Founder Sign-Off (Left Aligned) */}
                <div style={{ borderTop: '1px solid var(--hair)', paddingTop: '1.4rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.2rem' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.3rem', color: 'var(--brass)', display: 'block', marginBottom: '0.2rem', textAlign: 'left' }}>
                      {authorData.name}
                    </span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--bone-45)', display: 'block', textAlign: 'left' }}>
                      {authorData.role} — {authorData.brand}
                    </span>
                  </div>

                  {/* Connect on Social Media */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <a href="https://www.instagram.com/the_direct_or" target="_blank" rel="noopener noreferrer" className="foot-social-btn" aria-label="Instagram @the_direct_or" title="Instagram @the_direct_or">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </a>
                    <a href="https://wa.me/918093844489" target="_blank" rel="noopener noreferrer" className="foot-social-btn" aria-label="WhatsApp +91 8093844489" title="WhatsApp +91 8093844489">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    </a>
                    <a href="https://youtube.com/@artofweddingbyadarsh?si=Squya-1JjyoMxHd2" target="_blank" rel="noopener noreferrer" className="foot-social-btn" aria-label="YouTube @artofweddingbyadarsh" title="YouTube @artofweddingbyadarsh">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
                      </svg>
                    </a>
                    <a href="https://www.facebook.com/share/1EtQF3LBcH" target="_blank" rel="noopener noreferrer" className="foot-social-btn" aria-label="Facebook" title="Facebook — Adarsh Tripathy">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                    </a>
                  </div>
                </div>

              </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
