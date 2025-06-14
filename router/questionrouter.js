const express = require("express");
const router = express.Router();
const controller = require('../controller/questionController')

router.get("/", controller.getQuestions)
router.get("/:id", controller.getQuestionById)
router.post("/", controller.createQuestion)
router.delete("/:id", controller.deleteQuestionById)
router.put("/:id", controller.updateQuestionById)

module.exports = router
