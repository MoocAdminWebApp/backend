const express = require("express");
const router = express.Router();
const controller = require("../controller/courseofferingcontroller");

/**
 * @swagger
 * tags:
 *   name: CourseOfferings
 *   description: Course offering management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseOffering:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         courseName:
 *           type: string
 *         teacherName:
 *           type: string
 *         semester:
 *           type: string
 *         capacity:
 *           type: integer
 *         enrolledCount:
 *           type: integer
 *         location:
 *           type: string
 *         schedule:
 *           type: string
 *         status:
 *           type: integer
 *           enum: [0, 1, 2]
 *           description: 0=open, 1=closed, 2=cancelled
 *         courseId:
 *           type: integer
 *         createdBy:
 *           type: integer
 *         updatedBy:
 *           type: integer
 */

/**
 * @swagger
 * /api/courseofferings:
 *   get:
 *     summary: Get all course offerings
 *     tags: [CourseOfferings]
 *     responses:
 *       200:
 *         description: List of course offerings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseOffering'
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/courseofferings/{id}:
 *   get:
 *     summary: Get a course offering by ID
 *     tags: [CourseOfferings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course offering ID
 *     responses:
 *       200:
 *         description: Course offering data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseOffering'
 *       404:
 *         description: Course offering not found
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /api/courseofferings:
 *   post:
 *     summary: Create a new course offering
 *     tags: [CourseOfferings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseOffering'
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseOffering'
 *       400:
 *         description: Bad request
 */
router.post("/", controller.create);

/**
 * @swagger
 * /api/courseofferings/{id}:
 *   put:
 *     summary: Update a course offering by ID
 *     tags: [CourseOfferings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course offering ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseOffering'
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseOffering'
 *       400:
 *         description: Bad request
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /api/courseofferings/{id}:
 *   delete:
 *     summary: Delete a course offering by ID
 *     tags: [CourseOfferings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course offering ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       400:
 *         description: Bad request
 */
router.delete("/:id", controller.remove);

module.exports = router;

