import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Package Tier and Pricing Data
const PACKAGE_TIER_DATA = {
  'Traditional Wedding Collection': {
    essential: { label: 'Essential (Standard)', price: '₹1,80,000', numericPrice: 180000, subtitle: 'Standard Multi-Day Coverage' },
    signature: { label: 'Signature Collection', price: '₹2,40,000', numericPrice: 240000, subtitle: 'Full Candid & Cinematic Masterpiece' }
  },
  'Destination Storytelling': {
    essential: { label: 'Essential (Standard)', price: '₹2,00,000', numericPrice: 200000, subtitle: 'Standard Travel & Event Coverage' },
    signature: { label: 'Signature Collection', price: '₹2,80,000', numericPrice: 280000, subtitle: 'Complete Multi-Day Destination Coverage' }
  },
  'Pre-Wedding & Intimate': {
    essential: { label: 'Essential (Standard)', price: '₹25,000', numericPrice: 25000, subtitle: 'Standard Editorial Session' },
    signature: { label: 'Signature Collection', price: '₹35,000', numericPrice: 35000, subtitle: 'Full-Day Shoot + Drone + Film' }
  },
  'Pre-Wedding & Engagement': {
    essential: { label: 'Essential (Standard)', price: '₹25,000', numericPrice: 25000, subtitle: 'Standard Editorial Session' },
    signature: { label: 'Signature Collection', price: '₹35,000', numericPrice: 35000, subtitle: 'Full-Day Shoot + Drone + Film' }
  },
  'Traditional Wedding': {
    essential: { label: 'Essential (Standard)', price: '₹1,80,000', numericPrice: 180000, subtitle: 'Standard Multi-Day Coverage' },
    signature: { label: 'Signature Collection', price: '₹2,40,000', numericPrice: 240000, subtitle: 'Full Candid & Cinematic Masterpiece' }
  },
  'Destination Wedding': {
    essential: { label: 'Essential (Standard)', price: '₹2,00,000', numericPrice: 200000, subtitle: 'Standard Travel & Event Coverage' },
    signature: { label: 'Signature Collection', price: '₹2,80,000', numericPrice: 280000, subtitle: 'Complete Multi-Day Destination Coverage' }
  },
  'Pre Wedding': {
    essential: { label: 'Essential (Standard)', price: '₹25,000', numericPrice: 25000, subtitle: 'Standard Editorial Session' },
    signature: { label: 'Signature Collection', price: '₹35,000', numericPrice: 35000, subtitle: 'Full-Day Shoot + Drone + Film' }
  },
  'Engagement': {
    essential: { label: 'Essential (Standard)', price: '₹25,000', numericPrice: 25000, subtitle: 'Standard Editorial Session' },
    signature: { label: 'Signature Collection', price: '₹35,000', numericPrice: 35000, subtitle: 'Full-Day Shoot + Drone + Film' }
  },
  'Anniversary / Birthday': {
    essential: { label: 'Essential (Standard)', price: '₹25,000', numericPrice: 25000, subtitle: 'Standard Editorial Session' },
    signature: { label: 'Signature Collection', price: '₹35,000', numericPrice: 35000, subtitle: 'Full-Day Shoot + Drone + Film' }
  }
};

// Engagement Add-On Tiers
const ENGAGEMENT_TIER_DATA = {
  essential: { label: 'Essential (Standard)', price: '₹25,000', numericPrice: 25000, subtitle: 'Standard Editorial & Candid Session' },
  signature: { label: 'Signature Collection', price: '₹35,000', numericPrice: 35000, subtitle: 'Full-Day Shoot + Drone + Cinematic Film' }
};

