import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({
  path: ".env.local",
});

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  // Detect environment and configure connection accordingly
  const isLocal = process.env.POSTGRES_URL.includes('localhost') || 
                  process.env.POSTGRES_URL.includes('127.0.0.1');
  const isNeon = process.env.POSTGRES_URL.includes('neon.tech') || 
                 process.env.POSTGRES_URL.includes('aws.neon.tech');

  const connectionConfig = {
    max: 1, // Single connection for migrations
    ...(isNeon && {
      ssl: 'require' as const,
    }),
    ...(isLocal && {
      ssl: false,
    }),
  };

  console.log(`🔄 Running migrations on ${isLocal ? 'local PostgreSQL' : isNeon ? 'Neon PostgreSQL' : 'PostgreSQL'} database`);
  
  const connection = postgres(process.env.POSTGRES_URL, connectionConfig);
  const db = drizzle(connection);

  console.log("⏳ Running migrations...");

  const start = Date.now();
  await migrate(db, { migrationsFolder: "./lib/db/migrations" });
  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
