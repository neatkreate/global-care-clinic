# Global Care Clinic - Backend Setup Guide

## Overview
This is a complete healthcare clinic website with integrated backend API using Node.js and Express.

## Features
✅ Services management with API  
✅ Blog posts system with API  
✅ User management with role-based access  
✅ Contact form submissions  
✅ Appointment booking system  
✅ CORS enabled for frontend integration  

## Directory Structure
```
Global Care Clinic/
├── server.js              # Express server
├── package.json           # Node dependencies
├── index.html             # Home page
├── about.html             # About page
├── services.html          # Services page
├── blog.html              # Blog page
├── contact.html           # Contact page
├── login.html             # Login page
├── dashboard.html         # Dashboard page
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── responsive.css
│   │   └── dashboard.css
│   ├── js/
│   │   ├── main.js        # Main JS logic
│   │   ├── api.js         # API utility functions
│   │   ├── form.js
│   │   ├── cart.js
│   │   └── dashboard.js
│   └── img/               # Images folder
├── data/
│   ├── services.json      # Services data
│   ├── blog.json          # Blog articles
│   ├── users.json         # User accounts
│   ├── appointments.json  # Appointment requests (auto-created)
│   └── contact_submissions.json # Contact forms (auto-created)
└── README.md              # This file
```

## Installation & Setup

### 1. Install Node.js
Download and install from https://nodejs.org/ (LTS version recommended)

### 2. Install Dependencies
```bash
cd "c:\Users\ADMIN\Desktop\Global Care Clinic"
npm install
```

This will install:
- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **body-parser**: Parse JSON request bodies
- **nodemailer**: Email notifications (optional)

### 3. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

You should see:
```
Global Care Clinic server running on http://localhost:3000
API endpoints available:
  GET /api/services
  GET /api/services/:id
  GET /api/blog
  GET /api/blog/:id
  POST /api/contact
  POST /api/appointments
  GET /api/health
```

### 4. Open in Browser
Visit `http://localhost:3000` in your web browser

## API Endpoints

### Services
- **GET** `/api/services` - Get all services
- **GET** `/api/services/:id` - Get service by ID

Example:
```javascript
fetch('http://localhost:3000/api/services')
  .then(res => res.json())
  .then(data => console.log(data))
```

### Blog
- **GET** `/api/blog` - Get all blog posts
- **GET** `/api/blog/:id` - Get blog post by ID

Example:
```javascript
fetch('http://localhost:3000/api/blog')
  .then(res => res.json())
  .then(articles => console.log(articles))
```

### Contact Form
- **POST** `/api/contact` - Submit contact form

Example:
```javascript
fetch('http://localhost:3000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullname: 'John Doe',
    email: 'john@example.com',
    subject: 'Inquiry',
    message: 'I have a question...'
  })
})
.then(res => res.json())
.then(data => console.log(data))
```

### Appointments
- **POST** `/api/appointments` - Book appointment

Example:
```javascript
fetch('http://localhost:3000/api/appointments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+233 501 234 567',
    message: 'I need a general consultation'
  })
})
.then(res => res.json())
.then(data => console.log(data))
```

### Health Check
- **GET** `/api/health` - Check if server is running

## Frontend Integration

### Using the API Utility (`assets/js/api.js`)

The `api.js` file provides helper functions for all API calls:

```javascript
// Fetch services
const services = await fetchServices();

// Fetch blog posts
const posts = await fetchBlogPosts();

// Submit contact form
const result = await submitContactForm({
  fullname: 'John',
  email: 'john@example.com',
  subject: 'Help',
  message: 'Test message'
});

// Book appointment
const appointment = await bookAppointment({
  name: 'John',
  email: 'john@example.com',
  phone: '+233 5xx xxx xxx',
  message: 'I need help'
});
```

### Add API Script to HTML Files

Include the API script in your HTML pages:
```html
<script src="assets/js/api.js"></script>
```

## Data Files

### services.json
Contains 6 healthcare services with details like price, duration, and features.

### blog.json
Contains 5 blog articles with content, author, date, and category.

### users.json
Contains 6 user accounts (3 doctors, 1 staff, 2 patients) with roles and contact info.

### appointments.json
Auto-created when appointments are booked. Stores all appointment requests.

### contact_submissions.json
Auto-created when contact form is submitted. Stores all contact inquiries.

## Environment Variables (Optional)

Create a `.env` file for environment-specific settings:
```
PORT=3000
NODE_ENV=development
```

## Troubleshooting

### "Port 3000 already in use"
Use a different port:
```bash
set PORT=5000 && npm start
```

### "Cannot find module 'express'"
Reinstall dependencies:
```bash
npm install
```

### CORS errors in browser
The server has CORS enabled. Make sure frontend requests use the correct API URL:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### Files not being saved
Check that the `data/` folder exists and has write permissions.

## Production Deployment

Before deploying to production:

1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Set up a database instead of JSON files
4. Add authentication/authorization
5. Use HTTPS
6. Set up email notifications for contact forms

Example with PM2:
```bash
npm install -g pm2
pm2 start server.js
pm2 save
```

## Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm start`
3. ✅ Visit `http://localhost:3000`
4. ✅ Test API endpoints using the browser or Postman
5. ✅ Frontend will automatically use the API when you call `fetchServices()`, etc.

## Support
For issues or questions, contact: neatkreate@gmail.com

---
**Version**: 1.0.0  
**Last Updated**: 2025-11-30
