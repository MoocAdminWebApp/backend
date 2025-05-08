var express = require("express");
var router = express.Router();

const { body } = require("express-validator");
const { commonValidate } = require("../middleware/expressValidator");

var authcontroller = require("../controller/authcontroller");

/**
* @openapi
* '/api/auth/login':
*  post:
*     tags:
*     - auht Controller
*     summary: Login as a user return token
*     description: login success get token
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            required:
*              - userName
*              - password
*            properties:
*              userName:
*                type: string
*                default: admin
*              password:
*                type: string
*                default: 123456
*     responses:
*      201:
*        description: Created
*      400:
*        description: Bad Request
*      404:
*        description: Not Found
*      409:
*        description: Conflict
*      500:
*        description: Server Error 
*/
router.post(
  "/login",
  commonValidate([
    body("userName")
      .notEmpty()
      .withMessage("Not a valid userName")
      .isLength({ min: 3, max: 50 })
      .withMessage("The userName length must be between 5 and 50"),
    body("password")
      .notEmpty()
      .withMessage("Not a valid password")
      .isLength({ min: 6, max: 50 })
      .withMessage("The password length must be between 6 and 50"),
  ]),
  authcontroller.loginAsync
);

router.post("/loginOut", authcontroller.loginOutAsync);

module.exports = router;
