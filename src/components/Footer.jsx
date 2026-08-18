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
      {/* 1. TOP BRAND STATEMENT & ENQUIRY CTA */}
      <div className="home-footer-redesign">
        <span className="foot-badge">CHITRA WEDDINGS — FINE ART FILM &amp; PHOTOGRAPHY HOUSE</span>
        
        <h2 className="foot-main-heading">
          Creating Memories <em>One Story at a Time</em>
        </h2>

        <div className="foot-sub-line">
          <span className="foot-item">
            <span className="bullet">•</span> Limited Weddings Annually
          </span>
          <span className="divider" aria-hidden="true">|</span>
          <button 
            className="foot-enquire-btn" 
            onClick={() => handleNavClick('contact')}
            aria-label="Enquire Now"
          >
            <span>ENQUIRE NOW</span>
            <span className="enquire-arrow">→</span>
          </button>
        </div>

        <div className="foot-location-line">
          <span>PURI</span>
          <span className="bullet">•</span>
          <span>BHUBANESWAR</span>
          <span className="bullet">•</span>
          <span>ODISHA</span>
          <span className="bullet">•</span>
          <span>PAN INDIA &amp; WORLDWIDE</span>
        </div>
      </div>

      {/* 2. MAIN 4-COLUMN FOOTER NAVIGATION GRID */}
      <div className="foot-grid">
        <div className="foot-col">
          <span className="foot-col-label">NAVIGATE</span>
          <button onClick={handleHomeClick} className="foot-link">Home</button>
          <button onClick={() => handleNavClick('home', 'services-packages')} className="foot-link">Packages</button>
          <button onClick={() => handleNavClick('films')} className="foot-link">Films</button>
          <button onClick={() => handleNavClick('vlogs')} className="foot-link">Vlogs</button>
          <button onClick={() => handleNavClick('portfolio')} className="foot-link">Portfolio</button>
          <button onClick={() => handleNavClick('about')} className="foot-link">About</button>
          <button onClick={() => handleNavClick('contact')} className="foot-link">Contact</button>
        </div>

        <div className="foot-col">
          <span className="foot-col-label">SERVICES</span>
          <button onClick={() => handleNavClick('contact')} className="foot-link">Traditional Coverage</button>
          <button onClick={() => handleNavClick('contact')} className="foot-link">Destination Weddings</button>
          <button onClick={() => handleNavClick('contact')} className="foot-link">Pre-Wedding Films</button>
          <button onClick={() => handleNavClick('contact')} className="foot-link">Engagement Coverage</button>
          <button onClick={() => handleNavClick('contact')} className="foot-link">Anniversary &amp; Receptions</button>
        </div>

        <div className="foot-col">
          <span className="foot-col-label">CONNECT</span>
          <a href="https://wa.me/919090606831" target="_blank" rel="noopener noreferrer" className="foot-link">
            WhatsApp: +91 9090606831
          </a>
          <a href="https://www.instagram.com/chitra_weddings" target="_blank" rel="noopener noreferrer" className="foot-link">
            Instagram: @chitra_weddings
          </a>
          <a href="mailto:chitraweddings@gmail.com" className="foot-link">
            Email: chitraweddings@gmail.com
          </a>
        </div>

        <div className="foot-col">
          <span className="foot-col-label">HEADQUARTERS</span>
          <p className="foot-addr-text">
            Puri &amp; Bhubaneswar, Odisha, India
          </p>
          <p className="foot-addr-text" style={{ marginTop: '0.5rem' }}>
            Direct Line: +91 9090606831 / 8093844489
          </p>
          <span className="foot-avail-tag">AVAILABLE WORLDWIDE</span>
        </div>
      </div>

      {/* 3. GIANT BRAND WATERMARK */}
      <div 
        className="giant" 
        onClick={handleHomeClick} 
        aria-label="Redirect to Home Page"
      >
        CHITRA WEDDINGS
      </div>

      {/* 4. FINEPRINT FOOTER BAR */}
      <div className="fineprint">
        <span onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
          © 2026 CHITRA WEDDINGS · ALL RIGHTS RESERVED
        </span>
        <span className="fineprint-tagline">
          Your Love Story Deserves to be Told Beautifully.
        </span>
      </div>
    </footer>
  );
}
