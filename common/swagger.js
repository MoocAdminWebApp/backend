const path = require("path");
const swaggerDoc = require("swagger-jsdoc");
//config swagger-jsdoc
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "mk api",
      version: "1.0.0",
      description: `only has user apis and will add more`,
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          value: "Bearer <JWT token here>",
        },
      },
      schemas: {
        Role: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            roleName: { type: "string", example: "admin" },
            description: { type: "string", example: "Administrator role" },
            status: { type: "boolean", example: true },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-27T10:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-27T10:00:00Z",
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "../router/*.js")],
};

const swaggerSpec = swaggerDoc(options);

module.exports = swaggerSpec;
