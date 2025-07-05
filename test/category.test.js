const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../db/sequelizedb");
const models = require("../models");

describe("Category API CRUD", () => {
  let token;
  let rootId;
  let childId;

  beforeAll(async () => {
    // Reset the database and disable FK checks temporarily
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    // Login as admin user and store token from cookie
    const loginRes = await request(app).post("/api/login").send({
      email: "alice@gmail.com",
      password: "password12",
    });

    expect(loginRes.statusCode).toBe(200);
    token = loginRes.headers["set-cookie"].find(c => c.includes("token"));
    expect(token).toBeDefined();
  });

  afterAll(async () => {
    // Close DB connections after all tests
    await sequelize.close();
    await models.sequelize.close();
  });

  test("POST /api/categories – create parent category", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Cookie", token)
      .send({ name: "Test Parent Category", isPublic: true });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.name).toBe("Test Parent Category");

    // Save parent category ID for future use
    rootId = res.body.data.id;
  });

  test("POST /api/categories – create child category", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Cookie", token)
      .send({ name: "Test Child Category", parentId: rootId, isPublic: true });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.parentId).toBe(rootId);

    // Save child category ID for later tests
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

    // Ensure all returned categories have no parent
    expect(list.every(c => c.parentId === null)).toBe(true);
    expect(list.map(c => c.id)).toContain(rootId);
  });

  test("GET /api/categories/:id – should return specific category", async () => {
    const res = await request(app).get(`/api/categories/${childId}`).set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      id: childId,
      name: "Test Child Category",
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

  test("PUT /api/categories/:id – update category details", async () => {
    const res = await request(app).put(`/api/categories/${rootId}`).set("Cookie", token).send({
      name: "Updated Category Name",
      description: "Updated description",
      isPublic: true,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      id: rootId,
      name: "Updated Category Name",
      description: "Updated description",
      isPublic: true,
    });
  });

  test("DELETE /api/categories/:id – fail to delete category with children", async () => {
    const res = await request(app).delete(`/api/categories/${rootId}`).set("Cookie", token);

    // Deletion should fail due to existing child category
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/subcategories/i);
  });

  test("DELETE /api/categories/:id – delete child category successfully", async () => {
    const res = await request(app).delete(`/api/categories/${childId}`).set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      id: childId,
      isDeleted: true,
      isPublic: false,
    });
  });

  test("DELETE /api/categories/:id – delete parent after children removed", async () => {
    const res = await request(app).delete(`/api/categories/${rootId}`).set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      id: rootId,
      isDeleted: true,
      isPublic: false,
    });
  });
});
