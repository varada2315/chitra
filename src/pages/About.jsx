import React from 'react';
import { motion } from 'framer-motion';

// Easily editable Author Data for future updates
const authorData = {
  name: "Adarsh Tripathy",
  role: "Founder & Lead Photographer",
  experienceYears: "12+",
  location: "Bhubaneswar, Odisha & Worldwide",
  tagline: "Capturing timeless wedding stories and authentic human emotion across the globe.",
  
  // Section Headers
  badge: "MEET THE PHOTOGRAPHER",
  headingMain: "About the",
  headingItalic: "Author",

  // Personal Introduction
  introTitle: "Hello, I'm Adarsh Tripathy",
  introText: "Welcome to CHITRA Weddings. For over a decade, I have dedicated my life to documenting love stories that feel honest, intimate, and cinematic. What began as a deep fascination with light and human connection has evolved into a global wedding photography house built on trust, artistry, and emotional authenticity.",

  // Creative Philosophy
  philosophyTitle: "My Creative Philosophy",
  philosophyText: "I believe the most breathtaking wedding moments are never staged. They happen naturally — in quiet stolen glances between the couple, unscripted tears of joy from parents, and the vibrant energy of family celebrations. My goal is to capture your day as it unfolds, preserving the true soul of your celebration without interrupting its natural rhythm.",

  // The Journey & Vision
  journeyTitle: "The Journey & Vision",
  journeyText: "Over the years, I have had the honor of documenting over 350+ weddings across India and international destination venues. From royal palace celebrations in Rajasthan to intimate traditional ceremonies in Odisha, every couple brings a distinct energy that inspires my craft.",

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
      
      {/* 1. TOP HERO SECTION (LEFT-ALIGNED) */}
      <section className="about-hero" style={{ position: 'relative', width: '100%', height: 'clamp(550px, 80vh, 800px)', overflow: 'hidden' }}>
        <motion.img 
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          src="assets/images/hero_meet_me.png" 
          alt="Adarsh Tripathy - Chitra Weddings Founder"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 12%' }}
        />
        {/* Dark Gradient & Hero Content - Strictly Left-Aligned */}
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to bottom, rgba(10,10,11,0.25) 0%, rgba(10,10,11,0.45) 50%, rgba(10,10,11,0.92) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            textAlign: 'left',
            padding: 'clamp(2.5rem, 6vh, 4.5rem) var(--pad)'
          }} 
        >
          <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
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
              LEAD CINEMATOGRAPHER &amp; FOUNDER
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ 
                fontFamily: 'var(--serif)', 
                fontSize: 'clamp(2.6rem, 6.5vw, 5rem)', 
                color: 'var(--bone)', 
                lineHeight: 1.05,
                fontWeight: 400,
                marginBottom: '0.8rem',
                textAlign: 'left'
              }}
            >
              Adarsh <em>Tripathy</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
                color: 'rgba(234, 229, 219, 0.82)',
                maxWidth: '620px',
                lineHeight: 1.55,
                textAlign: 'left'
              }}
            >
              {authorData.tagline}
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2. AUTHENTIC NARRATIVE INTRO SECTION (LEFT-ALIGNED) */}
      <section style={{ background: '#eae5db', color: '#131312', padding: 'clamp(4rem, 9vh, 7rem) var(--pad)', textAlign: 'left' }}>
        <div className="about-bio-grid" style={{ maxWidth: '1150px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 5fr) minmax(0, 3fr)', gap: '2.5rem', alignItems: 'center' }}>
          
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

          {/* Center Narrative Paragraphs - Left Aligned */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ textAlign: 'left' }}
          >
            <span style={{ fontFamily: 'var(--sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(19,19,18,0.55)', display: 'block', marginBottom: '0.8rem', textAlign: 'left' }}>
              ABOUT CHITRA WEDDINGS · ADARSH TRIPATHY
            </span>
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

          {/* Right Stacked Side Photos */}
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

      {/* 3. NEW "ABOUT THE AUTHOR" / "MEET THE PHOTOGRAPHER" SECTION (LEFT-ALIGNED) */}
      <section style={{ position: 'relative', background: '#0a0a0b', padding: 'clamp(5rem, 11vh, 8rem) var(--pad)', textAlign: 'left' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
          
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
            <div className="author-card-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 4.5fr) minmax(0, 7.5fr)', gap: 'clamp(2.5rem, 5vw, 4rem)', alignItems: 'center' }}>
              
              {/* Left Column: Author Portrait Photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ position: 'relative' }}
              >
                <div 
                  style={{ 
                    borderRadius: '20px', 
                    overflow: 'hidden', 
                    aspectRatio: '4/5', 
                    border: '1px solid rgba(179, 161, 128, 0.3)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <img 
                    src="assets/images/author_portrait.png" 
                    alt={authorData.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} 
                  />
                </div>

                {/* Author Badge Pill below photo */}
                <div 
                  style={{ 
                    marginTop: '1.2rem', 
                    background: 'rgba(18, 18, 20, 0.9)', 
                    border: '1px solid var(--hair)', 
                    padding: '0.8rem 1.2rem', 
                    borderRadius: '12px',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', color: 'var(--bone)', display: 'block', marginBottom: '0.2rem', textAlign: 'left' }}>
                    {authorData.name}
                  </span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brass)', display: 'block', textAlign: 'left' }}>
                    {authorData.role}
                  </span>
                </div>
              </motion.div>

              {/* Right Column: Left-Aligned Editorial Text */}
              <div style={{ textAlign: 'left' }}>
                <span 
                  style={{ 
                    fontSize: '0.68rem', 
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
                  {authorData.badge}
                </span>

                <h2 
                  style={{ 
                    fontFamily: 'var(--serif)', 
                    fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', 
                    color: 'var(--bone)', 
                    lineHeight: 1.1,
                    marginBottom: '1.8rem',
                    textAlign: 'left'
                  }}
                >
                  {authorData.headingMain} <em>{authorData.headingItalic}</em>
                </h2>

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
                <div style={{ borderTop: '1px solid var(--hair)', paddingTop: '1.4rem', textAlign: 'left' }}>
                  <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.3rem', color: 'var(--brass)', display: 'block', marginBottom: '0.2rem', textAlign: 'left' }}>
                    {authorData.name}
                  </span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--bone-45)', display: 'block', textAlign: 'left' }}>
                    {authorData.role} — {authorData.brand}
                  </span>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. REVIEW QUOTE BANNER (LEFT-ALIGNED) */}
      <section style={{ background: '#eae5db', color: '#131312', padding: 'clamp(4rem, 8vh, 6rem) var(--pad)', textAlign: 'left' }}>
        <motion.div 
          initial={{ opacity: 0, y: 25 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          style={{ maxWidth: '950px', margin: '0 auto', textAlign: 'left' }}
        >
          <blockquote style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', lineHeight: 1.45, textTransform: 'uppercase', marginBottom: '2rem', textAlign: 'left' }}>
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

      {/* 5. CALL TO ACTION & OFFER SECTION (MATCHING WEBSITE BRAND) */}
      <section style={{ background: '#0d0d0f', borderTop: '1px solid var(--hair)', borderBottom: '1px solid var(--hair)', padding: 'clamp(3.5rem, 8vh, 5.5rem) var(--pad)', textAlign: 'left' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--brass)', display: 'block', marginBottom: '0.6rem' }}>
              SPECIAL OFFER
            </span>
            <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--bone)', lineHeight: 1.15, margin: 0, textAlign: 'left' }}>
              Free Engagement Coverage with <em>Traditional &amp; Destination Packages</em>
            </h3>
          </div>

          <button 
            onClick={() => onNavigate && onNavigate('contact')}
            className="btn"
            style={{ flexShrink: 0 }}
          >
            <span>ENQUIRE NOW</span>
          </button>
        </div>
      </section>

      {/* 6. INSTAGRAM FOOTER STRIP (LEFT-ALIGNED) */}
      <section style={{ background: '#0a0a0b', padding: '4rem var(--pad) 2rem', borderTop: '1px solid var(--hair)', textAlign: 'left' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
            <img src="assets/images/insta_1.png" alt="Chitra Weddings 1" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            <img src="assets/images/insta_2.png" alt="Chitra Weddings 2" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            <img src="assets/images/insta_3.png" alt="Chitra Weddings 3" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            <img src="assets/images/insta_4.png" alt="Chitra Weddings 4" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            <img src="assets/images/insta_5.png" alt="Chitra Weddings 5" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
          </div>

          <span className="label" style={{ display: 'block', marginBottom: '0.8rem', textAlign: 'left' }}>WEDDING PHOTOGRAPHY &amp; VIDEOGRAPHY</span>
          <div className="mark" style={{ marginBottom: '1.2rem' }}>
            <span className="mark-main">CHITRA</span>
            <small className="mark-sub">WEDDINGS</small>
          </div>
          <p className="muted" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'left' }}>
            SPECIALIZING IN TRADITIONAL, DESTINATION &amp; PRE-WEDDING COVERAGE
          </p>

        </div>
      </section>
    </div>
  );
}
