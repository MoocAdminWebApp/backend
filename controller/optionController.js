const optionService = require("../service/optionService")

const getOptionById = async(req, res, next) => {
  try {
    const option = await optionService.getOptionById(req.params.id)
    console.log(option)
    res.sendCommonValue(200, "success", option)
  } catch (e) {
    next(e)
  }
}

const createOption = async(req, res, next) => {
  try {
    const newOption = await optionService.createOption(req.body)
    res.sendCommonValue(201, "success", newOption)
  } catch (e) {
    next(e)
  }
}

const updateOptionById = async(req, res, next) => {
  try {
    const updatedOption = await optionService.updateOptionById(req.params.id, req.body)
    res.sendCommonValue(204, "success", updatedOption)
  } catch (e) {
    next(e)
  }
}

const updateOptionsByQuestionId = async(req, res, next) => {
  try {
    const updatedOptions = await optionService.updateOptionsByQuestionId(req.params.questionId, req.body)
    res.sendCommonValue(202, "success", updatedOptions)
  } catch (e) {
    next(e)
  }
}


module.exports = {
  createOption,
  updateOptionById,
  getOptionById,
  updateOptionsByQuestionId
}