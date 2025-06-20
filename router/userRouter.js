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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 default: test@example.com
 *               password:
 *                 type: string
 *                 default: 123456
 *               firstName:
 *                 type: string
 *                 default: John
 *               lastName:
 *                 type: string
 *                 default: Doe
 *               access:
 *                 type: string
 *                 enum: [ADMIN, TEACHER, STUDENT]
 *                 default: STUDENT
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input
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
 *     responses:
 *       200:
 *         description: Get all users Successfully
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
 *           default: test@example.com
 *     responses:
 *       200:
 *         description: Get user by email successfully
 *       400:
 *         description: Invalid input
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
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
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
 *       400:
 *         description: Invalid input
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
 *     summary: Update user by ID
 *     tags: [Users]
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
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: updated@example.com
 *               password:
 *                 type: string
 *                 default: newpassword
 *               firstName:
 *                 type: string
 *                 default: Jane
 *               lastName:
 *                 type: string
 *                 default: Smith
 *               access:
 *                 type: string
 *                 enum: [ADMIN, TEACHER, STUDENT]
 *                 default: TEACHER
 *     responses:
 *       201:
 *         description: User updated
 *       400:
 *         description: Invalid input
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
    body("email").optional().isEmail().withMessage("Valid email is required"),
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
 *         description: Invalid input
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
