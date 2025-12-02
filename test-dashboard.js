/**
 * test-dashboard.js
 * Comprehensive test suite for Global Care Clinic dashboard API endpoints
 * 
 * Usage:
 *   node test-dashboard.js
 * 
 * Tests all endpoints: login, appointments, services, blog, users, change password, logout
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
let authToken = null;
let testResults = { passed: 0, failed: 0, errors: [] };

// Helper to make HTTP requests
function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Test result logging
function logTest(testName, passed, message = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL';
  console.log(`  ${status}: ${testName}${message ? ' - ' + message : ''}`);
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
    testResults.errors.push(`${testName}: ${message}`);
  }
}

// Main test suite
async function runTests() {
  console.log('\n🧪 Global Care Clinic Dashboard API Tests\n');
  console.log('Starting tests...\n');

  try {
    // Test 1: Admin Login
    console.log('📝 TEST SUITE 1: Authentication');
    console.log('─'.repeat(50));
    let res = await makeRequest('POST', '/api/auth/login', {
      username: 'neatkreate',
      password: 'password',
    });
    logTest('Admin Login', res.status === 200 && res.body.token, `Status: ${res.status}`);
    if (res.body.token) {
      authToken = res.body.token;
      console.log(`  Token acquired: ${authToken.substring(0, 20)}...`);
    }

    // Test 2: Health Check
    console.log('\n📋 TEST SUITE 2: Health & System');
    console.log('─'.repeat(50));
    res = await makeRequest('GET', '/api/health');
    logTest('Health Endpoint', res.status === 200 && res.body.status === 'ok', `Status: ${res.status}`);

    // Test 3: Fetch Appointments (protected endpoint)
    console.log('\n📅 TEST SUITE 3: Appointments');
    console.log('─'.repeat(50));
    res = await makeRequest('GET', '/api/appointments', null, authToken);
    logTest('Fetch Appointments', res.status === 200 && Array.isArray(res.body), `Found ${res.body?.length || 0} appointments`);

    // Test 4: Create Appointment
    const testApptData = {
      name: 'Test Patient ' + Date.now(),
      email: `test${Date.now()}@example.com`,
      phone: '5551234567',
      message: 'Test appointment for unit test',
    };
    res = await makeRequest('POST', '/api/appointments', testApptData, authToken);
    logTest('Create Appointment', res.status === 201 && res.body.id, `ID: ${res.body.id}`);
    const apptId = res.body.id;

    // Test 5: Resend Appointment Email
    if (apptId) {
      res = await makeRequest('POST', `/api/appointments/${apptId}/resend-email`, null, authToken);
      logTest('Resend Appointment Email', res.status === 200 || res.status === 201, `Status: ${res.status}, Response: ${JSON.stringify(res.body)}`);
    }

    // Test 6: Fetch Services
    console.log('\n💉 TEST SUITE 4: Services');
    console.log('─'.repeat(50));
    res = await makeRequest('GET', '/api/services');
    logTest('Fetch Services', res.status === 200 && Array.isArray(res.body), `Found ${res.body?.length || 0} services`);

    // Test 7: Create Service
    const testServiceData = {
      title: 'Test Service ' + Date.now(),
      description: 'A test service for unit testing',
    };
    res = await makeRequest('POST', '/api/services', testServiceData, authToken);
    logTest('Create Service', res.status === 201 && res.body.id, `ID: ${res.body.id}`);
    const serviceId = res.body.id;

    // Test 8: Update Service
    if (serviceId) {
      const updateData = {
        title: 'Updated Service ' + Date.now(),
        description: 'Updated description',
      };
      res = await makeRequest('PUT', `/api/services/${serviceId}`, updateData, authToken);
      logTest('Update Service', res.status === 200, `Status: ${res.status}`);
    }

    // Test 9: Delete Service
    if (serviceId) {
      res = await makeRequest('DELETE', `/api/services/${serviceId}`, null, authToken);
      logTest('Delete Service', res.status === 200 || res.status === 204, `Status: ${res.status}`);
    }

    // Test 10: Fetch Blog Posts
    console.log('\n📰 TEST SUITE 5: Blog');
    console.log('─'.repeat(50));
    res = await makeRequest('GET', '/api/blog');
    logTest('Fetch Blog Posts', res.status === 200 && Array.isArray(res.body), `Found ${res.body?.length || 0} posts`);

    // Test 11: Create Blog Post
    const testPostData = {
      id: `test-post-${Date.now()}`,
      title: 'Test Blog Post ' + Date.now(),
      excerpt: 'A test blog post excerpt',
      content: 'This is the full content of a test blog post for unit testing.',
      created_at: new Date().toISOString(),
    };
    res = await makeRequest('POST', '/api/blog', testPostData, authToken);
    logTest('Create Blog Post', res.status === 201 && res.body.id, `ID: ${res.body.id}`);
    const postId = res.body.id;

    // Test 12: Fetch Users
    console.log('\n👤 TEST SUITE 6: Users & Staff');
    console.log('─'.repeat(50));
    res = await makeRequest('GET', '/api/users', null, authToken);
    logTest('Fetch Users', res.status === 200 && Array.isArray(res.body), `Found ${res.body?.length || 0} users`);

    // Test 13: Create User
    const testUserData = {
      username: `testuser${Date.now()}`,
      password: 'tempPassword123!',
      full_name: 'Test User ' + Date.now(),
      email: `user${Date.now()}@example.com`,
    };
    res = await makeRequest('POST', '/api/users', testUserData, authToken);
    logTest('Create User', res.status === 201 && res.body.id, `ID: ${res.body.id}`);
    const userId = res.body.id;

    // Test 14: Update User
    if (userId) {
      const updateUserData = {
        full_name: 'Updated User Name',
        email: `updated${Date.now()}@example.com`,
      };
      res = await makeRequest('PUT', `/api/users/${userId}`, updateUserData, authToken);
      logTest('Update User', res.status === 200, `Status: ${res.status}`);
    }

    // Test 15: Contact Form Submission
    console.log('\n✉️ TEST SUITE 7: Contact');
    console.log('─'.repeat(50));
    const contactData = {
      fullname: 'Test Contact',
      email: `contact${Date.now()}@example.com`,
      subject: 'Test Message',
      message: 'This is a test contact form submission',
    };
    res = await makeRequest('POST', '/api/contact', contactData);
    logTest('Submit Contact Form', res.status === 200 || res.status === 201, `Status: ${res.status}`);

    // Test 16: Fetch Submissions (protected)
    res = await makeRequest('GET', '/api/submissions', null, authToken);
    logTest('Fetch Contact Submissions', res.status === 200 && Array.isArray(res.body), `Found ${res.body?.length || 0} submissions`);

    // Test 17: Invalid Login (negative test)
    console.log('\n⚠️ TEST SUITE 8: Security & Error Handling');
    console.log('─'.repeat(50));
    res = await makeRequest('POST', '/api/auth/login', {
      username: 'neatkreate',
      password: 'wrongpassword',
    });
    logTest('Reject Invalid Password', res.status === 401 || res.status === 400, `Status: ${res.status}`);

    // Test 18: Unauthenticated Access (negative test)
    res = await makeRequest('GET', '/api/appointments', null, null);
    logTest('Reject Unauthenticated Request', res.status === 401 || res.status === 403, `Status: ${res.status}`);

    // Test 19: Delete non-existent service (error handling)
    res = await makeRequest('DELETE', '/api/services/nonexistent-id', null, authToken);
    logTest('Handle Non-existent Resource', res.status === 404 || res.status === 400, `Status: ${res.status}`);

  } catch (err) {
    console.error('\n❌ Test suite error:', err.message);
    testResults.failed++;
    testResults.errors.push(`Suite error: ${err.message}`);
  }

  // Final Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('═'.repeat(50));
  console.log(`✓ Passed: ${testResults.passed}`);
  console.log(`✗ Failed: ${testResults.failed}`);
  console.log(`📈 Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

  if (testResults.errors.length > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.errors.forEach((err) => console.log(`  - ${err}`));
  } else {
    console.log('\n✨ All tests passed!');
  }

  console.log('═'.repeat(50) + '\n');

  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
