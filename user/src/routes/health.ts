import { Hono } from "hono";

export const healthRouter = new Hono({
  strict: false,
});

healthRouter.get("/", (c) => {
  return c.json({
    status: "🚀 User service runnning!",
    timestamp: new Date().toISOString(),
  });
});
