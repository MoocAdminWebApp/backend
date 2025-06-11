const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: user logs in and returns a token, the user and all the menus
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: user logs in
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.post("/login", authController.loginUser);

module.exports = router;
