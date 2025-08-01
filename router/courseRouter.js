const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const courseController = require("../controller/courseController");
const { commonValidate } = require("../middleware/expressValidator");

const ECourseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"];

/**
 * @openapi
 * tags:
 *   - name: Courses
 *     description: Course management APIs
 */

/**
 * @openapi
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get("/", courseController.getAllCourses);

/**
 * @openapi
 * /api/courses/page:
 *   get:
 *     summary: Get courses with pagination and filters
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *           example: '{"courseName":"JavaScript"}'
 *       - in: query
 *         name: fuzzyKeys
 *         schema:
 *           type: string
 *           example: "courseName"
 *     responses:
 *       200:
 *         description: Paged courses data
 */
router.get(
  "/page",
  commonValidate([
    query("page").optional().isInt({ min: 1 }),
    query("pageSize").optional().isInt({ min: 1 }),
    query("filters").optional().isString(),
    query("fuzzyKeys").optional().isString(),
  ]),
  courseController.getCoursesByPage
);

/**
 * @openapi
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseName
 *               - instructorId
 *             properties:
 *               courseName:
 *                 type: string
 *                 maxLength: 200
 *                 description: Name of the course
 *               courseDescription:
 *                 type: string
 *                 description: Description of the course
 *               courseCode:
 *                 type: string
 *               instructorId:
 *                 type: integer
 *                 description: ID of the instructor
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *                 description: Status of the course
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/",
  commonValidate([
    body("courseName")
      .isString()
      .notEmpty()
      .withMessage("courseName is required")
      .isLength({ max: 200 })
      .withMessage("courseName max length is 200"),
    body("courseDescription").optional().isString(),
    body("courseCode").optional().isString(),
    body("instructorId")
      .isInt({ min: 1 })
      .withMessage("instructorId must be a positive integer"),
    body("status")
      .optional()
      .isIn(ECourseStatus)
      .withMessage("Invalid status"),
  ]),
  courseController.createCourse
);

/**
 * @openapi
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course found
 *       404:
 *         description: Course not found
 */
router.get(
  "/:id",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("id must be a positive integer"),
  ]),
  courseController.getCourseById
);

/**
 * @openapi
 * /api/courses/{id}:
 *   put:
 *     summary: Update course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *                 maxLength: 200
 *               courseDescription:
 *                 type: string
 *               courseCode:
 *                 type: string
 *               instructorId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 */
router.put(
  "/:id",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("id must be a positive integer"),
    body("courseName").optional().isString().notEmpty(),
    body("courseDescription").optional().isString(),
    body("courseCode").optional().isString(),
    body("instructorId").optional().isInt({ min: 1 }),
    body("status").optional().isIn(ECourseStatus),
  ]),
  courseController.updateCourse
);

/**
 * @openapi
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course ID
 *     responses:
 *       204:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete(
  "/:id",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("id must be a positive integer"),
  ]),
  courseController.deleteCourse
);

module.exports = router;
