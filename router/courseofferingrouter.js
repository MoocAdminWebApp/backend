const express = require("express");
const { body, param } = require("express-validator");
const { commonValidate } = require("../middleware/expressValidator");

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
 * /api/courseofferings/by-page:
 *   get:
 *     summary: Get paginated list of course offerings
 *     tags: [CourseOfferings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *         description: JSON string for exact match filtering
 *       - in: query
 *         name: fuzzyKeys
 *         schema:
 *           type: string
 *         description: Comma-separated keys for fuzzy search
 *     responses:
 *       200:
 *         description: A paginated list of course offerings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CourseOffering'
 */
router.get("/by-page", controller.getByPage);

/**
 * @swagger
 * /api/courseofferings:
 *   get:
 *     summary: Get all course offerings
 *     tags: [CourseOfferings]
 *     responses:
 *       200:
 *         description: A list of course offerings
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/courseofferings/{id}:
 *   get:
 *     summary: Get course offering by ID
 *     tags: [CourseOfferings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course offering ID
 *     responses:
 *       200:
 *         description: A single course offering
 */
router.get(
  "/:id",
  commonValidate([
    param("id").notEmpty().isInt({ min: 1 }).withMessage("Invalid course offering ID"),
  ]),
  controller.getById
);

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
 *         description: Course offering created
 */
router.post(
  "/",
  commonValidate([
    body("courseName").notEmpty().withMessage("courseName is required"),
    body("teacherName").notEmpty().withMessage("teacherName is required"),
    body("semester").notEmpty().withMessage("semester is required"),
    body("capacity").isInt({ min: 1 }).withMessage("capacity must be a positive integer"),
    body("location").notEmpty().withMessage("location is required"),
    body("schedule").notEmpty().withMessage("schedule is required"),
    body("status").isIn([0, 1, 2]).withMessage("status must be 0, 1, or 2"),
  ]),
  controller.create
);

/**
 * @swagger
 * /api/courseofferings/{id}:
 *   put:
 *     summary: Update a course offering
 *     tags: [CourseOfferings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course offering ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseOffering'
 *     responses:
 *       200:
 *         description: Course offering updated
 */
router.put(
  "/:id",
  commonValidate([
    param("id")
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Invalid course offering ID"),

    body("courseName")
      .optional()
      .notEmpty()
      .withMessage("courseName is required"),

    body("teacherName")
      .optional()
      .notEmpty()
      .withMessage("teacherName is required"),

    body("semester")
      .optional()
      .notEmpty()
      .withMessage("semester is required"),

    body("capacity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("capacity must be a positive integer"),

    body("location")
      .optional()
      .notEmpty()
      .withMessage("location is required"),

    body("schedule")
      .optional()
      .notEmpty()
      .withMessage("schedule is required"),

    body("status")
      .optional()
      .isIn([0, 1, 2])
      .withMessage("status must be 0, 1, or 2"),
  ]),
  controller.update
);

/**
 * @swagger
 * /api/courseofferings/{id}:
 *   delete:
 *     summary: Delete a course offering
 *     tags: [CourseOfferings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course offering ID
 *     responses:
 *       204:
 *         description: Course offering deleted
 */
router.delete(
  "/:id",
  commonValidate([
    param("id").notEmpty().isInt({ min: 1 }).withMessage("Invalid course offering ID"),
  ]),
  controller.deleteOne
);

module.exports = router;
