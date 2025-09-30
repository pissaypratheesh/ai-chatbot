import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

/**
 * Database connection utility that handles both local and production environments
 * 
 * Local Development: Uses local PostgreSQL
 * Production: Uses Neon PostgreSQL
 */
export function createDatabaseConnection() {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL environment variable is not defined");
  }

  // Parse the connection string to determine environment
  const isLocal = process.env.POSTGRES_URL.includes('localhost') || 
                  process.env.POSTGRES_URL.includes('127.0.0.1');
  
  const isNeon = process.env.POSTGRES_URL.includes('neon.tech') || 
                 process.env.POSTGRES_URL.includes('aws.neon.tech');

  // Configure connection based on environment
  const connectionConfig = {
    // Common configuration
    max: 20, // Maximum number of connections
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Connection timeout
    
    // Environment-specific configuration
    ...(isNeon && {
      // Neon-specific optimizations
      ssl: 'require' as const, // Require SSL for Neon
      max_lifetime: 60 * 30, // 30 minutes max connection lifetime
    }),
    
    ...(isLocal && {
      // Local development optimizations
      ssl: false, // No SSL needed for local
      max_lifetime: 60 * 60, // 1 hour max connection lifetime
    }),
  };

  console.log(`🔗 Connecting to ${isLocal ? 'local PostgreSQL' : isNeon ? 'Neon PostgreSQL' : 'PostgreSQL'} database`);
  
  const client = postgres(process.env.POSTGRES_URL, connectionConfig);
  const db = drizzle(client);

  return { client, db, isLocal, isNeon };
}

/**
 * Get database connection info for debugging
 */
export function getDatabaseInfo() {
  if (!process.env.POSTGRES_URL) {
    return { error: "POSTGRES_URL not defined" };
  }

  const url = process.env.POSTGRES_URL;
  const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
  const isNeon = url.includes('neon.tech') || url.includes('aws.neon.tech');
  
  return {
    environment: isLocal ? 'local' : isNeon ? 'neon' : 'unknown',
    host: url.includes('@') ? url.split('@')[1].split('/')[0] : 'unknown',
    database: url.split('/').pop() || 'unknown',
    ssl: isNeon ? 'required' : 'disabled',
  };
}
