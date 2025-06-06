const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../db/sequelizedb");

let roleId;

describe("Role API CRUD", () => {
  beforeAll(async () => {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /api/roles - createRole", async () => {
    const res = await request(app).post("/api/roles").send({
      roleName: "admin",
      description: "admin role",
      status: true,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.roleName).toBe("admin");

    roleId = res.body.data.id;
  });

  test("PUT /api/roles/:id - updateRole", async () => {
    const res = await request(app).put(`/api/roles/${roleId}`).send({
      roleName: "superAdmin",
      description: "Super admin role",
      status: true,
    });
    console.log("Update Role Response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.roleName).toBe("superAdmin");
  });

  test("GET /api/roles -getAll", async () => {
    const res = await request(app).get("/api/roles");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("roleName");
  });

  test("GET /api/roles/:id - get role by id", async () => {
    const res = await request(app).get(`/api/roles/${roleId}`);
    console.log("getRoleById", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", roleId);
    expect(res.body).toHaveProperty("roleName", "superAdmin");
  });

  test("DELETE /api/roles/:id - delete role by id", async () => {
    const res1 = await request(app).delete(`/api/roles/${roleId}`);
    expect(res1.statusCode).toBe(200);

    const res2 = await request(app).get(`/api/roles/${roleId}`);
    console.log("deleteSuccessOrNot", res2);
    expect(res2.statusCode).toBe(404);
  });
});
