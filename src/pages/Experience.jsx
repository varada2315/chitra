import React from 'react';

export default function Experience() {
  return (
    <div className="page-content-wrapper">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container fade-in-up">
          <span className="label">THE EXPERIENCE</span>
          <h1 className="display" style={{ marginTop: '1rem' }}>The <em>Process</em></h1>
        </div>
      </section>

      {/* Numbered Steps */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="steps">
            
            {/* Step 1 */}
            <div className="step rv in">
              <span className="no">01.</span>
              <div>
                <h3>Inquiry &amp; Discovery</h3>
                <p className="muted" style={{ marginTop: '0.5rem', maxWidth: '600px' }}>We start with a phone call to understand your vision, discuss location options, and align on timeline and packages.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="step rv in">
              <span className="no">02.</span>
              <div>
                <h3>Creative Planning</h3>
                <p className="muted" style={{ marginTop: '0.5rem', maxWidth: '600px' }}>We assist you in structuring a custom timeline, styling your outfits, coordinating lighting conditions, and scouting unique spots.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="step rv in">
              <span className="no">03.</span>
              <div>
                <h3>The Wedding Day</h3>
                <p className="muted" style={{ marginTop: '0.5rem', maxWidth: '600px' }}>Unobtrusive and calm, we document your day as it unfolds naturally. No forced posing, just genuine moments recorded on film.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="step rv in">
              <span className="no">04.</span>
              <div>
                <h3>Editorial Editing</h3>
                <p className="muted" style={{ marginTop: '0.5rem', maxWidth: '600px' }}>We spend weeks carefully editing and color-grading your photos and films, overlaying vows and music to deliver a polished story.</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
