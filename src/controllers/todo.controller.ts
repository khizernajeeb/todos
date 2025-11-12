import { FastifyReply, FastifyRequest } from "fastify";
import { todoModel } from "../models/todo.model";
import { TodoCreate, TodoUpdate } from "../types";
import { sendError, successResponse } from "../utils/response";

export const todoController = {
  async getAllTodo(request: FastifyRequest, reply: FastifyReply) {
    try {
      const todos = await todoModel.findAll();
      return successResponse(reply, todos, 200);
    } catch (error) {
      return sendError(
        reply,
        error instanceof Error ? error.message : "Unknown Error",
        500
      );
    }
  },

  async getTodoById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);
      if (isNaN(id)) {
        return reply.code(400).send({ error: "Invalid ID" });
      }

      const todo = await todoModel.findById(id);

      if (!todo) {
        return sendError(reply, "Todo not found", 404);
      }

      return successResponse(reply, todo, 200);
    } catch (error) {
      return sendError(
        reply,
        error instanceof Error ? error.message : "Unknown Error",
        500
      );
    }
  },

  async createTodo(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { title } = request.body as TodoCreate;

      if (!title || title.trim() === "") {
        return sendError(reply, "Title is required", 400);
      }

      const todo = await todoModel.create(request.body as TodoCreate);
      return successResponse(reply, todo, 201);
    } catch (error) {
      return sendError(
        reply,
        error instanceof Error ? error.message : "Unknown Error",
        500
      );
    }
  },

  async updateTodo(
    request: FastifyRequest<{ Params: { id: string }; Body: TodoUpdate }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);
      if (isNaN(id)) {
        return sendError(reply, "Invalid ID", 400);
      }

      const todo = await todoModel.update(id, request.body);

      if (!todo) {
        return sendError(reply, "Todo not found", 404);
      }

      return successResponse(reply, todo, 200);
    } catch (error) {
      return sendError(
        reply,
        error instanceof Error ? error.message : "Unknown Error",
        500
      );
    }
  },

  async deleteTodo(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);
      if (isNaN(id)) {
        return sendError(reply, "Invalid ID", 400);
      }

      const deleted = await todoModel.delete(id);

      if (!deleted) {
        return sendError(reply, "Todo not found", 404);
      }

      return successResponse(reply, null, 204);
    } catch (error) {
      return sendError(
        reply,
        error instanceof Error ? error.message : "Unknown Error",
        500
      );
    }
  },
};
