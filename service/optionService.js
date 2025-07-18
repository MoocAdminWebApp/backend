const { body } = require("express-validator")
const { EntityNotFoundException } = require("../common/commonError")
const db = require("../models")
const Option = db.Option

const getOptionById = async(id) => {
  const option = Option.findByPk(id)
  if(!option){
    throw new EntityNotFoundException(`Option with ID: ${id} not found`)
  }

  return option
}

const createOption = async(body) => {
  const { content, isCorrect, questionId } = body
  const newOption = Option.create({
    content, isCorrect, questionId
  })

  return newOption
}

const updateOptionById = async(id, body) => {
  const option = await Option.findByPk(id)
  if(!option){
    throw new EntityNotFoundException(`Option with ID: ${id} not found`)
  }
  const { content, isCorrect, questionId } = body
  const updatedOption = await option.update({
    content: content ?? null,
    isCorrect: isCorrect ?? null,
    questionId: questionId ?? null
  })

  return updatedOption
}

const updateOptionsByQuestionId = async(questionId, body) => {
  const newOptions = body

  await Option.destroy({ where : { questionId }})
  const updatedOptions = await Option.bulkCreate(
    newOptions.map(option => ({
      ...option,
      questionId
    }))
  )

  return updatedOptions
}

module.exports = {
  createOption,
  updateOptionById,
  getOptionById,
  updateOptionsByQuestionId
}