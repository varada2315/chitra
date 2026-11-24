import React from 'react';

export default function Mentorship() {
  return (
    <div className="page-content-wrapper">
      <section className="placeholder-hero" style={{ backgroundColor: "var(--bg-dark)", color: "var(--text-light)", padding: "12rem 0 6rem 0", textAlign: "center" }}>
        <div className="container fade-in-up">
          <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>MENTORSHIP</h1>
          <p className="sans-uppercase" style={{ color: "var(--color-bronze)" }}>FOR PHOTOGRAPHERS LOOKING TO GROW</p>
        </div>
      </section>

      <div className="wave-container wave-to-light">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60 C 360 120, 720 0, 1080 60 C 1260 90, 1380 75, 1440 60 L 1440 100 L 0 100 Z" fill="#EAE7E1" />
        </svg>
      </div>

      <section className="mentorship-sec" style={{ backgroundColor: "var(--bg-light)", padding: "clamp(3.5rem, 8vh, 8rem) 0" }}>
        <div className="container">
          <div className="mentorship-grid">
            <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h2 className="serif-italic" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>GROW YOUR CREATIVE SPIRIT</h2>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.65 }}>We love mentoring other photographers. Whether you're just starting or looking to build a sustainable, full-time business, we offer custom 1-on-1 programs designed to give you clarity and direction.</p>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.65 }}>We cover branding, workflow, editing style, posing guides, search engine optimization, and client experience systems that actually work.</p>
              <div>
                <a href="#contact" className="btn-pill btn-bronze">APPLY TO MENTORSHIP</a>
              </div>
            </div>
            
            <div className="fade-in-up">
              <div className="img-arch" style={{ height: "clamp(340px, 45vw, 520px)" }}>
                <img src="assets/images/meet_me_arch.webp" alt="Mentorship session" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
