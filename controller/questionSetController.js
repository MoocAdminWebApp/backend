const service = require("../service/questionSetService")

const getAllQuestionSets = async(req, res, next) => {
  try {
    const sets = await service.getAllQuestionSets(req.query)
    res.sendCommonValue(200, "success", sets)
  } catch (e) {
    next(e)
  }
}

const getQuestionSetById = async(req, res, next) => {
  try {
    const set = await service.getQuestionSetById(req.params.id)
    res.sendCommonValue(200, "success", set)
  } catch (e) {
    next(e)
  }
}

const createQuestionSet = async(req, res, next) => {
  try {
    const newSet = await service.createQuestionSet(req.body)
    res.sendCommonValue(201, "success", newSet)
  } catch (e) {
    next(e)
  }
}

const deleteQuestionSetById = async(req, res, next) => {
  try {
    await service.deleteQuestionSetById(req.params.id)
    res.sendCommonValue(204, "success")
  } catch (e) {
    next(e)
  }
}

const bulkDeleteQuestionSets = async(req, res, next) => {
  try {
    await service.bulkDeleteQuestionSets(req.body)
    res.sendCommonValue(204, "success")
  } catch (e) {
    next(e)
  }
}

const updateQuestionSetById = async(req, res, next) => {
  try {
    const updatedSet = await service.updateQuestionSetById(req.params.id, req.body)
    res.sendCommonValue(201, "success", updatedSet)
  } catch (e) {
    next(e)
  }
}

const attachQuestionToSet = async(req, res, next) => {
  try {
    const newSet = await service.attachQuestionToSet(req.params.id, req.params.questionId)
    res.sendCommonValue(201, "success", newSet)
  } catch (e) {
    next(e)
  }
}

const attachManyQuestionsToSet = async(req, res, next) => {
  try {
    const newSet = await service.attachManyQuestionsToSet(req.params.id, req.body)
    res.sendCommonValue(201, "success", newSet)
  } catch (e) {
    next(e)
  }
}

const removeQuestionFromSet = async(req, res, next) => {
  try {
    const newSet = await service.removeQuestionFromSet(req.params.id, req.params.questionId)
    res.sendCommonValue(204, "success")
  } catch (e) {
    next(e)
  }
}

const bulkRemoveQuestionsFromSet = async(req, res, next) => {
  try {
    console.log("hi")
    const newSet = await service.bulkRemoveQuestionsFromSet(req.params.id, req.body)
    res.sendCommonValue(204, "success")
  } catch (e) {
    next(e)
  }
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