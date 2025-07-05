const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/authentication");
const { checkPermissionByRole, getCategoryAccessFilter } = require("../middleware/authorization");
const { paginationValidator } = require("../middleware/pagination");
const { commonValidate } = require("../middleware/expressValidator");
const { body, param, query } = require("express-validator");

const {
  createAsync,
  getAllAsync,
  getByIdAsync,
  getChildrenByIdAsync,
  getRootCategoriesAsync,
  deleteByIdAsync,
  deleteByIdsAsync,
  updateByIdAsync,
} = require("../controller/categoryController");

router.use(requireAuth);

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
 *     summary: Create a new course category (admin only)
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
  checkPermissionByRole("admin"),
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
  getCategoryAccessFilter,
  commonValidate([
    ...paginationValidator,
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
  getCategoryAccessFilter,
  commonValidate([
    ...paginationValidator,
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

router.get(
  "/:id",
  getCategoryAccessFilter,
  commonValidate([param("id").exists().bail().isInt({ gt: 0 })]),
  getByIdAsync
);

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
  getCategoryAccessFilter,
  commonValidate([
    param("id").exists().bail().isInt({ gt: 0 }),
    ...paginationValidator,
    query("keyword")
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage("Category name cannot exceed 100 characters"),
  ]),
  getChildrenByIdAsync
);

/**
 * @swagger
 * /api/categories:
 *   delete:
 *     summary: Soft delete multiple categories (admin only)
 *     tags:
 *       - Category
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
 *                 description: Array of category IDs to delete
 *                 items:
 *                   type: integer
 *     responses:
 *       '200':
 *         description: Categories deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   description: List of deleted category objects
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 time:
 *                   type: string
 *                   format: date-time
 *                 message:
 *                   type: string
 *             example:
 *               isSuccess: true
 *               status: 200
 *               data:
 *                 - id: 8
 *                   name: "Graphic Design"
 *                   description: "Illustration and visual design"
 *                   icon: "https://example.com/icons/frontend.png"
 *                   parentId: 6
 *                   isPublic: false
 *                   createdBy: 1
 *                   updatedBy: 1
 *                   isDeleted: true
 *                   deletedAt: "2025-07-04T15:01:41.000Z"
 *                   createdAt: "2025-06-20T09:42:07.000Z"
 *                   updatedAt: "2025-07-04T15:01:41.000Z"
 *                 - id: 9
 *                   name: "JavaScript"
 *                   description: null
 *                   icon: null
 *                   parentId: 2
 *                   isPublic: false
 *                   createdBy: 1
 *                   updatedBy: null
 *                   isDeleted: true
 *                   deletedAt: "2025-07-04T15:01:41.000Z"
 *                   createdAt: "2025-06-27T12:54:11.000Z"
 *                   updatedAt: "2025-07-04T15:01:41.000Z"
 *               time: "2025-07-04T15:01:41.554Z"
 *               message: "Categories deleted successfully"
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         description: One or more categories not found
 */

router.delete(
  "/",
  checkPermissionByRole("admin"),
  commonValidate([body("ids").isArray({ min: 1 }), body("ids.*").isInt({ gt: 0 })]),
  deleteByIdsAsync
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Soft delete a category (admin only)
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
 *       '200':
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                 status:
 *                   type: integer
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 time:
 *                   type: string
 *                   format: date-time
 *                 message:
 *                   type: string
 *             example:
 *               isSuccess: true
 *               status: 200
 *               data:
 *                 id: 11
 *                 name: "Marketing"
 *                 description: null
 *                 icon: null
 *                 parentId: 10
 *                 isPublic: false
 *                 createdBy: 1
 *                 updatedBy: null
 *                 isDeleted: true
 *                 deletedAt: "2025-07-04T14:56:50.000Z"
 *                 createdAt: "2025-07-04T09:41:03.000Z"
 *                 updatedAt: "2025-07-04T14:56:50.000Z"
 *               time: "2025-07-04T14:56:50.406Z"
 *               message: "Category deleted successfully"
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         description: Category not found
 */

router.delete(
  "/:id",
  checkPermissionByRole("admin"),
  commonValidate([param("id").exists().bail().isInt({ gt: 0 })]),
  deleteByIdAsync
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category by ID (admin only)
 *     description: Update an existing category's details including name, description, icon, and visibility.
 *     tags:
 *       - Category
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Frontend"
 *               description:
 *                 type: string
 *                 example: "Courses related to frontend development"
 *               icon:
 *                 type: string
 *                 maxLength: 255
 *                 example: "frontend-icon.png"
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             example:
 *               isSuccess: true
 *               status: 200
 *               data:
 *                 id: 1
 *                 name: "Programming"
 *                 description: "Coding courses"
 *                 icon: ""
 *                 parentId: null
 *                 isPublic: true
 *                 createdBy: 1
 *                 updatedBy: 1
 *                 isDeleted: false
 *                 deletedAt: null
 *                 createdAt: "2025-06-20T09:42:07.000Z"
 *                 updatedAt: "2025-07-05T06:34:48.702Z"
 *               time: "2025-07-05T06:34:48.705Z"
 *               message: "Category updated successfully"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Category not found
 */

router.put(
  "/:id",
  checkPermissionByRole("admin"),
  commonValidate([
    param("id").exists().bail().isInt({ gt: 0 }),
    body("name")
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage("Category name cannot exceed 100 characters"),
    body("description").optional().isString(),
    body("icon").optional().isString().isLength({ max: 255 }),
    body("isPublic").optional().isBoolean(),
  ]),
  updateByIdAsync
);

module.exports = router;
