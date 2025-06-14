const db = require('../models')
const Question = db.Question
const Option = db.Option

const getQuestions = async() => {
  const questions = await Question.findAll({
    include: [
      {
        model: Option,
        as: "options",
        attributes: ["id", "content", "isCorrect"]
      }
    ]
  })
  return questions
}

const getQuestionById = async(id) => {
  const question = await Question.findByPk(id, {
    include: [
      {
        model: Option,
        as: "options",
        attributes: ["id", "content", "isCorrect"]
      }
    ]
  })
  return question
}

const createQuestion = async(body) => {
  const {type, content, difficulty } = body
  const newQuestion = await Question.create({
    type,
    content,
    difficulty
  })

  return newQuestion
}

const deleteQuestionById = async(id) => {
  const deleted = await Question.destroy({ where: { id }})

  return
}

const updateQuestionById = async(id, body) => {
  const question = await Question.findByPk(id)

  const {type, content, difficulty, updatedBy } = body
  await question.update({
    type: type ?? question.type,
    content: content ?? question.content,
    difficulty: difficulty ?? question.difficulty,
    updatedBy: updatedBy ?? question.updatedBy,
  });

  return newQuestion
}

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  deleteQuestionById,
  updateQuestionById
}