import request from 'supertest';
import app from '../app';
import { OrderStatus } from '../domain/enums/OrderStatus';
import { TransportType } from '../domain/enums/TransportType';
import { describe, it, expect } from 'bun:test';

describe('Order Service', () => {
  const mockToken = 'mock.jwt.token';
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockAddressId = '123e4567-e89b-12d3-a456-426614174001';

  describe('Health Check', () => {
    it('should return 200 OK', async () => {
      const response = await request(app.fetch).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('Order Endpoints', () => {
    describe('POST /orders', () => {
      it('should create a new order', async () => {
        const response = await request(app.fetch)
          .post('/orders')
          .set('Authorization', `Bearer ${mockToken}`)
          .send({
            userId: mockUserId,
            pickupAddressId: mockAddressId,
            deliveryAddressId: mockAddressId,
            transportType: TransportType.GROUND,
          });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.status).toBe(OrderStatus.PROCESSING);
      });
    });

    describe('GET /orders/:id', () => {
      it('should return 404 for non-existent order', async () => {
        const response = await request(app.fetch)
          .get(`/orders/${mockUserId}`)
          .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).toBe(404);
      });
    });

    describe('GET /orders/user/:userId', () => {
      it('should return user orders', async () => {
        const response = await request(app.fetch)
          .get(`/orders/user/${mockUserId}`)
          .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('Authentication', () => {
      it('should return 401 without token', async () => {
        const response = await request(app.fetch).get('/orders/123');
        expect(response.status).toBe(401);
      });
    });
  });
});
