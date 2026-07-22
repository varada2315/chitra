import React from 'react';

export default function Blog() {
  return (
    <div className="page-content-wrapper">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container fade-in-up">
          <span className="label">RESOURCES</span>
          <h1 className="display" style={{ marginTop: '1rem' }}>The <em>Journal</em></h1>
        </div>
      </section>

      {/* Journal list */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="jr-list">
            
            {/* Row 1 */}
            <div className="jr-row fade-in-up">
              <span className="jr-meta">June 15, 2026 · Real Wedding</span>
              <h2>The Hansons Outdoor Celebration in <em>Bozeman</em></h2>
              <p className="dek">Exploring natural sunset lighting, organic green grading, and capturing candid mountain vows. A look into how we scheduled their portraits to avoid harsh mid-day shadows.</p>
            </div>

            {/* Row 2 */}
            <div className="jr-row fade-in-up">
              <span className="jr-meta">May 28, 2026 · Guides</span>
              <h2>How to Choose the Best <em>Timeline</em> for Your Ceremony</h2>
              <p className="dek">A detailed breakdown of wedding day timelines. Why buffer times are critical, how much time to allocate for portrait shoots, and how to coordinate with your vendors.</p>
            </div>

            {/* Row 3 */}
            <div className="jr-row fade-in-up">
              <span className="jr-meta">May 10, 2026 · Film Stories</span>
              <h2>Demi &amp; Luca Lifestyle Couple <em>Session</em></h2>
              <p className="dek">Taking couples out of their comfort zone and into natural play. A case study in using a retro tennis court setting to capture movement and raw smiles.</p>
            </div>

            {/* Row 4 */}
            <div className="jr-row fade-in-up">
              <span className="jr-meta">April 14, 2026 · Education</span>
              <h2>The Difference Between Photography &amp; <em>Videography</em></h2>
              <p className="dek">Understanding how photo and video work together on your wedding day. How we coordinate with other photographers to ensure clean fields of view and shared timelines.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
