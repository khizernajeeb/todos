import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import Fastify from "fastify";
import pool from "../src/config/database";
import { todoRoutes } from "../src/routes/todo.route";
import { errorHandler } from "../src/utils/errorHandler";
import { env } from "./config/env";

// Create Fastify instance
const fastify = Fastify({
  logger: process.env.NODE_ENV === "development",
});

// Register CORS
// CORS restrictions commented out to allow frontend access
// fastify.register(fastifyCors, {
//   origin: true,
//   credentials: true,
// });
fastify.register(fastifyCors, {
  origin: "*", // Allow all origins
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
});

// Register Swagger
fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: "Todo API",
      description: "A RESTful API for managing todos",
      version: "1.0.0",
    },
    schemes: ["https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      { name: "todos", description: "Todo related endpoints" },
      { name: "health", description: "Health check endpoints" },
    ],
  },
});

fastify.register(fastifySwaggerUI, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: true,
  },
});

// Health endpoint
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

// Register routes
fastify.register(async (fastify) => {
  await fastify.register(todoRoutes, { prefix: "/api" });
});

fastify.setErrorHandler(errorHandler);

// At the end of src/server.ts, replace start() call with:
// Only start server if not in Vercel
if (process.env.VERCEL !== "1") {
  const start = async () => {
    try {
      await pool.query("SELECT NOW()");
      await fastify.listen({ port: env.PORT, host: env.HOST });
      console.log(`🚀 Server running on http://${env.HOST}:${env.PORT}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };
  start();
}

// Export fastify instance for Vercel (if needed)

// Export handler for Vercel
export default async (req: any, res: any) => {
  await fastify.ready();
  fastify.server.emit("request", req, res);
};

export { fastify };
