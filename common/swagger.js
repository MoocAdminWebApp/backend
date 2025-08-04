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
              description:
                "The question type, needs to be one of : Single, Multiple, TrueFalse, ShortAnswer",
            },
            content: {
              type: "string",
              example: "Which HTML tag is used to insert a line break",
            },
            difficulty: {
              type: "string",
              enum: ["Easy", "Medium", "Hard"],
              example: "Easy",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            email: { type: "string", example: "test@example.com" },
            password: { type: "string", example: "123456" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            access: {
              type: "string",
              enum: ["ADMIN", "TEACHER", "STUDENT"],
              example: "ADMIN",
            },
            roleIds: {
              type: "array",
              items: { type: "integer" },
              description: "List of role IDs assigned to the user",
              example: [1, 2],
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-27T10:00:00Z",
              readOnly: true,
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-27T12:00:00Z",
              readOnly: true,
            },
          },
          required: ["email", "password", "firstName", "lastName"],
        },
        UserUpdate: {
          type: "object",
          properties: {
            password: {
              type: "string",
              default: "newpassword",
            },
            firstName: {
              type: "string",
              default: "Jane",
            },
            lastName: {
              type: "string",
              default: "Smith",
            },
            access: {
              type: "string",
              enum: ["ADMIN", "TEACHER", "STUDENT"],
              default: "TEACHER",
            },
            roleIds: {
              type: "array",
              items: { type: "integer" },
              description: "List of new role IDs to assign",
              example: [2],
            },
          },
          description:
            "Only password, firstName, lastName, access, and roleIds can be updated. Id and Email cannot be updated.",
        },
        ProfileBase: {
          type: "object",
          properties: {
            countryCode: { type: "string", example: "+61" },
            phoneNumber: { type: "string", example: "1234567890" },
            country: { type: "string", example: "Australia" },
            state: { type: "string", example: "Victoria" },
            city: { type: "string", example: "Melbourne" },
            streetAddress: { type: "string", example: "123 Collins Street" },
            postalCode: { type: "string", example: "3000" },
            birthdate: {
              type: "string",
              format: "date",
              example: "1990-01-01",
            },
            gender: {
              type: "string",
              enum: ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
              example: "FEMALE",
            },
            avatar: {
              type: "string",
              example: "https://example.com/avatar.jpg",
            },
            bio: {
              type: "string",
              example: "Experienced software engineer with a passion for teaching.",
            },
          },
        },
        ProfileCreate: {
          allOf: [
            {
              type: "object",
              required: ["userId"],
              properties: {
                userId: { type: "integer", example: 6 },
              },
            },
            { $ref: "#/components/schemas/ProfileBase" },
          ],
        },
        ProfileUpdate: {
          $ref: "#/components/schemas/ProfileBase",
        },
        Profile: {
          allOf: [
            {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                userId: { type: "integer", example: 6 },
              },
            },
            { $ref: "#/components/schemas/ProfileBase" },
            {
              type: "object",
              properties: {
                createdBy: { type: "integer", example: 1 },
                updatedBy: { type: "integer", example: 1 },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-06-27T08:00:00Z",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-07-01T14:30:00Z",
                },
              },
            },
          ],
        },
        Permission: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            permissionName: { type: "string", example: "Add Role" },
            description: { type: "string", example: "User can create new roles" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-06-27T10:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-06-27T10:00:00Z",
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
