import { app } from "@/app";
import { env } from "@/config/env";
import { serve } from "bun";

const PORT = env.PORT;

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`API started - Listening on port ${PORT}`);
