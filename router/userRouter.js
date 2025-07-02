const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const userController = require("../controller/userController");
const { commonValidate } = require("../middleware/expressValidator");

const EUserAccess = ["ADMIN", "TEACHER", "STUDENT"];

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User management APIs
 */

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  commonValidate([
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("access").optional().isIn(EUserAccess).withMessage("Invalid access type"),
  ]),
  userController.createUser
);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Get all users Successfully
 *         content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/", userController.getAllUsers);

/**
 * @openapi
 * /api/users/by-email:
 *   get:
 *     summary: Get user by email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           default: bob@gmail.com
 *     responses:
 *       200:
 *         description: Get user by email successfully
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User with this email not found
 *       500:
 *         description: Server error
 */
router.get(
  "/by-email",
  commonValidate([query("email").isEmail().withMessage("Valid email is required")]),
  userController.getUserByEmail
);

/**
 * @openapi
 * /api/users/page:
 *   get:
 *     summary: Get users with pagination
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (starting from 1)
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: access
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ADMIN, TEACHER, STUDENT]
 *           default: STUDENT
 *         description: Filter users by access type
 *     responses:
 *       200:
 *         description: Get paged users successfully
 *         content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Users with this page information not found
 *       500:
 *         description: Server error
 */
router.get(
  "/page",
  commonValidate([
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be an integer >= 1"),
    query("pageSize").optional().isInt({ min: 1 }).withMessage("Page size must be an integer >= 1"),
  ]),
  userController.getUsersByPage
);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Get user by id successfully
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User with this id not found
 *       500:
 *         description: Server error
 */
router.get(
  "/:id",
  commonValidate([param("id").isInt().withMessage("User ID must be an integer")]),
  userController.getUserById
);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update user by ID, id and email cannot be updated
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       201:
 *         description: User updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: User with this id not found
 *       409:
 *         description: Conflict
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  commonValidate([
    param("id").isInt().withMessage("User ID must be an integer"),
    body("email").not().exists().withMessage("Email cannot be updated"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("firstName").optional().notEmpty().withMessage("First name cannot be empty"),
    body("lastName").optional().notEmpty().withMessage("Last name cannot be empty"),
    body("access").optional().isIn(EUserAccess).withMessage("Invalid access type"),
  ]),
  userController.updateUser
);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User with this id not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  commonValidate([param("id").isInt().withMessage("User ID must be an integer")]),
  userController.deleteUser
);

module.exports = router;
