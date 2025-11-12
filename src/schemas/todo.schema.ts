export const createTodoSchema = {
  body: {
    type: "object",
    required: ["title"],
    properties: {
      title: {
        type: "string",
        minLength: 1,
        maxLength: 255,
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
