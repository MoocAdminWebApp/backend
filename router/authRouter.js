const express = require("express");
const router = express.Router();
const authController = require("../controller/authcontroller");
const { commonValidate } = require("../middleware/expressValidator");
const { body } = require("express-validator");

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: user logs in
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
 *                 default: "alice@gmail.com"
 *               password:
 *                 type: string
 *                 default: "password12"
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

module.exports = router;
