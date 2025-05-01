import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config({ path: '.env' });

// Get database URL with fallback
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set in your .env file.\n" +
    "Example PostgreSQL format: postgresql://username:password@localhost:5432/dbname\n" +
    "Did you create a .env file in your project root?"
  );
}

// Create connection pool
export const pool = new Pool({
  connectionString: databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });