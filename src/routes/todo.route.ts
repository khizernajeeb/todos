import { FastifyInstance } from "fastify";
import { todoController } from "../controllers/todo.controller";

export async function todoRoutes(fastify: FastifyInstance) {
  fastify.get("/todos", todoController.getAllTodo);
  fastify.get("/todos/:id", todoController.getTodoById);
  fastify.post("/todos", todoController.createTodo);
  fastify.put("/todos/:id", todoController.updateTodo);
  fastify.delete("/todos/:id", todoController.deleteTodo);
}
