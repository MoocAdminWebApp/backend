var express = require("express");
var router = express.Router();

const { body, query, param } = require("express-validator");
const { commonValidate } = require("../middleware/expressValidator");

const menuControllers = require("../controller/menuController");

/**
 * @openapi
 * /api/menus/{id}:
 *   get:
 *     tags: [Menus]
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
 *        description: Menu Retrieved Successfully
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Unauthorized - Validation Failed
 *      404:
 *        description: Menu Not Found
 *      500:
 *        description: Internal Server Error
 */
router.get(
  "/:id",
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
 *     tags: [Menus]
 *     summary: get all accessible menus for the current user
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get("/", menuControllers.getAllMenus);

/**
 * @openapi
 * /api/menus:
 *   post:
 *     tags: [Menus]
 *     summary: create a new menu item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - path
 *               - component
 *               - permission
 *               - status
 *               - type
 *               - parentId
 *             properties:
 *               title:
 *                 type: string
 *                 default: ""
 *               path:
 *                 type: string
 *                 default: ""
 *               component:
 *                 type: string
 *                 default: ""
 *               permission:
 *                 type: integer
 *                 default: null
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, DRAFT, ARCHIVED]
 *                 default: ACTIVE
 *               type:
 *                 type: string
 *                 enum: [DIRECTORY, MENU, BUTTON]
 *                 default: MENU
 *               parentId:
 *                 type: integer
 *                 default: 0
 *     responses:
 *      200:
 *        description: Menu Created Successfully
 *      400:
 *        description: Bad Request - Inputs Not Meet Requirement
 *      403:
 *        description: Unauthorized - Validation Failed
 *      404:
 *        description: Menu Not Found
 *      500:
 *        description: Internal Server Error
 */
router.post(
  "/",
  commonValidate([
    // TODO: fix here
    body("title").notEmpty().withMessage("Title field is mandatory. "),
    body("status").notEmpty().withMessage("Status field is mandatory"),
    body("type").notEmpty().withMessage("Type field is mandatory"),
  ]),
  menuControllers.createMenu
);

/**
 * @openapi
 * /api/menus/{id}:
 *   put:
 *     tags: [Menus]
 *     summary: edit an existing menu by Id
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the menu to update
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *      200:
 *        description: Menu Updated Successfully
 *      400:
 *        description: Bad Request - Inputs Not Meet Requirement
 *      403:
 *        description: Unauthorized - Validation Failed
 *      404:
 *        description: Menu Not Found
 *      500:
 *        description: Internal Server Error
 */
router.put(
  "/:id",
  commonValidate([
    param("id")
      .notEmpty()
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage("Not a valid id"),
  ]),
  menuControllers.updateMenuById
);

/**
 * @openapi
 * /api/menus/{id}:
 *   delete:
 *     tags: [Menus]
 *     summary: delete an existing menu by Id
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the menu to delete
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *      200:
 *        description: Menu Deleted Successfully
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Unauthorized - Validation Failed
 *      404:
 *        description: Menu Not Found
 *      500:
 *        description: Internal Server Error
 */
router.delete(
  "/:id",
  commonValidate([
    param("id")
      .notEmpty()
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage("Not a valid id"),
  ]),
  menuControllers.deleteMenuById
);

module.exports = router;
