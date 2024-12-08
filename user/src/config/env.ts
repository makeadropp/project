import { z } from "zod";

const envSchema = z.object({
  PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().positive().int())
    .default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
  JWT_SECRET: z.string(),
});

function loadEnvConfig() {
  try {
    const env = envSchema.parse(process.env);
    return {
      ...env,
      IS_PROD: env.NODE_ENV === "production",
      IS_DEV: env.NODE_ENV === "development",
      IS_TEST: env.NODE_ENV === "test",
    } as const;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => {
          return `${err.path.join(".")}: ${err.message}`;
        })
        .join("\n");

      throw new Error(`❌ Invalid environment variables:\n${errorMessages}`);
    }
    throw error;
  }
}

export const env = loadEnvConfig();
type EnvConfig = ReturnType<typeof loadEnvConfig>;
export type { EnvConfig };
