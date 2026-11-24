import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Films from './pages/Films';
import Portfolio from './pages/Portfolio';
import Mentorship from './pages/Mentorship';
import About from './pages/About';
import Contact from './pages/Contact';

const AdminPortfolio = lazy(() => import('./pages/AdminPortfolio'));

// Complicated entry URL redirects to the isolated gate URL (never linked on the public website)
export const SECRET_ACCESS_ENTRY_URL = '/cw-9k4m7x2p-8v1n6q3r-5t9z2b4w-7f3c8a1e';
export const SECRET_ACCESS_GATE_URL = '/cw-p5n8r2c7-3m9v6x1q-8b4d7k2w-9f6j3y5t';

// Helper to parse page from URL
const getPageFromUrl = (pathname = window.location.pathname, hash = window.location.hash) => {
  const clean = (pathname || '').replace(/\/+$/, '') || '/';
  if (clean === '/films') return 'films';
  if (clean === '/portfolio') return 'portfolio';
  if (clean === '/mentorship') return 'mentorship';
  if (clean === '/about') return 'about';
  if (clean === '/contact') return 'contact';
  if (clean === '/packages') return 'packages';
  if (clean === SECRET_ACCESS_ENTRY_URL || clean === SECRET_ACCESS_GATE_URL) {
    return 'admin';
  }
  if (hash === '#packages' || hash === '#services-packages') return 'packages';
  return 'home';
};

const getUrlForPage = (page) => {
  switch (page) {
    case 'films': return '/films';
    case 'portfolio': return '/portfolio';
    case 'mentorship': return '/mentorship';
    case 'about': return '/about';
    case 'contact': return '/contact';
    case 'packages': return '/packages';
    case 'admin': return SECRET_ACCESS_GATE_URL;
    case 'home':
    default:
      return '/';
  }
};

