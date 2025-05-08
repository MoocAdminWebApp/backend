var express = require("express");
var router = express.Router();

const { body, query, param } = require("express-validator");
const { commonValidate } = require("../middleware/expressValidator");

const democontroller = require("../controller/democontroller");

/**
 * @openapi
 * '/api/demos':
 *  post:
 *     tags:
 *     - Demo Controller
 *     summary: add demo
 *     description: add demo
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - title
 *            properties:
 *              title:
 *                type: string
 *                default: test
 *              mark:
 *                type: string
 *                default: mark123
 *              count:
 *                type: number
 *                default: 122
 *              active:
 *                type: boolean
 *                default: true
 *              dataTime:
 *                type: datetime
 *                default: 2022-02-02 23:10:15
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
  commonValidate([body("title").notEmpty().withMessage("Not a valid title")]),
  democontroller.createAsync
);

/**
 * @openapi
 * '/api/demos':
 *  put:
 *     tags:
 *     - Demo Controller
 *     summary: update demo
 *     description: update demo
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
 *              - title
 *            properties:
 *              id:
 *                type: number
 *                default: 0
 *              title:
 *                type: string
 *                default: test
 *              mark:
 *                type: string
 *                default: mark123
 *              count:
 *                type: number
 *                default: 122
 *              active:
 *                type: boolean
 *                default: true
 *              dataTime:
 *                type: datetime
 *                default: 2022-02-02 23:10:15
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
    body("id")
      .notEmpty()
      .withMessage("id is required")
      .isInt({ min: 1 })
      .withMessage("ID must be a valid integer"),
    body("title").notEmpty().withMessage("Not a valid title"),
  ]),
  democontroller.updateAsync
);

/**
 * @openapi
 * '/api/demos/getAll':
 *  get:
 *     tags:
 *     - Demo Controller
 *     summary: Get all demos
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
router.get("/getAll", democontroller.getAllAsync);

/**
 * @openapi
 * '/api/demos/{page}/{pageSize}':
 *  get:
 *     tags:
 *     - Demo Controller
 *     summary: Get  demos by page and pageSize and title
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
 *      - name: title
 *        in: query
 *        description: title
 *        required: false
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
router.get("/:page/:pageSize",
  commonValidate([
    param("page")
      .notEmpty()
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage("Not a valid page"),
    param("pageSize")
      .notEmpty()
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage("Not a valid pageSize"),
      query("title").optional().isString().trim().escape(),
  ]),
  democontroller.pageAsync
);

/**
 * @openapi
 * '/api/demos/{id}':
 *  delete:
 *     tags:
 *     - Demo Controller
 *     summary: delete a demo by Id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the demo to delete
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
  "/:id",
  param([
    param("id")
      .notEmpty()
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage("Not a valid id"),
  ]),
  democontroller.deleteAsync
);


/**
 * @openapi
 * '/api/demos/{id}':
 *  get:
 *     tags:
 *     - Demo Controller
 *     summary: get a demo by Id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the demo to delete
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
  "/:id",
  param([
    param("id")
      .notEmpty()
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage("Not a valid id"),
  ]),
  democontroller.getByIdAsync
);
module.exports = router;
