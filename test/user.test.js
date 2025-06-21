const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../db/sequelizedb");

let createdUserId;
let authCookie;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create an admin user for authentication
  await request(app).post("/api/users").send({
    email: "alice@gmail.com",
    password: "password12",
    firstName: "Alice",
    lastName: "Anderson",
    access: "ADMIN",
  });

  // Log in as admin user to obtain auth cookie
  const loginRes = await request(app).post("/api/login").send({
    email: "alice@gmail.com",
    password: "password12",
  });

  const rawCookie = loginRes.headers["set-cookie"][0];
  authCookie = rawCookie.split(";")[0]; // extract token in cookie string
});

afterAll(async () => {
  await sequelize.close();
});

describe("User API CRUD Tests", () => {
  test("GET /api/users/page - get users with pagination ordered by id ASC", async () => {
    for (let i = 0; i < 15; i++) {
      await request(app)
        .post("/api/users")
        .set("Cookie", authCookie)
        .send({
          email: `user${i}@example.com`,
          password: "123456",
          firstName: `First${i}`,
          lastName: `Last${i}`,
          access: "STUDENT",
        });
    }

    const res = await request(app)
      .get("/api/users/page")
      .set("Cookie", authCookie)
      .query({ page: 2, pageSize: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page", 2);
    expect(res.body).toHaveProperty("pageSize", 5);
    expect(res.body).toHaveProperty("totalPages");
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBeLessThanOrEqual(5);
    expect(res.body.users[0]).toHaveProperty("email", "user4@example.com"); //the first one is admin
  });

  test("POST /api/users - create user", async () => {
    const res = await request(app).post("/api/users").set("Cookie", authCookie).send({
      email: "test@example.com",
      password: "123456",
      firstName: "John",
      lastName: "Doe",
      access: "STUDENT",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("test@example.com");
    createdUserId = res.body.id; //global variable used in the following tests
  });

  test("GET /api/users - get all users", async () => {
    const res = await request(app).get("/api/users").set("Cookie", authCookie);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /api/users/by-email - get user by email", async () => {
    const res = await request(app)
      .get("/api/users/by-email")
      .set("Cookie", authCookie)
      .query({ email: "test@example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  test("GET /api/users/:id - get user by ID", async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`).set("Cookie", authCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", createdUserId);
  });

  test("PUT /api/users/:id - update user", async () => {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .set("Cookie", authCookie)
      .send({
        firstName: "UpdatedFirstName",
        lastName: "UpdatedLastName",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe("Updated");
  });

  test("DELETE /api/users/:id - delete user", async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`).set("Cookie", authCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test("GET /api/users/:id - should return 404 after deletion", async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`).set("Cookie", authCookie);

    expect(res.statusCode).toBe(404);
  });
});
