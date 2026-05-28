import { z } from "zod";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const envSchema = z.object({
  PORT: z.coerce.number().optional(),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string(),
  OPENROUTER_API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);