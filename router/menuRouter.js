var express = require("express");
var router = express.Router();

const { body, query, param } = require("express-validator");
const { commonValidate } = require("../middleware/expressValidator");

const mockJwt = require("../middleware/mockJWT");   // TODO: remove this line when authentication is implemented


const menuControllers = require("../controller/menuController");

/**
 * @openapi
 * /api/menus/{id}:
 *   get:
 *     tags:
 *     - Menu Controller
 *     summary: get a menu by Id
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the menu to retrieve
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      403:
 *        description: Unauthorized - Validation Failed
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
  "/:id",
  mockJwt,  //TODO: remove this line when authentication is implemented
  commonValidate([
    param("id")
      .notEmpty()
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage("Not a valid id"),
  ]),
  menuControllers.getMenuById
);

/**
 * @openapi
 * /api/menus:
 *   get:
 *     tags:
 *     - Menu Controller
 *     summary: get all accessible menus for the current user
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
    "/",
    mockJwt,  //TODO: remove this line when authentication is implemented
    menuControllers.getAllMenus
  );
module.exports = router;