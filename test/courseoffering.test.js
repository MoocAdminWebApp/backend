const request = require('supertest');
const app = require('../app');
const { sequelize, CourseOffering, User } = require('../models');

beforeAll(async () => {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await sequelize.query('DELETE FROM course_offerings');
  await sequelize.query('DELETE FROM users');
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

  await User.create({
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    firstName: 'Test',
    lastName: 'User',
    access: 'admin',
    active: true,
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('CourseOffering API CRUD', () => {
  let createdId;

  test('POST /api/courseofferings - should create a course offering', async () => {
    const res = await request(app).post('/api/courseofferings').send({
      courseName: 'Node.js Basics',
      teacherName: 'Mr. Lin',
      semester: '2025 Spring',
      capacity: 30,
      enrolledCount: 0,
      location: 'A101',
      schedule: 'Mon 10:00-12:00',
      status: 0,
      createdBy: 1,
      updatedBy: 1,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  test('PUT /api/courseofferings/:id - should update offering', async () => {
    const res = await request(app).put(`/api/courseofferings/${createdId}`).send({
      courseName: 'Node.js Advanced',
      updatedBy: 1,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.courseName).toBe('Node.js Advanced');
  });

  test('GET /api/courseofferings - should return all offerings', async () => {
    const res = await request(app).get('/api/courseofferings');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/courseofferings/:id - should return offering by id', async () => {
    const res = await request(app).get(`/api/courseofferings/${createdId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdId);
  });

  test('DELETE /api/courseofferings/:id - should delete offering', async () => {
    const res = await request(app).delete(`/api/courseofferings/${createdId}`);
    expect(res.statusCode).toBe(204);
  });
});
