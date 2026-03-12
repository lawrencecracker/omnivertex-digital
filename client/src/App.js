import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// API Base URL
const API_URL = 'http://localhost:3001/api';

// Load Stripe (use test key - replace with your actual key in production)
const stripePromise = loadStripe('pk_test_placeholder');

// Service Categories
const CATEGORIES = ['All', 'Development', 'Infrastructure', 'Computing', 'Design', 'Marketing'];

function App() {
  // State
  const [view, setView] = useState('home');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    features: [],
    pages: '',
    platforms: [],
    additionalRequirements: '',
    requirements: '',
    budget: '',
    timeline: ''
  });
  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Payment & Request States
  const [pendingRequest, setPendingRequest] = useState(null);
  const [userRequestId, setUserRequestId] = useState(null);
  const [userRequest, setUserRequest] = useState(null);
  const [adminRequests, setAdminRequests] = useState([]);
  const [adminStats, setAdminStats] = useState(null);

  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Filter services
  useEffect(() => {
    let result = services;
    
    if (selectedCategory !== 'All') {
      result = result.filter(service => service.category === selectedCategory);
    }
    
    setFilteredServices(result);
  }, [services, selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, testimonialsRes, companyRes] = await Promise.all([
        fetch(`${API_URL}/services`),
        fetch(`${API_URL}/testimonials`),
        fetch(`${API_URL}/company`)
      ]);
      
      const servicesData = await servicesRes.json();
      const testimonialsData = await testimonialsRes.json();
      const companyData = await companyRes.json();
      
      setServices(servicesData);
      setFilteredServices(servicesData);
      setTestimonials(testimonialsData);
      setCompanyInfo(companyData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceRequest = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    try {
      const response = await fetch(`${API_URL}/service-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          ...requestForm
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPendingRequest({
          id: data.requestId,
          amount: data.amount,
          serviceName: data.serviceName
        });
        setFormSuccess('Request submitted! Please complete payment.');
        setView('payment');
      } else {
        setFormError(data.error || 'Failed to submit request');
      }
    } catch (error) {
      setFormError('Network error. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await fetch(`${API_URL}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: pendingRequest.id,
          paymentStatus: 'paid'
        })
      });
      
      setUserRequestId(pendingRequest.id);
      setView('request-status');
      setFormSuccess('Payment successful! Your service is now in queue.');
    } catch (error) {
      console.error('Payment confirmation error:', error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFormSuccess('Message sent successfully! We will get back to you soon.');
        setContactForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setFormError(data.error || 'Failed to send message');
      }
    } catch (error) {
      setFormError('Network error. Please try again.');
    }
  };

  const openServiceDetail = (service) => {
    setSelectedService(service);
    setView('service-detail');
  };

  const requestService = (service) => {
    setSelectedService(service);
    setView('request');
  };

  const checkRequestStatus = async (e) => {
    e.preventDefault();
    if (!userRequestId) return;
    
    try {
      const response = await fetch(`${API_URL}/requests/${userRequestId}`);
      const data = await response.json();
      if (response.ok) {
        setUserRequest(data);
        setView('request-status');
      } else {
        setFormError(data.error || 'Request not found');
      }
    } catch (error) {
      setFormError('Error checking status');
    }
  };

  // Admin functions
  const fetchAdminData = async () => {
    try {
      const [requestsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/admin/requests`),
        fetch(`${API_URL}/admin/stats`)
      ]);
      
      const requestsData = await requestsRes.json();
      const statsData = await statsRes.json();
      
      setAdminRequests(requestsData);
      setAdminStats(statsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      await fetch(`${API_URL}/admin/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchAdminData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Render Functions
  const renderHeader = () => (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => setView('home')}>
          <div className="logo-icon">◇</div>
          <span className="logo-text">OmniVertex</span>
          <span className="logo-tag">Digital</span>
        </div>
        
        <nav className="nav">
          <button 
            className={`nav-btn ${view === 'home' ? 'active' : ''}`}
            onClick={() => setView('home')}
          >
            Home
          </button>
          <button 
            className={`nav-btn ${view === 'services' ? 'active' : ''}`}
            onClick={() => setView('services')}
          >
            Services
          </button>
          <button 
            className={`nav-btn ${view === 'about' ? 'active' : ''}`}
            onClick={() => setView('about')}
          >
            About
          </button>
          <button 
            className={`nav-btn ${view === 'contact' ? 'active' : ''}`}
            onClick={() => setView('contact')}
          >
            Contact
          </button>
          <button 
            className={`nav-btn ${view === 'check-status' ? 'active' : ''}`}
            onClick={() => setView('check-status')}
          >
            Check Status
          </button>
          <button 
            className={`nav-btn admin-btn ${view === 'admin' ? 'active' : ''}`}
            onClick={() => { fetchAdminData(); setView('admin'); }}
          >
            Admin
          </button>
        </nav>

        <button className="btn btn-primary" onClick={() => setView('services')}>
          Get Started
        </button>
      </div>
    </header>
  );

  const renderHero = () => (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-icon">✨</span>
          One Platform. Infinite Possibilities.
        </div>
        <h1 className="hero-title">
          All Your Digital Needs,
          <span className="hero-gradient"> One Platform</span>
        </h1>
        <p className="hero-subtitle">
          Welcome to OmniVertex Digital - your comprehensive solution for every digital service. 
          From web development to cloud infrastructure, we provide everything you need to succeed 
          online - no more running between multiple vendors.
        </p>
        
        <div className="hero-actions">
          <button className="btn btn-primary btn-large" onClick={() => setView('services')}>
            Explore Services
            <span className="btn-arrow">→</span>
          </button>
          <button className="btn btn-secondary btn-large" onClick={() => setView('contact')}>
            Talk to Us
          </button>
        </div>

        <div className="hero-features">
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>10+ Digital Services</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>24/7 Support</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>One-Stop Solution</span>
          </div>
        </div>
      </div>
      
      <div className="hero-visual">
        <div className="floating-card card-1">
          <span className="card-icon">🌐</span>
          <span>Web Development</span>
        </div>
        <div className="floating-card card-2">
          <span className="card-icon">☁️</span>
          <span>Cloud Hosting</span>
        </div>
        <div className="floating-card card-3">
          <span className="card-icon">🗄️</span>
          <span>Database</span>
        </div>
        <div className="floating-card card-4">
          <span className="card-icon">🎨</span>
          <span>Rendering</span>
        </div>
      </div>
    </section>
  );

  const renderServicesPreview = () => {
    const popularServices = services.filter(s => s.popular);
    
    return (
      <section className="services-preview">
        <div className="section-header">
          <span className="section-tag">Our Services</span>
          <h2 className="section-title">Everything You Need in One Place</h2>
          <p className="section-subtitle">
            From concept to deployment, we've got you covered with our comprehensive suite of digital services.
          </p>
        </div>
        
        <div className="services-grid">
          {popularServices.map(service => (
            <div key={service.id} className="service-card" onClick={() => openServiceDetail(service)}>
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-name">{service.name}</h3>
              <p className="service-description">{service.shortDescription}</p>
              <div className="service-footer">
                <span className="service-price">{service.pricing}</span>
                <span className="service-learn">Learn more →</span>
              </div>
              {service.popular && <span className="popular-badge">Popular</span>}
            </div>
          ))}
        </div>
        
        <div className="section-cta">
          <button className="btn btn-secondary" onClick={() => setView('services')}>
            View All Services
          </button>
        </div>
      </section>
    );
  };

  const renderWhyChooseUs = () => (
    <section className="why-choose-us">
      <div className="section-header">
        <span className="section-tag">Why OmniVertex</span>
        <h2 className="section-title">Your Trusted Digital Partner</h2>
      </div>
      
      <div className="benefits-grid">
        <div className="benefit-card">
          <div className="benefit-icon">🎯</div>
          <h3>One-Stop Solution</h3>
          <p>No more juggling multiple vendors. Get all your digital services from a single, trusted platform.</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">⚡</div>
          <h3>Fast Turnaround</h3>
          <p>Quick project delivery with efficient workflows and dedicated support teams.</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">💰</div>
          <h3>Competitive Pricing</h3>
          <p>Transparent pricing with no hidden fees. Get the best value for your investment.</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">🛡️</div>
          <h3>Reliable Support</h3>
          <p>24/7 customer support to help you with any issues, big or small.</p>
        </div>
      </div>
    </section>
  );

  const renderTestimonials = () => (
    <section className="testimonials">
      <div className="section-header">
        <span className="section-tag">Testimonials</span>
        <h2 className="section-title">What Our Clients Say</h2>
      </div>
      
      <div className="testimonials-grid">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-stars">
              {'★'.repeat(testimonial.rating)}
            </div>
            <p className="testimonial-message">"{testimonial.message}"</p>
            <div className="testimonial-author">
              <div className="author-avatar">{testimonial.name.charAt(0)}</div>
              <div className="author-info">
                <span className="author-name">{testimonial.name}</span>
                <span className="author-company">{testimonial.company}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderServicesView = () => (
    <div className="services-view">
      <div className="services-header">
        <h1 className="page-title">Our Services</h1>
        <p className="page-subtitle">
          Explore our comprehensive range of digital services tailored to meet all your business needs.
        </p>
      </div>
      
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="services-grid large">
        {filteredServices.map(service => (
          <div key={service.id} className="service-card" onClick={() => openServiceDetail(service)}>
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-name">{service.name}</h3>
            <p className="service-description">{service.shortDescription}</p>
            <div className="service-footer">
              <span className="service-price">{service.pricing}</span>
              <span className="service-category">{service.category}</span>
            </div>
            {service.popular && <span className="popular-badge">Popular</span>}
          </div>
        ))}
      </div>
    </div>
  );

  const renderServiceDetail = () => (
    <div className="service-detail-view">
      <button className="btn btn-back" onClick={() => setView('services')}>
        ← Back to Services
      </button>
      
      <div className="service-detail">
        <div className="service-detail-header">
          <div className="service-detail-icon">{selectedService.icon}</div>
          <div className="service-detail-info">
            <span className="service-detail-category">{selectedService.category}</span>
            <h1 className="service-detail-name">{selectedService.name}</h1>
            <p className="service-detail-price">{selectedService.pricing}</p>
          </div>
          {selectedService.popular && <span className="popular-badge large">Most Popular</span>}
        </div>
        
        <div className="service-detail-content">
          <div className="service-detail-description">
            <h2>About This Service</h2>
            <p>{selectedService.fullDescription}</p>
          </div>
          
          <div className="service-features">
            <h2>What's Included</h2>
            <ul className="features-list">
              {selectedService.features.map((feature, index) => (
                <li key={index}>
                  <span className="feature-check">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="service-detail-action">
          <button className="btn btn-primary btn-large" onClick={() => requestService(selectedService)}>
            Request This Service
            <span className="btn-arrow">→</span>
          </button>
          <p className="action-note">Fill out the form and proceed to payment</p>
        </div>
      </div>
    </div>
  );

  const renderRequestView = () => (
    <div className="request-view">
      <button className="btn btn-back" onClick={() => selectedService ? setView('service-detail') : setView('services')}>
        ← Back
      </button>
      
      <div className="request-container">
        <div className="request-header">
          <div className="request-service-info">
            <span className="request-icon">{selectedService.icon}</span>
            <span>{selectedService.name}</span>
          </div>
          <h1 className="page-title">Request Service</h1>
          <p className="page-subtitle">
            Tell us about your project requirements. After submission, you'll proceed to payment.
          </p>
        </div>
        
        {formSuccess && (
          <div className="success-message">
            ✓ {formSuccess}
          </div>
        )}
        
        {formError && (
          <div className="error-message">
            ⚠ {formError}
          </div>
        )}
        
        <form onSubmit={handleServiceRequest} className="request-form">
          {/* Contact Information */}
          <div className="form-section-title">Contact Information</div>
          <div className="form-row">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                value={requestForm.name}
                onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={requestForm.email}
                onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={requestForm.phone}
                onChange={(e) => setRequestForm({...requestForm, phone: e.target.value})}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                value={requestForm.company}
                onChange={(e) => setRequestForm({...requestForm, company: e.target.value})}
                placeholder="Your Company"
              />
            </div>
          </div>
          
          {/* Project Details */}
          <div className="form-section-title">Project Details</div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Project Type</label>
              <select
                value={requestForm.projectType}
                onChange={(e) => setRequestForm({...requestForm, projectType: e.target.value})}
              >
                <option value="">Select project type</option>
                <option value="New Project">New Project</option>
                <option value="Redesign">Redesign/Revamp</option>
                <option value="Migration">Migration</option>
                <option value="Maintenance">Maintenance/Updates</option>
                <option value="Extension">Add Features</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Number of Pages/Screens</label>
              <select
                value={requestForm.pages}
                onChange={(e) => setRequestForm({...requestForm, pages: e.target.value})}
              >
                <option value="">Select count</option>
                <option value="1-3">1-3 pages</option>
                <option value="4-7">4-7 pages</option>
                <option value="8-15">8-15 pages</option>
                <option value="16-30">16-30 pages</option>
                <option value="30+">30+ pages</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Target Platforms</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={requestForm.platforms.includes('Web')}
                  onChange={(e) => {
                    const platforms = e.target.checked
                      ? [...requestForm.platforms, 'Web']
                      : requestForm.platforms.filter(p => p !== 'Web');
                    setRequestForm({...requestForm, platforms});
                  }}
                />
                <span>Web Browser</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={requestForm.platforms.includes('iOS')}
                  onChange={(e) => {
                    const platforms = e.target.checked
                      ? [...requestForm.platforms, 'iOS']
                      : requestForm.platforms.filter(p => p !== 'iOS');
                    setRequestForm({...requestForm, platforms});
                  }}
                />
                <span>iOS</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={requestForm.platforms.includes('Android')}
                  onChange={(e) => {
                    const platforms = e.target.checked
                      ? [...requestForm.platforms, 'Android']
                      : requestForm.platforms.filter(p => p !== 'Android');
                    setRequestForm({...requestForm, platforms});
                  }}
                />
                <span>Android</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={requestForm.platforms.includes('Desktop')}
                  onChange={(e) => {
                    const platforms = e.target.checked
                      ? [...requestForm.platforms, 'Desktop']
                      : requestForm.platforms.filter(p => p !== 'Desktop');
                    setRequestForm({...requestForm, platforms});
                  }}
                />
                <span>Desktop App</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label>Features You Need</label>
            <div className="checkbox-group">
              {selectedService.features && selectedService.features.slice(0, 6).map((feature, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={requestForm.features.includes(feature)}
                    onChange={(e) => {
                      const features = e.target.checked
                        ? [...requestForm.features, feature]
                        : requestForm.features.filter(f => f !== feature);
                      setRequestForm({...requestForm, features});
                    }}
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Requirements & Budget */}
          <div className="form-section-title">Requirements & Timeline</div>
          
          <div className="form-group">
            <label>Describe Your Requirements in Detail *</label>
            <textarea
              value={requestForm.requirements}
              onChange={(e) => setRequestForm({...requestForm, requirements: e.target.value})}
              placeholder="Please describe your project goals, target audience, specific functionalities, design preferences, and any other details that will help us understand your needs..."
              rows={6}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Additional Requirements or Notes</label>
            <textarea
              value={requestForm.additionalRequirements}
              onChange={(e) => setRequestForm({...requestForm, additionalRequirements: e.target.value})}
              placeholder="Any additional requirements, references, competitors to study, or specific constraints..."
              rows={3}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Budget Range</label>
              <select
                value={requestForm.budget}
                onChange={(e) => setRequestForm({...requestForm, budget: e.target.value})}
              >
                <option value="">Select budget</option>
                <option value="Under $500">Under $500</option>
                <option value="$500 - $1000">$500 - $1000</option>
                <option value="$1000 - $5000">$1000 - $5000</option>
                <option value="$5000 - $10000">$5000 - $10000</option>
                <option value="$10000+">$10000+</option>
                <option value="To be discussed">To be discussed</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Preferred Timeline</label>
              <select
                value={requestForm.timeline}
                onChange={(e) => setRequestForm({...requestForm, timeline: e.target.value})}
              >
                <option value="">Select timeline</option>
                <option value="ASAP">ASAP</option>
                <option value="Within 1 month">Within 1 month</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-large">
            Submit & Proceed to Payment
            <span className="btn-arrow">→</span>
          </button>
        </form>
      </div>
    </div>
  );

  // Payment Component
  const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!stripe || !elements) {
        return;
      }

      setProcessing(true);
      setError('');

      // In production, you would:
      // 1. Call your backend to create a payment intent
      // 2. Confirm the payment with Stripe
      
      // For demo, simulate payment success
      setTimeout(() => {
        setProcessing(false);
        handlePaymentSuccess();
      }, 2000);
    };

    return (
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="payment-summary">
          <h3>Payment Summary</h3>
          <div className="payment-item">
            <span>Service:</span>
            <span>{pendingRequest?.serviceName}</span>
          </div>
          <div className="payment-total">
            <span>Total:</span>
            <span>${(pendingRequest?.amount || 0) / 100}.00</span>
          </div>
        </div>
        
        <div className="form-group">
          <label>Card Details</label>
          <div className="card-element-container">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#fa755a',
                  },
                },
              }}
            />
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="btn btn-primary btn-large"
          disabled={!stripe || processing}
        >
          {processing ? 'Processing...' : `Pay $${(pendingRequest?.amount || 0) / 100}.00`}
        </button>
        
        <p className="payment-note">
          🔒 Your payment is secure and encrypted
        </p>
      </form>
    );
  };

  const renderPaymentView = () => (
    <div className="payment-view">
      <div className="payment-container">
        <h1 className="page-title">Complete Payment</h1>
        <p className="page-subtitle">
          Your service request has been submitted. Please complete payment to start the process.
        </p>
        
        <div className="payment-card">
          <Elements stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        </div>
      </div>
    </div>
  );

  const renderRequestStatusView = () => (
    <div className="status-view">
      <div className="status-container">
        <h1 className="page-title">Request Status</h1>
        
        {userRequest ? (
          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">{userRequest.serviceIcon}</span>
              <div>
                <h2>{userRequest.serviceName}</h2>
                <p className="request-id">Request ID: {userRequest.id}</p>
              </div>
            </div>
            
            <div className="status-timeline">
              <div className={`timeline-step ${userRequest.paymentStatus === 'paid' ? 'completed' : ''}`}>
                <div className="step-circle">1</div>
                <div className="step-content">
                  <span className="step-title">Payment</span>
                  <span className={`step-status ${userRequest.paymentStatus}`}>
                    {userRequest.paymentStatus === 'paid' ? '✓ Paid' : '○ Pending'}
                  </span>
                </div>
              </div>
              
              <div className={`timeline-step ${userRequest.status === 'in-progress' || userRequest.status === 'completed' ? 'completed' : ''}`}>
                <div className="step-circle">2</div>
                <div className="step-content">
                  <span className="step-title">Processing</span>
                  <span className={`step-status ${userRequest.status}`}>
                    {userRequest.status === 'in-progress' ? '⟳ In Progress' : 
                     userRequest.status === 'completed' ? '✓ Completed' : '○ Waiting'}
                  </span>
                </div>
              </div>
              
              <div className={`timeline-step ${userRequest.status === 'completed' ? 'completed' : ''}`}>
                <div className="step-circle">3</div>
                <div className="step-content">
                  <span className="step-title">Delivery</span>
                  <span className={`step-status ${userRequest.status}`}>
                    {userRequest.status === 'completed' ? '✓ Delivered' : '○ Pending'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="status-details">
              <div className="detail-row">
                <span>Submitted:</span>
                <span>{new Date(userRequest.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <span>Your Name:</span>
                <span>{userRequest.name}</span>
              </div>
              <div className="detail-row">
                <span>Email:</span>
                <span>{userRequest.email}</span>
              </div>
              <div className="detail-row">
                <span>Amount Paid:</span>
                <span>${(userRequest.amount || 0) / 100}.00</span>
              </div>
            </div>
            
            <button className="btn btn-secondary" onClick={() => setView('home')}>
              Back to Home
            </button>
          </div>
        ) : (
          <p>Loading status...</p>
        )}
      </div>
    </div>
  );

  const renderCheckStatusView = () => (
    <div className="check-status-view">
      <div className="check-status-container">
        <h1 className="page-title">Check Request Status</h1>
        <p className="page-subtitle">
          Enter your Request ID to check the status of your service request.
        </p>
        
        <form onSubmit={checkRequestStatus} className="check-status-form">
          <div className="form-group">
            <label>Request ID</label>
            <input
              type="text"
              value={userRequestId}
              onChange={(e) => setUserRequestId(e.target.value)}
              placeholder="Enter your request ID (e.g., abc-123...)"
            />
          </div>
          
          {formError && <div className="error-message">{formError}</div>}
          
          <button type="submit" className="btn btn-primary">
            Check Status
          </button>
        </form>
        
        <div className="status-help">
          <p>💡 Your Request ID was sent to your email after submission.</p>
        </div>
      </div>
    </div>
  );

  const renderAdminView = () => (
    <div className="admin-view">
      <div className="admin-container">
        <h1 className="page-title">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="stat-card-admin">
            <span className="stat-number">{adminStats?.totalRequests || 0}</span>
            <span className="stat-label">Total Requests</span>
          </div>
          <div className="stat-card-admin">
            <span className="stat-number">{adminStats?.pendingRequests || 0}</span>
            <span className="stat-label">Pending Payment</span>
          </div>
          <div className="stat-card-admin">
            <span className="stat-number">{adminStats?.paidRequests || 0}</span>
            <span className="stat-label">Ready to Process</span>
          </div>
          <div className="stat-card-admin">
            <span className="stat-number">{adminStats?.completedRequests || 0}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card-admin revenue">
            <span className="stat-number">${((adminStats?.totalRevenue || 0) / 100).toFixed(2)}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>
        
        {/* Requests Table */}
        <div className="admin-table-container">
          <h2>Service Request Queue</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {adminRequests.map(request => (
                <tr key={request.id}>
                  <td>
                    <span className="service-cell">
                      <span className="service-icon">{request.serviceIcon}</span>
                      {request.serviceName}
                    </span>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <span>{request.name}</span>
                      <span className="customer-email">{request.email}</span>
                    </div>
                  </td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>${(request.amount || 0) / 100}</td>
                  <td>
                    <span className={`payment-badge ${request.paymentStatus}`}>
                      {request.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${request.status}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {request.paymentStatus === 'paid' && request.status !== 'completed' && (
                        <>
                          <button 
                            className="btn-action btn-progress"
                            onClick={() => updateRequestStatus(request.id, 'in-progress')}
                          >
                            Start
                          </button>
                          <button 
                            className="btn-action btn-complete"
                            onClick={() => updateRequestStatus(request.id, 'completed')}
                          >
                            Complete
                          </button>
                        </>
                      )}
                      {request.status === 'completed' && (
                        <span className="completed-text">✓ Done</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {adminRequests.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-row">No requests yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAboutView = () => (
    <div className="about-view">
      <div className="about-header">
        <h1 className="page-title">About OmniVertex Digital</h1>
        <p className="page-subtitle">
          Your trusted partner for all digital solutions
        </p>
      </div>
      
      <div className="about-content">
        <div className="about-section">
          <h2>Who We Are</h2>
          <p>
            OmniVertex Digital is a comprehensive platform offering all digital services under one roof. 
            We believe in simplifying the digital landscape for businesses by providing everything you 
            need - from web development to cloud infrastructure - in a single, trusted platform.
          </p>
          <p>
            Gone are the days of coordinating with multiple vendors, managing different contracts, and 
            running after multiple support teams. With OmniVertex, you have a single point of contact 
            for all your digital needs.
          </p>
        </div>
        
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            To empower businesses with comprehensive, reliable, and affordable digital solutions that 
            drive growth and success. We're committed to being your one-stop destination for all things digital.
          </p>
        </div>
        
        <div className="about-stats">
          <div className="stat-card">
            <span className="stat-number">10+</span>
            <span className="stat-label">Services</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">500+</span>
            <span className="stat-label">Clients</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
        
        <div className="about-section">
          <h2>Why Choose Us?</h2>
          <ul className="about-benefits">
            <li>
              <span className="benefit-check">✓</span>
              <div>
                <strong>Comprehensive Solutions</strong>
                <p>All digital services under one platform - no more vendor management</p>
              </div>
            </li>
            <li>
              <span className="benefit-check">✓</span>
              <div>
                <strong>Expert Team</strong>
                <p>Skilled professionals with years of industry experience</p>
              </div>
            </li>
            <li>
              <span className="benefit-check">✓</span>
              <div>
                <strong>Flexible Pricing</strong>
                <p>Solutions for businesses of all sizes and budgets</p>
              </div>
            </li>
            <li>
              <span className="benefit-check">✓</span>
              <div>
                <strong>Dedicated Support</strong>
                <p>Round-the-clock assistance for all your needs</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderContactView = () => (
    <div className="contact-view">
      <div className="contact-container">
        <div className="contact-info">
          <h1 className="page-title">Get In Touch</h1>
          <p className="page-subtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <span className="contact-label">Email</span>
                <span className="contact-value">{companyInfo?.email || 'hello@omnivertex.digital'}</span>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <span className="contact-label">Phone</span>
                <span className="contact-value">{companyInfo?.phone || '+1 (555) 123-4567'}</span>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <span className="contact-label">Address</span>
                <span className="contact-value">{companyInfo?.address || '123 Tech Street, Silicon Valley, CA'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container">
          {formSuccess && (
            <div className="success-message">
              ✓ {formSuccess}
            </div>
          )}
          
          {formError && (
            <div className="error-message">
              ⚠ {formError}
            </div>
          )}
          
          <form onSubmit={handleContactSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  placeholder="How can we help?"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Message *</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                placeholder="Your message..."
                rows={5}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-large">
              Send Message
              <span className="btn-arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">◇</div>
              <span className="logo-text">OmniVertex</span>
              <span className="logo-tag">Digital</span>
            </div>
            <p className="footer-tagline">Your One-Stop Digital Solutions Platform</p>
            <p className="footer-description">
              Simplifying digital services for businesses. Get web development, hosting, 
              domains, databases, and more - all in one place.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li onClick={() => setView('services')}>Web Development</li>
                <li onClick={() => setView('services')}>Domain Services</li>
                <li onClick={() => setView('services')}>Hosting</li>
                <li onClick={() => setView('services')}>Cloud Services</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li onClick={() => setView('about')}>About Us</li>
                <li onClick={() => setView('contact')}>Contact</li>
                <li onClick={() => setView('services')}>Services</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 OmniVertex Digital. All rights reserved.</p>
          <p className="footer-note">One Platform. Infinite Possibilities.</p>
        </div>
      </div>
    </footer>
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading OmniVertex...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {renderHeader()}
      
      <main className="main-content">
        {view === 'home' && (
          <>
            {renderHero()}
            {renderServicesPreview()}
            {renderWhyChooseUs()}
            {renderTestimonials()}
          </>
        )}
        {view === 'services' && renderServicesView()}
        {view === 'service-detail' && renderServiceDetail()}
        {view === 'request' && renderRequestView()}
        {view === 'payment' && renderPaymentView()}
        {view === 'request-status' && renderRequestStatusView()}
        {view === 'check-status' && renderCheckStatusView()}
        {view === 'admin' && renderAdminView()}
        {view === 'about' && renderAboutView()}
        {view === 'contact' && renderContactView()}
      </main>
      
      {renderFooter()}
    </div>
  );
}

export default App;

