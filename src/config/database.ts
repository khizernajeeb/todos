import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Important: Use 1 connection in serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // ✅ Add SSL for production databases
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

// Remove process.exit in serverless environment
if (process.env.VERCEL !== "1") {
  pool.on("connect", () => {
    console.log("✅ Connected to PostgreSQL database");
  });

  pool.on("error", (err: Error) => {
    console.error("❌ Unexpected error on idle client", err);
    if (process.env.NODE_ENV !== "production") {
      process.exit(-1);
    }
  });
}

export default pool;
