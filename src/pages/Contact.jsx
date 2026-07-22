import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    names: '',
    email: '',
    phone: '',
    date: '',
    venue: '',
    service: 'Traditional Wedding Coverage',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-content-wrapper">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container fade-in-up">
          <span className="label">CHITRA WEDDINGS</span>
          <h1 className="display" style={{ marginTop: '1rem' }}>Let's Start Your <em>Journey</em></h1>
          <p className="muted" style={{ marginTop: '0.8rem', fontSize: '1.15rem', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
            Your Love Story deserves to be told Beautifully.
          </p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Quick Contact Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem', textTransform: 'uppercase' }}>
            <div style={{ padding: '1.8rem', border: '1px solid var(--hair)', background: 'rgba(234,229,219,0.03)' }}>
              <span className="label" style={{ color: 'var(--brass)', display: 'block', marginBottom: '0.6rem' }}>PHONE / WHATSAPP</span>
              <a href="tel:9090606831" style={{ fontSize: '1.1rem', fontFamily: 'var(--sans)', fontWeight: 600, display: 'block' }}>9090606831</a>
              <a href="tel:8093844489" style={{ fontSize: '0.95rem', color: 'var(--bone-70)', display: 'block', marginTop: '0.2rem' }}>8093844489</a>
            </div>

            <div style={{ padding: '1.8rem', border: '1px solid var(--hair)', background: 'rgba(234,229,219,0.03)' }}>
              <span className="label" style={{ color: 'var(--brass)', display: 'block', marginBottom: '0.6rem' }}>EMAIL US</span>
              <a href="mailto:chitraweddings@gmail.com" style={{ fontSize: '1rem', fontFamily: 'var(--sans)', fontWeight: 600, textTransform: 'lowercase' }}>chitraweddings@gmail.com</a>
            </div>

            <div style={{ padding: '1.8rem', border: '1px solid var(--hair)', background: 'rgba(234,229,219,0.03)' }}>
              <span className="label" style={{ color: 'var(--brass)', display: 'block', marginBottom: '0.6rem' }}>SPECIAL OFFER</span>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', color: '#eae5db', display: 'block' }}>FREE ENGAGEMENT COVERAGE WITH TRADITIONAL / DESTINATION PACKAGES</span>
            </div>
          </div>

          {submitted ? (
            <div className="rv in" style={{ textAlign: 'center', padding: '4rem 0' }}>
              <h2 className="display" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Thank <em>You.</em></h2>
              <p className="body-lg muted">We have received your message. Chitra Weddings will get in touch with you shortly to begin your journey.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rv in" style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              {/* Names input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label className="label" style={{ color: 'var(--bone-45)' }}>YOUR NAMES</label>
                <input 
                  type="text" 
                  required
                  placeholder="Adarsh & Partner"
                  value={formData.names}
                  onChange={(e) => setFormData({ ...formData, names: e.target.value })}
                  style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--hair)', padding: '0.8rem 0', color: 'var(--bone)', fontFamily: 'var(--sans)', fontSize: '1.1rem', outline: 'none' }} 
                />
              </div>

              {/* Email & Phone grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <label className="label" style={{ color: 'var(--bone-45)' }}>EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    required
                    placeholder="chitraweddings@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--hair)', padding: '0.8rem 0', color: 'var(--bone)', fontFamily: 'var(--sans)', fontSize: '1.1rem', outline: 'none' }} 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <label className="label" style={{ color: 'var(--bone-45)' }}>PHONE / WHATSAPP</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="9090606831"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--hair)', padding: '0.8rem 0', color: 'var(--bone)', fontFamily: 'var(--sans)', fontSize: '1.1rem', outline: 'none' }} 
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label className="label" style={{ color: 'var(--bone-45)' }}>SERVICE INTERESTED IN</label>
                <select 
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  style={{ background: '#101012', border: 'none', borderBottom: '1px solid var(--hair)', padding: '0.8rem 0', color: 'var(--bone)', fontFamily: 'var(--sans)', fontSize: '1.05rem', outline: 'none' }}
                >
                  <option value="Traditional Wedding Coverage">Traditional Wedding Coverage</option>
                  <option value="Destination Wedding Coverage">Destination Wedding Coverage</option>
                  <option value="Pre Wedding Coverage">Pre Wedding Coverage</option>
                  <option value="Engagement / Birthday / Anniversaries">Engagement / Birthday / Anniversaries</option>
                </select>
              </div>

              {/* Date & Venue */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <label className="label" style={{ color: 'var(--bone-45)' }}>WEDDING DATE</label>
                  <input 
                    type="text" 
                    placeholder="December 14, 2026"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--hair)', padding: '0.8rem 0', color: 'var(--bone)', fontFamily: 'var(--sans)', fontSize: '1.1rem', outline: 'none' }} 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <label className="label" style={{ color: 'var(--bone-45)' }}>LOCATION / VENUE</label>
                  <input 
                    type="text" 
                    placeholder="City / Venue Name"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--hair)', padding: '0.8rem 0', color: 'var(--bone)', fontFamily: 'var(--sans)', fontSize: '1.1rem', outline: 'none' }} 
                  />
                </div>
              </div>

              {/* Message textarea */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label className="label" style={{ color: 'var(--bone-45)' }}>TELL US ABOUT YOUR DAY</label>
                <textarea 
                  rows="4" 
                  placeholder="Share details about your celebration..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--hair)', padding: '0.8rem 0', color: 'var(--bone)', fontFamily: 'var(--sans)', fontSize: '1.1rem', outline: 'none', resize: 'none', lineHeight: '1.6' }}
                />
              </div>

              {/* Submit button */}
              <div style={{ textAlign: 'center' }}>
                <button type="submit" className="btn">
                  <span>Enquire Now</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </section>
    </div>
  );
}
