import React from 'react';

export default function MeetMe() {
  return (
    <div className="page-content-wrapper">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container fade-in-up">
          <span className="label">ABOUT US</span>
          <h1 className="display" style={{ marginTop: '1rem' }}>Marie &amp; <em>Bennet</em></h1>
        </div>
      </section>

      {/* About Grid */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="about-grid">
            <div className="portrait fade-in-up">
              <img src="assets/images/meet_me_arch.png" alt="Marie and Bennet hugging" />
            </div>
            
            <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <h2 className="display" style={{ fontSize: '2.5rem' }}>We turn wedding days into films couples rewatch for the rest of their lives.</h2>
              <p className="body-lg muted">Based in Montana and Southern California, we are a husband-and-wife team focused on timeless cinematic storytelling.</p>
              <p className="muted">More than a decade behind the lens has taught us that the best moments are never staged. We blend in with your guests, stay quiet, and capture the natural energy and emotional depth of your celebration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Numbered Approach Rows */}
      <section className="sec on-bone">
        <div className="container">
          <div className="sec-head"><span className="n">01</span><span className="label">Our Approach</span></div>
          
          <div className="approach-row">
            <span className="no">01.</span>
            <h3>Unobtrusive</h3>
            <p className="muted">We don't use heavy rigs or block your guests. We shoot with small, high-end cinema packages to remain natural and blending into the background.</p>
          </div>
          
          <div className="approach-row">
            <span className="no">02.</span>
            <h3>Cinematic</h3>
            <p className="muted">We treat lighting, composition, sound design, and color grading to theatrical standards, making your wedding day look and feel like a real movie.</p>
          </div>
          
          <div className="approach-row">
            <span className="no">03.</span>
            <h3>Story-Driven</h3>
            <p className="muted">Your voices carry the edit. Vows, toast quotes, and letters shape the narrative of the film, not just a highlight montage set to pop music.</p>
          </div>
        </div>
      </section>

      {/* Stills Strip scrolling banner */}
      <section className="sec" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="stills">
          <img src="assets/images/collage_tennis.png" alt="Couple on tennis court" />
          <img src="assets/images/collage_smile.png" alt="Couple portrait smile" />
          <img src="assets/images/collage_piggyback.png" alt="Piggyback on beach" />
          <img src="assets/images/collage_proposal.png" alt="Proposal forest" />
        </div>
      </section>

      {/* Accordion FAQ Details list */}
      <section className="sec on-bone">
        <div className="container">
          <div className="sec-head"><span className="n">02</span><span className="label">Common Questions</span></div>
          
          <div className="faq">
            <details className="faq-item">
              <summary>
                <span className="q">Do you travel for weddings?</span>
                <span className="faq-x">+</span>
              </summary>
              <p className="muted">Yes, we film all across Southern California, Montana, and worldwide. Travel costs are fully built into our custom destination packages so there are no surprise fees.</p>
            </details>
            
            <details className="faq-item">
              <summary>
                <span className="q">When will we receive our photos and films?</span>
                <span className="faq-x">+</span>
              </summary>
              <p className="muted">Our average delivery time is 8 to 12 weeks. We take great care in our custom editing process, treating every frame with the attention it deserves.</p>
            </details>
            
            <details className="faq-item">
              <summary>
                <span className="q">Can we download the high-resolution files?</span>
                <span className="faq-x">+</span>
              </summary>
              <p className="muted">Absolutely. Every gallery and collection is delivered digitally with full download rights so you can save, print, and share your images anywhere.</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
