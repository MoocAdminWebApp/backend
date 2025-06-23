const questionService = require("../service/questionService")

const getAllQuestions = async(req, res, next) => {
  try {
    const questions = await questionService.getAllQuestions(req.query)
    const data = {
      data: questions.data,
      metaData: questions.meta
    }
    res.sendCommonValue(200, "success", data)

  } catch (e) {
    next(e)
  }
}

const getQuestionById = async(req, res, next) => {
  try {
    const questionId = req.params.id
    const question = await questionService.getQuestionById(questionId)
    res.sendCommonValue(200, "success", question)
    
  } catch (e) {
    next(e)
  }
}

const createQuestion = async(req, res, next) => {
  try {
    const newQuestion = await questionService.createQuestion(req.body)
    res.sendCommonValue(201, "success", newQuestion)
  } catch (error) {
    next(error)
  }
}

const deleteQuestionById = async(req, res, next) => {
  try {
    const result = await questionService.deleteQuestionById(req.params.id)
    res.sendCommonValue(204, "success")
  } catch (e) {
    next(e)
  }
}

const updateQuestionById = async(req, res, next) => {
  try {
    const questionId = req.params.id
    const updatedQuestion = await questionService.updateQuestionById(questionId, req.body)
    res.sendCommonValue(201, "success", updatedQuestion)
  } catch (e) {
    next(e)
  }
}

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  deleteQuestionById,
  updateQuestionById
}