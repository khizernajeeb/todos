import { FastifyInstance } from "fastify";
import { todoController } from "../controllers/todo.controller";
import {
  createTodoSchema,
  deleteTodoSchema,
  getAllTodosSchema,
  getTodoByIdSchema,
  updateTodoSchema,
} from "../schemas/todo.schema";

export async function todoRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/todos",
    { schema: getAllTodosSchema },
    todoController.getAllTodo
  );
  fastify.get(
    "/todos/:id",
    { schema: getTodoByIdSchema },
    todoController.getTodoById
  );
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
  fastify.delete(
    "/todos/:id",
    { schema: deleteTodoSchema },
    todoController.deleteTodo
  );
}
