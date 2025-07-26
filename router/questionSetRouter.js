const express = require("express")
const router = express.Router()
const controller = require("../controller/questionSetController");
const { commonValidate } = require("../middleware/expressValidator")
const { body, param, query } = require("express-validator")

/**
 * @swagger
 * /api/question-sets/:
 *   get:
 *     summary: Get all questionSets with optional pagination
 *     tags: [QuestionSets]
 *     parameters: 
 *      - name: page
 *        in: query
 *        description: Page number
 *        required: false
 *        schema: 
 *          type: integer
 *          minimum: 1
 *      - name: limit
 *        in: query
 *        description: Number of items per page
 *        required: false
 *        schema: 
 *          type: integer
 *          minimum: 1
 *      - name: title
 *        in: query
 *        description: Search query
 *        required: false
 *        schema: 
 *          type: string
 *     responses:
 *       200:
 *         description: List of questionSets
 *       404:
 *         description: QuestionSet not Found
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
    .withMessage("Search query must be a string"),
  ]),
  controller.getAllQuestionSets)


  /**
 * @swagger
 * /api/question-sets/{id}:
 *   get:
 *     summary: Get all questionSets with matching ID
 *     tags: [QuestionSets]
 *     parameters: 
 *      - name: id
 *        in: path
 *        description: questionSet ID
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *       200:
 *         description: QuestionSet with matching ID
 *       404:
 *         description: QuestionSet not Found
 */
router.get("/:id",
  commonValidate([
    param("id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Valid id is required!")
  ]),
  controller.getQuestionSetById)


  /**
 * @swagger
 * /api/question-sets/:
 *   post:
 *     summary: Create a new questionSet
 *     tags: [QuestionSets]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -title
 *                -description
 *              properties:
 *                title:
 *                  type: string
 *                  example: Intro to React
 *                description:
 *                  type: string
 *                  example: Introductory course to the basic of React
 *                courseId:
 *                  type: integer
 *                  example: 1
 *     responses:
 *       201:
 *         description: QuestionSet created
 *       400:
 *         description: Validation Error
 */
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


/**
 * @swagger
 * /api/question-sets/:
 *   delete:
 *     summary: Bulk delete questionSets
 *     tags: [QuestionSets]
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
 *                 description: Array of questionSet IDs to delete
 *     responses:
 *       204:
 *         description: QuestionSets deleted successfully
 *       400:
 *         description: Invalid request (e.g. no IDs provided)
 *       500:
 *         description: Internal server error
 */
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


/**
 * @swagger
 * /api/question-sets/{id}:
 *   delete:
 *     summary: Delete a questionSet
 *     tags: [QuestionSets]
 *     parameters: 
 *      - name: id
 *        in: path
 *        description: QuestionSet ID
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
    .isInt({ min:1 })
    .withMessage("ID must be a positive integer")
  ]),
  controller.deleteQuestionSetById)


  /**
 * @swagger
 * /api/question-sets/{id}:
 *   put:
 *     summary: Update a questionSet
 *     tags: [QuestionSets]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: QuestionSet ID
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -title
 *                -description
 *              properties:
 *                title:
 *                  type: string
 *                  example: Intro to React
 *                description:
 *                  type: string
 *                  example: Introductory course to the basic of React
 *                courseId:
 *                  type: integer
 *                  example: 1
 *     responses:
 *       201:
 *         description: QuestionSet updated
 *       400:
 *         description: Validation Error
 *       404:
 *         description: QuestionSet not found
 */
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


/**
 * @swagger
 * /api/question-sets/{id}/question/{questionId}:
 *   post:
 *     summary: Attach a question to a questionSet
 *     tags: [QuestionSets]
 *     parameters: 
 *      - name: id
 *        in: path
 *        description: QuestionSet ID
 *        required: true
 *        schema: 
 *          type: integer
 *          minimum: 1
 *      - name: questionId
 *        in: path
 *        description: Question ID
 *        required: true
 *        schema: 
 *          type: integer
 *          minimum: 1
 *     responses:
 *       201:
 *         description: Question attached
 *       400:
 *         description: Validation error
 */
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


/**
 * @swagger
 * /api/question-sets/{id}/questions:
 *   post:
 *     summary: Attach many questions to a questionSet
 *     tags: [QuestionSets]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: QuestionSet ID
 *         required: true
 *         schema: 
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: integer
 *             example: [ 1, 2, 3]
 *     responses:
 *       204:
 *         description: Questions attached successfully
 *       400:
 *         description: Invalid request (e.g. no IDs provided)
 *       500:
 *         description: Internal server error
 */
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


/**
 * @swagger
 * /api/question-sets/{id}/questions:
 *   delete:
 *     summary: Bulk delete questionSets
 *     tags: [QuestionSets]
 *     parameters: 
 *      - name: id
 *        in: path
 *        description: QuestionSet ID
 *        required: true
 *        schema: 
 *          type: integer
 *          minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: integer
 *             example: [ 1, 2, 3]
 *     responses:
 *       204:
 *         description: Questions removed from questionSet
 */
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


/**
 * @swagger
 * /api/question-sets/{id}/question/{questionId}:
 *   delete:
 *     summary: Remove a question from a questionSet
 *     tags: [QuestionSets]
 *     parameters: 
 *      - name: id
 *        in: path
 *        description: QuestionSet ID
 *        required: true
 *        schema: 
 *          type: integer
 *          minimum: 1
 *      - name: questionId
 *        in: path
 *        description: Question ID
 *        required: true
 *        schema: 
 *          type: integer
 *          minimum: 1
 *     responses:
 *       204:
 *         description: Question removed from questionSet
 */
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