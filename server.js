const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
let bcrypt;
try {
  bcrypt = require('bcrypt');
} catch (e) {
  // fallback to pure-js implementation when native bcrypt is unavailable
  bcrypt = require('bcryptjs');
}
const jwt = require('jsonwebtoken');

const { authenticateToken, generateToken } = require('./server/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Utils
const readJSON = (filename) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8');
    return JSON.parse(data || '{}');
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

const writeJSON = (filename, data) => {
  try {
    fs.writeFileSync(path.join(__dirname, 'data', filename), JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// Basic auth route (demo)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const users = readJSON('users.json');
  if (!users) return res.status(500).json({ error: 'User store not available' });

  const user = users.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // Validate password strictly against stored bcrypt hash
  const isValid = (user.password_hash && bcrypt.compareSync(password, user.password_hash));
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken({ id: user.id, username: user.username, role: user.role });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name } });
});

// Public endpoints
app.get('/api/services', (req, res) => {
  const services = readJSON('services.json');
  res.json((services && services.services) || []);
});

app.get('/api/blog', (req, res) => {
  const blog = readJSON('blog.json');
  res.json((blog && blog.articles) || []);
});

app.get('/api/blog/:id', (req, res) => {
  const blog = readJSON('blog.json');
  const article = (blog && blog.articles) ? blog.articles.find(a => a.id === req.params.id) : null;
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// Contact submissions
app.post('/api/contact', (req, res) => {
  const { fullname, email, subject, message } = req.body;
  if (!fullname || !email || !subject || !message) return res.status(400).json({ error: 'All fields are required' });

  const submissionsFile = path.join(__dirname, 'data', 'contact_submissions.json');
  let submissions = [];
  if (fs.existsSync(submissionsFile)) submissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf8') || '[]');

  const item = { id: Date.now(), fullname, email, subject, message, submitted_at: new Date().toISOString(), status: 'new' };
  submissions.push(item);
  writeJSON('contact_submissions.json', submissions);
  res.status(201).json({ success: true, message: 'Received', id: item.id });
});

// Appointments
app.post('/api/appointments', (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !phone || !message) return res.status(400).json({ error: 'All fields are required' });

  const file = path.join(__dirname, 'data', 'appointments.json');
  let appointments = [];
  if (fs.existsSync(file)) appointments = JSON.parse(fs.readFileSync(file, 'utf8') || '[]');

  const item = { id: Date.now(), name, email, phone, message, requested_at: new Date().toISOString(), status: 'pending' };
  appointments.push(item);
  writeJSON('appointments.json', appointments);
  res.status(201).json({ success: true, message: 'Appointment requested', id: item.id });

  // Server-side logging: append to appointments.log for audit
  try {
    const logLine = `[${new Date().toISOString()}] Appointment id=${item.id} name=${item.name} email=${item.email} phone=${item.phone}\n`;
    fs.appendFile(path.join(__dirname, 'data', 'appointments.log'), logLine, (err) => { if (err) console.error('Failed to write appointments.log', err); });
  } catch (e) { console.error('Logging failed', e); }

  // Optional email notification (if SMTP configured via env)
  try {
    const nodemailer = require('nodemailer');
    const smtpHost = process.env.SMTP_HOST;
    if (smtpHost) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
      });
      const mailOpts = {
        from: process.env.SMTP_FROM || 'no-reply@globalcareclinic.com',
        to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER || 'admin@globalcareclinic.com',
        subject: `New appointment requested (${item.id})`,
        text: `New appointment:\n\nName: ${item.name}\nEmail: ${item.email}\nPhone: ${item.phone}\nMessage: ${item.message}\nRequested at: ${item.requested_at}`
      };
      transporter.sendMail(mailOpts, (err, info) => {
        if (err) console.error('Appointment email failed', err); else console.log('Appointment notification sent', info && info.response);
      });
    }
  } catch (e) {
    console.error('Failed to send appointment notification', e);
  }
});

// Admin-protected endpoints
// Get contact submissions (admin)
app.get('/api/submissions', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const subs = readJSON('contact_submissions.json') || [];
  res.json(subs);
});

// Get appointments (admin)
app.get('/api/appointments', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const appts = readJSON('appointments.json') || [];
  res.json(appts);
});

// Update appointment status (admin)
app.patch('/api/appointments/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const file = path.join(__dirname, 'data', 'appointments.json');
  let appointments = [];
  if (fs.existsSync(file)) appointments = JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
  const appt = appointments.find(a => String(a.id) === String(req.params.id));
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  appt.status = req.body.status || appt.status;
  writeJSON('appointments.json', appointments);
  res.json({ success: true, appt });
});

