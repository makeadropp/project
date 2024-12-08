import { describe, expect, test } from '@jest/globals';
import { app } from '../app'; // Certifica-te de que o caminho está correto

describe('App Routes', () => {
  test('should return health check status', async () => {
    const res = await app.request('http://localhost/health');
    expect(res.status).toBe(200);
  });
});
