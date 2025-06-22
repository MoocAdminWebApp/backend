const questionService = require("../service/questionService")

const getAllQuestions = async(req, res, next) => {
  try {
    const questions = await questionService.getAllQuestions(req.query)
    res.status(200).json({
      success: true,
      data: questions.data, 
      meta: questions.meta
    })
  } catch (e) {
    next(e)
  }
}

const getQuestionById = async(req, res, next) => {
  try {
    const questionId = req.params.id
    const question = await questionService.getQuestionById(questionId)
    res.status(200).json({
      success: true,
      data: question
    })
  } catch (e) {
    next(e)
  }
}

const createQuestion = async(req, res, next) => {
  try {
    const newQuestion = await questionService.createQuestion(req.body)
    res.status(201).json({
      success: true,
      data: newQuestion
    })
  } catch (error) {
    next(error)
  }
}

const deleteQuestionById = async(req, res, next) => {
  try {
    const result = await questionService.deleteQuestionById(req.params.id)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

const updateQuestionById = async(req, res, next) => {
  try {
    const questionId = req.params.id
    console.log(req.body)
    const updatedQuestion = await questionService.updateQuestionById(questionId, req.body)
    res.status(201).json({
      success: true,
      data: updatedQuestion
    })
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