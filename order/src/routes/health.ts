import { Hono } from 'hono';

const router = new Hono();

router.get('/', c => {
  return c.json({
    status: 'success',
    message: 'Order service is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
