import React, { useState } from 'react';

export default function Navbar({ currentPage, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  const handleNavClick = (page) => {
    setIsOpen(false);
    document.body.classList.remove('menu-open');
    if (page === 'packages') {
      if (currentPage !== 'home') {
        onNavigate('home');
        setTimeout(() => {
          const el = document.getElementById('services-packages');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.getElementById('services-packages');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <>
      {/* iOS progressive blur overlay */}
      <div className="nav-edge" aria-hidden="true">
        <span className="b1"></span>
        <span className="b2"></span>
        <span className="b3"></span>
        <span className="b4"></span>
        <span className="b5"></span>
        <span className="b6"></span>
      </div>

      {/* Main Navbar */}
      <nav className="nav">
        <button 
          aria-label="Chitra Weddings, redirect to home page" 
          className="mark" 
          onClick={() => handleNavClick('home')}
          style={{ cursor: 'pointer' }}
        >
          <span className="mark-main">CHITRA</span>
          <small className="mark-sub">WEDDINGS</small>
        </button>
        
        <div className="links">
          <button 
            onClick={() => handleNavClick('packages')} 
            className={currentPage === 'packages' ? 'active' : ''}
          >
            Services / Packages
          </button>
          <button 
            onClick={() => handleNavClick('films')} 
            className={currentPage === 'films' ? 'active' : ''}
          >
            Films
          </button>
          <button 
            onClick={() => handleNavClick('vlogs')} 
            className={currentPage === 'vlogs' ? 'active' : ''}
          >
            Vlogs
          </button>
          <button 
            onClick={() => handleNavClick('portfolio')} 
            className={currentPage === 'portfolio' ? 'active' : ''}
          >
            Portfolio
          </button>
          <button 
            onClick={() => handleNavClick('about')} 
            className={currentPage === 'about' ? 'active' : ''}
          >
            About
          </button>
          <button 
            onClick={() => handleNavClick('contact')} 
            className={currentPage === 'contact' ? 'active' : ''}
          >
            Contact
          </button>
        </div>

        <button className="cta-mini" onClick={() => handleNavClick('contact')}>
          Enquire Now
        </button>

        <button 
          className="burger" 
          onClick={toggleMenu} 
          aria-label="Menu" 
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Fullscreen Mobile & Desktop Menu Overlay */}
      <div className="menu" aria-hidden={!isOpen}>
        {/* Top Header Bar inside Menu Drawer */}
        <div className="menu-top-bar">
          <button 
            className="mark" 
            onClick={() => handleNavClick('home')} 
            style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            <span className="mark-main">CHITRA</span>
            <small className="mark-sub">WEDDINGS</small>
          </button>

          <button 
            className="menu-close" 
            onClick={toggleMenu} 
            aria-label="Close Menu"
          >
            <span>CLOSE</span> <span className="close-x">✕</span>
          </button>
        </div>

        {/* Center Content Container */}
        <div className="menu-content">
          {/* Header Quote / Tagline */}
          <div className="menu-head-quote">
            <span className="label">Chitra Weddings</span>
            <p className="menu-tagline">
              Every Memory that Feels Like <em>True Moments</em>
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="menu-nav">
            <button className={`big ${currentPage === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>Home</button>
            <button className={`big ${currentPage === 'packages' ? 'active' : ''}`} onClick={() => handleNavClick('packages')}>Services / Packages</button>
            <button className={`big ${currentPage === 'films' ? 'active' : ''}`} onClick={() => handleNavClick('films')}>Films</button>
            <button className={`big ${currentPage === 'vlogs' ? 'active' : ''}`} onClick={() => handleNavClick('vlogs')}>Vlogs</button>
            <button className={`big ${currentPage === 'portfolio' ? 'active' : ''}`} onClick={() => handleNavClick('portfolio')}>Portfolio</button>
            <button className={`big ${currentPage === 'about' ? 'active' : ''}`} onClick={() => handleNavClick('about')}>About</button>
            <button className={`big ${currentPage === 'contact' ? 'active' : ''}`} onClick={() => handleNavClick('contact')}>Contact</button>
          </nav>
        </div>
        
        {/* Bottom Footer Bar inside Menu Drawer */}
        <div className="menu-foot">
          <div className="menu-foot-left">
            <button 
              className="mark" 
              onClick={() => handleNavClick('home')} 
              style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
            >
              <span className="mark-main">CHITRA</span>
              <small className="mark-sub">WEDDINGS</small>
            </button>
          </div>

          <div className="menu-foot-right">
            <a className="menu-email" href="mailto:chitraweddings@gmail.com">
              chitraweddings@gmail.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
