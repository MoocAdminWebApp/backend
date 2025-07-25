const { EntityNotFoundException, ValidationException, EntityAlreadyExistsException } = require('../common/commonError')
const db = require('../models')
const Question = db.Question
const Option = db.Option
const QuestionSet = db.QuestionSet
const { Op } = require("sequelize")
const checkQuestionIdExist = require("../service/questionService")

const checkQuestionSetIdExist = async(id) => {
  const set = await QuestionSet.findByPk(id)
  if(!set){
    throw new EntityNotFoundException(`QuestionSet with ID: ${id} not found!`)
  }
}

const checkIfArray = async(arr) => {
  if(!Array.isArray(arr) || arr.length === 0){
    throw new ValidationException("Question IDs must be a non-empty array")
  }
}

const getAllQuestionSets = async() => {
  const sets = await QuestionSet.findAll({
    attributes: ["id", "title", "description", "courseId"],
    include: [
      {
        model: Question,
        attributes: ["id", "category", "type", "content", "difficulty"],
        include: [
          {
            model: Option,
            as: "options",
            attributes: ["id", "content", "isCorrect"]
          }
        ]
      }
    ]
  })

  return sets
}

const getQuestionSetById = async(id) => {
  await checkQuestionSetIdExist(id)

  const set = await QuestionSet.findByPk(id, {
    attributes: ["id", "title", "description", "courseId"],
    include: [
      {
        model: Question,
        attributes: ["id", "category", "type", "content", "difficulty"],
        include: [
          {
            model: Option,
            as: "options",
            attributes: ["id", "content", "isCorrect"]
          }
        ]
      }
    ]
  })

  return set
}

const createQuestionSet = async(body) => {
  const {title, description, courseId} = body
  const newSet = await QuestionSet.create({
    title, 
    description, 
    courseId
  })

  return newSet
}

const deleteQuestionSetById = async(id) => {
  await checkQuestionSetIdExist
  await QuestionSet.destroy({ where: {id}})
  return
}

const bulkDeleteQuestionSets = async(body) => {
  const ids = body.ids
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ValidationException("QuestionSet IDs required")
  }

  await QuestionSet.destroy({
    where: {id: ids}
  })

  return
}

const updateQuestionSetById = async(id, body) => {
  await checkQuestionSetIdExist(id)

  const set = await QuestionSet.findByPk(id)

  const {title, description, courseId} = body
  const updatedSet = await set.update({
    title:title ?? null,
    description:description ?? null,
    courseId:courseId ?? null,
  });

  return updatedSet
}

const attachQuestionToSet = async(setId, questionId) => {
  await checkQuestionSetIdExist(setId)

  if(existingQuestionIds.includes(Number(questionId))){
    throw new EntityAlreadyExistsException("no no no")
  }

  const newSet = await set.addQuestion(questionId)

  return newSet
}

const attachManyQuestionsToSet = async(setId, questionIds) => {
  await checkQuestionSetIdExist(setId)
  await checkIfArray(questionIds)

  const set = await QuestionSet.findByPk(setId)
  const existingQuestions = await set.getQuestions({ attributes: ['id'] }); 
  const existingQuestionIds = new Set(existingQuestions.map(q => q.id)) // array of ids to set to apply has() function for performance
  const duplicateIds = questionIds.filter(id => existingQuestionIds.has(id))

  if(duplicateIds.length > 0) throw new EntityAlreadyExistsException(`${duplicateIds.length} IDs are not valid`)

  const newSet = await set.addQuestions(questionIds)

  return newSet
}

const removeQuestionFromSet = async(setId, questionId) => {
  await checkQuestionSetIdExist(setId)

  const set = await QuestionSet.findByPk(setId)
  await set.removeQuestion(questionId)

  return 
}

const bulkRemoveQuestionsFromSet = async(setId, questionIds) => {
  await checkQuestionSetIdExist(setId)
  await checkIfArray(questionIds)

  const set = await QuestionSet.findByPk(setId)
  await set.removeQuestions(questionIds)

  return
}

module.exports = {
  getAllQuestionSets,
  getQuestionSetById,
  createQuestionSet,
  deleteQuestionSetById,
  bulkDeleteQuestionSets,
  updateQuestionSetById,
  attachQuestionToSet,
  attachManyQuestionsToSet,
  removeQuestionFromSet,
  bulkRemoveQuestionsFromSet
}