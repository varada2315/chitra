import React, { useState } from 'react';

const filmsList = [
  {
    vimeoId: "332887606",
    img: "assets/images/exp_weddings.png",
    num: "i.",
    names: "Traditional Wedding Film",
    venue: "Chitra Weddings",
    location: "Full Legacy"
  },
  {
    vimeoId: "1027095536",
    img: "assets/images/bio_couple.png",
    num: "ii.",
    names: "Destination Wedding Film",
    venue: "Chitra Weddings",
    location: "Global Locations"
  },
  {
    vimeoId: "914290878",
    img: "assets/images/fav_couple.png",
    num: "iii.",
    names: "Pre-Wedding Cinematic Story",
    venue: "Chitra Weddings",
    location: "Outdoor Session"
  },
  {
    vimeoId: "382794147",
    img: "assets/images/exp_couples.png",
    num: "iv.",
    names: "Engagement Celebration Film",
    venue: "Chitra Weddings",
    location: "Special Edition"
  },
  {
    vimeoId: "891737638",
    img: "assets/images/hero_home.png",
    num: "v.",
    names: "Traditional Grand Ceremony",
    venue: "Chitra Weddings",
    location: "Heritage Highlights"
  },
  {
    vimeoId: "766281509",
    img: "assets/images/hero_meet_me.png",
    num: "vi.",
    names: "Destination Love Story",
    venue: "Chitra Weddings",
    location: "Seaside Vows"
  },
  {
    vimeoId: "746685962",
    img: "assets/images/rainbow_couple.png",
    num: "vii.",
    names: "Island Pre-Wedding Film",
    venue: "Chitra Weddings",
    location: "Coastal Sessions"
  },
  {
    vimeoId: "749278985",
    img: "assets/images/meet_me_arch.png",
    num: "viii.",
    names: "Anniversary & Reception Story",
    venue: "Chitra Weddings",
    location: "Luxury Coverage"
  }
];

export default function Films() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxBoot, setLightboxBoot] = useState(false);
  const [lightboxLit, setLightboxLit] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Direct GPU 3D Tilt calculation
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg)';
    setHoveredIdx(null);
  };

  const openFilm = (vimeoId) => {
    setActiveVideo(vimeoId);
    setLightboxBoot(true);
    setLightboxLit(false);
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      setLightboxLit(true);
      setLightboxBoot(false);
    }, 540);
  };

  const closeFilm = () => {
    setActiveVideo(null);
    setLightboxLit(false);
    setLightboxBoot(false);
    document.body.style.overflow = '';
  };

  return (
    <div className="page-content-wrapper">
      <main className="spotlight">
        
        {/* Page Hero Header */}
        <header className="page-hero">
          <span className="label rv">Chitra Weddings</span>
          <h1 className="display" data-split>
            Real weddings,<br />told like <em>cinema.</em>
          </h1>
          <p className="muted body-lg rv d1" style={{ maxWidth: '46ch', marginTop: '2rem' }}>
            Your Love Story deserves to be told Beautifully. Press play, sound on.
          </p>
        </header>

        {/* Films Grid */}
        <section className="sec" style={{ paddingTop: '2rem' }}>
          <div className="films-duo">
            {filmsList.map((film, index) => {
              const isDimmed = hoveredIdx !== null && hoveredIdx !== index;
              return (
                <div 
                  key={index} 
                  style={{ 
                    perspective: '1000px',
                    opacity: isDimmed ? 0.38 : 1,
                    transition: 'opacity 0.4s var(--ease)'
                  }}
                >
                  <div className="veil">
                    <div 
                      className="feature-frame"
                      onMouseMove={handleMouseMove}
                      onMouseEnter={() => setHoveredIdx(index)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => openFilm(film.vimeoId)}
                      role="button"
                      tabIndex="0"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openFilm(film.vimeoId);
                        }
                      }}
                      aria-label={`Play ${film.names}`}
                    >
                      <img src={film.img} alt={film.names} />
                      
                      <span className="brk tl" aria-hidden="true"></span>
                      <span className="brk tr" aria-hidden="true"></span>
                      <span className="brk bl" aria-hidden="true"></span>
                      <span className="brk br" aria-hidden="true"></span>
                      
                      <div className="shade"></div>
                      
                      <div className="playbtn">
                        <svg width="18" height="20" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1.5v19l17-9.5L1 1.5z" stroke="#EAE5DB" strokeWidth="1.2" fill="none" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="film-meta rv">
                    <button className="names" onClick={() => openFilm(film.vimeoId)}>
                      {film.num} {film.names}
                    </button>
                    <span className="label">
                      {film.venue} {film.location && <><span className="tick">·</span> {film.location}</>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quiet CTA section */}
        <section className="cta-quiet">
          <span className="label rv">Your Love Story Deserves Beauty</span>
          <h2 className="display rv d1">Let's <em>Start</em> Your Journey.</h2>
          <div className="rule rv d1" aria-hidden="true" style={{ width: '64px', height: '1px', background: 'var(--brass)', margin: '1.2rem 0' }}></div>
          <a className="btn rv d2" href="#contact" onClick={(e) => { e.preventDefault(); window.location.hash = 'contact'; }}>
            <span>Enquire Now</span>
          </a>
        </section>

      </main>

      {/* Cinematic Projector Lightbox Modal */}
      <div 
        className={`lightbox ${activeVideo ? 'open' : ''} ${lightboxBoot ? 'boot' : ''} ${lightboxLit ? 'lit' : ''}`} 
        onClick={(e) => { if (e.target.classList.contains('lightbox')) closeFilm(); }}
        aria-hidden={!activeVideo}
      >
        <button className="close" onClick={closeFilm}>Close ✕</button>
        <div className="box">
          {activeVideo && (
            <iframe 
              src={`https://player.vimeo.com/video/${activeVideo}?autoplay=1&title=0&byline=0&portrait=0`}
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen 
              title="Wedding film"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
}
