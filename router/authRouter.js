const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { commonValidate } = require("../middleware/expressValidator");
const { body } = require("express-validator");

const EUserAccess = ["ADMIN", "TEACHER", "STUDENT"];

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: A user logs in
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "alice@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password12"
 *     responses:
 *      200:
 *        description: login Successfully
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post(
  "/login",
  commonValidate([
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ]),
  authController.loginUser
);

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Authentication]
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
  "/signup",
  commonValidate([
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("access").optional().isIn(EUserAccess).withMessage("Invalid access type"),
  ]),
  authController.signupUser
);

/**
 * @swagger
 * /api/auth/forgotPwd:
 *   post:
 *     summary: A user forgot password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "alice@gmail.com"
 *     responses:
 *      200:
 *        description: login Successfully
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post(
  "/auth/forgotPwd",
  commonValidate([body("email").isEmail().withMessage("Please enter a valid email")]),
  authController.forgotUserPwd
);

/**
 * @swagger
 * /api/auth/resetPwd:
 *   post:
 *     summary: A user reset password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: ""
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "1234567"
 *     responses:
 *      200:
 *        description: login Successfully
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post(
  "/auth/resetPwd",
  commonValidate([
    body("token").isLength().withMessage("token must be at least 50 characters"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ]),
  authController.resetUserPwd
);

module.exports = router;
