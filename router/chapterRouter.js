const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const { commonValidate } = require("../middleware/expressValidator");
const chapterController = require("../controller/chapterController");

/**
 * @swagger
 * tags:
 *   name: Chapters
 *   description: Chapter management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Chapter:
 *       type: object
 *       required:
 *         - courseId
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: Chapter ID
 *         courseId:
 *           type: integer
 *           description: Course ID this chapter belongs to
 *         title:
 *           type: string
 *           maxLength: 255
 *           description: Chapter title
 *         description:
 *           type: string
 *           maxLength: 1000
 *           description: Chapter description
 *         orderIndex:
 *           type: integer
 *           description: Order index in the course
 *         isPublished:
 *           type: boolean
 *           description: Publication status
 *         content:
 *           type: string
 *           description: Chapter content
 *         videoUrl:
 *           type: string
 *           maxLength: 500
 *           description: Video URL
 *         duration:
 *           type: integer
 *           description: Duration in seconds
 *         createdBy:
 *           type: integer
 *           description: Creator user ID
 *         updatedBy:
 *           type: integer
 *           description: Last updater user ID
 */

/**
 * @swagger
 * /api/chapters:
 *   get:
 *     summary: Get all chapters with optional course filter
 *     tags: [Chapters]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: integer
 *         description: Filter by course ID
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filter by publication status
 *     responses:
 *       200:
 *         description: List of chapters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chapter'
 */
router.get("/", 
  commonValidate([
    query("courseId").optional().isInt({ min: 1 }).withMessage("CourseId must be a valid integer"),
    query("published").optional().isBoolean().withMessage("Published must be a boolean")
  ]),
  chapterController.getAllChapters
);

/**
 * @swagger
 * /api/chapters/{id}:
 *   get:
 *     summary: Get a chapter by ID
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chapter ID
 *     responses:
 *       200:
 *         description: Chapter data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Chapter'
 *       404:
 *         description: Chapter not found
 */
router.get("/:id",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("ID must be a valid integer")
  ]),
  chapterController.getChapterById
);

/**
 * @swagger
 * /api/chapters:
 *   post:
 *     summary: Create a new chapter
 *     tags: [Chapters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - title
 *               - createdBy
 *             properties:
 *               courseId:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Introduction to JavaScript"
 *               description:
 *                 type: string
 *                 example: "Basic concepts of JavaScript programming"
 *               orderIndex:
 *                 type: integer
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: "This chapter covers..."
 *               videoUrl:
 *                 type: string
 *                 example: "https://example.com/video.mp4"
 *               duration:
 *                 type: integer
 *                 example: 3600
 *               createdBy:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Chapter created successfully
 *       400:
 *         description: Validation error
 */
router.post("/",
  commonValidate([
    body("courseId").isInt({ min: 1 }).withMessage("CourseId is required and must be a valid integer"),
    body("title").notEmpty().trim().isLength({ max: 255 }).withMessage("Title is required and max 255 characters"),
    body("description").optional().isLength({ max: 1000 }).withMessage("Description max 1000 characters"),
    body("orderIndex").optional().isInt({ min: 0 }).withMessage("OrderIndex must be a non-negative integer"),
    body("content").optional().isString().withMessage("Content must be a string"),
    body("videoUrl").optional().isURL().isLength({ max: 500 }).withMessage("VideoUrl must be a valid URL with max 500 characters"),
    body("duration").optional().isInt({ min: 0 }).withMessage("Duration must be a non-negative integer"),
    body("createdBy").isInt({ min: 1 }).withMessage("CreatedBy is required and must be a valid integer")
  ]),
  chapterController.createChapter
);

/**
 * @swagger
 * /api/chapters/{id}:
 *   put:
 *     summary: Update a chapter
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chapter ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updatedBy
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Advanced JavaScript"
 *               description:
 *                 type: string
 *                 example: "Advanced concepts of JavaScript"
 *               orderIndex:
 *                 type: integer
 *                 example: 2
 *               isPublished:
 *                 type: boolean
 *                 example: true
 *               content:
 *                 type: string
 *                 example: "Updated content..."
 *               videoUrl:
 *                 type: string
 *                 example: "https://example.com/updated-video.mp4"
 *               duration:
 *                 type: integer
 *                 example: 4200
 *               updatedBy:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Chapter updated successfully
 *       404:
 *         description: Chapter not found
 *       400:
 *         description: Validation error
 */
router.put("/:id",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("ID must be a valid integer"),
    body("title").optional().trim().isLength({ max: 255 }).withMessage("Title max 255 characters"),
    body("description").optional().isLength({ max: 1000 }).withMessage("Description max 1000 characters"),
    body("orderIndex").optional().isInt({ min: 0 }).withMessage("OrderIndex must be a non-negative integer"),
    body("isPublished").optional().isBoolean().withMessage("IsPublished must be a boolean"),
    body("content").optional().isString().withMessage("Content must be a string"),
    body("videoUrl").optional().isURL().isLength({ max: 500 }).withMessage("VideoUrl must be a valid URL with max 500 characters"),
    body("duration").optional().isInt({ min: 0 }).withMessage("Duration must be a non-negative integer"),
    body("updatedBy").isInt({ min: 1 }).withMessage("UpdatedBy is required and must be a valid integer")
  ]),
  chapterController.updateChapter
);

/**
 * @swagger
 * /api/chapters/{id}:
 *   delete:
 *     summary: Delete a chapter
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chapter ID
 *     responses:
 *       200:
 *         description: Chapter deleted successfully
 *       404:
 *         description: Chapter not found
 */
router.delete("/:id",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("ID must be a valid integer")
  ]),
  chapterController.deleteChapter
);

/**
 * @swagger
 * /api/chapters/{id}/publish:
 *   patch:
 *     summary: Publish/Unpublish a chapter
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chapter ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isPublished
 *               - updatedBy
 *             properties:
 *               isPublished:
 *                 type: boolean
 *                 example: true
 *               updatedBy:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Chapter publication status updated
 *       404:
 *         description: Chapter not found
 */
router.patch("/:id/publish",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("ID must be a valid integer"),
    body("isPublished").isBoolean().withMessage("IsPublished is required and must be a boolean"),
    body("updatedBy").isInt({ min: 1 }).withMessage("UpdatedBy is required and must be a valid integer")
  ]),
  chapterController.publishChapter
);

/**
 * @swagger
 * /api/chapters/course/{courseId}:
 *   get:
 *     summary: Get all chapters for a specific course
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filter by publication status
 *     responses:
 *       200:
 *         description: List of chapters for the course
 */
router.get("/course/:courseId",
  commonValidate([
    param("courseId").isInt({ min: 1 }).withMessage("CourseId must be a valid integer"),
    query("published").optional().isBoolean().withMessage("Published must be a boolean")
  ]),
  chapterController.getChaptersByCourse
);

module.exports = router;