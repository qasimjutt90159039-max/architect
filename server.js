/**
 * Archtech Architecture Firm - Official REST API & Web Application Server
 * Location: 9 Scotch Corner, Upper Mall, Lahore, Pakistan (+92 42 35752102)
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Data Paths
const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const CONSULTATIONS_FILE = path.join(DATA_DIR, 'consultations.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function initDataFile(filePath, defaultData) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

initDataFile(INQUIRIES_FILE, []);
initDataFile(CONSULTATIONS_FILE, []);
initDataFile(SUBSCRIBERS_FILE, []);
initDataFile(PROJECTS_FILE, []);

// Helpers for Data Read/Write
function readJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// --------------------------------------------------------------------------
// Middleware
// --------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use(express.static(__dirname));

// --------------------------------------------------------------------------
// Clean Page Routes
// --------------------------------------------------------------------------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get('/services', (req, res) => res.sendFile(path.join(__dirname, 'services.html')));
app.get('/projects', (req, res) => res.sendFile(path.join(__dirname, 'projects.html')));
app.get('/team', (req, res) => res.sendFile(path.join(__dirname, 'team.html')));
app.get('/testimonials', (req, res) => res.sendFile(path.join(__dirname, 'testimonials.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

// --------------------------------------------------------------------------
// API Endpoints
// --------------------------------------------------------------------------

/**
 * 1. POST /api/contact - Submit project inquiry
 */
app.post('/api/contact', (req, res) => {
  const { name, email, phone, typology, area, location, message } = req.body;

  // Validation
  const errors = [];
  if (!name || name.trim().length < 3) {
    errors.push('Full name must be at least 3 characters long.');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required.');
  }
  const phoneRegex = /^[\d\s+\-()]{8,}$/;
  if (!phone || !phoneRegex.test(phone.trim())) {
    errors.push('A valid contact phone number is required (min 8 digits).');
  }
  if (!typology || typology.trim() === '') {
    errors.push('Project typology must be selected.');
  }
  if (!message || message.trim().length < 10) {
    errors.push('Project brief/message must be at least 10 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors
    });
  }

  const inquiries = readJSON(INQUIRIES_FILE);
  const newInquiryId = `ARCH-INQ-${Math.floor(1000 + Math.random() * 9000)}`;

  const newInquiry = {
    id: newInquiryId,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    typology: typology.trim(),
    area: area ? area.trim() : 'Not Specified',
    location: location ? location.trim() : 'Lahore Region',
    message: message.trim(),
    status: 'new',
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  writeJSON(INQUIRIES_FILE, inquiries);

  return res.status(201).json({
    success: true,
    message: 'Your architectural inquiry has been recorded successfully.',
    inquiryId: newInquiryId,
    data: newInquiry
  });
});

/**
 * 2. POST /api/consultation - Book studio or virtual consultation
 */
app.post('/api/consultation', (req, res) => {
  const { name, email, phone, preferredDate, meetingType, projectType, notes } = req.body;

  const errors = [];
  if (!name || name.trim().length < 3) {
    errors.push('Name must be at least 3 characters long.');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('Valid email address is required.');
  }
  const phoneRegex = /^[\d\s+\-()]{8,}$/;
  if (!phone || !phoneRegex.test(phone.trim())) {
    errors.push('Valid contact phone is required.');
  }
  if (!preferredDate) {
    errors.push('Preferred appointment date must be selected.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors
    });
  }

  const consultations = readJSON(CONSULTATIONS_FILE);
  const consultationId = `ARCH-CON-${Math.floor(100 + Math.random() * 900)}`;

  const newConsultation = {
    id: consultationId,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    preferredDate: preferredDate,
    meetingType: meetingType || 'studio',
    projectType: projectType || 'residential',
    notes: notes ? notes.trim() : 'No initial notes provided.',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  consultations.unshift(newConsultation);
  writeJSON(CONSULTATIONS_FILE, consultations);

  return res.status(201).json({
    success: true,
    message: 'Studio consultation request booked successfully. Our executive team will confirm your slot.',
    consultationId: consultationId,
    data: newConsultation
  });
});

/**
 * 3. POST /api/newsletter - Subscribe to architectural journal
 */
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const subscribers = readJSON(SUBSCRIBERS_FILE);

  const existing = subscribers.find(s => s.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(200).json({
      success: true,
      message: 'You are already registered with the Archtech Architectural Journal.'
    });
  }

  subscribers.unshift({
    email: cleanEmail,
    subscribedAt: new Date().toISOString()
  });

  writeJSON(SUBSCRIBERS_FILE, subscribers);

  return res.status(201).json({
    success: true,
    message: 'Thank you for subscribing to the Archtech Architectural Journal.'
  });
});

