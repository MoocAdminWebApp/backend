const express = require("express")
const router = express.Router()
const controller = require("../controller/questionSetController");
const { commonValidate } = require("../middleware/expressValidator")
const { body, param, query } = require("express-validator")

router.get("/", 
  commonValidate([

  ]),
  controller.getAllQuestionSets)

router.get("/:id",
  commonValidate([
    param("id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Valid id is required!")
  ]),
  controller.getQuestionSetById)

router.post("/", 
  commonValidate([
    body("title")
    .notEmpty()
    .withMessage("Title is required"),
    body("description")
    .notEmpty()
    .withMessage("Description is required"),
    body("courseId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Course ID must be a integer")
  ]),
  controller.createQuestionSet)

router.delete("/",
  commonValidate([
    body("ids")
    .isArray({ min: 1})
    .withMessage("IDs must be a non-empty array"),
    body("ids.*")
    .isInt({ min: 1 })
    .withMessage("All ids must be a positive integer")
  ]),
  controller.bulkDeleteQuestionSets)

router.delete("/:id",
  commonValidate([
    param("id")
    .isInt({ min:1 })
    .withMessage("ID must be a positive integer")
  ]),
  controller.deleteQuestionSetById)

router.put("/:id",
  commonValidate([
    param("id")
    .isInt({ min:1 })
    .withMessage("ID must be a positive integer"),
    body("title")
    .notEmpty()
    .withMessage("Title is required"),
    body("description")
    .notEmpty()
    .withMessage("Description is required"),
    body("courseId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Course ID must be a integer")
  ]),
  controller.updateQuestionSetById)

router.post("/:id/question/:questionId",
  commonValidate([
    param("id")
    .isInt({ min:1 })
    .withMessage("ID must be a positive integer"),
    param("questionId")
    .isInt({ min:1 })
    .withMessage("ID must be a positive integer"),
  ]),
  controller.attachQuestionToSet)

router.post("/:id/questions",
  commonValidate([
    param("id")
    .isInt({ min:1 })
    .withMessage("ID must be a positive integer"),
    body()
    .isArray({ min:1 })
    .withMessage("Body must be a non-empty array"),
    body("*")
    .isInt({ min:1 })
    .withMessage("Each item in the array must be a positive integer")
  ]),
  controller.attachManyQuestionsToSet)

router.delete("/:id/questions",
  commonValidate([
    param("id")
    .isInt({ min:1 })
    .withMessage("ID must be a positive integer"),
    body()
    .isArray({ min:1 })
    .withMessage("Body must be a non-empty array"),
    body("*")
    .isInt({ min:1 })
    .withMessage("Each item in the array must be a positive integer")
  ]),
  controller.bulkRemoveQuestionsFromSet)

router.delete("/:id/question/:questionId",
  commonValidate([
    param("id")
    .isInt({ min:1 })
    .withMessage("ID must be a positive integer"),
    param("questionId")
    .isInt({ min:1 })
    .withMessage("ID must be a positive integer"),
  ]),
  controller.removeQuestionFromSet)


module.exports = router