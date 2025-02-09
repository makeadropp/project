import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '1m', target: 1000 },   // Ramp up to 100 users
    { duration: '2m', target: 1000 },   // Stay at 100 users for 5 minutes
    { duration: '1m', target: 2000 },   // Ramp up to 200 users
    { duration: '2m', target: 2000 },   // Stay at 200 users for 5 minutes
    { duration: '1m', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.01'],    // Less than 1% of requests should fail
  },
};

export default function () {
  const response = http.get('http://k8s.orb.local/api/user/test');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
