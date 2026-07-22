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
          CHITRA <small>WEDDING<br/>STORIES</small>
        </button>
        
        <div className="links">
          <button 
            onClick={() => handleNavClick('films')} 
            className={currentPage === 'films' ? 'active' : ''}
          >
            Films
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

      {/* Fullscreen Mobile Menu Overlay */}
      <div className="menu" aria-hidden="true">
        <span className="label" style={{ marginBottom: "2rem" }}>Menu</span>
        <button className="big" onClick={() => handleNavClick('home')}>Home</button>
        <button className="big" onClick={() => handleNavClick('films')}>Films</button>
        <button className="big" onClick={() => handleNavClick('portfolio')}>Portfolio</button>
        <button className="big" onClick={() => handleNavClick('about')}>About</button>
        <button className="big" onClick={() => handleNavClick('contact')}>Contact</button>
        
        <div className="menu-foot">
          <span className="label" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>Chitra Weddings</span>
          <a className="label" href="mailto:chitraweddings@gmail.com" style={{ color: "var(--bone)" }}>
            chitraweddings@gmail.com
          </a>
        </div>
      </div>
    </>
  );
}