export default function Contact() {
  const [currentStep, setCurrentStep] = useState(1);
  const dateInputRef = useRef(null);
  const quickDateInputRef = useRef(null);

  const [quickCheckDate, setQuickCheckDate] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState(null); // null | 'checking' | 'available'

  const [formData, setFormData] = useState({
    name: '',
    spouseName: '',
    phone: '',
    sameWhatsapp: true,
    whatsapp: '',
    email: '',
    weddingDate: '',
    venue: '',
    eventType: 'Traditional Wedding',
    coverageType: 'Traditional Wedding Collection',
    coverageTier: 'signature',
    includeEngagement: false,
    engagementTier: 'signature',
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
  const [groomEvents, setGroomEvents] = useState([
    { id: 1, date: '', venue: '' },
    { id: 2, date: '', venue: '' },
    { id: 3, date: '', venue: '' }
  ]);

  const [brideEvents, setBrideEvents] = useState([
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

  // Groom Side Event Handlers
  const handleAddGroomEvent = () => {
    setGroomEvents((prev) => [
      ...prev,
      { id: prev.length + 1, date: '', venue: '' }
    ]);
  };

  const handleRemoveGroomEvent = (index) => {
    if (groomEvents.length <= 1) return;
    setGroomEvents((prev) => prev.filter((_, i) => i !== index));
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

  // Bride Side Event Handlers
  const handleAddBrideEvent = () => {
    setBrideEvents((prev) => [
      ...prev,
      { id: prev.length + 1, date: '', venue: '' }
    ]);
  };

  const handleRemoveBrideEvent = (index) => {
    if (brideEvents.length <= 1) return;
    setBrideEvents((prev) => prev.filter((_, i) => i !== index));
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
    setFormData((prev) => {
      const nextData = { ...prev, [field]: value };

      if (field === 'eventType') {
        if (value === 'Traditional Wedding') {
          nextData.coverageType = 'Traditional Wedding';
        } else if (value === 'Destination Wedding') {
          nextData.coverageType = 'Destination Wedding';
        } else if (['Pre Wedding', 'Engagement', 'Anniversary / Birthday'].includes(value)) {
          nextData.coverageType = 'Pre-Wedding & Engagement';
          nextData.includeEngagement = false;
        }
      }

      if (field === 'coverageType') {
        if (value === 'Traditional Wedding Collection' || value === 'Traditional Wedding') {
          nextData.eventType = 'Traditional Wedding';
        } else if (value === 'Destination Storytelling' || value === 'Destination Wedding') {
          nextData.eventType = 'Destination Wedding';
        } else if (value === 'Pre-Wedding & Intimate' || value === 'Pre-Wedding & Engagement') {
          if (!['Pre Wedding', 'Engagement', 'Anniversary / Birthday'].includes(nextData.eventType)) {
            nextData.eventType = 'Pre Wedding';
          }
          nextData.includeEngagement = false;
        }
      }

      const allowed = ['Traditional Wedding Collection', 'Destination Storytelling', 'Traditional Wedding', 'Destination Wedding'];
      const isAllowed = allowed.includes(nextData.coverageType) || allowed.includes(nextData.eventType);
      if (!isAllowed) {
        nextData.includeEngagement = false;
      }

      return nextData;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle Quick Date Availability Check
  const handleCheckAvailability = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!quickCheckDate) {
      if (quickDateInputRef.current) {
        quickDateInputRef.current.focus();
        if (typeof quickDateInputRef.current.showPicker === 'function') {
          quickDateInputRef.current.showPicker();
        }
      }
      return;
    }

    setAvailabilityStatus('checking');
    setTimeout(() => {
      setAvailabilityStatus('available');
      setFormData((prev) => ({
        ...prev,
        weddingDate: quickCheckDate
      }));
      setGroomEvents((prev) => {
        const updated = [...prev];
        if (!updated[0].date) updated[0].date = quickCheckDate;
        return updated;
      });
      setDestinationEvents((prev) => {
        const updated = [...prev];
        if (!updated[0].date) updated[0].date = quickCheckDate;
        return updated;
      });

      setTimeout(() => {
        const el = document.getElementById('contact-form-anchor');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }, 500);
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
      if (!formData.eventType) {
        newErrors.eventType = 'Please select an event type.';
      }
      if (!formData.coverageType) {
        newErrors.coverageType = 'Please select type of coverage.';
      }

      const isDestination = formData.coverageType === 'Destination Storytelling' || formData.eventType === 'Destination Wedding';
      const isTraditional = !isDestination && (formData.coverageType === 'Traditional Wedding Collection' || formData.eventType === 'Traditional Wedding');

      if (isDestination) {
        const hasAnyDestDate = destinationEvents.some((e) => !!e.date);
        if (!hasAnyDestDate) {
          newErrors['dest_date_0'] = 'Please select at least one wedding date.';
        }
      } else if (isTraditional) {
        const hasAnyGroomDate = groomEvents.some((e) => !!e.date);
        const hasAnyBrideDate = brideEvents.some((e) => !!e.date);
        if (!hasAnyGroomDate && !hasAnyBrideDate) {
          newErrors['groom_date_0'] = 'Please select at least one wedding date.';
        }
      } else {
        if (!formData.weddingDate) {
          newErrors.weddingDate = 'Please select your event date.';
        }
      }
    }

    if (step === 3) {
      if (!formData.message.trim()) {
        newErrors.message = 'Please share a few details about your celebration or vision.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate dynamic estimated total
  const calculateEstimatedTotal = () => {
    const pkg = PACKAGE_TIER_DATA[formData.coverageType || formData.eventType];
    const baseNumeric = pkg?.[formData.coverageTier]?.numericPrice || 0;
    const baseFormatted = pkg?.[formData.coverageTier]?.price || '₹0';
    
    let engagementNumeric = 0;
    let engagementFormatted = '';
    if (formData.includeEngagement) {
      const eng = ENGAGEMENT_TIER_DATA[formData.engagementTier || 'signature'];
      engagementNumeric = eng?.numericPrice || 35000;
      engagementFormatted = eng?.price || '₹35,000';
    }

    const totalNumeric = baseNumeric + engagementNumeric;
    const totalFormatted = `₹${totalNumeric.toLocaleString('en-IN')}`;

    return {
      baseNumeric,
      baseFormatted,
      engagementNumeric,
      engagementFormatted,
      totalNumeric,
      totalFormatted
    };
  };

  // Dynamic WhatsApp pre-filled message generator
  const getWhatsappMessage = () => {
    const isDestination = formData.coverageType === 'Destination Storytelling' || formData.eventType === 'Destination Wedding';
    const isTraditional = !isDestination && (formData.coverageType === 'Traditional Wedding Collection' || formData.eventType === 'Traditional Wedding');

    let datesStr = formData.weddingDate || 'TBD';
    if (isDestination) {
      const destDates = destinationEvents.filter(e => e.date).map((e, idx) => `Day ${idx + 1}: ${e.date}${e.venue ? ` (${e.venue})` : ''}`).join(', ');
      datesStr = destDates || 'TBD';
    } else if (isTraditional) {
      datesStr = `Groom Side: ${groomEvents.map((e) => e.date).filter(Boolean).join(', ') || 'TBD'} | Bride Side: ${brideEvents.map((e) => e.date).filter(Boolean).join(', ') || 'TBD'}`;
    }

    const costSummary = calculateEstimatedTotal();
    const engagementStr = formData.includeEngagement 
      ? `• Add-On: + Engagement Coverage (${formData.engagementTier === 'essential' ? 'Essential — ₹25,000' : 'Signature — ₹35,000'})\n` 
      : '';

    return encodeURIComponent(
      `Hello Chitra Weddings! ✨\n\nI just submitted an enquiry:\n• Name: ${formData.name}\n• Partner: ${formData.spouseName || 'N/A'}\n• Package: ${formData.coverageType || formData.eventType}\n• Tier: ${formData.coverageTier === 'signature' ? 'Signature' : 'Standard'} (${costSummary.baseFormatted})\n${engagementStr}• Estimated Total: ${costSummary.totalFormatted}*\n• Date(s): ${datesStr}\n• Venue: ${formData.venue || 'To be finalized'}\n• Phone: ${formData.phone}\n\nLooking forward to speaking with your team!`
    );
  };

  const handleNextStep = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1);
        setTimeout(() => {
          const el = document.getElementById('contact-form-anchor');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      } else {
        setIsSubmitting(true);
        const whatsappUrl = `https://wa.me/919090606813?text=${getWhatsappMessage()}`;
        
        // Auto-redirect to WhatsApp immediately right as they hit submit (no second click required)
        try {
          const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
          if (!win || win.closed || typeof win.closed === 'undefined') {
            window.location.href = whatsappUrl;
          }
        } catch {
          window.location.href = whatsappUrl;
        }

        setTimeout(() => {
          setIsSubmitting(false);
          setSubmitted(true);
          setTimeout(() => {
            const el = document.getElementById('contact-form-anchor');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 60);
        }, 700);
      }
    } else {
      setTimeout(() => {
        const errorEl = document.querySelector('.form-input--error, .form-error-msg');
        if (errorEl) {
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 60);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setTimeout(() => {
        const el = document.getElementById('contact-form-anchor');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  };

  return (
    <div className="page-content-wrapper">
      {/* CREATIVE VISUAL HERO BANNER */}
      <section className="contact-hero-banner">
        <motion.div
          className="contact-hero-frame"
          initial={{ opacity: 0.85, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            className="contact-hero-img"
            src="/assets/images/Below%20part%20of%20the%20Website.jpg.jpeg"
            alt="Chitra Weddings Royal Wedding Hero"
            loading="eager"
            decoding="async"
          />
        </motion.div>
        {/* Cinematic Gradient Overlay & Hero Content */}
        <div className="contact-hero-overlay">
          <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="contact-hero-title"
            >
              Let's Start Your <em>Journey</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="contact-hero-sub"
            >
              Your Love Story deserves to be told Beautifully. Share your dates, venue, and vision below.
            </motion.p>

            {/* CALENDAR AVAILABILITY CHECKER BAR */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ width: '100%' }}
            >
              <form onSubmit={handleCheckAvailability} className="contact-avail-checker">
                <div 
                  className="contact-avail-input-wrap"
                  onClick={() => {
                    if (quickDateInputRef.current) {
                      if (typeof quickDateInputRef.current.showPicker === 'function') {
                        quickDateInputRef.current.showPicker();
                      } else {
                        quickDateInputRef.current.focus();
                      }
                    }
                  }}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: quickCheckDate ? 'var(--brass)' : 'rgba(234, 229, 219, 0.85)', 
                    letterSpacing: '0.08em',
                    fontFamily: 'var(--sans)',
                    fontWeight: quickCheckDate ? 600 : 400
                  }}>
                    {quickCheckDate ? new Date(quickCheckDate + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Calendar'}
                  </span>

                  <input
                    ref={quickDateInputRef}
                    type="date"
                    value={quickCheckDate}
                    onChange={(e) => {
                      setQuickCheckDate(e.target.value);
                      if (availabilityStatus) setAvailabilityStatus(null);
                    }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                    aria-label="Select Wedding / Event Date"
                  />
                </div>
                <button type="submit" className="contact-avail-btn" style={{ position: 'relative', zIndex: 3 }}>
                  {availabilityStatus === 'checking' ? 'CHECKING...' : 'Check Availability'}
                </button>
              </form>

              {availabilityStatus === 'available' && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="contact-avail-status"
                >
                  <span>✨ <strong>Available!</strong> Your date ({quickCheckDate}) is open for booking. Fill your details below to lock it in.</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section id="contact-form-anchor" className="sec" style={{ paddingTop: '2.5rem', marginTop: '-3rem', position: 'relative', zIndex: 5 }}>
        <div className="container" style={{ maxWidth: '960px', margin: '0 auto' }}>

          {!submitted ? (
            <>
              {/* MULTI-STEP PROGRESS INDICATOR */}
              <div className="form-steps-nav">
                <div 
                  className={`step-indicator ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`} 
                  onClick={() => setCurrentStep(1)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="step-badge">{currentStep > 1 ? '✓' : '1'}</div>
                  <span className="step-title-lbl">Basic Details</span>
                </div>
                <div 
                  className={`step-indicator ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`} 
                  onClick={() => validateStep(1) && setCurrentStep(2)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="step-badge">{currentStep > 2 ? '✓' : '2'}</div>
                  <span className="step-title-lbl">Event Details</span>
                </div>
                <div 
                  className={`step-indicator ${currentStep === 3 ? 'active' : ''}`} 
                  onClick={() => validateStep(1) && validateStep(2) && setCurrentStep(3)}
                  style={{ cursor: 'pointer' }}
                >
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
                        <label htmlFor="spouseName" className="form-label">SPOUSE / PARTNER NAME (Optional)</label>
                        <input 
                          id="spouseName"
                          type="text" 
                          placeholder="Spouse / Partner Name"
                          value={formData.spouseName}
                          onChange={(e) => handleInputChange('spouseName', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    {/* 2-Col: Contact Number & WhatsApp Number */}
                    <div className="form-row-2col">
                      <div className="form-group">
                        <label htmlFor="phone" className="form-label">CONTACT NUMBER <span className="req-star">*</span></label>
                        <input 
                          id="phone"
                          type="tel" 
                          placeholder="9090606813"
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
                          placeholder="9090606813"
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
                      <p className="muted">Step 2 of 3 — Tell us about your wedding dates, venues, coverage type required.</p>
                    </div>

                    {/* 1. EVENT TYPE */}
                    <div className="form-group">
                      <label htmlFor="eventType" className="form-label">EVENT TYPE <span className="req-star">*</span></label>
                      <select 
                        id="eventType"
                        value={formData.eventType}
                        onChange={(e) => handleInputChange('eventType', e.target.value)}
                        className={`form-select ${errors.eventType ? 'form-input--error' : ''}`}
                      >
                        <option value="" disabled hidden>Select Event Type...</option>
                        <option value="Traditional Wedding">Traditional Wedding (Multi-Day)</option>
                        <option value="Destination Wedding">Destination Wedding</option>
                        <option value="Pre Wedding">Pre Wedding</option>
                        <option value="Engagement">Engagement</option>
                        <option value="Anniversary / Birthday">Anniversary / Birthday</option>
                      </select>
                      {errors.eventType && <span className="form-error-msg">{errors.eventType}</span>}
                    </div>

                    {/* 2. TYPE OF COVERAGE */}
                    <div className="form-group">
                      <label htmlFor="coverageType" className="form-label">TYPE OF COVERAGE <span className="req-star">*</span></label>
                      <select 
                        id="coverageType"
                        value={formData.coverageType || ''}
                        onChange={(e) => handleInputChange('coverageType', e.target.value)}
                        className={`form-select ${errors.coverageType ? 'form-input--error' : ''}`}
                      >
                        <option value="" disabled hidden>Select Type of Coverage...</option>
                        <option value="Traditional Wedding">Traditional Wedding</option>
                        <option value="Destination Wedding">Destination Wedding</option>
                        <option value="Pre-Wedding &amp; Engagement">Pre-Wedding &amp; Engagement</option>
                      </select>
                      {errors.coverageType && <span className="form-error-msg">{errors.coverageType}</span>}
                    </div>

                    {/* 3. TIER & PRICE SELECTION BOX */}
                    {(formData.coverageType || formData.eventType) && PACKAGE_TIER_DATA[formData.coverageType || formData.eventType] && (
                      <motion.div 
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(234, 229, 219, 0.12)',
                          borderRadius: '12px',
                          padding: '1.2rem',
                          marginBottom: '1.2rem'
                        }}
                      >
                        <div style={{ marginBottom: '0.85rem' }}>
                          <label className="form-label" style={{ margin: 0 }}>
                            PACKAGE TIER &amp; PRICING <span className="req-star">*</span>
                          </label>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                          {/* Essential / Standard Card */}
                          <button
                            type="button"
                            onClick={() => handleInputChange('coverageTier', 'essential')}
                            style={{
                              background: formData.coverageTier === 'essential' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(10, 10, 11, 0.6)',
                              border: formData.coverageTier === 'essential' ? '1.5px solid var(--brass)' : '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '10px',
                              padding: '1rem',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                <span style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--bone-70)', fontWeight: 600 }}>
                                  STANDARD / ESSENTIAL
                                </span>
                                {formData.coverageTier === 'essential' && (
                                  <span style={{ fontSize: '0.72rem', color: 'var(--brass)', fontWeight: 700 }}>✓ ACTIVE</span>
                                )}
                              </div>
                              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.45rem', color: 'var(--bone)', fontWeight: 600 }}>
                                {PACKAGE_TIER_DATA[formData.coverageType || formData.eventType].essential.price}
                              </div>
                            </div>
                            <span style={{ fontSize: '0.68rem', color: 'rgba(234, 229, 219, 0.65)', marginTop: '0.45rem' }}>
                              {PACKAGE_TIER_DATA[formData.coverageType || formData.eventType].essential.subtitle}
                            </span>
                          </button>

                          {/* Signature Card */}
                          <button
                            type="button"
                            onClick={() => handleInputChange('coverageTier', 'signature')}
                            style={{
                              background: formData.coverageTier === 'signature' ? 'rgba(212, 175, 55, 0.16)' : 'rgba(10, 10, 11, 0.6)',
                              border: formData.coverageTier === 'signature' ? '1.5px solid var(--brass)' : '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '10px',
                              padding: '1rem',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                <span style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brass)', fontWeight: 600 }}>
                                  SIGNATURE ★
                                </span>
                                {formData.coverageTier === 'signature' && (
                                  <span style={{ fontSize: '0.72rem', color: 'var(--brass)', fontWeight: 700 }}>✓ ACTIVE</span>
                                )}
                              </div>
                              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.45rem', color: 'var(--brass)', fontWeight: 600 }}>
                                {PACKAGE_TIER_DATA[formData.coverageType || formData.eventType].signature.price}
                              </div>
                            </div>
                            <span style={{ fontSize: '0.68rem', color: 'rgba(234, 229, 219, 0.65)', marginTop: '0.45rem' }}>
                              {PACKAGE_TIER_DATA[formData.coverageType || formData.eventType].signature.subtitle}
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Optional Engagement Add-On Selection Card with Tier Options */}
                    {(
                      ['Traditional Wedding Collection', 'Destination Storytelling', 'Traditional Wedding', 'Destination Wedding'].includes(formData.coverageType) ||
                      ['Traditional Wedding Collection', 'Destination Storytelling', 'Traditional Wedding', 'Destination Wedding'].includes(formData.eventType)
                    ) && (
                      <div 
                        style={{ 
                          background: formData.includeEngagement ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255, 255, 255, 0.02)', 
                          border: formData.includeEngagement ? '1.5px solid rgba(212, 175, 55, 0.45)' : '1px solid rgba(234, 229, 219, 0.12)', 
                          borderRadius: '12px', 
                          padding: '1.05rem 1.25rem', 
                          marginTop: '0.6rem',
                          marginBottom: '1.2rem',
                          transition: 'all 0.25s ease'
                        }}
                      >
                        {/* Header with toggle */}
                        <div 
                          onClick={() => handleInputChange('includeEngagement', !formData.includeEngagement)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <input 
                              type="checkbox"
                              checked={!!formData.includeEngagement}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleInputChange('includeEngagement', e.target.checked);
                              }}
                              className="checkbox-input"
                              style={{ cursor: 'pointer', accentColor: 'var(--brass)', width: '18px', height: '18px' }}
                            />
                            <div>
                              <div style={{ fontSize: '0.92rem', color: 'var(--bone)', fontWeight: 500, letterSpacing: '0.02em' }}>
                                Add Engagement Ceremony Coverage
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--bone-70)' }}>
                                Optional Add-On: Pre-wedding shoot, ring ceremony &amp; editorial session
                              </div>
                            </div>
                          </div>
                          <span style={{ 
                            fontSize: '0.68rem', 
                            letterSpacing: '0.12em', 
                            textTransform: 'uppercase', 
                            background: formData.includeEngagement ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)', 
                            color: formData.includeEngagement ? 'var(--brass)' : 'var(--bone-70)', 
                            padding: '0.25rem 0.65rem', 
                            borderRadius: '99px', 
                            fontWeight: 600,
                            flexShrink: 0
                          }}>
                            {formData.includeEngagement ? '✓ Added' : '+ Add Coverage'}
                          </span>
                        </div>

                        {/* Expandable Engagement Tier Selection when checked */}
                        <AnimatePresence>
                          {formData.includeEngagement && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.28 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{ borderTop: '1px solid rgba(234, 229, 219, 0.08)', marginTop: '0.85rem', paddingTop: '0.85rem' }}>
                                <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '0.55rem', fontWeight: 600 }}>
                                  Select Engagement Coverage Tier:
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
                                  {/* Essential 25k */}
                                  <button
                                    type="button"
                                    onClick={() => handleInputChange('engagementTier', 'essential')}
                                    style={{
                                      background: formData.engagementTier === 'essential' ? 'rgba(212, 175, 55, 0.14)' : 'rgba(10, 10, 11, 0.6)',
                                      border: formData.engagementTier === 'essential' ? '1.5px solid var(--brass)' : '1px solid rgba(255, 255, 255, 0.08)',
                                      borderRadius: '8px',
                                      padding: '0.75rem 0.9rem',
                                      textAlign: 'left',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                      <span style={{ fontSize: '0.66rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--bone-70)', fontWeight: 600 }}>
                                        ESSENTIAL
                                      </span>
                                      {formData.engagementTier === 'essential' && (
                                        <span style={{ fontSize: '0.68rem', color: 'var(--brass)', fontWeight: 700 }}>✓ ACTIVE</span>
                                      )}
                                    </div>
                                    <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--bone)', fontWeight: 600 }}>
                                      ₹25,000
                                    </div>
                                    <div style={{ fontSize: '0.67rem', color: 'rgba(234, 229, 219, 0.65)', marginTop: '0.2rem' }}>
                                      Standard Editorial &amp; Candid Session
                                    </div>
                                  </button>

                                  {/* Signature 35k */}
                                  <button
                                    type="button"
                                    onClick={() => handleInputChange('engagementTier', 'signature')}
                                    style={{
                                      background: (formData.engagementTier === 'signature' || !formData.engagementTier) ? 'rgba(212, 175, 55, 0.18)' : 'rgba(10, 10, 11, 0.6)',
                                      border: (formData.engagementTier === 'signature' || !formData.engagementTier) ? '1.5px solid var(--brass)' : '1px solid rgba(255, 255, 255, 0.08)',
                                      borderRadius: '8px',
                                      padding: '0.75rem 0.9rem',
                                      textAlign: 'left',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                      <span style={{ fontSize: '0.66rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brass)', fontWeight: 600 }}>
                                        SIGNATURE ★
                                      </span>
                                      {(formData.engagementTier === 'signature' || !formData.engagementTier) && (
                                        <span style={{ fontSize: '0.68rem', color: 'var(--brass)', fontWeight: 700 }}>✓ ACTIVE</span>
                                      )}
                                    </div>
                                    <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--brass)', fontWeight: 600 }}>
                                      ₹35,000
                                    </div>
                                    <div style={{ fontSize: '0.67rem', color: 'rgba(234, 229, 219, 0.65)', marginTop: '0.2rem' }}>
                                      Full-Day Shoot + Drone + Cinematic Film
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* OVERALL COST / INVESTMENT BOX WITH * MARK */}
                    {(() => {
                      const costSummary = calculateEstimatedTotal();
                      return (
                        <div 
                          style={{
                            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(10, 10, 11, 0.75) 100%)',
                            border: '1px solid rgba(212, 175, 55, 0.35)',
                            borderRadius: '12px',
                            padding: '1.1rem 1.35rem',
                            marginBottom: '1.4rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.5rem' }}>
                            <div>
                              <span style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brass)', fontWeight: 600 }}>
                                ESTIMATED OVERALL INVESTMENT
                              </span>
                              <div style={{ fontSize: '0.78rem', color: 'var(--bone-70)', marginTop: '0.2rem' }}>
                                {formData.coverageType || formData.eventType} ({formData.coverageTier === 'signature' ? 'Signature Tier' : 'Standard Tier'}: {costSummary.baseFormatted})
                                {formData.includeEngagement && ` + Engagement (${formData.engagementTier === 'essential' ? 'Essential: ₹25,000' : 'Signature: ₹35,000'})`}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.5rem, 3.2vw, 2rem)', color: 'var(--brass)', fontWeight: 600, lineHeight: 1.05 }}>
                                {costSummary.totalFormatted}*
                              </div>
                              <span style={{ fontSize: '0.66rem', color: 'rgba(234, 229, 219, 0.65)' }}>
                                Indicative Estimate
                              </span>
                            </div>
                          </div>
                          <div style={{ borderTop: '1px solid rgba(234, 229, 219, 0.08)', paddingTop: '0.45rem', marginTop: '0.35rem' }}>
                            <p style={{ margin: 0, fontSize: '0.69rem', color: 'rgba(234, 229, 219, 0.6)', lineHeight: 1.45, fontStyle: 'italic' }}>
                              *Note: Prices are indicative estimates. Final quotation may vary depending on customized deliverables, multi-city travel logistics, and personalized itinerary requests.
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* DYNAMIC EVENT BREAKDOWN */}
                    {(formData.coverageType === 'Destination Storytelling' || formData.eventType === 'Destination Wedding') ? (
                      /* DESTINATION WEDDING: 2 DEFAULT EVENT BOXES (DAY 1 & DAY 2) */
                      <div className="traditional-side-card" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(234, 229, 219, 0.12)', borderRadius: '12px', padding: '1.25rem 1.4rem', marginTop: '1.2rem', marginBottom: '1.6rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(234, 229, 219, 0.08)', paddingBottom: '0.6rem' }}>
                          <div>
                            <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', color: 'var(--brass)', margin: 0, fontWeight: 500 }}>
                              Destination Celebration Itinerary
                            </h4>
                            <span style={{ fontSize: '0.72rem', color: 'var(--bone-70)' }}>
                              2-Day Destination Wedding Schedule (Date &amp; Venue for each day)
                            </span>
                          </div>
                          <span style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(212, 175, 55, 0.12)', color: 'var(--brass)', padding: '0.25rem 0.65rem', borderRadius: '99px', fontWeight: 600 }}>
                            Destination Wedding
                          </span>
                        </div>

                        {destinationEvents.map((item, index) => (
                          <div key={`dest-${index}`} style={{ background: 'rgba(10, 10, 11, 0.6)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '8px', padding: '0.95rem 1rem', marginBottom: index === destinationEvents.length - 1 ? 0 : '0.9rem' }}>
                            <div style={{ fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--bone)', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>
                                Day {index + 1} {index === 0 ? '— Welcome / Sangeet / Mehendi' : index === 1 ? '— Main Wedding & Reception' : '— Celebration'}
                              </span>
                              {destinationEvents.length > 1 && (
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveDestinationEvent(index)}
                                  style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.72rem' }}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.8rem' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.67rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--bone-70)', marginBottom: '0.35rem' }}>
                                  Event Date <span className="req-star">*</span>
                                </label>
                                <input 
                                  type="date"
                                  value={item.date}
                                  onChange={(e) => handleDestinationEventChange(index, 'date', e.target.value)}
                                  className={`form-input ${errors[`dest_date_${index}`] ? 'form-input--error' : ''}`}
                                  style={{ colorScheme: 'dark', cursor: 'pointer' }}
                                />
                                {errors[`dest_date_${index}`] && <span className="form-error-msg">{errors[`dest_date_${index}`]}</span>}
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.67rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--bone-70)', marginBottom: '0.35rem' }}>
                                  Venue / Resort Location
                                </label>
                                <input 
                                  type="text"
                                  placeholder="e.g. The Oberoi Udaivilas, Udaipur / Goa Beach Resort"
                                  value={item.venue}
                                  onChange={(e) => handleDestinationEventChange(index, 'venue', e.target.value)}
                                  className="form-input"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button 
                          type="button" 
                          onClick={handleAddDestinationEvent}
                          style={{ marginTop: '0.85rem', background: 'transparent', border: '1px dashed rgba(212, 175, 55, 0.4)', color: 'var(--brass)', padding: '0.45rem 0.9rem', borderRadius: '6px', fontSize: '0.76rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          + Add Day
                        </button>
                      </div>
                    ) : (formData.coverageType === 'Traditional Wedding Collection' || formData.eventType === 'Traditional Wedding') ? (
                      <>
                        {/* 1. GROOM'S SIDE AREA (3 DEFAULT EVENT BOXES) */}
                        <div className="traditional-side-card" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(234, 229, 219, 0.12)', borderRadius: '12px', padding: '1.25rem 1.4rem', marginTop: '1.2rem', marginBottom: '1.6rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(234, 229, 219, 0.08)', paddingBottom: '0.6rem' }}>
                            <div>
                              <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', color: 'var(--brass)', margin: 0, fontWeight: 500 }}>
                                Groom's Side Celebrations
                              </h4>
                              <span style={{ fontSize: '0.72rem', color: 'var(--bone-70)' }}>
                                3 Days of Coverage (Date &amp; Venue for each day)
                              </span>
                            </div>
                            <span style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(212, 175, 55, 0.12)', color: 'var(--brass)', padding: '0.25rem 0.65rem', borderRadius: '99px', fontWeight: 600 }}>
                              Groom's Side (3 Days)
                            </span>
                          </div>

                          {groomEvents.map((item, index) => (
                            <div key={`groom-${index}`} style={{ background: 'rgba(10, 10, 11, 0.6)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '8px', padding: '0.95rem 1rem', marginBottom: index === groomEvents.length - 1 ? 0 : '0.9rem' }}>
                              <div style={{ fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--bone)', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>
                                  Day {index + 1} (Groom Side) {index === 0 ? '— Haldi / Mehendi' : index === 1 ? '— Sangeet / Tilak' : index === 2 ? '— Barat / Reception' : '— Celebration'}
                                </span>
                                {groomEvents.length > 1 && (
                                  <button 
                                    type="button" 
                                    onClick={() => handleRemoveGroomEvent(index)}
                                    style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.72rem' }}
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.8rem' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.67rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--bone-70)', marginBottom: '0.35rem' }}>
                                    Date <span className="req-star">*</span>
                                  </label>
                                  <input 
                                    type="date"
                                    value={item.date}
                                    onChange={(e) => handleGroomEventChange(index, 'date', e.target.value)}
                                    className={`form-input ${errors[`groom_date_${index}`] ? 'form-input--error' : ''}`}
                                    style={{ colorScheme: 'dark', cursor: 'pointer' }}
                                  />
                                  {errors[`groom_date_${index}`] && <span className="form-error-msg">{errors[`groom_date_${index}`]}</span>}
                                </div>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.67rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--bone-70)', marginBottom: '0.35rem' }}>
                                    Venue / Location
                                  </label>
                                  <input 
                                    type="text"
                                    placeholder="e.g. Hotel Grand, Groom's City"
                                    value={item.venue}
                                    onChange={(e) => handleGroomEventChange(index, 'venue', e.target.value)}
                                    className="form-input"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          <button 
                            type="button" 
                            onClick={handleAddGroomEvent}
                            style={{ marginTop: '0.85rem', background: 'transparent', border: '1px dashed rgba(212, 175, 55, 0.4)', color: 'var(--brass)', padding: '0.45rem 0.9rem', borderRadius: '6px', fontSize: '0.76rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                          >
                            + Add Groom Event
                          </button>
                        </div>

                        {/* 2. BRIDE'S SIDE AREA (2 DEFAULT EVENT BOXES) */}
                        <div className="traditional-side-card" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(234, 229, 219, 0.12)', borderRadius: '12px', padding: '1.25rem 1.4rem', marginBottom: '1.6rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(234, 229, 219, 0.08)', paddingBottom: '0.6rem' }}>
                            <div>
                              <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', color: 'var(--brass)', margin: 0, fontWeight: 500 }}>
                                Bride's Side Celebrations
                              </h4>
                              <span style={{ fontSize: '0.72rem', color: 'var(--bone-70)' }}>
                                2 Days of Coverage (Date &amp; Venue for each day)
                              </span>
                            </div>
                            <span style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(212, 175, 55, 0.12)', color: 'var(--brass)', padding: '0.25rem 0.65rem', borderRadius: '99px', fontWeight: 600 }}>
                              Bride's Side (2 Days)
                            </span>
                          </div>

                          {brideEvents.map((item, index) => (
                            <div key={`bride-${index}`} style={{ background: 'rgba(10, 10, 11, 0.6)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '8px', padding: '0.95rem 1rem', marginBottom: index === brideEvents.length - 1 ? 0 : '0.9rem' }}>
                              <div style={{ fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--bone)', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>
                                  Day {index + 1} (Bride Side) {index === 0 ? '— Haldi / Mehendi / Sangeet' : index === 1 ? '— Main Wedding & Vidai' : '— Celebration'}
                                </span>
                                {brideEvents.length > 1 && (
                                  <button 
                                    type="button" 
                                    onClick={() => handleRemoveBrideEvent(index)}
                                    style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.72rem' }}
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.8rem' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.67rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--bone-70)', marginBottom: '0.35rem' }}>
                                    Date <span className="req-star">*</span>
                                  </label>
                                  <input 
                                    type="date"
                                    value={item.date}
                                    onChange={(e) => handleBrideEventChange(index, 'date', e.target.value)}
                                    className={`form-input ${errors[`bride_date_${index}`] ? 'form-input--error' : ''}`}
                                    style={{ colorScheme: 'dark', cursor: 'pointer' }}
                                  />
                                  {errors[`bride_date_${index}`] && <span className="form-error-msg">{errors[`bride_date_${index}`]}</span>}
                                </div>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.67rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--bone-70)', marginBottom: '0.35rem' }}>
                                    Venue / Location
                                  </label>
                                  <input 
                                    type="text"
                                    placeholder="e.g. Royal Palace, Bride's City"
                                    value={item.venue}
                                    onChange={(e) => handleBrideEventChange(index, 'venue', e.target.value)}
                                    className="form-input"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          <button 
                            type="button" 
                            onClick={handleAddBrideEvent}
                            style={{ marginTop: '0.85rem', background: 'transparent', border: '1px dashed rgba(212, 175, 55, 0.4)', color: 'var(--brass)', padding: '0.45rem 0.9rem', borderRadius: '6px', fontSize: '0.76rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                          >
                            + Add Bride Event
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* STANDARD EVENT DATE & VENUE FOR OTHER SELECTIONS */}
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                          <label htmlFor="weddingDate" className="form-label">Event / Wedding Date <span className="req-star">*</span></label>
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

                        <div className="form-group">
                          <label htmlFor="venue" className="form-label">Venue / Location (If Finalized)</label>
                          <input 
                            id="venue"
                            type="text" 
                            placeholder="e.g. Swosti Premium, Bhubaneswar / Taj Lake Palace, Udaipur"
                            value={formData.venue}
                            onChange={(e) => handleInputChange('venue', e.target.value)}
                            className="form-input"
                          />
                        </div>
                      </>
                    )}
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
                        <span className="spinner-dot" /> SENDING ENQUIRY...
                      </span>
                    ) : currentStep === 3 ? (
                      'SEND ENQUIRY →'
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
              <div className="thankyou-badge">ENQUIRY RECEIVED</div>

              <h2 className="display thankyou-title">
                Thank <em>You!</em>
              </h2>

              <p className="thankyou-msg">
                We'll get back soon. Our team will contact you shortly.
              </p>

              {/* Submission Summary Box */}
              <div className="thankyou-summary">
                <div className="summary-item">
                  <span className="summary-label">Name</span>
                  <span className="summary-val">{formData.name}</span>
                </div>
                {formData.spouseName && (
                  <div className="summary-item">
                    <span className="summary-label">Spouse / Partner</span>
                    <span className="summary-val">{formData.spouseName}</span>
                  </div>
                )}
                <div className="summary-item">
                  <span className="summary-label">Contact / WhatsApp</span>
                  <span className="summary-val">
                    {formData.phone}
                    {!formData.sameWhatsapp && formData.whatsapp && formData.whatsapp !== formData.phone ? ` (WhatsApp: ${formData.whatsapp})` : ''}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Email</span>
                  <span className="summary-val">{formData.email}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Event Date(s)</span>
                  <span className="summary-val">
                    {(formData.coverageType === 'Destination Storytelling' || formData.eventType === 'Destination Wedding') ? (
                      <>
                        {destinationEvents.filter(e => e.date).length > 0 ? (
                          destinationEvents.filter(e => e.date).map((e, idx) => (
                            <div key={idx}>Day {idx + 1}: {e.date}{e.venue ? ` (${e.venue})` : ''}</div>
                          ))
                        ) : (
                          'To Be Finalized'
                        )}
                      </>
                    ) : (formData.coverageType === 'Traditional Wedding Collection' || formData.eventType === 'Traditional Wedding') ? (
                      <>
                        {groomEvents.filter(e => e.date).length > 0 && (
                          <div>Groom Side: {groomEvents.filter(e => e.date).map(e => `${e.date}${e.venue ? ` (${e.venue})` : ''}`).join(', ')}</div>
                        )}
                        {brideEvents.filter(e => e.date).length > 0 && (
                          <div>Bride Side: {brideEvents.filter(e => e.date).map(e => `${e.date}${e.venue ? ` (${e.venue})` : ''}`).join(', ')}</div>
                        )}
                        {groomEvents.filter(e => e.date).length === 0 && brideEvents.filter(e => e.date).length === 0 && 'To Be Finalized'}
                      </>
                    ) : (
                      formData.weddingDate || 'To Be Finalized'
                    )}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Selected Collection &amp; Investment</span>
                  <span className="summary-val">
                    {(() => {
                      const costSummary = calculateEstimatedTotal();
                      return (
                        <>
                          <div>
                            {formData.coverageType || formData.eventType} ({formData.coverageTier === 'signature' ? 'Signature' : 'Standard'} — {costSummary.baseFormatted})
                          </div>
                          {formData.includeEngagement && (
                            <div style={{ color: 'var(--brass)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                              + Engagement Coverage ({formData.engagementTier === 'essential' ? 'Essential — ₹25,000' : 'Signature — ₹35,000'})
                            </div>
                          )}
                          <div style={{ marginTop: '0.35rem', fontWeight: 600, color: 'var(--brass)', fontSize: '0.96rem' }}>
                            Estimated Total: {costSummary.totalFormatted}*
                          </div>
                        </>
                      );
                    })()}
                  </span>
                </div>
              </div>

              {/* Action Buttons: PDF Download & WhatsApp */}
              <div className="thankyou-actions">
                <a 
                  href="assets/pdf/Chitra_Weddings_Guide.pdf" 
                  download="Chitra_Weddings_Guide.pdf" 
                  className="btn btn-pdf-download"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '17px', height: '17px', flexShrink: 0 }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  <span>Download Free Wedding Guide</span>
                </a>

                <a 
                  href={`https://wa.me/919090606813?text=${getWhatsappMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp-chat"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '17px', height: '17px', flexShrink: 0 }}>
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                  <span>Chat on WhatsApp</span>
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