function App() {
  const [initialPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const cleanPath = (window.location.pathname || '').replace(/\/+$/, '') || '/';
      if (cleanPath === SECRET_ACCESS_ENTRY_URL) {
        // Clicking the secret entry URL always resets session and redirects to the login gate page
        localStorage.removeItem('chitra_admin_auth');
        sessionStorage.removeItem('cw_portal_session_v2');
      }
    }
    return getPageFromUrl();
  });
  const [currentPage, setCurrentPage] = useState(initialPage === 'packages' ? 'home' : initialPage);
  const [pageClass, setPageClass] = useState('');
  const [scrollPercent, setScrollPercent] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Page navigation transition classes with cinematic letterbox shutter curtain
  const handleNavigate = (page, options = {}) => {
    const isPush = options.push !== false;
    const isInstant = options.instant === true;

    // Handle 'packages' collection navigation
    if (page === 'packages') {
      if (currentPage !== 'home') {
        if (isPush) {
          window.history.pushState({ page: 'packages' }, '', '/packages');
        }
        document.body.classList.add('lb-closed');
        setTimeout(() => {
          setCurrentPage('home');
          document.body.style.overflow = '';
          window.scrollTo({ top: 0, behavior: 'instant' });
          setTimeout(() => {
            const el = document.getElementById('services-packages');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 120);
        }, 420);
        setTimeout(() => {
          document.body.classList.remove('lb-closed');
        }, 780);
      } else {
        if (isPush) {
          window.history.pushState({ page: 'packages' }, '', '/packages');
        }
        const el = document.getElementById('services-packages');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (page === currentPage) return;

    if (isPush) {
      window.history.pushState({ page }, '', getUrlForPage(page));
    }

    if (isInstant) {
      setCurrentPage(page);
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

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

  // On Page Refresh / Initial Mount: Initialize History and Preloader
  useEffect(() => {
    // Disable browser default scroll restoration so we control scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const currentPathPage = getPageFromUrl();
    const effectivePage = currentPathPage === 'packages' ? 'home' : currentPathPage;
    const targetUrl = getUrlForPage(currentPathPage);

    // 1. Replace base state with root flag
    window.history.replaceState({ page: currentPathPage, isRoot: true }, '', targetUrl);

    // 2. Push active state entry so sliding back from initial page does NOT close the website/tab
    window.history.pushState({ page: currentPathPage, isRoot: false }, '', targetUrl);

    if (effectivePage === 'admin') {
      document.body.classList.add('ready');
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    if (currentPathPage === 'packages') {
      setTimeout(() => {
        const el = document.getElementById('services-packages');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    const preloader = document.getElementById('preloader-overlay');
    const startTime = Date.now();
    const duration = 750;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setLoadingProgress(pct);

      if (pct >= 100) {
        clearInterval(progressInterval);
      }
    }, 20);

    const timer = setTimeout(() => {
      document.body.classList.add('ready');
      document.body.style.overflow = '';
      if (currentPathPage !== 'packages') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      if (preloader) {
        preloader.classList.add('done');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      }
    }, 920);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  // Listen to Browser Back / Forward gestures (PopState event)
  useEffect(() => {
    const handlePopState = (event) => {
      const statePage = event.state?.page;
      const pathPage = getPageFromUrl(window.location.pathname, window.location.hash);
      const targetPage = statePage || pathPage || 'home';

      // Root protection: if user slid all the way back to initial entry, protect against browser tab closure
      if (event.state?.isRoot) {
        window.history.pushState({ page: targetPage, isRoot: false }, '', getUrlForPage(targetPage));
      }

      // If navigation is to packages collection
      if (targetPage === 'packages') {
        setCurrentPage('home');
        document.body.style.overflow = '';
        setTimeout(() => {
          const el = document.getElementById('services-packages');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else if (targetPage !== currentPage) {
        // Fast instant switch on browser slide back/forward gesture so it feels native & immediate
        setCurrentPage(targetPage);
        document.body.style.overflow = '';
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPage]);

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

  // Scroll animations: scroll-rail updates & smooth adaptive navbar text colors
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      
      // 1. Scroll rail updates
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = totalHeight > 0 ? Math.min(100, Math.max(0, (scrolled / totalHeight) * 100)) : 0;
      setScrollPercent(pct);

      // 2. Smooth adaptive navbar & section theme color transition
      const navbar = document.querySelector('.nav');
      const boneSections = document.querySelectorAll('.on-bone');
      if (navbar) {
        const navRect = navbar.getBoundingClientRect();
        let overlapsBone = false;
        
        boneSections.forEach((sec) => {
          const secRect = sec.getBoundingClientRect();
          // Smooth threshold overlap detection
          if (navRect.bottom > secRect.top + 30 && navRect.top < secRect.bottom - 30) {
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

  // Page Component Router
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'films':
        return <Films onNavigate={handleNavigate} />;
      case 'mentorship':
        return <Mentorship onNavigate={handleNavigate} />;
      case 'portfolio':
        return <Portfolio onNavigate={handleNavigate} />;
      case 'about':
        return <About onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact onNavigate={handleNavigate} />;
      case 'admin':
        return (
          <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0b' }} />}>
            <AdminPortfolio onNavigate={handleNavigate} />
          </Suspense>
        );
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {/* Cinematic Letterbox Shutter Curtain Bars (Rayne Films Page Transition) */}
      <div className="lb-bar top" aria-hidden="true"></div>
      <div className="lb-bar bot" aria-hidden="true"></div>
      <div className="lb-title" aria-hidden="true">
        <span className="lb-main">CHITRA</span>
        <small className="lb-sub">WEDDINGS</small>
      </div>

      {/* Root-Level Luxury Loading Screen Overlay (hidden on secret portal route) */}
      {currentPage !== 'admin' && (
        <div className="loader" aria-hidden="true" id="preloader-overlay">
          <div className="loader-brand-unit">
            {/* Real-time Numeric Count-up Display */}
            <div className="loader-num-badge">
              <span className="loader-num-val">{String(loadingProgress).padStart(2, '0')}</span>
              <span className="loader-num-pct">%</span>
            </div>

            <div className="loader-brand-divider" aria-hidden="true"></div>

            {/* Authentic Brand Identity Unit */}
            <div className="loader-brand-text">
              <div className="mark loader-mark">
                <span className="mark-main">CHITRA</span>
                <small className="mark-sub">WEDDINGS</small>
              </div>
              <span className="loader-brand-subtitle">Wedding Photography &amp; Videography Services</span>
            </div>
          </div>

          {/* Minimal Smooth Progress Fill */}
          <div className="loader-progress-bar">
            <div className="loader-progress-fill" style={{ transform: `scaleX(${loadingProgress / 100})` }}></div>
          </div>
        </div>
      )}

      {currentPage !== 'admin' && <Navbar currentPage={currentPage} onNavigate={handleNavigate} />}
      
      <main className="page-transition-container">
        {renderPage()}
      </main>

      {/* Desktop Scroll Rail indicator */}
      {currentPage !== 'admin' && (
        <div className="scroll-rail" aria-hidden="true">
          <div className="mk" style={{ top: `${scrollPercent}%` }}></div>
        </div>
      )}

      {currentPage !== 'admin' && <Footer onNavigate={handleNavigate} />}
    </>
  );
}

export default App;
