import { defineConfig } from "drizzle-kit";
import env from "./envSchema";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: {
    url: env.NEON_POSTGRES_DATABASE_URL,
  },
});
