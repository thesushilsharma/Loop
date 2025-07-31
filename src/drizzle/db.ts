import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import env from "../../envSchema";
import * as schema from "./schema";

const sql = neon(env.NEON_POSTGRES_DATABASE_URL);
export const db = drizzle(sql, { schema });
