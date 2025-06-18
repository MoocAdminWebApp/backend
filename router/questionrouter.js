const express = require("express");
const router = express.Router();
const controller = require('../controller/questionController');

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
router.get("/", controller.getQuestions)


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
router.get("/:id", controller.getQuestionById)


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
router.post("/", controller.createQuestion)

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Create a new question
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
router.delete("/:id", controller.deleteQuestionById)


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
router.put("/:id", controller.updateQuestionById)

module.exports = router
