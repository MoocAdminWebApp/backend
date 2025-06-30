const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../db/sequelizedb");

let questionId

describe("Question API CRUD", () => {
  beforeAll(async() => {
    await sequelize.sync({ force: true})
  })

  afterAll(async() => {
    await sequelize.close()
  })

  test("Create Question POST /api/questions", async() => {
    const question = await Question.create({
      type: "MultipleChoice",
      content: "What is 2 + 2",
      difficulty: "Easy"
    })
    questionId = question.id

    await Option.bulkCreate([
      { questionId, content: "2", isCorrect: false },
      { questionId, content: "4", isCorrect: true },
    ])
  })

  test("should return question with options", async() => {
    const res = await request(app).get(`/api/questions/${questionId}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.toHaveProperty("id", questionId))
    expect(res.body.toHaveProperty("type", "MultipleChoice"))
    expect(res.body.toHaveProperty("content", "What is 2 + 2"))
    expect(res.body.toHaveProperty("difficulty", "Easy"))
    expect(Array.isArray(res.body.options).toBe(true))
    expect(res.body.options.length).toBe(2)

    const optionText = res.body.options.map(option => option.content)
    expect(optionText).toContain("4")
    expect(optionText).toContain("2")
  })

  test("Should return 404 if question ID not found", async() => {
    const res = await request(app).get(`/api/questions/9999`)

    expect(res.statusCode).toBe(404)
    expect(res.body).toHaveProperty("message")
  })
})