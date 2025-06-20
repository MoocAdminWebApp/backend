const path = require("path");
const swaggerDoc = require("swagger-jsdoc");

// config swagger-jsdoc
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MOOC25 API",
      version: "1.0.0",
      description: `include all APIs of MOOC25`,
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
        CourseOffering: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            courseName: { type: "string", example: "JavaScript 101" },
            teacherName: { type: "string", example: "John Doe" },
            semester: { type: "string", example: "2025 Fall" },
            capacity: { type: "integer", example: 40 },
            enrolledCount: { type: "integer", example: 35 },
            location: { type: "string", example: "Room A101" },
            schedule: { type: "string", example: "Mon/Wed 10:00–11:30" },
            status: { type: "integer", enum: [0, 1, 2], example: 0 },
            courseId: { type: "integer", example: 1 },
            createdBy: { type: "integer", example: 2 },
            updatedBy: { type: "integer", example: 2 },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-06-15T10:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-06-15T12:00:00Z",
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
