import { FastifyReply } from "fastify";

export function successResponse<T>(
  reply: FastifyReply,
  data: T,
  statusCode: number = 200
) {
  return reply.status(statusCode).send({
    success: true,
    data,
  });
}

export const sendError = (
  reply: FastifyReply,
  message: string,
  statusCode = 500
) => {
  return reply.status(statusCode).send({
    success: false,
    error: message,
    statusCode,
  });
};
