# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Get All Services
**GET** `/services`

**Response:**
```json
[
  {
    "id": 1,
    "name": "General Consultation",
    "description": "Comprehensive health checkups...",
    "icon": "🏥",
    "price": "$50",
    "duration": "30 minutes",
    "features": ["Initial health assessment", "Blood pressure and vital signs check", ...]
  }
]
```

---

### 2. Get Service by ID
**GET** `/services/:id`

**Parameters:**
- `id` (number): Service ID

**Response:**
```json
{
  "id": 1,
  "name": "General Consultation",
  "description": "...",
  "icon": "🏥",
  "price": "$50",
  "duration": "30 minutes",
  "features": [...]
}
```

---

### 3. Get All Blog Posts
**GET** `/blog`

**Response:**
```json
[
  {
    "id": "post-healthy-living",
    "title": "5 Tips for Healthy Living",
    "date": "2025-11-20",
    "author": "Dr. Ama Mensah",
    "category": "Wellness",
    "excerpt": "Discover simple lifestyle changes...",
    "content": "Full article content here...",
    "image": "assets/img/blog/healthy-living.jpg"
  }
]
```

---

### 4. Get Blog Post by ID
**GET** `/blog/:id`

**Parameters:**
- `id` (string): Post ID (e.g., "post-healthy-living")

**Response:**
```json
{
  "id": "post-healthy-living",
  "title": "5 Tips for Healthy Living",
  "date": "2025-11-20",
  "author": "Dr. Ama Mensah",
  "category": "Wellness",
  "excerpt": "...",
  "content": "Full content...",
  "image": "assets/img/blog/healthy-living.jpg"
}
```

---

### 5. Submit Contact Form
**POST** `/contact`

**Request Body:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about services",
  "message": "I would like more information about..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Your message has been received. We will contact you soon.",
  "id": 1234567890
}
```

**Response (Error):**
```json
{
  "error": "All fields are required"
}
```

---

### 6. Book Appointment
**POST** `/appointments`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+233 501 234 567",
  "message": "I need a general consultation"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Your appointment request has been received. We will contact you shortly.",
  "id": 1234567890
}
```

**Response (Error):**
```json
{
  "error": "All fields are required"
}
```

---

### 7. Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2025-11-30T14:23:45.123Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "All fields are required"
}
```

### 404 Not Found
```json
{
  "error": "Service not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to load services"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Example Requests

### Using Fetch API

```javascript
// Get all services
fetch('http://localhost:3000/api/services')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Submit contact form
fetch('http://localhost:3000/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullname: 'John Doe',
    email: 'john@example.com',
    subject: 'Question',
    message: 'I have a question about your services'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Using cURL

```bash
# Get all services
curl http://localhost:3000/api/services

# Submit contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"fullname":"John","email":"john@example.com","subject":"Help","message":"Test"}'
```

### Using Postman

1. Create new request
2. Set method to GET or POST
3. Enter URL: `http://localhost:3000/api/[endpoint]`
4. For POST requests, go to Body tab
5. Select "raw" and set format to JSON
6. Paste JSON data
7. Click Send

---

## CORS Headers
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

All endpoints are CORS-enabled for frontend integration.

---

**API Version**: 1.0.0  
**Last Updated**: 2025-11-30
