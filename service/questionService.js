const { EntityNotFoundException, ValidationException } = require('../common/commonError')
const db = require('../models')
const Question = db.Question
const Option = db.Option
const { Op } = require("sequelize")

const checkQuestionIdExist = async(id) => {
  const question = await Question.findByPk(id)
  if(!question){
    throw new EntityNotFoundException(`Question with ID: ${id} not found!`)
  }
}

const getAllQuestions = async (query) => {
  const { page = 1, limit = 10, title } = query;
  const offset = (page - 1) * limit;
  

  const where = {};

  if (title) {
    where[Op.or] = [
      { content: { [Op.like]: `%${title}%` } },  
      { category: { [Op.like]: `%${title}%` } }     
    ];
  }
  const { count, rows } = await Question.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [
      {
        model: Option,
        as: "options",
        attributes: ["id", "content", "isCorrect"],
      },
    ],
    order: [["id", "ASC"]],
  });
  return { isSuccess: true, message: "", data: { total: count, items: rows } };
};

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
  const {category, type, content, difficulty } = body
  const newQuestion = await Question.create({
    category,
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

const bulkDeleteQuestions = async(body) => {
  const ids = body.ids
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ValidationException("Questions IDs required")
  }

  await Question.destroy({
    where: {id: ids}
  })

  return
}

const updateQuestionById = async(id, body) => {
  await checkQuestionIdExist(id)

  const question = await Question.findByPk(id)

  const {category, type, content, difficulty, updatedBy } = body
  const updatedQuestion = await question.update({
    category: category ?? null,
    type: type ?? null,
    content: content ?? null,
    difficulty: difficulty ?? null,
    updatedBy: updatedBy ?? null,
  });

  return updatedQuestion
}

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  deleteQuestionById,
  bulkDeleteQuestions,
  updateQuestionById
}