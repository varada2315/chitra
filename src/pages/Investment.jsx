import React from 'react';

export default function Investment() {
  return (
    <div className="page-content-wrapper">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container fade-in-up">
          <span className="label">INVESTMENT</span>
          <h1 className="display" style={{ marginTop: '1rem' }}>Collections</h1>
          <p className="muted" style={{ marginTop: '0.5rem', fontSize: '1.15rem', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
            Real numbers for real weddings.
          </p>
        </div>
      </section>

      {/* Collections Section */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="container">
          
          {/* Collection 1 */}
          <div className="collection">
            <span className="tier-no">I</span>
            <div className="media">
              <div className="feature-frame">
                <img src="assets/images/exp_families.png" alt="The Moment Collection" />
                <div className="shade"></div>
              </div>
            </div>
            <div className="tier-content">
              <div className="tier">
                <span className="n">Collection i.</span>
                <div className="title-row">
                  <h3>The Moment</h3>
                  <span className="price">$6,000</span>
                </div>
                <p className="tag">Timeless coverage of your wedding day.</p>
                <p className="desc muted">A comprehensive edit of your day, focused on the key highlights, candid interactions, and natural emotion, structured to be shared easily.</p>
                
                <ul>
                  <li>8 Hours of Cinematic Coverage</li>
                  <li>Single Photographer + Videographer</li>
                  <li>3-5 Minute Highlight Film</li>
                  <li>Online Gallery Delivery with High-Res Images</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Collection 2 */}
          <div className="collection alt">
            <span className="tier-no">II</span>
            <div className="media">
              <div className="feature-frame">
                <img src="assets/images/exp_weddings.png" alt="The Portrait Collection" />
                <div className="shade"></div>
              </div>
            </div>
            <div className="tier-content">
              <div className="tier">
                <span className="n">Collection ii.</span>
                <div className="title-row">
                  <h3>The Portrait</h3>
                  <span className="price">$8,000</span>
                </div>
                <p className="tag">Our most popular cinematic offering.</p>
                <p className="desc muted">An extended look into your ceremony, sunset portrait sessions, and reception Speeches. Story-driven with vows and real voices integrated.</p>
                
                <ul>
                  <li>10 Hours of Comprehensive Coverage</li>
                  <li>Two Photographers + Two Videographers</li>
                  <li>6-8 Minute Highlight Story Film</li>
                  <li>Drone Footage & Full Ceremony Video</li>
                  <li>Raw Footage Delivered</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Collection 3 */}
          <div className="collection">
            <span className="tier-no">III</span>
            <div className="media">
              <div className="feature-frame">
                <img src="assets/images/exp_couples.png" alt="The Legacy Collection" />
                <div className="shade"></div>
              </div>
            </div>
            <div className="tier-content">
              <div className="tier">
                <span className="n">Collection iii.</span>
                <div className="title-row">
                  <h3>The Legacy</h3>
                  <span className="price">$10,000</span>
                </div>
                <p className="tag">An heirloom film and photo archive.</p>
                <p className="desc muted">The complete documentation of your celebration. Multiday coverage support, custom packaging, and comprehensive raw archive storage.</p>
                
                <ul>
                  <li>Full Weekend/Multi-day Coverage</li>
                  <li>Two Photographers + Three Videographers</li>
                  <li>10-12 Minute Cinematic Feature Film</li>
                  <li>Drone Footage & Documentary Edits</li>
                  <li>Physical Polaroid Print Book & Custom Gift Box</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="compare">
            <div className="row" style={{ borderBottom: '2px solid var(--hair)', paddingBottom: '1rem' }}>
              <div className="label">Compare Tiers</div>
              <div className="label">The Moment</div>
              <div className="label">The Portrait</div>
              <div className="label">The Legacy</div>
            </div>
            
            <div className="row">
              <div>Coverage Hours</div>
              <div>8 Hours</div>
              <div>10 Hours</div>
              <div>Weekend</div>
            </div>
            <div className="row">
              <div>Photographers / Videographers</div>
              <div>1 / 1</div>
              <div>2 / 2</div>
              <div>2 / 3</div>
            </div>
            <div className="row">
              <div>Film Length</div>
              <div>3-5 Mins</div>
              <div>6-8 Mins</div>
              <div>10-12 Mins</div>
            </div>
            <div className="row">
              <div>Drone Coverage</div>
              <div className="no">—</div>
              <div className="dot">✓</div>
              <div className="dot">✓</div>
            </div>
            <div className="row">
              <div>Raw Footage Delivery</div>
              <div className="no">—</div>
              <div className="dot">✓</div>
              <div className="dot">✓</div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
