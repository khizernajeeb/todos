import { FastifyReply, FastifyRequest } from "fastify";
import { todoModel } from "../models/todo.model";
import { TodoCreate, TodoUpdate } from "../types";

export const todoController = {
  async getAllTodo(request: FastifyRequest, reply: FastifyReply) {
    try {
      const todos = await todoModel.findAll();
      return reply.status(200).send(todos);
    } catch (error) {
      return reply.status(500).send({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown Error",
      });
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
        return reply.code(404).send({ error: "Todo not found" });
      }

      return reply.status(200).send(todo);
    } catch (error) {
      return reply.status(500).send({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown Error",
      });
    }
  },

  async createTodo(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { title } = request.body as TodoCreate;

      if (!title || title.trim() === "") {
        return reply.code(400).send({ error: "Title is required" });
      }

      const todo = await todoModel.create(request.body as TodoCreate);
      return reply.status(201).send(todo);
    } catch (error) {
      return reply.status(500).send({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown Error",
      });
    }
  },

  async updateTodo(
    request: FastifyRequest<{ Params: { id: string }; Body: TodoUpdate }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);
      if (isNaN(id)) {
        return reply.code(400).send({ error: "Invalid ID" });
      }

      const todo = await todoModel.update(id, request.body);

      if (!todo) {
        return reply.code(404).send({ error: "Todo not found" });
      }

      return reply.status(200).send(todo);
    } catch (error) {
      return reply.status(500).send({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown Error",
      });
    }
  },

  async deleteTodo(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);
      if (isNaN(id)) {
        return reply.code(400).send({ error: "Invalid ID" });
      }

      const deleted = await todoModel.delete(id);

      if (!deleted) {
        return reply.code(404).send({ error: "Todo not found" });
      }

      return reply.status(204).send();
    } catch (error) {
      return reply.status(500).send({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown Error",
      });
    }
  },
};
