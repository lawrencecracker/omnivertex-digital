const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Stripe initialization - Use test key for demo, replace with real key in production
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'omnivertex-secret-key-2024';
const JWT_EXPIRES_IN = '7d';

const app = express();

// Security middleware
app.use(helmet());

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
</xai:function_call}


<xai:function_call name="edit_file">
<parameter name="path">server/src/index.js

// Services Data with pricing for payments
const services = [
  {
    id: 'web-app-development',
    name: 'Web App Development',
    icon: '🌐',
    shortDescription: 'Custom web applications tailored to your business needs',
    fullDescription: 'We build scalable, secure, and高性能 custom web applications using cutting-edge technologies. From simple websites to complex enterprise solutions, our team delivers tailored applications that drive business growth.',
    features: [
      'Custom Web Application Development',
      'Progressive Web Apps (PWA)',
      'E-commerce Solutions',
      'API Development & Integration',
      'Frontend & Backend Development',
      'Maintenance & Support'
    ],
    pricing: 'Starting from $500',
    priceAmount: 50000, // in cents
    category: 'Development',
    popular: true
  },
  {
    id: 'domain-services',
    name: 'Domain Services',
    icon: '🔌',
    shortDescription: 'Domain registration, management, and DNS configuration',
    fullDescription: 'Complete domain management solutions including registration, transfer, DNS management, and domain forwarding. We help you secure the perfect domain for your business and manage it effortlessly.',
    features: [
      'Domain Registration',
      'Domain Transfer',
      'DNS Management',
      'Domain Forwarding',
      'SSL Certificate Installation',
      '24/7 Domain Support'
    ],
    pricing: 'Starting from $12/year',
    priceAmount: 1200,
    category: 'Infrastructure',
    popular: true
  },
  {
    id: 'cdn-services',
    name: 'CDN Services',
    icon: '🚀',
    shortDescription: 'Global content delivery network for faster loading',
    fullDescription: 'Accelerate your website globally with our CDN services. Deliver content faster to users anywhere in the world with reduced latency, improved performance, and better user experience.',
    features: [
      'Global Edge Network',
      'Static & Dynamic Content Delivery',
      'DDoS Protection',
      'Real-time Analytics',
      'Cache Optimization',
      'SSL/TLS Acceleration'
    ],
    pricing: 'Starting from $25/month',
    priceAmount: 2500,
    category: 'Infrastructure',
    popular: false
  },
  {
    id: 'server-services',
    name: 'Server Services',
    icon: '🖥️',
    shortDescription: 'Dedicated and virtual servers for your applications',
    fullDescription: 'Powerful server solutions tailored to your needs. Whether you need dedicated servers, VPS, or cloud instances, we provide reliable infrastructure with 99.9% uptime guarantee.',
    features: [
      'Dedicated Servers',
      'Virtual Private Servers (VPS)',
      'Cloud Instances',
      'Server Management',
      'Security & Firewalls',
      'Backup Solutions'
    ],
    pricing: 'Starting from $30/month',
    priceAmount: 3000,
    category: 'Infrastructure',
    popular: true
  },
  {
    id: 'database-services',
    name: 'Database Services',
    icon: '🗄️',
    shortDescription: 'Database setup, optimization, and management',
    fullDescription: 'Professional database solutions for your applications. We handle setup, configuration, optimization, backup, and maintenance of various database systems to ensure your data is secure and accessible.',
    features: [
      'Database Setup & Configuration',
      'Database Optimization',
      'Data Backup & Recovery',
      'Replication & Clustering',
      'Security & Access Control',
      '24/7 Monitoring'
    ],
    pricing: 'Starting from $20/month',
    priceAmount: 2000,
    category: 'Infrastructure',
    popular: false
  },
  {
    id: 'hosting-deployment',
    name: 'Hosting & Deployment',
    icon: '☁️',
    shortDescription: 'Reliable web hosting and automated deployment',
    fullDescription: 'Stress-free hosting and deployment solutions. We handle all aspects of hosting your applications, from initial deployment to ongoing maintenance, ensuring your services are always available.',
    features: [
      'Web Hosting',
      'Automated CI/CD',
      'Container Deployment',
      'Load Balancing',
      'Auto-scaling',
      'Performance Monitoring'
    ],
    pricing: 'Starting from $15/month',
    priceAmount: 1500,
    category: 'Infrastructure',
    popular: true
  },
  {
    id: 'rendering-services',
    name: 'Rendering Services',
    icon: '🎨',
    shortDescription: 'GPU rendering and cloud rendering solutions',
    fullDescription: 'High-performance rendering services for 3D graphics, video production, and visual effects. Access powerful GPU clusters on-demand without investing in expensive hardware.',
    features: [
      'GPU Rendering',
      'Cloud Rendering Farm',
      '3D Animation Rendering',
      'Video Encoding',
      'Batch Processing',
      'Priority Support'
    ],
    pricing: 'Starting from $50/hour',
    priceAmount: 5000,
    category: 'Computing',
    popular: false
  },
  {
    id: 'mobile-app-development',
    name: 'Mobile App Development',
    icon: '📱',
    shortDescription: 'Native and cross-platform mobile applications',
    fullDescription: 'Create engaging mobile experiences for iOS and Android. Our team builds high-quality native and cross-platform applications that deliver exceptional user experiences.',
    features: [
      'iOS App Development',
      'Android App Development',
      'Cross-platform Apps',
      'App Store Optimization',
      'API Integration',
      'Post-launch Support'
    ],
    pricing: 'Starting from $1000',
    priceAmount: 100000,
    category: 'Development',
    popular: false
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    icon: '🎯',
    shortDescription: 'User interface and experience design services',
    fullDescription: 'Transform your ideas into beautiful, user-friendly designs. Our design team creates intuitive interfaces that enhance user engagement and drive conversions.',
    features: [
      'Website Design',
      'Mobile App Design',
      'Brand Identity',
      'Prototyping',
      'User Research',
      'Design Systems'
    ],
    pricing: 'Starting from $300',
    priceAmount: 30000,
    category: 'Design',
    popular: false
  },
  {
    id: 'seo-services',
    name: 'SEO Services',
    icon: '📊',
    shortDescription: 'Search engine optimization for better visibility',
    fullDescription: 'Improve your online visibility and drive organic traffic with our comprehensive SEO services. We help your business rank higher in search results.',
    features: [
      'On-page SEO',
      'Off-page SEO',
      'Technical SEO',
      'Keyword Research',
      'Content Strategy',
      'Analytics & Reporting'
    ],
    pricing: 'Starting from $200/month',
    priceAmount: 20000,
    category: 'Marketing',
    popular: false
  }
];

