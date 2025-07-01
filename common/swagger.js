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
            semester: { type: "string", example: "2026 First" },
            capacity: { type: "integer", example: 40 },
            enrolledCount: { type: "integer", example: 35 },
            location: { type: "string", example: "Room A101" },
            schedule: { type: "string", example: "5/3/2026-5/6/2026" },
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
        QuestionInput: {
          type: "object",
          required: ["type", "content"],
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            type: {
              type: "string",
              enum: ["Single", "Multiple", "TrueFalse", "ShortAnswer"],
              example: "Single",
              description: "The question type, needs to be one of : Single, Multiple, TrueFalse, ShortAnswer"
            },
            content: {
              type: "string",
              example: "Which HTML tag is used to insert a line break"
            },
            difficulty: {
              type: "string",
              enum: ["Easy", "Medium", "Hard"],
              example: "Easy"
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