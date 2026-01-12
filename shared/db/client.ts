import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

/**
 * postgres-js client
 * - prepare:false required for serverless / transaction poolers
 */
const client = postgres(DATABASE_URL, {
  prepare: false,
  max: 10,
});

export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === 'development',
});

export type DB = typeof db;