// In-memory storage
let serviceRequests = [];
let testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechStart Inc.',
    message: 'OmniVertex transformed our online presence. Their web development team delivered beyond our expectations!',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'DataFlow Systems',
    message: 'The best decision we made was choosing OmniVertex for our server and hosting needs. Incredible support!',
    rating: 5
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'Creative Studios',
    message: 'Our rendering projects are now completed 10x faster. The cloud rendering service is a game-changer!',
    rating: 5
  }
];

let contacts = [];

// ============ Users & Authentication ============

// In-memory user storage
let users = [
  {
    id: 'admin-1',
    email: 'admin@omnivertex.digital',
    password: '$2a$10$rQZ8K8Y8Y8Y8Y8Y8Y8Y8YO8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8', // admin123
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

// Pre-hash admin password (admin123)
(async () => {
  users[0].password = await bcrypt.hash('admin123', 10);
})();

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt
  });
});

// ============ SDLC Lifecycle Routes ============

// SDLC Stages
const SDLC_STAGES = [
  { id: 'planning', name: 'Planning', icon: '📋', description: 'Project scope and requirements gathering' },
  { id: 'design', name: 'Design', icon: '🎨', description: 'Architecture and UI/UX design' },
  { id: 'development', name: 'Development', icon: '💻', description: 'Code implementation' },
  { id: 'testing', name: 'Testing', icon: '🧪', description: 'Quality assurance and testing' },
  { id: 'deployment', name: 'Deployment', icon: '🚀', description: 'Production deployment' },
  { id: 'maintenance', name: 'Maintenance', icon: '🔧', description: 'Ongoing support and updates' }
];

app.get('/api/sdlc/stages', (req, res) => {
  res.json(SDLC_STAGES);
});

// Get user's service requests with SDLC
app.get('/api/user/requests', authenticateToken, (req, res) => {
  const userRequests = serviceRequests.filter(r => r.userId === req.user.id);
  res.json(userRequests);
});

