import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import dotenv from "dotenv";
import Fastify from "fastify";
import pool from "./config/database";
import { env } from "./config/env";
import { todoRoutes } from "./routes/todo.route";
import { errorHandler } from "./utils/errorHandler";

const fastify = Fastify({
  logger: {
    level: env.LOG_LEVEL || "info",
    transport:
      env.NODE_ENV === "development"
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
            },
          }
        : undefined,
  },
});
dotenv.config();

const PORT = env.PORT;
const HOST = env.HOST;

fastify.register(fastifyCors, {
  origin: process.env.NODE_ENV === "production" ? [""] : true, // Allow all in development
  credentials: true,
});

// Register Swagger
fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: "Todo API",
      description: "A RESTful API for managing todos",
      version: "1.0.0",
    },
    host: `${HOST}:${PORT}`,
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      {
        name: "todos",
        description: "Todo related endpoints",
      },
      {
        name: "health",
        description: "Health check endpoints",
      },
    ],
  },
});

// Register Swagger UI
fastify.register(fastifySwaggerUI, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list", // or 'full' or 'none'
    deepLinking: true,
  },
  staticCSP: true,
  transformStaticCSP: (header: string) => header,
});

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

fastify.setErrorHandler(errorHandler);

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
