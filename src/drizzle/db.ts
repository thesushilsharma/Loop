import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import env from "../../envSchema";

const sql = neon(env.NEON_POSTGRES_DATABASE_URL);
export const db = drizzle({ client: sql });
