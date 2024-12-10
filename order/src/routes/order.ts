import { Hono } from 'hono';
import { OrderFactory } from '../infra/factories/OrderFactory';
import { auth } from '../middleware/auth';

const router = new Hono();
const orderController = OrderFactory.createController();

// Create new order
router.post('/', auth, c => orderController.create(c));

// Get order by ID
router.get('/:id', auth, c => orderController.getById(c));

// Update order
router.put('/:id', auth, c => orderController.update(c));

// Cancel order
router.delete('/:id', auth, c => orderController.cancel(c));

export default router;
