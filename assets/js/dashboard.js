// Dashboard helper functions to call admin APIs
// Requires a valid JWT stored in localStorage as 'gcc_token'

const DASH_API = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('gcc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function adminLogin(username, password) {
  const res = await fetch(`${DASH_API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('gcc_token', data.token);
    return data.user;
  }
  throw new Error(data.error || 'Login failed');
}

async function fetchSubmissions() {
  const res = await fetch(`${DASH_API}/submissions`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Unauthorized or failed');
  return res.json();
}

async function fetchAppointments() {
  const res = await fetch(`${DASH_API}/appointments`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Unauthorized or failed');
  return res.json();
}

async function updateAppointmentStatus(id, status) {
  const res = await fetch(`${DASH_API}/appointments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

async function fetchUsers() {
  const res = await fetch(`${DASH_API}/users`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Unauthorized or failed');
  return res.json();
}

async function createService(service) {
  const res = await fetch(`${DASH_API}/services`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(service)
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

async function updateService(id, service) {
  const res = await fetch(`${DASH_API}/services/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(service)
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

async function deleteService(id) {
  const res = await fetch(`${DASH_API}/services/${id}`, { method: 'DELETE', headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}

// Export for console use in dashboard page
if (typeof window !== 'undefined') {
  window.dashboardAPI = {
    adminLogin,
    fetchSubmissions,
    fetchAppointments,
    updateAppointmentStatus,
    fetchUsers,
    createService,
    updateService,
    deleteService
  };
}

  // Additional admin helpers
  async function fetchServices() {
    const res = await fetch(`${DASH_API}/services`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  }

  async function createBlogPost(post) {
    const res = await fetch(`${DASH_API}/blog`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  }

  async function createUser(user) {
    const res = await fetch(`${DASH_API}/users`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(user)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create user');
    return data;
  }

  async function updateUser(id, body) {
    const res = await fetch(`${DASH_API}/users/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update user');
    return data;
  }

  async function createAppointment(appointment) {
    const res = await fetch(`${DASH_API}/appointments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(appointment)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create appointment');
    return data;
  }

  function logout() {
    localStorage.removeItem('gcc_token');
    window.location.reload();
  }

  // attach new helpers to window
  if (typeof window !== 'undefined') {
    window.dashboardAPI = Object.assign(window.dashboardAPI || {}, {
      fetchServices,
      createBlogPost,
      createUser,
      updateUser,
      createAppointment,
      logout
    });
  }
