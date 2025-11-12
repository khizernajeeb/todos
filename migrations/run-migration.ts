import fs from "fs";
import path from "path";
import pool from "../src/config/database";

async function runMigration() {
  const client = await pool.connect();
  try {
    const migrationFile = path.join(__dirname, "001_create_todos_table.sql");
    const sql = fs.readFileSync(migrationFile, "utf8");
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    console.log("Migration completed successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  });
