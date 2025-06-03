const request = require("supertest");
const app = require("../app"); 
const { sequelize } = require("../db/sequelizedb");

let offeringId;

describe("CourseOffering API CRUD", () => {
  
  beforeAll(async () => {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  });

  
  afterAll(async () => {
    await sequelize.close();
  });

  
  test("POST /api/courseofferings - should create a course offering", async () => {
    const res = await request(app).post("/api/courseofferings").send({
      courseName: "JavaScript advanced",
      teacherName: "Amy Wang",
      semester: "2025 Spring",
      capacity: 50,
      enrolledCount: 10,
      location: "C101",
      schedule: "Monday 10:00-12:00",
      status: 0
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id"); 
    expect(res.body.courseName).toBe("JavaScript advanced");

    offeringId = res.body.id; 
  });

  
  test("PUT /api/courseofferings/:id - should update offering", async () => {
    const res = await request(app).put(`/api/courseofferings/${offeringId}`).send({
      courseName: "JS basics",
      teacherName: "Tom Lee",
      semester: "2025 Summer",
      capacity: 60,
      enrolledCount: 20,
      location: "D202",
      schedule: "Friday 14:00-16:00",
      status: 1
    });

    expect(res.statusCode).toBe(200); 
    expect(res.body.courseName).toBe("JS basics"); 
  });

  test("GET /api/courseofferings - should return all offerings", async () => {
    const res = await request(app).get("/api/courseofferings");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("courseName");
  });

  
  test("GET /api/courseofferings/:id - should return offering by id", async () => {
    const res = await request(app).get(`/api/courseofferings/${offeringId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", offeringId);
    expect(res.body.courseName).toBe("JS basics");
  });

  
  test("DELETE /api/courseofferings/:id - should delete offering", async () => {
    const res = await request(app).delete(`/api/courseofferings/${offeringId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("offering deleted");

  
    const res2 = await request(app).get(`/api/courseofferings/${offeringId}`);
    expect(res2.statusCode).toBe(404); 
  });
});
