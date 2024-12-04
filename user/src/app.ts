import { Hono } from "hono";
import { healthRouter } from "./routes/health";

export const app = new Hono();

app.route("/health", healthRouter);

