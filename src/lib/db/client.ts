import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type DbClient = ReturnType<typeof drizzle<typeof schema>>;

export function getDatabaseUrl(): string | undefined {
  const metaEnv =
    typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env as Record<string, string | undefined>)
      : undefined;

  return (
    metaEnv?.DATABASE_URL ||
    process.env.DATABASE_URL ||
    metaEnv?.POSTGRES_URL ||
    process.env.POSTGRES_URL ||
    undefined
  );
}

/** Returns a Neon/Postgres Drizzle client when DATABASE_URL is configured. */
export function getDb(): DbClient | null {
  const url = getDatabaseUrl();
  if (!url) return null;
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export function getStorageMode(): "postgres" | "file" {
  return getDatabaseUrl() ? "postgres" : "file";
}
