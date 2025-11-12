import pool from "../config/database";
import { Todo, TodoCreate, TodoUpdate } from "../types";

export const todoModel = {
  async findAll(): Promise<Todo[]> {
    const result = await pool.query("SELECT * FROM todos");
    return result.rows;
  },
  async findById(id: number): Promise<Todo | null> {
    const result = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
    return result.rows[0] || null;
  },
  async create(todo: TodoCreate): Promise<Todo> {
    const result = await pool.query(
      "INSERT INTO todos (title, description, completed) VALUES ($1, $2, $3) RETURNING *",
      [
        todo.title,
        todo.description || null, // Handle undefined description
        todo.completed ?? false, // Default to false if not provided
      ]
    );
    return result.rows[0];
  },
  async update(id: number, todo: TodoUpdate): Promise<Todo | null> {
    const values = [];
    const updates = [];
    let paramCount = 1;

    if (todo.title !== undefined) {
      values.push(todo.title);
      updates.push(`title = $${paramCount}`);
      paramCount++;
    }

    if (todo.description !== undefined) {
      values.push(todo.description);
      updates.push(`description = $${paramCount}`);
      paramCount++;
    }

    if (todo.completed !== undefined) {
      values.push(todo.completed);
      updates.push(`completed = $${paramCount}`);
      paramCount++;
    }

    if (updates.length === 0) {
      return null;
    }

    values.push(id);

    const query = `UPDATE todos SET ${updates.join(
      ", "
    )} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },
};
