import { Hono } from 'hono';
import { AddressFactory } from '../infra/factories/AddressFactory';
import { authMiddleware } from '../middleware/auth';

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
addressRouter.put('/:id', c => addressController.update(c));
addressRouter.delete('/:id', c => addressController.delete(c));
