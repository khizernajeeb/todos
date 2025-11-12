import { FastifyInstance } from "fastify";
import { todoController } from "../controllers/todo.controller";
import { createTodoSchema, updateTodoSchema } from "../schemas/todo.schema";

export async function todoRoutes(fastify: FastifyInstance) {
  fastify.get("/todos", todoController.getAllTodo);
  fastify.get("/todos/:id", todoController.getTodoById);
  fastify.post(
    "/todos",
    { schema: createTodoSchema },
    todoController.createTodo
  );
  fastify.put(
    "/todos/:id",
    { schema: updateTodoSchema },
    todoController.updateTodo
  );
  fastify.delete("/todos/:id", todoController.deleteTodo);
}
