var express = require("express");
var router = express.Router();

const { body, query, param } = require("express-validator");
const { commonValidate } = require("../middleware/expressValidator");

const menuControllers = require("../controller/menuController");

/**
 * @openapi
 * /api/menus:
 *   get:
 *     tags: [Menus]
 *     summary: get all accessible menus that should display on the sidebar
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get("/", menuControllers.getMenus);

/**
 * @openapi
 * /api/menus/route:
 *   get:
 *     tags: [Menus]
 *     summary: get a list of menu id and its corrsponding route
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get("/route", menuControllers.getMenuRoute);

/**
 * @openapi
 * /api/menus/tree:
 *   get:
 *     tags: [Menus]
 *     summary: get all accessible menus for the current user
 *     parameters:
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get("/tree", menuControllers.getMenuTree);

/**
 * @openapi
 * /api/menus/search:
 *   get:
 *     tags:
 *       - Menus
 *     summary: Search menus with filters, keyword, pagination and sorting
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: permission
 *         in: query
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *       - name: parentId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menus successfully retrieved
 *       404:
 *         description: No matching menus found
 *       500:
 *         description: Internal server error
 */
router.get("/search", menuControllers.searchMenus);

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
 * /api/menus/permissionprefix/{id}:
 *   get:
 *     tags: [Menus]
 *     summary: get a menu's permission prefix by Id
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
  "/permissionprefix/:id",
  commonValidate([
    param("id")
      .notEmpty()
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage("Not a valid id"),
  ]),
  menuControllers.getMenuPermissionPrefixById
);

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
 *                 default: 1
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
 *                 default: 1
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permanent
 *             properties:
 *               permanent:
 *                 type: boolean
 *                 default: false
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
