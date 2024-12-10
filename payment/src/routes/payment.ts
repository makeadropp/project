import { Hono } from 'hono';
import { PaymentFactory } from '../infra/factories/PaymentFactory';
import { auth } from '../middleware/auth';

const router = new Hono();
const paymentController = PaymentFactory.createController();

// Create new payment
router.post('/', auth, c => paymentController.create(c));

// Get payment by ID
router.get('/:id', auth, c => paymentController.getById(c));

// Update payment
router.put('/:id', auth, c => paymentController.update(c));

// List user payments
router.get('/user/:userId', auth, c => paymentController.listUserPayments(c));

export default router;
