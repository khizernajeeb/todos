import dotenv from "dotenv";
import Fastify from "fastify";
import pool from "./config/database";
import { todoRoutes } from "./routes/todo.route";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

fastify.get("/health", async (request, reply) => {
  try {
    await pool.query("SELECT NOW()");
    return {
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "error",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown Error",
    };
  }
});

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    await pool.end();
    await fastify.close();
    console.log("✅ Server closed gracefully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

fastify.register(async (fastify) => {
  await fastify.register(todoRoutes, { prefix: "/api" });
});

const start = async () => {
  try {
    await pool.query("SELECT NOW()");
    await fastify.listen({ port: PORT, host: HOST });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
