const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../db/sequelizedb");
const { jwtConfig } = require("../appConfig");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

describe("Log in with a test user", () => {
  beforeAll(async () => {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true }); //clean database need to create a new data item
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    await User.create({
      userName: "alice",
      email: "alice@example.com",
      password: await bcrypt.hash("password123", 10),
      status: true,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /api/login", async () => {
    const res = await request(app).post("/api/login").send({
      userName: "alice@example.com",
      password: "password123",
      status: true,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("token");
    expect(typeof res.body.data).toBe("string");
    expect(res.body.data.length).toBeGreaterThan(10);
    const decoded = jwt.verify(res.body.data.token, jwtConfig.secret);
    expect(decoded).toHaveProperty("id");
    expect(decoded).toHaveProperty("email");
    expect(decoded).toHaveProperty("userName");
    expect(decoded).toHaveProperty("roles");
  });
});
