import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [currentStep, setCurrentStep] = useState(1);
  const dateInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    spouseName: '',
    phone: '',
    sameWhatsapp: true,
    whatsapp: '',
    email: '',
    weddingDate: '',
    venue: '',
    eventType: 'Traditional Wedding Coverage',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [destinationEvents, setDestinationEvents] = useState([
    { id: 1, date: '', venue: '' },
    { id: 2, date: '', venue: '' }
  ]);

  // Traditional Wedding Side States
  const [brideEvents, setBrideEvents] = useState([
    { id: 1, date: '', venue: '' },
    { id: 2, date: '', venue: '' }
  ]);

  const [groomEvents, setGroomEvents] = useState([
    { id: 1, date: '', venue: '' },
    { id: 2, date: '', venue: '' }
  ]);

  const handleAddDestinationEvent = () => {
    setDestinationEvents((prev) => [
      ...prev,
      { id: prev.length + 1, date: '', venue: '' }
    ]);
  };

  const handleRemoveDestinationEvent = (index) => {
    if (destinationEvents.length <= 1) return;
    setDestinationEvents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDestinationEventChange = (index, field, value) => {
    setDestinationEvents((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    if (errors[`dest_date_${index}`]) {
      setErrors((prev) => ({ ...prev, [`dest_date_${index}`]: '' }));
    }
  };

  // Synchronized Add Event for both Bride & Groom sides
  const handleAddTraditionalEventPair = () => {
    setBrideEvents((prev) => [
      ...prev,
      { id: prev.length + 1, date: '', venue: '' }
    ]);
    setGroomEvents((prev) => [
      ...prev,
      { id: prev.length + 1, date: '', venue: '' }
    ]);
  };

  const handleRemoveTraditionalEventPair = (index) => {
    if (brideEvents.length <= 1) return;
    setBrideEvents((prev) => prev.filter((_, i) => i !== index));
    setGroomEvents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBrideEventChange = (index, field, value) => {
    setBrideEvents((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    if (errors[`bride_date_${index}`]) {
      setErrors((prev) => ({ ...prev, [`bride_date_${index}`]: '' }));
    }
  };

  const handleGroomEventChange = (index, field, value) => {
    setGroomEvents((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    if (errors[`groom_date_${index}`]) {
      setErrors((prev) => ({ ...prev, [`groom_date_${index}`]: '' }));
    }
  };

  // Synchronize Phone and WhatsApp
  const handlePhoneChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      phone: val,
      whatsapp: prev.sameWhatsapp ? val : prev.whatsapp
    }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
    if (formData.sameWhatsapp && errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: '' }));
  };

  const handleSameWhatsappToggle = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      sameWhatsapp: checked,
      whatsapp: checked ? prev.phone : prev.whatsapp
    }));
    if (checked && errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: '' }));
  };

  const handleWhatsappChange = (val) => {
    setFormData((prev) => ({ ...prev, whatsapp: val }));
    if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: '' }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Open calendar date picker
  const triggerDatePicker = () => {
    if (validateStep(1)) {
      setCurrentStep(2);
      window.scrollTo({ top: 350, behavior: 'smooth' });
    } else {
      setCurrentStep(1);
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  // Validate Specific Step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Please enter your name.';
      }
      if (!formData.spouseName.trim()) {
        newErrors.spouseName = 'Please enter your spouse / partner name.';
      }
      const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
      if (!formData.phone.trim()) {
        newErrors.phone = 'Please enter your contact number.';
      } else if (cleanPhone.length < 10) {
        newErrors.phone = 'Please enter a valid 10-digit number.';
      }
      if (!formData.sameWhatsapp) {
        const cleanWa = formData.whatsapp.replace(/[^0-9]/g, '');
        if (!formData.whatsapp.trim()) {
          newErrors.whatsapp = 'Please enter your WhatsApp number.';
        } else if (cleanWa.length < 10) {
          newErrors.whatsapp = 'Please enter a valid WhatsApp number.';
        }
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Please enter your email address.';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (step === 2) {
      if (!formData.message.trim()) {
        newErrors.message = 'Please describe your event or expectations.';
      }
      if (!formData.eventType || formData.eventType === '') {
        newErrors.eventType = 'Please select an event type.';
      }

      if (formData.eventType === 'Destination Wedding') {
        let hasDate = false;
        destinationEvents.forEach((ev, idx) => {
          if (!ev.date) {
            newErrors[`dest_date_${idx}`] = `Please select date for Event ${idx + 1}.`;
          } else {
            hasDate = true;
          }
        });
        if (hasDate) {
          const datesSummary = destinationEvents.map((ev, i) => `Event ${i+1}: ${ev.date}`).join(' | ');
          const venuesSummary = destinationEvents.map((ev, i) => ev.venue ? `Event ${i+1}: ${ev.venue}` : '').filter(Boolean).join(' | ');
          setFormData((prev) => ({
            ...prev,
            weddingDate: datesSummary,
            venue: venuesSummary || prev.venue
          }));
        }
      } else if (formData.eventType === 'Traditional Wedding') {
        let hasDate = false;
        brideEvents.forEach((ev, idx) => {
          if (!ev.date && idx === 0) {
            newErrors[`bride_date_${idx}`] = `Select Bride Event ${idx + 1} date.`;
          } else if (ev.date) {
            hasDate = true;
          }
        });
        groomEvents.forEach((ev, idx) => {
          if (!ev.date && idx === 0) {
            newErrors[`groom_date_${idx}`] = `Select Groom Event ${idx + 1} date.`;
          } else if (ev.date) {
            hasDate = true;
          }
        });
        if (hasDate) {
          const brideSummary = brideEvents.map((ev, i) => ev.date ? `Bride E${i+1}: ${ev.date}` : '').filter(Boolean).join(', ');
          const groomSummary = groomEvents.map((ev, i) => ev.date ? `Groom E${i+1}: ${ev.date}` : '').filter(Boolean).join(', ');
          setFormData((prev) => ({
            ...prev,
            weddingDate: [brideSummary, groomSummary].filter(Boolean).join(' | '),
            venue: prev.venue
          }));
        }
      } else if (formData.eventType && !formData.weddingDate) {
        newErrors.weddingDate = 'Please select your wedding / event date.';
      }
    }

    if (step === 3) {
      if (!formData.message.trim()) {
        newErrors.message = 'Please tell us a few details about your celebration.';
      } else if (formData.message.trim().length < 5) {
        newErrors.message = 'Message must be at least 5 characters.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 220, behavior: 'smooth' });
      } else {
        setIsSubmitting(true);
        setTimeout(() => {
          setIsSubmitting(false);
          setSubmitted(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 700);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I just submitted my wedding details. Looking forward to connecting.`
  );

  return (
    <div className="page-content-wrapper">
      {/* CREATIVE VISUAL HERO BANNER */}
      <section className="contact-hero-banner" style={{ position: 'relative', width: '100%', height: 'clamp(520px, 75vh, 750px)', overflow: 'hidden' }}>
        <motion.img 
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          src="assets/images/contact_hero.png" 
          alt="Chitra Weddings Royal Wedding Hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
        />
        {/* Cinematic Gradient Overlay & Hero Content */}
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to bottom, rgba(10,10,11,0.3) 0%, rgba(10,10,11,0.55) 60%, #0a0a0b 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'clamp(2.5rem, 6vh, 4.5rem) var(--pad)'
          }} 
        >
          <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ 
                fontSize: '0.72rem', 
                letterSpacing: '0.36em', 
                textTransform: 'uppercase', 
                color: 'var(--brass)', 
                fontFamily: 'var(--sans)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.8rem'
              }}
            >
              CHITRA WEDDINGS — AVAILABILITY &amp; INQUIRIES
            </motion.span>

            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ 
                fontFamily: 'var(--serif)', 
                fontSize: 'clamp(3rem, 7.5vw, 5.6rem)', 
                color: 'var(--bone)', 
                lineHeight: 1.05,
                fontWeight: 400,
                marginBottom: '1rem'
              }}
            >
              Let's Start Your <em>Journey</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                color: 'rgba(234, 229, 219, 0.85)',
                maxWidth: '640px',
                margin: '0 auto',
                lineHeight: 1.5
              }}
            >
              Your Love Story deserves to be told Beautifully. Share your dates, venue, and vision below.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="sec" style={{ paddingTop: '2.5rem', marginTop: '-4.5rem', position: 'relative', zIndex: 5 }}>
        <div className="container" style={{ maxWidth: '960px', margin: '0 auto' }}>

          {!submitted ? (
            <>
              {/* MULTI-STEP PROGRESS INDICATOR */}
              <div className="form-steps-nav">
                <div className={`step-indicator ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`} onClick={() => currentStep > 1 && setCurrentStep(1)}>
                  <div className="step-badge">{currentStep > 1 ? '✓' : '1'}</div>
                  <span className="step-title-lbl">Basic Details</span>
                </div>
                <div className={`step-indicator ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`} onClick={() => validateStep(1) && setCurrentStep(2)}>
                  <div className="step-badge">{currentStep > 2 ? '✓' : '2'}</div>
                  <span className="step-title-lbl">Event Details</span>
                </div>
                <div className={`step-indicator ${currentStep === 3 ? 'active' : ''}`} onClick={() => validateStep(1) && validateStep(2) && setCurrentStep(3)}>
                  <div className="step-badge">3</div>
                  <span className="step-title-lbl">Your Vision</span>
                </div>
              </div>

              {/* MULTI-STEP FORM CONTAINER */}
              <motion.form 
                key={currentStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleNextStep} 
                className="contact-form"
                noValidate
              >

                {/* STEP 1: BASIC DETAILS */}
                {currentStep === 1 && (
                  <>
                    <div className="contact-form-head">
                      <h3 className="contact-form-title">Basic <em>Details</em></h3>
                      <p className="muted">Step 1 of 3 — Tell us a bit about you and your partner.</p>
                    </div>

                    {/* 2-Col: Your Name & Spouse Name */}
                    <div className="form-row-2col">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">YOUR NAME <span className="req-star">*</span></label>
                        <input 
                          id="name"
                          type="text" 
                          placeholder="Your Full Name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                        />
                        {errors.name && <span className="form-error-msg">{errors.name}</span>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="spouseName" className="form-label">SPOUSE / PARTNER NAME <span className="req-star">*</span></label>
                        <input 
                          id="spouseName"
                          type="text" 
                          placeholder="Spouse Full Name"
                          value={formData.spouseName}
                          onChange={(e) => handleInputChange('spouseName', e.target.value)}
                          className={`form-input ${errors.spouseName ? 'form-input--error' : ''}`}
                        />
                        {errors.spouseName && <span className="form-error-msg">{errors.spouseName}</span>}
                      </div>
                    </div>

                    {/* 2-Col: Contact Number & WhatsApp Number */}
                    <div className="form-row-2col">
                      <div className="form-group">
                        <label htmlFor="phone" className="form-label">CONTACT NUMBER <span className="req-star">*</span></label>
                        <input 
                          id="phone"
                          type="tel" 
                          placeholder="9090606831"
                          value={formData.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                        />
                        {errors.phone && <span className="form-error-msg">{errors.phone}</span>}

                        {/* Checkbox: Same as Contact Number */}
                        <label className="checkbox-wrap">
                          <input 
                            type="checkbox"
                            checked={formData.sameWhatsapp}
                            onChange={handleSameWhatsappToggle}
                            className="checkbox-input"
                          />
                          <span className="checkbox-text">Same as Contact Number</span>
                        </label>
                      </div>

                      <div className="form-group">
                        <label htmlFor="whatsapp" className="form-label">WHATSAPP NUMBER <span className="req-star">*</span></label>
                        <input 
                          id="whatsapp"
                          type="tel" 
                          placeholder="9090606831"
                          value={formData.whatsapp}
                          onChange={(e) => handleWhatsappChange(e.target.value)}
                          disabled={formData.sameWhatsapp}
                          className={`form-input ${errors.whatsapp ? 'form-input--error' : ''}`}
                          style={{ opacity: formData.sameWhatsapp ? 0.75 : 1 }}
                        />
                        {errors.whatsapp && <span className="form-error-msg">{errors.whatsapp}</span>}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">EMAIL ADDRESS <span className="req-star">*</span></label>
                      <input 
                        id="email"
                        type="email" 
                        placeholder="yourname@gmail.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                      />
                      {errors.email && <span className="form-error-msg">{errors.email}</span>}
                    </div>
                  </>
                )}

                {/* STEP 2: EVENT DETAILS */}
                {currentStep === 2 && (
                  <>
                    <div className="contact-form-head">
                      <h3 className="contact-form-title">Help Us Describe <em>Your Event</em></h3>
                      <p className="muted">Step 2 of 3 — Tell us about your wedding, celebrations, expectations, or any important details.</p>
                    </div>

                    {/* Large Text Area for Event Description & Expectations */}
                    <div className="form-group">
                      <label htmlFor="message" className="form-label">DESCRIBE YOUR EVENT / VISION <span className="req-star">*</span></label>
                      <textarea 
                        id="message"
                        rows="5" 
                        placeholder="Describe your wedding functions, guest count, expectations, ceremonial highlights, or special preferences..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className={`form-input form-textarea ${errors.message ? 'form-input--error' : ''}`}
                      />
                      {errors.message && <span className="form-error-msg">{errors.message}</span>}
                    </div>

                    {/* Event Type Dropdown */}
                    <div className="form-group">
                      <label htmlFor="eventType" className="form-label">EVENT TYPE <span className="req-star">*</span></label>
                      <select 
                        id="eventType"
                        value={formData.eventType}
                        onChange={(e) => handleInputChange('eventType', e.target.value)}
                        className={`form-select ${errors.eventType ? 'form-input--error' : ''}`}
                      >
                        <option value="">Select Event Type...</option>
                        <option value="Destination Wedding">Destination Wedding</option>
                        <option value="Traditional Wedding">Traditional Wedding</option>
                        <option value="Pre Wedding">Pre Wedding</option>
                        <option value="Engagement">Engagement</option>
                        <option value="Anniversary / Birthday">Anniversary / Birthday</option>
                      </select>
                      {errors.eventType && <span className="form-error-msg">{errors.eventType}</span>}
                    </div>

                    {/* DYNAMIC ADDITIONAL FIELDS FOR DESTINATION WEDDING VS OTHER EVENTS */}
                    {formData.eventType === 'Destination Wedding' ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4 }}
                        className="dest-events-wrap"
                      >
                        <div className="dest-events-head">
                          <span className="label text-brass">DESTINATION WEDDING SCHEDULE</span>
                          <span className="opt-tag">Add each ceremony or celebration function date &amp; venue</span>
                        </div>

                        {destinationEvents.map((ev, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.35, delay: index * 0.05 }}
                            className="dest-event-card"
                          >
                            <div className="dest-event-head">
                              <span className="dest-event-badge">EVENT {index + 1}</span>
                              {destinationEvents.length > 2 && (
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveDestinationEvent(index)}
                                  className="btn-remove-event"
                                >
                                  ✕ Remove
                                </button>
                              )}
                            </div>

                            <div className="form-row-2col">
                              {/* Date Field */}
                              <div className="form-group">
                                <label className="form-label">DATE <span className="req-star">*</span></label>
                                <input 
                                  type="date" 
                                  value={ev.date}
                                  onChange={(e) => handleDestinationEventChange(index, 'date', e.target.value)}
                                  className={`form-input ${errors[`dest_date_${index}`] ? 'form-input--error' : ''}`}
                                  style={{ colorScheme: 'dark', cursor: 'pointer' }}
                                />
                                {errors[`dest_date_${index}`] && <span className="form-error-msg">{errors[`dest_date_${index}`]}</span>}
                              </div>

                              {/* Venue Field */}
                              <div className="form-group">
                                <label className="form-label">VENUE / LOCATION <span className="opt-tag">(If finalized)</span></label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. Taj Lake Palace, Udaipur"
                                  value={ev.venue}
                                  onChange={(e) => handleDestinationEventChange(index, 'venue', e.target.value)}
                                  className="form-input"
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {/* Add More Events Button */}
                        <button 
                          type="button" 
                          onClick={handleAddDestinationEvent}
                          className="btn-add-event"
                        >
                          + ADD MORE EVENTS
                        </button>
                      </motion.div>
                    ) : formData.eventType === 'Traditional Wedding' ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4 }}
                        className="trad-wedding-wrap"
                      >
                        <div className="trad-events-head" style={{ marginBottom: '0.4rem' }}>
                          <span className="label text-brass">TRADITIONAL WEDDING SCHEDULE</span>
                          <span className="opt-tag">Specify event dates &amp; venues for both Bride and Groom sides</span>
                        </div>

                        {/* Symmetrical Two-Column Layout */}
                        <div className="trad-wedding-grid">
                          {/* LEFT COLUMN: BRIDE SIDE */}
                          <div className="trad-column">
                            <div className="trad-col-header">
                              <span className="trad-col-title">Bride Side</span>
                              <span className="trad-col-badge">FAMILY FUNCTIONS</span>
                            </div>

                            {brideEvents.map((ev, index) => (
                              <motion.div 
                                key={`bride_${index}`}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: index * 0.05 }}
                                className="dest-event-card"
                              >
                                <div className="dest-event-head">
                                  <span className="dest-event-badge">BRIDE EVENT {index + 1}</span>
                                  {brideEvents.length > 2 && index >= 2 && (
                                    <button 
                                      type="button" 
                                      onClick={() => handleRemoveTraditionalEventPair(index)}
                                      className="btn-remove-event"
                                    >
                                      ✕ Remove
                                    </button>
                                  )}
                                </div>

                                <div className="form-row-2col">
                                  {/* Date Field */}
                                  <div className="form-group">
                                    <label className="form-label">DATE <span className="req-star">*</span></label>
                                    <input 
                                      type="date" 
                                      value={ev.date}
                                      onChange={(e) => handleBrideEventChange(index, 'date', e.target.value)}
                                      className={`form-input ${errors[`bride_date_${index}`] ? 'form-input--error' : ''}`}
                                      style={{ colorScheme: 'dark', cursor: 'pointer' }}
                                    />
                                    {errors[`bride_date_${index}`] && <span className="form-error-msg">{errors[`bride_date_${index}`]}</span>}
                                  </div>

                                  {/* Venue Field */}
                                  <div className="form-group">
                                    <label className="form-label">VENUE / LOCATION <span className="opt-tag">(If finalized)</span></label>
                                    <input 
                                      type="text" 
                                      placeholder="e.g. Mayfair, Bhubaneswar"
                                      value={ev.venue}
                                      onChange={(e) => handleBrideEventChange(index, 'venue', e.target.value)}
                                      className="form-input"
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* RIGHT COLUMN: GROOM SIDE */}
                          <div className="trad-column">
                            <div className="trad-col-header">
                              <span className="trad-col-title">Groom Side</span>
                              <span className="trad-col-badge">FAMILY FUNCTIONS</span>
                            </div>

                            {groomEvents.map((ev, index) => (
                              <motion.div 
                                key={`groom_${index}`}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: index * 0.05 }}
                                className="dest-event-card"
                              >
                                <div className="dest-event-head">
                                  <span className="dest-event-badge">GROOM EVENT {index + 1}</span>
                                  {groomEvents.length > 2 && index >= 2 && (
                                    <button 
                                      type="button" 
                                      onClick={() => handleRemoveTraditionalEventPair(index)}
                                      className="btn-remove-event"
                                    >
                                      ✕ Remove
                                    </button>
                                  )}
                                </div>

                                <div className="form-row-2col">
                                  {/* Date Field */}
                                  <div className="form-group">
                                    <label className="form-label">DATE <span className="req-star">*</span></label>
                                    <input 
                                      type="date" 
                                      value={ev.date}
                                      onChange={(e) => handleGroomEventChange(index, 'date', e.target.value)}
                                      className={`form-input ${errors[`groom_date_${index}`] ? 'form-input--error' : ''}`}
                                      style={{ colorScheme: 'dark', cursor: 'pointer' }}
                                    />
                                    {errors[`groom_date_${index}`] && <span className="form-error-msg">{errors[`groom_date_${index}`]}</span>}
                                  </div>

                                  {/* Venue Field */}
                                  <div className="form-group">
                                    <label className="form-label">VENUE / LOCATION <span className="opt-tag">(If finalized)</span></label>
                                    <input 
                                      type="text" 
                                      placeholder="e.g. Swosti Premium, Puri"
                                      value={ev.venue}
                                      onChange={(e) => handleGroomEventChange(index, 'venue', e.target.value)}
                                      className="form-input"
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Synchronized Add More Events Button */}
                        <button 
                          type="button" 
                          onClick={handleAddTraditionalEventPair}
                          className="btn-add-trad-event"
                        >
                          + ADD MORE EVENTS
                        </button>
                      </motion.div>
                    ) : formData.eventType !== '' ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4 }}
                        className="form-row-2col"
                        style={{ marginTop: '1.2rem' }}
                      >
                        {/* Dynamic Wedding Date Picker */}
                        <div className="form-group">
                          <label htmlFor="weddingDate" className="form-label">EVENT / WEDDING DATE <span className="req-star">*</span></label>
                          <input 
                            ref={dateInputRef}
                            id="weddingDate"
                            type="date" 
                            value={formData.weddingDate}
                            onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                            className={`form-input ${errors.weddingDate ? 'form-input--error' : ''}`}
                            style={{ colorScheme: 'dark', cursor: 'pointer' }}
                          />
                          {errors.weddingDate && <span className="form-error-msg">{errors.weddingDate}</span>}
                        </div>

                        {/* Dynamic Venue / Location */}
                        <div className="form-group">
                          <label htmlFor="venue" className="form-label">VENUE / LOCATION <span className="opt-tag">(If finalized)</span></label>
                          <input 
                            id="venue"
                            type="text" 
                            placeholder="e.g. Puri, Bhubaneswar, Cuttack"
                            value={formData.venue}
                            onChange={(e) => handleInputChange('venue', e.target.value)}
                            className="form-input"
                          />
                        </div>
                      </motion.div>
                    ) : null}
                  </>
                )}

                {/* STEP 3: YOUR VISION */}
                {currentStep === 3 && (
                  <>
                    <div className="contact-form-head">
                      <h3 className="contact-form-title">Your <em>Vision</em></h3>
                      <p className="muted">Step 3 of 3 — Tell us your story and vision for the big day.</p>
                    </div>

                    {/* Message Textarea */}
                    <div className="form-group">
                      <label htmlFor="message" className="form-label">TELL US ABOUT YOUR CELEBRATION <span className="req-star">*</span></label>
                      <textarea 
                        id="message"
                        rows="5" 
                        placeholder="Share your wedding plans, ceremonies, inspiration, or any specific questions..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className={`form-input form-textarea ${errors.message ? 'form-input--error' : ''}`}
                      />
                      {errors.message && <span className="form-error-msg">{errors.message}</span>}
                    </div>
                  </>
                )}

                {/* NAVIGATION STEP ACTIONS */}
                <div className="form-step-actions">
                  {currentStep > 1 ? (
                    <button type="button" onClick={handlePrevStep} className="btn-step-prev">
                      ← BACK
                    </button>
                  ) : <div />}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`btn-step-next ${isSubmitting ? 'btn-submitting' : ''}`}
                  >
                    {isSubmitting ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="spinner-dot" /> SUBMITTING INQUIRY...
                      </span>
                    ) : currentStep === 3 ? (
                      'SEND INQUIRY & CHECK DATES →'
                    ) : (
                      'NEXT STEP →'
                    )}
                  </button>
                </div>

              </motion.form>
            </>
          ) : (
            /* CINEMATIC THANK YOU SCREEN VIEW */
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="thankyou-card"
            >
              <div className="thankyou-badge">INQUIRY RECEIVED</div>

              <h2 className="display thankyou-title">
                Thank <em>You!</em>
              </h2>

              <p className="thankyou-msg">
                We've received your enquiry. We can't wait to be a part of your story.
              </p>

              {/* Submission Summary Box */}
              <div className="thankyou-summary">
                <div className="summary-item">
                  <span className="summary-label">Name</span>
                  <span className="summary-val">{formData.name}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Spouse Name</span>
                  <span className="summary-val">{formData.spouseName}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Contact / WhatsApp</span>
                  <span className="summary-val">{formData.phone}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Email</span>
                  <span className="summary-val">{formData.email}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Wedding Date</span>
                  <span className="summary-val">{formData.weddingDate || 'To Be Finalized'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Selected Collection</span>
                  <span className="summary-val">{formData.eventType}</span>
                </div>
              </div>

              {/* Action Buttons: PDF Download & WhatsApp */}
              <div className="thankyou-actions">
                <a 
                  href="assets/pdf/Chitra_Weddings_Guide.pdf" 
                  download="Chitra_Weddings_Guide.pdf" 
                  className="btn btn-pdf-download"
                >
                  <span>📄 Download FREE Wedding Guide</span>
                </a>

                <a 
                  href={`https://wa.me/919090606831?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp-chat"
                >
                  <span>💬 Chat on WhatsApp</span>
                </a>
              </div>
            </motion.div>
          )}

        </div>
      </section>

      {/* WHAT HAPPENS NEXT? TIMELINE PROCESS SECTION */}
      <section className="sec process-sec">
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="process-sec-head"
          >
            <span className="label text-brass">THE EXPERIENCE</span>
            <h2 className="display process-title">What Happens <em>Next?</em></h2>
            <p className="body-lg muted process-subtitle">
              From your first enquiry to capturing your special day, here's what you can expect.
            </p>
          </motion.div>

          {/* Timeline Process List */}
          <div className="process-timeline">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="process-step"
            >
              <div className="process-step-num">01</div>
              <div className="process-step-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div className="process-step-content">
                <h3 className="process-step-title">We Receive Your Enquiry</h3>
                <p className="process-step-desc">
                  As soon as you submit the form, our team carefully reviews your requirements and wedding details.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="process-step"
            >
              <div className="process-step-num">02</div>
              <div className="process-step-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 9h8" />
                  <path d="M8 13h6" />
                </svg>
              </div>
              <div className="process-step-content">
                <h3 className="process-step-title">Personal Consultation</h3>
                <p className="process-step-desc">
                  We'll contact you to understand your vision, answer your questions, discuss your event, and recommend the most suitable photography and cinematography package.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="process-step"
            >
              <div className="process-step-num">03</div>
              <div className="process-step-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <div className="process-step-content">
                <h3 className="process-step-title">Customized Proposal</h3>
                <p className="process-step-desc">
                  Based on your requirements, we'll share a personalized quotation, package details, and availability for your wedding dates.
                </p>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.36 }}
              className="process-step"
            >
              <div className="process-step-num">04</div>
              <div className="process-step-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.4 6.6 6.6 2.4-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
                  <path d="M19 17l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
                </svg>
              </div>
              <div className="process-step-content">
                <h3 className="process-step-title">Booking Confirmation</h3>
                <p className="process-step-desc">
                  Once you're happy with everything, we'll confirm your booking and begin planning every important detail to ensure your memories are captured beautifully.
                </p>
              </div>
            </motion.div>

            {/* Step 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="process-step"
            >
              <div className="process-step-num">05</div>
              <div className="process-step-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <div className="process-step-content">
                <h3 className="process-step-title">Your Wedding Story Begins</h3>
                <p className="process-step-desc">
                  Our team works closely with you throughout the journey, ensuring a seamless experience and creating timeless memories you'll cherish forever.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  );
}
