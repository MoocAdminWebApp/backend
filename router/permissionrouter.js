const express = require("express");
const router = express.Router();
const permissionController = require("../controller/permissionController");
const { commonValidate } = require("../middleware/expressValidator");
const { body, param, query } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Permission management APIs
 */

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 */
router.get("/", permissionController.getAllPermissions);

/**
 * @swagger
 * /api/permissions/page:
 *   get:
 *     summary: Get permissions with pagination and flexible filters
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (starting from 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of permissions per page
 *       - in: query
 *         name: fuzzyKeys
 *         schema:
 *           type: string
 *           example: "permissionName,description"
 *         description: Comma-separated list of fields to apply fuzzy search
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *           example: '{"permissionName":"menu:view", "description":"Permission to view menu"}'
 *         description: JSON string of filter fields and values
 *     responses:
 *       200:
 *         description: Get paged permissions successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/page",
  commonValidate([
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be an integer >= 1"),
    query("pageSize").optional().isInt({ min: 1 }).withMessage("Page size must be an integer >= 1"),
    query("fuzzyKeys").optional().isString(),
    query("filters").optional().isString().withMessage("Filters must be a JSON string"),
  ]),
  permissionController.getPermissionsByPage
);

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Get a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
 */
router.get(
  "/:id",
  commonValidate([param("id").isInt().withMessage("Permission ID must be an integer")]),
  permissionController.getPermissionById
);

/**
 * @swagger
 * /api/permissions/role/{id}/permissions:
 *   get:
 *     summary: Get a permission by roleId
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Permission data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
 */
router.get("/role/:id/permissions", permissionController.getPermissionsByRole);



/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 */
router.post("/", permissionController.createPermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   put:
 *     summary: Update a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Permission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
 */
router.put(
  "/:id",
  commonValidate([param("id").isInt().withMessage("Permission ID must be an integer")]),
  permissionController.updatePermission
);

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Delete a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Permission ID
 *     responses:
 *       204:
 *         description: Permission deleted successfully (no content)
 *       404:
 *         description: Permission not found
 */
router.delete(
  "/:id",
  commonValidate([param("id").isInt().withMessage("Permission ID must be an integer")]),
  permissionController.deletePermission
);

module.exports = router;
