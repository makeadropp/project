import { AddressFactory } from '@/infra/factories/AddressFactory';
import { authMiddleware } from '@/middleware/auth';
import { Hono } from 'hono';

export const addressRouter = new Hono({
  strict: false,
});

const repository = AddressFactory.makeRepository();
const useCases = AddressFactory.makeUseCases(repository);
const addressController = AddressFactory.makeController(useCases);

addressRouter.use('/*', authMiddleware);
addressRouter.get('/', c => addressController.list(c));
addressRouter.get('/:id', c => addressController.getByID(c));
addressRouter.post('/', c => addressController.create(c));
