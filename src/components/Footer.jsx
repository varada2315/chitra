import React from 'react';

export default function Footer({ onNavigate }) {
  const handleHomeClick = () => {
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <footer>
      <div className="foot-grid">
        <div>
          <span className="label" style={{ display: 'block', marginBottom: '1rem' }}>Navigate</span>
          <button onClick={handleHomeClick}>Home</button>
          <button onClick={() => onNavigate('films')}>Films</button>
          <button onClick={() => onNavigate('portfolio')}>Portfolio</button>
          <button onClick={() => onNavigate('about')}>About</button>
          <button onClick={() => onNavigate('contact')}>Contact</button>
        </div>
        <div>
          <span className="label" style={{ display: 'block', marginBottom: '1rem' }}>Services</span>
          <a href="#contact" onClick={() => onNavigate('contact')}>Traditional Wedding Coverage</a>
          <a href="#contact" onClick={() => onNavigate('contact')}>Destination Wedding Coverage</a>
          <a href="#contact" onClick={() => onNavigate('contact')}>Pre Wedding Coverage</a>
          <a href="#contact" onClick={() => onNavigate('contact')}>Engagement / Celebrations</a>
        </div>
        <div>
          <span className="label" style={{ display: 'block', marginBottom: '1rem' }}>Follow</span>
          <a href="https://www.instagram.com/chitra_weddings" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:chitraweddings@gmail.com">Email Us</a>
          <a href="tel:9090606831">Call Us</a>
        </div>
        <div>
          <span className="label" style={{ display: 'block', marginBottom: '1rem' }}>Contact Us</span>
          <a href="mailto:chitraweddings@gmail.com">chitraweddings@gmail.com</a>
          <p className="muted" style={{ fontSize: '0.8rem', maxWidth: '28ch', marginTop: '0.4rem' }}>
            Phone: 9090606831 / 8093844489
          </p>
        </div>
      </div>
      <div 
        className="giant" 
        onClick={handleHomeClick} 
        style={{ cursor: 'pointer' }} 
        aria-label="Redirect to Home Page"
      >
        CHITRA
      </div>
      <div className="fineprint">
        <span onClick={handleHomeClick} style={{ cursor: 'pointer' }}>© 2026 CHITRA WEDDINGS</span>
        <span>Your Love Story deserves to be told Beautifully.</span>
      </div>
    </footer>
  );
}
