const express = require("express");
const router = express.Router();
const {
  createAsync,
  getAllAsync,
  getByIdAsync,
  getChildrenByIdAsync,
  getRootCategoriesAsync,
} = require("../controller/categoryController");
const { commonValidate } = require("../middleware/expressValidator");
const { body, param, query } = require("express-validator");

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         parentId:
 *           type: integer
 *           nullable: true
 *         isPublic:
 *           type: boolean
 *         createdBy:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   responses:
 *     Unauthorized:
 *       description: Missing or invalid token
 *     Forbidden:
 *       description: No permission
 *     Conflict:
 *       description: Entity already exists
 *
 * /api/categories:
 *   post:
 *     summary: Create a new course category
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *               parentId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID of parent category (null for top-level)
 *               isPublic:
 *                 type: boolean
 *                 description: Whether this category is visible to students
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */

router.post(
  "/",
  commonValidate([
    body("name")
      .isString()
      .notEmpty()
      .withMessage("Category name is required")
      .isLength({ max: 100 })
      .withMessage("Category name cannot exceed 100 characters"),

    body("parentId").optional({ nullable: true }).isNumeric(),

    body("isPublic").optional().isBoolean(),
  ]),
  createAsync
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all course categories
 *     tags:
 *       - Category
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
 *         description: Number of items per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to search in category name
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         pageSize:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                 time:
 *                   type: string
 *                   format: date-time
 *                 message:
 *                   type: string
 *                   example: Categories retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

router.get(
  "/",
  commonValidate([
    query("page").optional().toInt().isInt({ gt: 0 }),
    query("pageSize").optional().toInt().isInt({ gt: 0 }),
    query("keyword")
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage("Category name cannot exceed 100 characters"),
  ]),
  getAllAsync
);

/**
 * @swagger
 * /api/categories/root:
 *   get:
 *     summary: Get all top-level course categories
 *     tags:
 *       - Category
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to fuzzy-match category name
 *     responses:
 *       200:
 *         description: Top-level categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         pageSize:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                 time:
 *                   type: string
 *                   format: date-time
 *                 message:
 *                   type: string
 *                   example: Top-level categories retrieved successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: No top-level categories found
 */

router.get(
  "/root",
  commonValidate([
    query("page").optional().toInt().isInt({ gt: 0 }),
    query("pageSize").optional().toInt().isInt({ gt: 0 }),
    query("keyword")
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage("Category name cannot exceed 100 characters"),
  ]),
  getRootCategoriesAsync
);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Category not found
 */

router.get("/:id", commonValidate([param("id").exists().bail().isInt({ gt: 0 })]), getByIdAsync);

/**
 * @swagger
 * /api/categories/{id}/children:
 *   get:
 *     summary: Get child categories of a given category
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Parent category ID
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
 *         description: Items per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to search in category name
 *     responses:
 *       200:
 *         description: Child categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         pageSize:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                 time:
 *                   type: string
 *                   format: date-time
 *                 message:
 *                   type: string
 *                   example: Child categories retrieved successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Parent category not found or has no children
 */

router.get(
  "/:id/children",
  commonValidate([
    param("id").exists().bail().isInt({ gt: 0 }),
    query("page").optional().toInt().isInt({ gt: 0 }),
    query("pageSize").optional().toInt().isInt({ gt: 0 }),
    query("keyword")
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage("Category name cannot exceed 100 characters"),
  ]),
  getChildrenByIdAsync
);

module.exports = router;