// CRUD for services (admin)
app.post('/api/services', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const servicesData = readJSON('services.json') || { services: [] };
  const newId = servicesData.services.reduce((m, s) => Math.max(m, s.id), 0) + 1;
  const item = { id: newId, ...req.body };
  servicesData.services.push(item);
  writeJSON('services.json', servicesData);
  res.status(201).json(item);
});

app.put('/api/services/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const servicesData = readJSON('services.json') || { services: [] };
  const idx = servicesData.services.findIndex(s => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Service not found' });
  servicesData.services[idx] = { ...servicesData.services[idx], ...req.body };
  writeJSON('services.json', servicesData);
  res.json(servicesData.services[idx]);
});

app.delete('/api/services/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const servicesData = readJSON('services.json') || { services: [] };
  const idx = servicesData.services.findIndex(s => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Service not found' });
  const removed = servicesData.services.splice(idx, 1)[0];
  writeJSON('services.json', servicesData);
  res.json({ success: true, removed });
});

// CRUD for blog posts (admin)
app.post('/api/blog', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const blog = readJSON('blog.json') || { articles: [] };
  const id = req.body.id || `post-${Date.now()}`;
  const item = { id, ...req.body };
  blog.articles.push(item);
  writeJSON('blog.json', blog);
  res.status(201).json(item);
});

app.put('/api/blog/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const blog = readJSON('blog.json') || { articles: [] };
  const idx = blog.articles.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article not found' });
  blog.articles[idx] = { ...blog.articles[idx], ...req.body };
  writeJSON('blog.json', blog);
  res.json(blog.articles[idx]);
});

app.delete('/api/blog/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const blog = readJSON('blog.json') || { articles: [] };
  const idx = blog.articles.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article not found' });
  const removed = blog.articles.splice(idx, 1)[0];
  writeJSON('blog.json', blog);
  res.json({ success: true, removed });
});

// User management (admin)
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const users = readJSON('users.json') || { users: [] };
  const safe = users.users.map(({ password_hash, ...u }) => u);
  res.json(safe);
});

app.post('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const users = readJSON('users.json') || { users: [] };
  const newId = users.users.reduce((m, u) => Math.max(m, u.id), 0) + 1;
  const password = req.body.password || 'password';
  const password_hash = bcrypt.hashSync(password, 10);
  const user = { id: newId, ...req.body, password_hash };
  delete user.password; // remove plaintext
  users.users.push(user);
  writeJSON('users.json', users);
  res.status(201).json({ id: newId });
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const users = readJSON('users.json') || { users: [] };
  const idx = users.users.findIndex(u => String(u.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  if (req.body.password) users.users[idx].password_hash = bcrypt.hashSync(req.body.password, 10);
  users.users[idx] = { ...users.users[idx], ...req.body };
  writeJSON('users.json', users);
  res.json({ success: true });
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const users = readJSON('users.json') || { users: [] };
  const idx = users.users.findIndex(u => String(u.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const removed = users.users.splice(idx, 1)[0];
  writeJSON('users.json', users);
  res.json({ success: true, removed });
});

// Resend appointment notification email (admin)
app.post('/api/appointments/:id/resend-email', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const file = path.join(__dirname, 'data', 'appointments.json');
  let appointments = [];
  if (fs.existsSync(file)) appointments = JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
  const appt = appointments.find(a => String(a.id) === String(req.params.id));
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  try {
    const nodemailer = require('nodemailer');
    const smtpHost = process.env.SMTP_HOST;
    if (smtpHost) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
      });
      const mailOpts = {
        from: process.env.SMTP_FROM || 'no-reply@globalcareclinic.com',
        to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER || 'admin@globalcareclinic.com',
        subject: `Appointment reminder (${appt.id})`,
        text: `Appointment reminder:\n\nName: ${appt.name}\nEmail: ${appt.email}\nPhone: ${appt.phone}\nMessage: ${appt.message}\nRequested at: ${appt.requested_at}\nStatus: ${appt.status}`
      };
      transporter.sendMail(mailOpts, (err, info) => {
        if (err) console.error('Resend email failed', err); else console.log('Resend notification sent', info && info.response);
      });
    }
    res.json({ success: true, message: 'Email resent' });
  } catch (e) {
    console.error('Failed to resend appointment notification', e);
    res.status(500).json({ error: 'Failed to resend' });
  }
});

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// Serve index.html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

module.exports = app;
