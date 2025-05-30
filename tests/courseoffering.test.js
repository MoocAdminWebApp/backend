const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // 建立測試資料表
});

afterAll(async () => {
  await sequelize.close();
});

describe('CourseOffering API 測試', () => {
  let createdId;

  test('GET /api/courseofferings 應該回傳空陣列', async () => {
    const res = await request(app).get('/api/courseofferings');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('POST /api/courseofferings 應新增成功', async () => {
    const newOffering = {
      courseName: "Node.js advanced",
      teacherName: "David Chen",
      semester: "2025 Spring",
      capacity: 30,
      enrolledCount: 0,
      location: "A101",
      schedule: "Mon 10:00-12:00",
      status: "open"
    };

    const res = await request(app).post('/api/courseofferings').send(newOffering);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.courseName).toBe("Node.js advanced");
    createdId = res.body.id;
  });

  test('GET /api/courseofferings 應該回傳一筆資料', async () => {
    const res = await request(app).get('/api/courseofferings');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].teacherName).toBe("David Chen");
  });

  test('PUT /api/courseofferings/:id 應更新成功', async () => {
    const res = await request(app)
      .put(`/api/courseofferings/${createdId}`)
      .send({ status: "closed" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("closed");
  });

  test('DELETE /api/courseofferings/:id 應刪除成功', async () => {
    const res = await request(app).delete(`/api/courseofferings/${createdId}`);
    expect(res.statusCode).toBe(204);
  });
});
