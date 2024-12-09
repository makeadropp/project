import { Hono } from 'hono';

const router = new Hono();

router.get('/', c => {
  return c.json({
    status: '🚀 Order service runnning!',
    timestamp: new Date().toISOString(),
  });
});

export default router;