// Update request SDLC stage (admin)
app.put('/api/sdlc/update/:requestId', authenticateToken, requireAdmin, (req, res) => {
  const { sdlcStage } = req.body;
  const request = serviceRequests.find(r => r.id === req.params.requestId);
  
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  if (!SDLC_STAGES.find(s => s.id === sdlcStage)) {
    return res.status(400).json({ error: 'Invalid SDLC stage' });
  }
  
  request.sdlcStage = sdlcStage;
  request.sdlcUpdatedAt = new Date().toISOString();
  request.updatedAt = new Date().toISOString();
  
  res.json(request);
});

// ============ Emulation Tools Routes ============

const EMULATION_DEVICES = [
  { id: 'desktop-1920', name: 'Desktop HD', width: 1920, height: 1080, type: 'desktop' },
  { id: 'desktop-1366', name: 'Laptop', width: 1366, height: 768, type: 'desktop' },
  { id: 'tablet-768', name: 'Tablet Portrait', width: 768, height: 1024, type: 'tablet' },
  { id: 'tablet-1024', name: 'Tablet Landscape', width: 1024, height: 768, type: 'tablet' },
  { id: 'mobile-390', name: 'Mobile iPhone', width: 390, height: 844, type: 'mobile' },
  { id: 'mobile-360', name: 'Mobile Android', width: 360, height: 800, type: 'mobile' }
];

const BROWSER_INFO = [
  { id: 'chrome', name: 'Chrome', icon: '🔵' },
  { id: 'firefox', name: 'Firefox', icon: '🦊' },
  { id: 'safari', name: 'Safari', icon: '🧭' },
  { id: 'edge', name: 'Edge', icon: '🔷' }
];

app.get('/api/emulation/devices', (req, res) => {
  res.json(EMULATION_DEVICES);
});

app.get('/api/emulation/browsers', (req, res) => {
  res.json(BROWSER_INFO);
});

// ============ API Routes ============

// Get all services
app.get('/api/services', (req, res) => {
  res.json(services);
});

// Get services by category
app.get('/api/services/category/:category', (req, res) => {
  const category = req.params.category;
  const filtered = services.filter(s => s.category.toLowerCase() === category.toLowerCase());
  res.json(filtered);
});

// Get popular services
app.get('/api/services/popular', (req, res) => {
  const popular = services.filter(s => s.popular);
  res.json(popular);
});

// Get service by ID
app.get('/api/services/:id', (req, res) => {
  const service = services.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json(service);
});

// Submit service request
app.post('/api/service-requests', (req, res) => {
  const { serviceId, name, email, phone, company, requirements, budget, timeline, features, pages, platforms } = req.body;
  
  if (!serviceId || !name || !email || !requirements) {
    return res.status(400).json({ error: 'Please fill in all required fields' });
  }

  const service = services.find(s => s.id === serviceId);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const newRequest = {
    id: uuidv4(),
    serviceId,
    serviceName: service.name,
    serviceIcon: service.icon,
    name,
    email,
    phone: phone || '',
    company: company || '',
    requirements,
    features: features || [],
    pages: pages || '',
    platforms: platforms || [],
    budget: budget || 'To be discussed',
    timeline: timeline || 'Flexible',
    // Payment & Status Tracking
    status: 'pending', // pending, in-progress, completed
    paymentStatus: 'pending', // pending, paid, failed
    paymentId: null,
    amount: service.priceAmount,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    completedAt: null
  };

  serviceRequests.push(newRequest);
  res.status(201).json({ 
    message: 'Service request submitted successfully! Please proceed to payment.',
    requestId: newRequest.id,
    amount: newRequest.amount,
    serviceName: service.name
  });
});

// Get all service requests
app.get('/api/service-requests', (req, res) => {
  res.json(serviceRequests);
});

// Get user's request by ID
app.get('/api/requests/:id', (req, res) => {
  const request = serviceRequests.find(r => r.id === req.params.id);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }
  res.json(request);
});

// Update service request status (admin)
app.put('/api/service-requests/:id', (req, res) => {
  const { status, paymentStatus } = req.body;
  const request = serviceRequests.find(r => r.id === req.params.id);
  
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (status) {
    request.status = status;
    if (status === 'completed') {
      request.completedAt = new Date().toISOString();
    }
  }
  if (paymentStatus) {
    request.paymentStatus = paymentStatus;
  }
  
  request.updatedAt = new Date().toISOString();
  res.json(request);
});

