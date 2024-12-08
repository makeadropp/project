import { Hono } from "hono";
import { logger } from "hono/logger";
import { initializeDatabase } from "./config/database";
import { healthRouter } from "./routes/health";
import { userRouter } from "./routes/user";
import { notFound, onError } from "stoker/middlewares";

initializeDatabase();

export const app = new Hono({
  strict: false,
});

app.use("*", logger());
app.notFound(notFound);
app.onError(onError);

app.route("/health", healthRouter);
app.route("/", userRouter);
