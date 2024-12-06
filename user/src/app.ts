import { Hono } from "hono";
import { initializeDatabase } from "./config/database";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";
import { userRouter } from "./routes/user";

export const app = new Hono();

initializeDatabase();

app.route("/health", healthRouter);
app.route("/auth", authRouter);
app.route("/", userRouter);

