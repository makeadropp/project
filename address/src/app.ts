import { Hono } from "hono";
import { initializeDatabase } from "./config/database";
import { addressRouter } from "./routes/address";
import { healthRouter } from "./routes/health";

export const app = new Hono();

initializeDatabase();

app.route("/health", healthRouter);
app.route("/", addressRouter);