// ============ Payment Routes ============

// Create Stripe Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  const { requestId } = req.body;
  
  const request = serviceRequests.find(r => r.id === requestId);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (request.paymentStatus === 'paid') {
    return res.status(400).json({ error: 'This request has already been paid' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: request.amount,
      currency: 'usd',
      metadata: {
        requestId: request.id,
        serviceName: request.serviceName,
        customerEmail: request.email,
        customerName: request.name
      }
    });

    // Update request with payment intent ID
    request.paymentId = paymentIntent.id;
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      requestId: request.id,
      amount: request.amount
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    // For demo/testing without valid Stripe key, return mock data
    res.json({
      clientSecret: 'pi_mock_' + uuidv4() + '_secret_mock',
      requestId: request.id,
      amount: request.amount,
      demo: true
    });
  }
});

// Confirm payment (webhook simulation for demo)
app.post('/api/confirm-payment', (req, res) => {
  const { requestId, paymentStatus } = req.body;
  
  const request = serviceRequests.find(r => r.id === requestId);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (paymentStatus === 'paid') {
    request.paymentStatus = 'paid';
    request.status = 'paid'; // Ready for processing
    request.updatedAt = new Date().toISOString();
  } else if (paymentStatus === 'failed') {
    request.paymentStatus = 'failed';
    request.updatedAt = new Date().toISOString();
  }

  res.json(request);
});

// Get Stripe publishable key
app.get('/api/config/stripe', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
  });
});

// ============ Admin Routes ============

// Get all requests for admin dashboard
app.get('/api/admin/requests', (req, res) => {
  // Sort by date, newest first
  const sortedRequests = [...serviceRequests].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(sortedRequests);
});

// Update request status (admin)
app.put('/api/admin/requests/:id', (req, res) => {
  const { status, adminNotes } = req.body;
  const request = serviceRequests.find(r => r.id === req.params.id);
  
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (status) {
    request.status = status;
    if (status === 'completed') {
      request.completedAt = new Date().toISOString();
    }
  }
  if (adminNotes !== undefined) {
    request.adminNotes = adminNotes;
  }
  
  request.updatedAt = new Date().toISOString();
  res.json(request);
});

// Get dashboard stats
app.get('/api/admin/stats', (req, res) => {
  const totalRequests = serviceRequests.length;
  const pendingRequests = serviceRequests.filter(r => r.status === 'pending' && r.paymentStatus === 'pending').length;
  const paidRequests = serviceRequests.filter(r => r.paymentStatus === 'paid' && r.status !== 'completed').length;
  const completedRequests = serviceRequests.filter(r => r.status === 'completed').length;
  const totalRevenue = serviceRequests
    .filter(r => r.paymentStatus === 'paid')
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  res.json({
    totalRequests,
    pendingRequests,
    paidRequests,
    completedRequests,
    totalRevenue
  });
});

// ============ Testimonials & Contact ============

// Get testimonials
app.get('/api/testimonials', (req, res) => {
  res.json(testimonials);
});

// Submit contact form
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message, phone } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all required fields' });
  }

  const newContact = {
    id: uuidv4(),
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    phone: phone || '',
    status: 'unread',
    createdAt: new Date().toISOString()
  };

  contacts.push(newContact);
  res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.' });
});

// Get company info
app.get('/api/company', (req, res) => {
  res.json({
    name: 'OmniVertex Digital',
    tagline: 'Your One-Stop Digital Solutions Platform',
    description: 'OmniVertex Digital is a comprehensive platform offering all digital services under one roof. From web development to cloud infrastructure, we provide everything you need to succeed in the digital world.',
    email: 'hello@omnivertex.digital',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94025',
    social: {
      twitter: 'https://twitter.com/omnivertex',
      linkedin: 'https://linkedin.com/company/omnivertex',
      github: 'https://github.com/omnivertex'
    }
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`OmniVertex Digital server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`\n📋 Service Queue Flow:`);
  console.log(`   1. User submits request → Status: pending, Payment: pending`);
  console.log(`   2. User pays → Status: paid, Payment: paid`);
  console.log(`   3. Admin processes → Status: in-progress`);
  console.log(`   4. Service delivered → Status: completed`);
  console.log(`\n🔧 Admin Dashboard: http://localhost:${PORT}/#/admin`);
});

