const { EntityNotFoundException } = require('../common/commonError')
const db = require('../models')
const Question = db.Question
const Option = db.Option

const checkQuestionIdExist = async(id) => {
  const question = await Question.findByPk(id)
  if(!question){
    throw new EntityNotFoundException(`Question with ID: ${id} not found!`)
  }
}

const getAllQuestions = async() => {
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

  if(!question) {
    throw new EntityNotFoundException("Question ID not found!")
  }
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
  await checkQuestionIdExist(id)

  const deleted = await Question.destroy({ where: { id }})
  return
}

const updateQuestionById = async(id, body) => {
  await checkQuestionIdExist(id)

  const {type, content, difficulty, updatedBy } = body
  const newQuestion = await question.update({
    type: type ?? question.type,
    content: content ?? question.content,
    difficulty: difficulty ?? question.difficulty,
    updatedBy: updatedBy ?? question.updatedBy,
  });

  return newQuestion
}

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  deleteQuestionById,
  updateQuestionById
}