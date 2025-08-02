const express = require("express");
const { body, param, query } = require("express-validator");
const { commonValidate } = require("../middleware/expressValidator");
const chapterController = require("../controller/chapterController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chapters
 *   description: Chapter management
 */

/**
 * @swagger
 * /api/chapters/course/{courseId}:
 *   get:
 *     summary: Get chapters by course ID
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: List of course chapters
 */
router.get(
  "/course/:courseId",
  commonValidate([
    param("courseId").isInt({ min: 1 }),
    query("published").optional().isBoolean(),
  ]),
  chapterController.getChaptersByCourse
);

/**
 * @swagger
 * /api/chapters/page:
 *   get:
 *     summary: Paginated chapter list
 *     tags: [Chapters]
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
 *           default: "{}"
 *       - in: query
 *         name: fuzzyKeys
 *         schema:
 *           type: string
 *           default: '["title","description"]'
 *     responses:
 *       200:
 *         description: Paginated chapters
 */
router.get(
  "/page",
  commonValidate([
    query("page").optional().isInt({ min: 1 }),
    query("pageSize").optional().isInt({ min: 1 }),
    query("filters").optional().isString(),
    query("fuzzyKeys").optional().isString(),
  ]),
  chapterController.getChapterByPage
);

/**
 * @swagger
 * /api/chapters:
 *   get:
 *     summary: Get all chapters with optional filters
 *     tags: [Chapters]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: List of chapters
 */
router.get(
  "/",
  commonValidate([
    query("courseId").optional().isInt({ min: 1 }),
    query("published").optional().isBoolean(),
  ]),
  chapterController.getAllChapters
);

/**
 * @swagger
 * /api/chapters/{id}:
 *   get:
 *     summary: Get chapter by ID
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Chapter detail
 */
router.get(
  "/:id",
  commonValidate([param("id").isInt({ min: 1 })]),
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
 *             required: [courseId, title, createdBy]
 *             properties:
 *               courseId:
 *                 type: integer
 *                 default: 1
 *               title:
 *                 type: string
 *                 default: "New Chapter Title"
 *               createdBy:
 *                 type: integer
 *                 default: 1
 *               description:
 *                 type: string
 *                 default: "章节描述示例"
 *               orderNum:
 *                 type: integer
 *                 default: 0
 *               chapterNumber:
 *                 type: integer
 *                 default: 1
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, HIDDEN]
 *                 default: DRAFT
 *               content:
 *                 type: string
 *                 default: "章节内容示例"
 *               videoUrl:
 *                 type: string
 *                 format: url
 *                 default: "https://example.com/video.mp4"
 *               duration:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Chapter created
 */
router.post(
  "/",
  commonValidate([
    body("courseId").isInt({ min: 1 }),
    body("title").isString().notEmpty().isLength({ max: 255 }),
    body("description").optional().isString().isLength({ max: 1000 }),
    body("orderNum").optional().isInt({ min: 0 }),
    body("chapterNumber").optional().isInt({ min: 1 }),
    body("status").optional().isIn(["DRAFT", "PUBLISHED", "HIDDEN"]),
    body("content").optional().isString(),
    body("videoUrl").optional().isURL().isLength({ max: 500 }),
    body("duration").optional().isInt({ min: 0 }),
    body("createdBy").isInt({ min: 1 }),
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
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [updatedBy]
 *             properties:
 *               updatedBy:
 *                 type: integer
 *                 default: 1
 *               title:
 *                 type: string
 *                 default: "Updated Chapter Title"
 *               description:
 *                 type: string
 *                 default: "更新后的章节描述"
 *               orderNum:
 *                 type: integer
 *                 default: 1
 *               chapterNumber:
 *                 type: integer
 *                 default: 1
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, HIDDEN]
 *                 default: PUBLISHED
 *               content:
 *                 type: string
 *                 default: "更新后的章节内容"
 *               videoUrl:
 *                 type: string
 *                 format: url
 *                 default: "https://example.com/updated-video.mp4"
 *               duration:
 *                 type: integer
 *                 default: 120
 *     responses:
 *       200:
 *         description: Chapter updated
 */
router.put(
  "/:id",
  commonValidate([
    param("id").isInt({ min: 1 }),
    body("updatedBy").isInt({ min: 1 }),
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
 *           example: 1
 *     responses:
 *       200:
 *         description: Chapter deleted
 */
router.delete(
  "/:id",
  commonValidate([param("id").isInt({ min: 1 })]),
  chapterController.deleteChapter
);

/**
 * @swagger
 * /api/chapters/{id}/publish:
 *   patch:
 *     summary: Publish or unpublish chapter
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [isPublished, updatedBy]
 *             properties:
 *               isPublished:
 *                 type: boolean
 *                 default: true
 *               updatedBy:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Publish status updated
 */
router.patch(
  "/:id/publish",
  commonValidate([
    param("id").isInt({ min: 1 }),
    body("isPublished").isBoolean(),
    body("updatedBy").isInt({ min: 1 }),
  ]),
  chapterController.publishChapter
);

/**
 * @swagger
 * /api/chapters/reorder:
 *   post:
 *     summary: Reorder chapters
 *     tags: [Chapters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [chapterOrders, updatedBy]
 *             properties:
 *               chapterOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     orderNum:
 *                       type: integer
 *                       example: 2
 *               updatedBy:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Reorder success
 */
router.post(
  "/reorder",
  commonValidate([
    body("chapterOrders").isArray({ min: 1 }),
    body("chapterOrders.*.id").isInt({ min: 1 }),
    body("chapterOrders.*.orderNum").isInt({ min: 0 }),
    body("updatedBy").isInt({ min: 1 }),
  ]),
  chapterController.reorderChapters
);

/**
 * @swagger
 * /api/chapters/stats:
 *   get:
 *     summary: Get chapter statistics
 *     tags: [Chapters]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Statistics data
 */
router.get(
  "/stats",
  commonValidate([query("courseId").optional().isInt({ min: 1 })]),
  chapterController.getChapterStats
);

/**
 * @swagger
 * /api/chapters/{id}/duplicate:
 *   post:
 *     summary: Duplicate a chapter
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [createdBy]
 *             properties:
 *               createdBy:
 *                 type: integer
 *                 default: 1
 *               targetCourseId:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Chapter duplicated
 */
router.post(
  "/:id/duplicate",
  commonValidate([
    param("id").isInt({ min: 1 }),
    body("createdBy").isInt({ min: 1 }),
    body("targetCourseId").optional().isInt({ min: 1 }),
  ]),
  chapterController.duplicateChapter
);

/**
 * @swagger
 * /api/chapters/search:
 *   get:
 *     summary: Search chapters
 *     tags: [Chapters]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           default: "example keyword"
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *           default: true
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
 *     responses:
 *       200:
 *         description: Search result
 */
router.get(
  "/search",
  commonValidate([
    query("keyword").optional().isString(),
    query("courseId").optional().isInt({ min: 1 }),
    query("isPublished").optional().isBoolean(),
    query("page").optional().isInt({ min: 1 }),
    query("pageSize").optional().isInt({ min: 1 }),
  ]),
  chapterController.searchChapters
);

module.exports = router;
