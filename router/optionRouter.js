const express = require("express")
const router = express.Router()
const controller = require("../controller/optionController");
const { commonValidate } = require("../middleware/expressValidator")
const { body, param } = require("express-validator")

/**
 * @swagger
 * /api/options/{id}:
 *   get:
 *     summary: Get option by ID
 *     tags: [Options]
 *     parameters: 
 *      - name: id
 *        in: path
 *        description: Option ID
 *        required: true
 *        schema: 
 *          type: integer
 *     responses:
 *       200:
 *         description: Get option by ID successfully
 *       404:
 *         description: Option not Found
 */

router.get("/:id", 
  commonValidate([
    param("id")
      .notEmpty()
      .withMessage("id is required")
      .isInt({ min: 1 })
      .withMessage("ID must be an integer")
  ]),
  controller.getOptionById)


/**
 * @swagger
 * '/api/options':
 *  post:
 *     summary: Create a new option
 *     tags: [Options]
 *     requestBody:
 *       required: true
 *       content:
  *        application/json:
  *           schema:
  *            type: object
  *            required:
  *              - title
  *            properties:
  *              content:
  *                type: string
  *                default: test
  *              isCorrect:
  *                type: boolean
  *                default: true
  *              questionId:
  *                 type: integer
  *                 default: 1
  *     responses:
  *      201:
  *        description: Created
  *      400:
  *        description: Bad Request
 */
router.post("/",
  commonValidate([
    body("content")
      .notEmpty()
      .withMessage("Content is required!"),
    body("isCorrect")
      .notEmpty()
      .withMessage("Field isCorrect is required!"),
    body("questionId")
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Question ID is required and it needs to be an integer!")
  ]),
  controller.createOption)

/**
 * @swagger
 * /api/options/{id}:
 *   put:
 *     summary: Update an option by ID
 *     tags: [Options]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Option ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - isCorrect
 *               - questionId
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated option text"
 *               isCorrect:
 *                 type: boolean
 *                 example: true
 *               questionId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Option updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Option not found
 */

router.put("/:id",
  commonValidate([
    param("id")
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Option ID is required"),
    body("content")
      .notEmpty()
      .withMessage("Content is required!"),
    body("isCorrect")
      .notEmpty()
      .withMessage("Field isCorrect is required!"),
    body("questionId")
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Question ID is required and it needs to be an integer!")
  ]),
  controller.updateOptionById)


/**
 * @swagger
 * /api/options/question/{questionId}:
 *   put:
 *     summary: Replace all options for a specific question
 *     description: Updates the list of options for the specified question ID. Expects an array of option objects.
 *     tags: [Options]
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         description: The ID of the question whose options are being updated
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - content
 *                 - isCorrect
 *               properties:
 *                 content:
 *                   type: string
 *                   example: "Option A"
 *                 isCorrect:
 *                   type: boolean
 *                   example: false
 *     responses:
 *       200:
 *         description: Options updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Question not found
 */

  
router.put("/question/:questionId",
  commonValidate([
    param("questionId")
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Question ID is required"),
    body()
      .isArray({ min: 1})
      .withMessage("Request body must be a non-empty array of options"),
    body("*.content")
      .notEmpty()
      .withMessage("Content is required for all options"),
    
    body("*.isCorrect")
      .notEmpty()
      .isBoolean()
      .withMessage("Field isCorrect is required for all options and it needs to a boolean value"),
    ]),
  controller.updateOptionsByQuestionId)


module.exports = router


