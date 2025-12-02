// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// ============ Service API Calls ============

/**
 * Fetch all services from the backend
 */
async function fetchServices() {
  try {
    const response = await fetch(`${API_BASE_URL}/services`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

/**
 * Fetch a single service by ID
 */
async function fetchServiceById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`);
    if (!response.ok) throw new Error('Service not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

// ============ Blog API Calls ============

/**
 * Fetch all blog articles
 */
async function fetchBlogPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/blog`);
    if (!response.ok) throw new Error('Failed to fetch blog posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog article by ID
 */
async function fetchBlogPostById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`);
    if (!response.ok) throw new Error('Article not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// ============ Contact API Calls ============

/**
 * Submit contact form
 */
async function submitContactForm(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Failed to submit form');
    return await response.json();
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { error: 'Failed to submit form', details: error.message };
  }
}

/**
 * Book an appointment
 */
async function bookAppointment(appointmentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });
    
    if (!response.ok) throw new Error('Failed to book appointment');
    return await response.json();
  } catch (error) {
    console.error('Error booking appointment:', error);
    return { error: 'Failed to book appointment', details: error.message };
  }
}

// ============ Utility Functions ============

/**
 * Populate services grid on home page
 */
async function populateServicesGrid(containerId = 'services-grid') {
  const services = await fetchServices();
  const container = document.getElementById(containerId);
  
  if (!container || services.length === 0) {
    console.warn('Services container not found or no services available');
    return;
  }

  container.innerHTML = services.map(service => `
    <div class="card">
      <h3>${service.icon} ${service.name}</h3>
      <p>${service.description}</p>
      <small>Duration: ${service.duration} | ${service.price}</small>
    </div>
  `).join('');
}

/**
 * Populate blog grid
 */
async function populateBlogGrid(containerId = 'blog-grid') {
  const posts = await fetchBlogPosts();
  const container = document.getElementById(containerId);
  
  if (!container || posts.length === 0) {
    console.warn('Blog container not found or no posts available');
    return;
  }

  container.innerHTML = posts.map(post => `
    <article class="blog-card">
      <img src="${post.image}" alt="${post.title}" />
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <small>${post.date} by ${post.author}</small>
      <button type="button" class="read-more" data-target="${post.id}">Read More →</button>
      <div class="full-article" id="${post.id}" aria-hidden="true">
        <p><strong>${post.title}</strong></p>
        <p>${post.content}</p>
      </div>
    </article>
  `).join('');
}

/**
 * Check server health
 */
async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.warn('Server is not running:', error.message);
    return { status: 'Server is not running' };
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchServices,
    fetchServiceById,
    fetchBlogPosts,
    fetchBlogPostById,
    submitContactForm,
    bookAppointment,
    populateServicesGrid,
    populateBlogGrid,
    checkServerHealth
  };
}
