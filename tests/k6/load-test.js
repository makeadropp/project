import { check, sleep } from 'k6';
import http from 'k6/http';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  scenarios: {
    // Teste de smoke: poucos usuários para verificar se o sistema funciona
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
      gracefulStop: '30s',
      exec: 'smoke',
    },
    // Teste de carga: aumenta gradualmente o número de usuários
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 10 },  // Sobe para 10 usuários em 2 minutos
        { duration: '5m', target: 10 },  // Mantém 10 usuários por 5 minutos
        { duration: '2m', target: 20 },  // Sobe para 20 usuários em 2 minutos
        { duration: '5m', target: 20 },  // Mantém 20 usuários por 5 minutos
        { duration: '2m', target: 0 },   // Desce para 0 usuários em 2 minutos
      ],
      gracefulStop: '30s',
      exec: 'load',
    },
    // Teste de stress: testa os limites do sistema
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 30 },  // Sobe para 30 usuários em 2 minutos
        { duration: '5m', target: 30 },  // Mantém 30 usuários por 5 minutos
        { duration: '2m', target: 50 },  // Sobe para 50 usuários em 2 minutos
        { duration: '5m', target: 50 },  // Mantém 50 usuários por 5 minutos
        { duration: '2m', target: 0 },   // Desce para 0 usuários em 2 minutos
      ],
      gracefulStop: '30s',
      exec: 'stress',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requisições devem completar em menos de 500ms
    http_req_failed: ['rate<0.01'],   // Menos de 1% de falhas
    errors: ['rate<0.01'],            // Menos de 1% de erros
  },
};

// URL base da API
const BASE_URL = 'https://k8s.orb.local';

// Função auxiliar para fazer a requisição e verificar a resposta
function makeHealthCheck() {
  const response = http.get(`${BASE_URL}/addresses/health`);
  
  const checkResult = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!checkResult);

  sleep(1);
}

export function smoke() {
  makeHealthCheck();
}

export function load() {
  makeHealthCheck();
}

export function stress() {
  makeHealthCheck();
}
