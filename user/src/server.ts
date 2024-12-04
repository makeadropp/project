import { serve } from "bun";
import { app } from "./app";
import { env } from "./config/env";

const PORT = env.PORT;

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`API started - Listening on port ${PORT}`);
