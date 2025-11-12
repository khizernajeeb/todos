import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import Fastify from "fastify";
import pool from "../src/config/database";
import { todoRoutes } from "../src/routes/todo.route";
import { errorHandler } from "../src/utils/errorHandler";

const fastify = Fastify({
  logger: false,
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
});

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

fastify.register(async (fastify) => {
  await fastify.register(todoRoutes, { prefix: "/api" });
});

fastify.setErrorHandler(errorHandler);

export default async (req: any, res: any) => {
  await fastify.ready();
  fastify.server.emit("request", req, res);
};
