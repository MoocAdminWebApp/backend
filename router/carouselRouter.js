var express = require("express");
var router = express.Router();

const { body, query, param } = require("express-validator");
const { commonValidate } = require("../middleware/expressValidator");

const carouselController = require("../controller/carouselController");

/**
 * @openapi
 * '/api/carousels':
 *  post:
 *     tags:
 *     - Carousel Controller
 *     summary: add carousel
 *     description: add carousel
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
 *              - imageUrl
 *            properties:
 *              title:
 *                type: string
 *                default: test
 *              description:
 *                type: string
 *                default: This is a test carousel
 *              orderNum:
 *                type: number
 *                default: 1
 *              imageUrl:
 *                type: string
 *                default: https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png
 *              linkUrl:
 *                type: string
 *                default: https://www.google.com
 *              active:
 *                type: boolean
 *                default: true
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
  carouselController.createAsync
);

/**
 * @openapi
 * '/api/carousels':
 *  put:
 *     tags:
 *     - Carousel Controller
 *     summary: update carousel
 *     description: update carousel
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
 *              description:
 *                type: string
 *                default: This is a test carousel
 *              orderNum:
 *                type: number
 *                default: 1
 *              imageUrl:
 *                type: string
 *                default: https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png
 *              linkUrl:
 *                type: string
 *                default: https://www.google.com
 *              active:
 *                type: boolean
 *                default: true
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
  carouselController.updateAsync
);

/**
 * @openapi
 * '/api/carousels/getAll':
 *  get:
 *     tags:
 *     - Carousel Controller
 *     summary: Get all carousels
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
router.get("/getAll", carouselController.getAllAsync);

/**
 * @openapi
 * '/api/carousels/{page}/{pageSize}':
 *  get:
 *     tags:
 *     - Carousel Controller
 *     summary: Get  carousels by page and pageSize and title
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
      .withMessage("Not a valid pageSize"),
    query("title").optional().isString().trim().escape(),
  ]),
  carouselController.pageAsync
);

/**
 * @openapi
 * '/api/carousels/{id}':
 *  delete:
 *     tags:
 *     - Carousel Controller
 *     summary: delete a carousel by Id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the carousel to delete
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
  carouselController.deleteAsync
);

/**
 * @openapi
 * '/api/carousels/{id}':
 *  get:
 *     tags:
 *     - Carousel Controller
 *     summary: get a carousel by Id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the carousel to delete
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
  carouselController.getByIdAsync
);
module.exports = router;
