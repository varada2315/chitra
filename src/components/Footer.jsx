import React from 'react';

export default function Footer({ onNavigate }) {
  const handleHomeClick = () => {
    if (onNavigate) onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavClick = (pageId, sectionId = null) => {
    if (onNavigate) onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <footer className="chitra-footer">
      {/* 1. TOP BRAND STATEMENT */}
      <div className="home-footer-redesign">
        <span className="foot-badge">CHITRA WEDDINGS</span>
        
        <h2 className="foot-main-heading">
          Creating Memories <em>One Story at a Time</em>
        </h2>

        <div className="foot-location-block" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', marginTop: '1.8rem' }}>
          <div className="foot-location-line">
            <span>PURI</span>
            <span className="bullet">•</span>
            <span>BHUBANESWAR</span>
            <span className="bullet">•</span>
            <span>ODISHA</span>
          </div>
          <div className="foot-location-line">
            <span>PAN INDIA</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN 4-COLUMN FOOTER NAVIGATION GRID */}
      <div className="foot-grid">
        <div className="foot-col">
          <span className="foot-col-label">NAVIGATE</span>
          <button onClick={handleHomeClick} className="foot-link">Home</button>
          <button onClick={() => handleNavClick('home', 'services-packages')} className="foot-link">Collections</button>
          <button onClick={() => handleNavClick('portfolio')} className="foot-link">Portfolio</button>
          <button onClick={() => handleNavClick('about')} className="foot-link">About</button>
          <button onClick={() => handleNavClick('contact')} className="foot-link">Contact</button>
        </div>

        <div className="foot-col">
          <span className="foot-col-label">SERVICES</span>
          <button onClick={() => handleNavClick('contact')} className="foot-link">Traditional Coverage</button>
          <button onClick={() => handleNavClick('contact')} className="foot-link">Destination Weddings</button>
          <button onClick={() => handleNavClick('contact')} className="foot-link">Pre-Wedding Coverage</button>
          <button onClick={() => handleNavClick('contact')} className="foot-link">Engagement Coverage</button>
        </div>

        <div className="foot-col">
          <span className="foot-col-label">CONNECT</span>
          <a href="https://wa.me/919090606813" target="_blank" rel="noopener noreferrer" className="foot-link">
            WhatsApp: +91 9090606813
          </a>
          <a href="mailto:chitraweddings@gmail.com" className="foot-link">
            Email: chitraweddings@gmail.com
          </a>
        </div>

        <div className="foot-col">
          <span className="foot-col-label">ADDRESS</span>
          <a 
            href="https://share.google/dLUbAOdBTmfrSzMVK" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="foot-link"
            style={{ lineHeight: 1.55 }}
          >
            Abakash Lane, Puri-2, 752002, Odisha, India <span style={{ fontSize: '0.75rem', color: 'var(--brass)' }}>↗</span>
          </a>
          <p className="foot-addr-text" style={{ marginTop: '0.5rem' }}>
            WhatsApp / Call: <a href="tel:+919090606813" style={{ color: 'inherit', textDecoration: 'none' }}>+91 9090606813</a>
          </p>
        </div>
      </div>

      {/* 2.5 SOCIAL MEDIA CONNECTOR BAR */}
      <div className="foot-social-bar">
        <span className="foot-social-heading">FOLLOW OUR WEDDING STORIES</span>
        <div className="foot-social-pills">
          <a href="https://www.instagram.com/chitra_weddings" target="_blank" rel="noopener noreferrer" className="social-pill" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            <span>Instagram</span>
          </a>
          <a href="https://wa.me/919090606813" target="_blank" rel="noopener noreferrer" className="social-pill" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span>WhatsApp</span>
          </a>
          <a href="https://youtube.com/@chitraweddingspuri?si=_eqSHmgcredQjziM" target="_blank" rel="noopener noreferrer" className="social-pill" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
            </svg>
            <span>YouTube</span>
          </a>
          <a href="https://www.facebook.com/share/1LyjgnGVXx/" target="_blank" rel="noopener noreferrer" className="social-pill" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
            <span>Facebook</span>
          </a>
          <a href="https://share.google/dLUbAOdBTmfrSzMVK" target="_blank" rel="noopener noreferrer" className="social-pill" aria-label="Google Maps">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Location</span>
          </a>
        </div>
      </div>

      {/* 3. GIANT BRAND WATERMARK */}
      <div 
        className="giant" 
        onClick={handleHomeClick} 
        aria-label="Redirect to Home Page"
      >
        CHITRA
      </div>

      {/* 4. FINEPRINT FOOTER BAR */}
      <div className="fineprint">
        <span onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
          © 2026 CHITRA WEDDINGS · ALL RIGHTS RESERVED
        </span>
        <span className="fineprint-credit">
          Built by{' '}
          <a
            href="https://growitate.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="fineprint-credit-link"
          >
            GROWITATE
          </a>
        </span>
        <span className="fineprint-tagline">
          Your Love Story Deserves to be Told Beautifully.
        </span>
      </div>
    </footer>
  );
}
