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

      <section style={{ backgroundColor: "var(--bg-light)", padding: "8rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
            <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <h2 className="serif-italic" style={{ fontSize: "3rem" }}>GROW YOUR CREATIVE SPIRIT</h2>
              <p style={{ opacity: 0.8 }}>We love mentoring other photographers. Whether you're just starting or looking to build a sustainable, full-time business, we offer custom 1-on-1 programs designed to give you clarity and direction.</p>
              <p style={{ opacity: 0.8 }}>We cover branding, workflow, editing style, posing guides, search engine optimization, and client experience systems that actually work.</p>
              <div>
                <a href="#" className="btn-pill btn-bronze">APPLY TO MENTORSHIP</a>
              </div>
            </div>
            
            <div className="fade-in-up">
              <div className="img-arch" style={{ height: "520px" }}>
                <img src="assets/images/meet_me_arch.png" alt="Mentorship session" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
