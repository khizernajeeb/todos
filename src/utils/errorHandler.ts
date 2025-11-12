import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  return reply.status(statusCode).send({
    error: message,
    statusCode,
  });
}
