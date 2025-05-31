import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const chatDuration = new Trend('chat_duration');
const resumeDuration = new Trend('resume_duration');
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 }, // Stay at 20 users for 1 minute
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    'chat_duration': ['p(95)<5000'], // 95% of chat requests should be below 5s
    'resume_duration': ['p(95)<5000'], // 95% of resume requests should be below 5s
    'errors': ['rate<0.01'], // Less than 1% of requests should fail
  },
};

const BASE_URL = 'http://localhost:3001';

export default function () {
  // Test chat endpoint
  const chatResponse = http.post(
    `${BASE_URL}/chat`,
    JSON.stringify({ message: 'Hello' }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  chatDuration.add(chatResponse.timings.duration);
  check(chatResponse, {
    'chat status is 200': (r) => r.status === 200,
    'chat has response': (r) => r.json().response !== undefined,
  }) || errorRate.add(1);

  sleep(1);

  // Test resume endpoint
  const resumeResponse = http.get(`${BASE_URL}/resume/user?userId=undefined`);
  resumeDuration.add(resumeResponse.timings.duration);
  check(resumeResponse, {
    'resume status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(1);
} 