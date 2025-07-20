const express = require("express");
const router = express.Router();
const controller = require("../controller/questionController");
const { commonValidate } = require("../middleware/expressValidator")
const { body, param, query } = require("express-validator")

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management APIs  
 */


/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: Get all questions successfully
 */
router.get("/",
  commonValidate([
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),

    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be a positive integer"),

    query("title")
      .optional()
      .isString()
      .withMessage("Search query must be a string"),]),
  controller.getAllQuestions)


/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Questions]
 *     parameters: 
 *      - name: id
 *        in: path
 *        description: Question ID
 *        required: true
 *        schema: 
 *          type: integer
 *     responses:
 *       200:
 *         description: Get question by ID successfully
 */
router.get("/:id",
  commonValidate([
    param("id")
      .notEmpty()
      .withMessage("id is required")
      .isInt({ min: 1 })
      .withMessage("ID must be an integer")
  ]), 
  controller.getQuestionById)


/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionInput'
 *     responses:
 *       201:
 *         description: Question created successfully
 */
router.post("/",
  commonValidate([
    body("category")
      .notEmpty()
      .withMessage("Category is required"),
    body("type")
      .notEmpty()
      .withMessage("Type is required")
      .isIn(["Single", "Multiple", "TrueFalse", "ShortAnswer"])
      .withMessage("Type must be one of [ Single, Multiple, TrueFalse, ShortAnswer ]"),

    body("content")
      .notEmpty()
      .withMessage("Content is required"),

    body("difficulty")
      .optional()
      .isIn(["Easy", "Medium", "Hard"])
      .withMessage("Difficulty must be one of [ Easy, Medium, Hard ]")
  ]),
  controller.createQuestion)


/**
 * @swagger
 * /api/questions/bulk:
 *   delete:
 *     summary: Bulk delete questions
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example:
 *                   [1, 2, 3]
 *                 description: Array of question IDs to delete
 *     responses:
 *       204:
 *         description: Questions deleted successfully
 *       400:
 *         description: Invalid request (e.g. no IDs provided)
 *       500:
 *         description: Internal server error
 */
router.delete("/bulk",
  commonValidate([
    body("ids")
      .isArray({ min: 1 })
      .withMessage("IDs must be a non-empty array"),
    body("ids.*")
      .isInt()
      .withMessage("All ids must be a positive integer")
  ]),
  controller.bulkDeleteQuestions
)

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Questions]
 *     parameters: 
 *      - name: id
 *        in: path
 *        description: Question ID
 *        required: true
 *        schema: 
 *          type: integer
 *     responses:
 *       204:
 *         description: Question deleted
 */
router.delete("/:id",
  commonValidate([
    param("id")
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("ID must be an positive integer")
  ]), 
  controller.deleteQuestionById)



/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Create a new question
 *     tags: [Questions]
 *     parameters: 
 *      - name: id
 *        in: path
 *        description: Question ID
 *        required: true
 *        schema: 
 *          type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionInput'
 *     responses:
 *       201:
 *         description: Question created successfully
 */
router.put("/:id",
  commonValidate([
    param("id")
      .isInt({ min: 1 })
      .withMessage("ID must be an integer"),
    body("type")
      .notEmpty()
      .isIn(["Single", "Multiple", "TrueFalse", "ShortAnswer"])
      .withMessage("Type is required and must be one of [ Single, Multiple, TrueFalse, ShortAnswer ]"),

    body("content")
      .notEmpty()
      .withMessage("Content is required"),

    body("difficulty")
      .optional()
      .isIn(["Easy", "Medium", "Hard"])
      .withMessage("Difficulty must be Easy, Medium, or Hard")
  ]), 
  controller.updateQuestionById)

module.exports = router
