var express = require("express");
var router = express.Router();

const { body, query, param } = require("express-validator");
const { commonValidate } = require("../middleware/expressValidator");

var usercontroller = require("../controller/usercontroller");

/**
 * @openapi
 * '/api/users':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: add user
 *     description: add user
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - userName
 *              - password
 *              - email
 *              - age
 *              - gender
 *            properties:
 *              userName:
 *                type: string
 *                default: admin
 *              password:
 *                type: string
 *                default: 123456
 *              email:
 *                type: string
 *                default: demo@demo.com
 *              age:
 *                type: number
 *                default: 30
 *              gender:
 *                type: number
 *                default: 1
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
  "",
  commonValidate([
    body("userName").notEmpty().withMessage("Not a valid userName"),
    body("password").notEmpty().isLength({ min: 6 }),
    body("email").isEmail().withMessage("Not a valid email"),
  ]),
  usercontroller.addUserAsync
);

/**
 * @openapi
 * '/api/users/getUser':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get a user by userName
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - name: userName
 *        in: query
 *        description: The userName of the user
 *        required: true
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
  "/getUser",
  commonValidate([
    query("userName").notEmpty().withMessage("Not a valid userName"),
  ]),
  usercontroller.getUserAsync
);

/**
 * @openapi
 * '/api/users/{page}/{pageSize}':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get all users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - name: page
 *        in: path
 *        description: page
 *        required: true
 *      - name: pageSize
 *        in: path
 *        description: pageSize
 *        required: true
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
  "/:page/:pageSize",
  commonValidate([
    param("page")
      .notEmpty()
      .isInt({ allow_leading_zeroes: false, min: 1 })

      .withMessage("Not a valid page"),
    param("pageSize")
      .notEmpty()
      .isInt({ allow_leading_zeroes: false, min: 1 })

      .withMessage("Not a valid page"),
  ]),
  usercontroller.getUserListAsync
);

/**
 * @openapi
 * '/api/users/{ids}':
 *  delete:
 *     tags:
 *     - User Controller
 *     summary: delete a user by Id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - name: ids
 *        in: path
 *        description: The id of the user
 *        required: true
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.delete(
  "/:ids",
  param([param("ids").notEmpty().withMessage("Not a valid id")]),
  usercontroller.deUserByIdAsync
);

/**
 * @openapi
 * '/api/users':
 *  put:
 *     tags:
 *     - User Controller
 *     summary: update user
 *     description: update user
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - id
 *              - userName
 *              - email
 *              - age
 *              - gender
 *            properties:
 *              id:
 *                type: number
 *                default: 0
 *              userName:
 *                type: string
 *                default: admin
 *              email:
 *                type: string
 *                default: demo@demo.com
 *              age:
 *                type: number
 *                default: 30
 *              gender:
 *                type: number
 *                default: 1
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
router.put(
  "",
  commonValidate([
    body("userName").notEmpty().withMessage("Not a valid userName"),
    body("id").notEmpty().withMessage("Not a valid id"),
  ]),
  usercontroller.updateUserAsync
);

/**
 * @openapi
 * '/api/users/getUserById':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get a user by id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - name: id
 *        in: query
 *        description: The id of the user
 *        required: true
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
  "/getUserById",
  commonValidate([query("id").notEmpty().withMessage("Not a valid id")]),
  usercontroller.getUserByIdAsync
);

/**
 * @openapi
 * '/api/users/getCurrentUserPermissList':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: get CurrentUser Permiss List
 *     security:
 *       - BearerAuth: []
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
  "/getCurrentUserPermissList",
  usercontroller.getCurrentUserPermissListAsync
);

//updateProfileAsync

/**
 * @openapi
 * '/api/users/updateProfile':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: update user Profile
 *     description: update user Profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - userName
 *              - email
 *            properties:
 *              userName:
 *                type: string
 *                default: admin
 *              email:
 *                type: string
 *                default: demo@demo.com
 *              phone:
 *                type: string
 *                default: 123456789
 *              age:
 *                type: number
 *                default: 30
 *              address:
 *                type: string
 *                default: 123456789
 *              gender:
 *                type: number
 *                default: 1
 *              avatar:
 *                type: string
 *                default: 
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
  "/updateProfile",
  commonValidate([
    body("userName").notEmpty().withMessage("Not a valid userName"),
    body("email").isEmail().withMessage("Not a valid email"),
  ]),
  usercontroller.updateProfileAsync
);

module.exports = router;
