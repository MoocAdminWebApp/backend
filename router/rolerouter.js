const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");
const { param, body, query } = require("express-validator");
const { commonValidate } = require("../middleware/expressValidator");

/**
 * @openapi
 * tags:
 *   - name: Roles
 *     description: Role management APIs
 */

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     RoleInput:
 *       type: object
 *       required:
 *         - roleName
 *       properties:
 *         roleName:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: boolean
 *         createdBy:
 *           type: integer
 *         updatedBy:
 *           type: integer
 *     Role:
 *       allOf:
 *         - $ref: '#/components/schemas/RoleInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 */

/**
 * @openapi
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized
 */
router.get("/", roleController.getAllRoles);

/**
 * @openapi
 * /api/roles/page:
 *   get:
 *     summary: Get roles with pagination and filters
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
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
 *           example: '{"roleName":"Admin"}'
 *       - in: query
 *         name: fuzzyKeys
 *         schema:
 *           type: string
 *           example: "roleName"
 *     responses:
 *       200:
 *         description: Paged roles data
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/page",
  commonValidate([
    query("page").optional().isInt({ min: 1 }),
    query("pageSize").optional().isInt({ min: 1 }),
    query("filters").optional().isString(),
    query("fuzzyKeys").optional().isString(),
  ]),
  roleController.getRolesByPage
);

/**
 * @openapi
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleInput'
 *     responses:
 *       201:
 *         description: Role created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  commonValidate([
    body("roleName").notEmpty().withMessage("Role name is required"),
    body("description").optional().isString(),
  ]),
  roleController.createRole
);

/**
 * @openapi
 * /api/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Role found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  commonValidate([param("id").isInt().withMessage("Role ID must be an integer")]),
  roleController.getRoleById
);

/**
 * @openapi
 * /api/roles/{id}:
 *   put:
 *     summary: Update a role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleInput'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  commonValidate([
    param("id").isInt().withMessage("Role ID must be an integer"),
    body("roleName").optional().isString(),
    body("description").optional().isString(),
  ]),
  roleController.updateRole
);

/**
 * @openapi
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  commonValidate([param("id").isInt().withMessage("Role ID must be an integer")]),
  roleController.deleteRole
);

/**
 * @openapi
 * /api/roles/{id}/assign:
 *   put:
 *     summary: Assign menus and permissions to a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               menuIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Menus and permissions assigned
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id/assign",
  commonValidate([
    param("id").isInt().withMessage("Role ID must be an integer"),
    body("menuIds").optional().isArray(),
    body("permissionIds").optional().isArray(),
  ]),
  roleController.assignMenuAndPermission
);

module.exports = router;
