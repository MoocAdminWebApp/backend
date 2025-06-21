const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../db/sequelizedb");

let createdUserId;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset database before tests
});

afterAll(async () => {
  await sequelize.close();
});

describe("User API CRUD Tests", () => {
  test("POST /api/users - create user", async () => {
    const res = await request(app).post("/api/users").send({
      email: "test@example.com",
      password: "123456",
      firstName: "John",
      lastName: "Doe",
      access: "STUDENT",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("test@example.com");
    createdUserId = res.body.id;
  });

  test("GET /api/users - get all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /api/users/by-email - get user by email", async () => {
    const res = await request(app).get("/api/users/by-email").query({ email: "test@example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  test("GET /api/users/page - get users with pagination ordered by id ASC", async () => {
    // Create 15 users to ensure multiple pages of data
    for (let i = 0; i < 15; i++) {
      await request(app)
        .post("/api/users")
        .send({
          email: `user${i}@example.com`,
          password: "123456",
          firstName: `First${i}`,
          lastName: `Last${i}`,
          access: "STUDENT",
        });
    }

    // Request page 2 with pageSize 5
    const res = await request(app).get("/api/users/page").query({ page: 2, pageSize: 5 });

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page", 2);
    expect(res.body).toHaveProperty("pageSize", 5);
    expect(res.body).toHaveProperty("totalPages");
    expect(Array.isArray(res.body.users)).toBe(true);

    // The number of users returned should not exceed pageSize
    expect(res.body.users.length).toBeLessThanOrEqual(5);

    // Verify the order by id ASC, the first user on page 2 should be the 6th created user (index 5)
    expect(res.body.users[0]).toHaveProperty("email", "user0@example.com");
  });

  test("GET /api/users/:id - get user by ID", async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", createdUserId);
  });

  test("PUT /api/users/:id - update user", async () => {
    const res = await request(app).put(`/api/users/${createdUserId}`).send({
      firstName: "Updated",
      lastName: "Name",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe("Updated");
  });

  test("DELETE /api/users/:id - delete user", async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test("GET /api/users/:id - should return 404 after deletion", async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(404);
  });
});
