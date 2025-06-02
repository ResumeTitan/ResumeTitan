import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration from environment variables
const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:3001';
const CLERK_TOKEN = __ENV.CLERK_TOKEN;
const TEST_USER_ID = __ENV.TEST_USER_ID;

// Test configuration
export const options = {
  stages: [
    { duration: __ENV.RAMP_UP_DURATION || '30s', target: parseInt(__ENV.MAX_VIRTUAL_USERS) || 10 },
    { duration: __ENV.STEADY_STATE_DURATION || '1m', target: parseInt(__ENV.MAX_VIRTUAL_USERS) || 10 },
    { duration: __ENV.RAMP_DOWN_DURATION || '30s', target: 0 },
  ],
  thresholds: {
    'http_req_duration': [`p(95)<${__ENV.MAX_RESPONSE_TIME || 2000}`],
    'errors': [`rate<${__ENV.MAX_ERROR_RATE || 0.1}`],
  },
};

// Common headers
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${CLERK_TOKEN}`,
  'Origin': __ENV.ALLOWED_ORIGINS || 'http://localhost:3000'
};

// Main test function
export default function() {
  // Test chat endpoint
  const chatPayload = JSON.stringify({
    message: __ENV.TEST_MESSAGE || "Can you help me write a resume?"
  });
  
  const chatRes = http.post(`${BASE_URL}/chat`, chatPayload, { headers });
  
  check(chatRes, {
    'chat response status is 200': (r) => r.status === 200,
    'chat response has message': (r) => JSON.parse(r.body).response !== undefined,
  });

  sleep(1);

  // Test getting user's resumes
  const userResumesRes = http.get(`${BASE_URL}/resume/user?userId=${TEST_USER_ID}`, { headers });
  
  check(userResumesRes, {
    'get user resumes status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // Test getting a specific resume (if we have a resume ID)
  if (__ENV.TEST_RESUME_ID) {
    const resumeRes = http.get(`${BASE_URL}/resume?id=${__ENV.TEST_RESUME_ID}`, { headers });
    
    check(resumeRes, {
      'get specific resume status is 200': (r) => r.status === 200,
    });
  }

  sleep(1);

  // Test updating a resume (if we have a resume ID)
  if (__ENV.TEST_RESUME_ID) {
    const updatePayload = JSON.stringify({
      id: __ENV.TEST_RESUME_ID,
      title: __ENV.TEST_RESUME_TITLE || "Updated Test Resume",
      content: __ENV.TEST_RESUME_CONTENT || "Updated test content"
    });
    
    const updateRes = http.put(`${BASE_URL}/resume/update`, updatePayload, { headers });
    
    check(updateRes, {
      'update resume status is 200': (r) => r.status === 200,
    });
  }

  sleep(2);
}

// Handle errors
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'tests/performance/results.json': JSON.stringify(data),
  };
}
