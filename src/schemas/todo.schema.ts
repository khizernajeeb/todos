export const createTodoSchema = {
  tags: ["todos"],
  description: "Create a new todo",
  body: {
    type: "object",
    required: ["title"],
    properties: {
      title: {
        type: "string",
        minLength: 1,
        maxLength: 255,
        description: "Todo title",
      },
      description: {
        type: "string",
        minLength: 1,
        maxLength: 255,
      },
      completed: {
        type: "boolean",
      },
    },
  },
  response: {
    201: {
      type: "object",
      description: "Successfully created todo",
      properties: {
        success: { type: "boolean" },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            title: { type: "string" },
            description: { type: "string" },
            completed: { type: "boolean" },
            created_at: { type: "string" },
            updated_at: { type: "string" },
          },
        },
      },
    },
    400: {
      type: "object",
      description: "Bad request",
      properties: {
        success: { type: "boolean" },
        error: { type: "string" },
      },
    },
  },
};

export const updateTodoSchema = {
  body: {
    type: "object",
    properties: {
      title: {
        type: "string",
        minLength: 1,
        maxLength: 255,
      },
    },
    required: ["title"],
  },
  params: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "int64",
      },
    },
  },
};

export const deleteTodoSchema = {
  tags: ["todos"],
  description: "Delete a todo by ID",
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
        description: "Todo ID",
        // example: "1",
      },
    },
  },
  response: {
    204: {
      type: "null",
      description: "Successfully deleted todo",
    },
    404: {
      type: "object",
      description: "Todo not found",
      properties: {
        success: { type: "boolean" },
        error: { type: "string" },
      },
    },
  },
};

export const getTodoByIdSchema = {
  tags: ["todos"],
  description: "Get a single todo by ID",
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
        description: "Todo ID",
        // example: "1",
      },
    },
  },
  response: {
    200: {
      type: "object",
      description: "Successfully retrieved todo",
      properties: {
        success: { type: "boolean" },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            title: { type: "string" },
            description: { type: "string" },
            completed: { type: "boolean" },
            created_at: { type: "string" },
            updated_at: { type: "string" },
          },
        },
      },
    },
    404: {
      type: "object",
      description: "Todo not found",
      properties: {
        success: { type: "boolean" },
        error: { type: "string" },
      },
    },
  },
};

export const getAllTodosSchema = {
  tags: ["todos"],
  description: "Get all todos",
  response: {
    200: {
      type: "object",
      description: "Successfully retrieved todos",
      properties: {
        success: { type: "boolean" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              title: { type: "string" },
              description: { type: "string" },
              completed: { type: "boolean" },
              created_at: { type: "string" },
              updated_at: { type: "string" },
            },
          },
        },
      },
    },
  },
};
