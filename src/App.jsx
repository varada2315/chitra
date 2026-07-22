import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Films from './pages/Films';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageClass, setPageClass] = useState('');
  const [scrollPercent, setScrollPercent] = useState(0);

  // Page navigation transition classes with cinematic letterbox shutter curtain
  const handleNavigate = (page) => {
    if (page === currentPage) return;
    
    // 1. Close the letterbox shutter curtain (top & bottom black bars slide in)
    document.body.classList.add('lb-closed');

    // 2. Swap page component when screen is fully covered in black
    setTimeout(() => {
      setCurrentPage(page);
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 420);

    // 3. Open letterbox shutter curtain to reveal the new page
    setTimeout(() => {
      document.body.classList.remove('lb-closed');
    }, 780);
  };

  // Preloader arrival timer on initial application load
  useEffect(() => {
    const preloader = document.getElementById('preloader-overlay');
    const timer = setTimeout(() => {
      document.body.classList.add('ready');
      document.body.style.overflow = '';
      if (preloader) {
        preloader.classList.add('done');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 1200);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  // Split headings into line-mask spans dynamically on page change
  useEffect(() => {
    document.querySelectorAll('[data-split]').forEach((el) => {
      if (el.classList.contains('split')) return;
      const lines = el.innerHTML.split('<br>');
      el.innerHTML = lines
        .map((l) => `<span class="line"><span>${l}</span></span>`)
        .join('');
      el.classList.add('split');
    });

    // Re-trigger scroll reveal intersection observer for newly rendered elements
    const fadeElements = document.querySelectorAll('.rv, .split, .veil');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    fadeElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentPage]);

  // Scroll animations: scroll-rail updates & adaptive navbar text luma tones
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      
      // 1. Scroll rail updates
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = totalHeight > 0 ? Math.min(100, Math.max(0, scrolled / totalHeight * 100)) : 0;
      setScrollPercent(pct);

      // 2. Adaptive navbar text colors (overlaps bright .on-bone sections)
      const navbar = document.querySelector('.nav');
      const boneSections = document.querySelectorAll('.on-bone');
      if (navbar) {
        const navRect = navbar.getBoundingClientRect();
        let overlapsBone = false;
        
        boneSections.forEach((sec) => {
          const secRect = sec.getBoundingClientRect();
          if (navRect.bottom > secRect.top && navRect.top < secRect.bottom) {
            overlapsBone = true;
          }
        });

        if (overlapsBone) {
          navbar.classList.add('on-bone-scroll');
        } else {
          navbar.classList.remove('on-bone-scroll');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentPage]);

  // Page router mapping
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'films':
        return <Films />;
      case 'portfolio':
        return <Portfolio onNavigate={handleNavigate} />;
      case 'about':
        return <About onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {/* Cinematic Letterbox Shutter Curtain Bars (Rayne Films Page Transition) */}
      <div className="lb-bar top" aria-hidden="true"></div>
      <div className="lb-bar bot" aria-hidden="true"></div>
      <div className="lb-title" aria-hidden="true">CHITRA WEDDINGS</div>

      {/* Root-Level 3-2-1 Preloader Overlay */}
      <div className="loader" aria-hidden="true" id="preloader-overlay">
        <div className="leader">
          <div className="sweep"></div>
          <span className="num n3">3</span>
          <span className="num n2">2</span>
          <span className="num n1">1</span>
        </div>
        <span className="label sub">Chitra Weddings <span className="tick">·</span> Wedding Photography &amp; Videography</span>
      </div>

      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main className="page-transition-container">
        {renderPage()}
      </main>

      {/* Desktop Scroll Rail indicator */}
      <div className="scroll-rail" aria-hidden="true">
        <div className="mk" style={{ top: `${scrollPercent}%` }}></div>
      </div>

      <Footer onNavigate={handleNavigate} />
    </>
  );
}

export default App;
