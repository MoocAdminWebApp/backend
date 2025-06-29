const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { sequelize, CourseOffering } = require("../models");

let token;
let createdId;

beforeAll(async () => {
  // 確保資料乾淨
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  await sequelize.query("DELETE FROM course_offerings");
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

  // 執行登入取得 JWT token
  const loginRes = await request(app).post("/api/login").send({
    email: "alice@gmail.com",
    password: "password12",
  });

  console.log("loginRes.body:", loginRes.body);

  console.log("Login response body:", loginRes.body);

  if (!loginRes.body || !loginRes.body.isSuccess || !loginRes.body.data) {
    throw new Error("Login failed: please check your email and password.");
  }

  token = loginRes.body.data;

  try {
    const decoded = jwt.decode(token);
    console.log(" Decoded JWT token payload:", decoded);
  } catch (err) {
    console.warn("Cannot decode token, is JWT_SECRET correct?");
  }
});

afterAll(async () => {
  await sequelize.close();
});

describe("CourseOffering API CRUD", () => {
  test("POST /api/courseofferings - should create a course offering", async () => {
    const res = await request(app)
      .post("/api/courseofferings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        courseName: "Node.js Basics",
        teacherName: "Mr. Lin",
        semester: "2026 First",
        capacity: 30,
        enrolledCount: 0,
        location: "A101",
        schedule: "7/3/2026-7/6/2026",
        status: 0,
        courseId: 1,
        createdBy: 1,
        updatedBy: 1,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    createdId = res.body.data.id;
  });

  test("PUT /api/courseofferings/:id - should update offering", async () => {
    const res = await request(app)
      .put(`/api/courseofferings/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        courseName: "Node.js Advanced",
        updatedBy: 1,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.courseName).toBe("Node.js Advanced");
  });

  test("GET /api/courseofferings - should return all offerings", async () => {
    const res = await request(app)
      .get("/api/courseofferings")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("GET /api/courseofferings/:id - should return offering by id", async () => {
    const res = await request(app)
      .get(`/api/courseofferings/${createdId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("id", createdId);
  });

  test("DELETE /api/courseofferings/:id - should delete offering", async () => {
    const res = await request(app)
      .delete(`/api/courseofferings/${createdId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});