/**
 * 4. GET /api/projects - Retrieve projects (with optional category filtering)
 */
app.get('/api/projects', (req, res) => {
  const { category } = req.query;
  const projects = readJSON(PROJECTS_FILE);

  if (category && category !== 'all') {
    const filtered = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
    return res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  }

  return res.json({
    success: true,
    count: projects.length,
    data: projects
  });
});

/**
 * 5. GET /api/projects/:id - Retrieve single project details
 */
app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const projects = readJSON(PROJECTS_FILE);
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: `Project with ID '${id}' was not found.`
    });
  }

  return res.json({
    success: true,
    data: project
  });
});

/**
 * 6. GET /api/inquiries - Admin: List all client inquiries
 */
app.get('/api/inquiries', (req, res) => {
  const inquiries = readJSON(INQUIRIES_FILE);
  return res.json({
    success: true,
    count: inquiries.length,
    data: inquiries
  });
});

/**
 * 7. PATCH /api/inquiries/:id - Admin: Update status of inquiry
 */
app.patch('/api/inquiries/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['new', 'contacted', 'in-review', 'closed'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  const inquiries = readJSON(INQUIRIES_FILE);
  const index = inquiries.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Inquiry with ID '${id}' not found.`
    });
  }

  inquiries[index].status = status;
  inquiries[index].updatedAt = new Date().toISOString();
  writeJSON(INQUIRIES_FILE, inquiries);

  return res.json({
    success: true,
    message: `Inquiry ${id} status updated to ${status}.`,
    data: inquiries[index]
  });
});

/**
 * 8. GET /api/consultations - Admin: List all consultation bookings
 */
app.get('/api/consultations', (req, res) => {
  const consultations = readJSON(CONSULTATIONS_FILE);
  return res.json({
    success: true,
    count: consultations.length,
    data: consultations
  });
});

/**
 * 9. PATCH /api/consultations/:id - Admin: Update consultation status
 */
app.patch('/api/consultations/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  const consultations = readJSON(CONSULTATIONS_FILE);
  const index = consultations.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Consultation with ID '${id}' not found.`
    });
  }

  consultations[index].status = status;
  consultations[index].updatedAt = new Date().toISOString();
  writeJSON(CONSULTATIONS_FILE, consultations);

  return res.json({
    success: true,
    message: `Consultation ${id} status updated to ${status}.`,
    data: consultations[index]
  });
});

/**
 * 10. GET /api/subscribers - Admin: List all subscribers
 */
app.get('/api/subscribers', (req, res) => {
  const subscribers = readJSON(SUBSCRIBERS_FILE);
  return res.json({
    success: true,
    count: subscribers.length,
    data: subscribers
  });
});

/**
 * 11. GET /api/stats - Dashboard metric counts
 */
app.get('/api/stats', (req, res) => {
  const inquiries = readJSON(INQUIRIES_FILE);
  const consultations = readJSON(CONSULTATIONS_FILE);
  const subscribers = readJSON(SUBSCRIBERS_FILE);
  const projects = readJSON(PROJECTS_FILE);

  return res.json({
    success: true,
    data: {
      inquiriesCount: inquiries.length,
      newInquiriesCount: inquiries.filter(i => i.status === 'new').length,
      consultationsCount: consultations.length,
      pendingConsultationsCount: consultations.filter(c => c.status === 'pending').length,
      subscribersCount: subscribers.length,
      projectsCount: projects.length
    }
  });
});

// --------------------------------------------------------------------------
// 404 Handler
// --------------------------------------------------------------------------
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: `API endpoint '${req.method} ${req.path}' not found.`
    });
  }
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// --------------------------------------------------------------------------
// Global Error Handler
// --------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({
      success: false,
      error: 'An internal architectural server error occurred.'
    });
  }
  res.status(500).send('<h1>500 Internal Server Error</h1>');
});

// --------------------------------------------------------------------------
// Start Server
// --------------------------------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  ARCHTECH ARCHITECTURAL SERVER ONLINE`);
    console.log(`  Port: ${PORT}`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`  Studio: 9 Scotch Corner, Upper Mall, Lahore`);
    console.log(`  Phone: +92 42 35752102`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
