const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../db/sequelizedb");
const models = require("../models");

describe("Category API CRUD", () => {
  let token;
  let rootId;
  let childId;

  beforeAll(async () => {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    const loginRes = await request(app).post("/api/login").send({
      email: "alice@gmail.com",
      password: "password12",
    });

    expect(loginRes.statusCode).toBe(200);
    token = loginRes.headers["set-cookie"].find(c => c.includes("token"));
    expect(token).toBeDefined();
  });

  afterAll(async () => {
    await sequelize.close();
    await models.sequelize.close();
  });

  test("POST /api/categories – create root category", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Cookie", token)
      .send({ name: "Root Cat", isPublic: true });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.name).toBe("Root Cat");

    rootId = res.body.data.id;
  });

  test("POST /api/categories – create child category", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Cookie", token)
      .send({ name: "Child Cat", parentId: rootId, isPublic: true });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.parentId).toBe(rootId);

    childId = res.body.data.id;
  });

  test("GET /api/categories – should return paginated list with created categories", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Cookie", token)
      .query({ page: 1, pageSize: 10 });

    expect(res.statusCode).toBe(200);
    const { list, pagination } = res.body.data;

    const ids = list.map(c => c.id);
    expect(ids).toEqual(expect.arrayContaining([rootId, childId]));

    expect(pagination).toMatchObject({
      page: 1,
      pageSize: 10,
      total: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  test("GET /api/categories/root – should return only top-level categories", async () => {
    const res = await request(app).get("/api/categories/root").set("Cookie", token);

    expect(res.statusCode).toBe(200);
    const { list } = res.body.data;

    expect(list.every(c => c.parentId === null)).toBe(true);
    expect(list.map(c => c.id)).toContain(rootId);
  });

  test("GET /api/categories/:id – should return specific category", async () => {
    const res = await request(app).get(`/api/categories/${childId}`).set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      id: childId,
      name: "Child Cat",
      parentId: rootId,
    });
  });

  test("GET /api/categories/:id/children – should return children of parent", async () => {
    const res = await request(app).get(`/api/categories/${rootId}/children`).set("Cookie", token);

    expect(res.statusCode).toBe(200);
    const { list } = res.body.data;

    expect(list.every(c => c.parentId === rootId)).toBe(true);
    expect(list.map(c => c.id)).toContain(childId);
  });
});
