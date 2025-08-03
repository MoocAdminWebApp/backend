const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const profileController = require("../controller/profileController");
const { commonValidate } = require("../middleware/expressValidator");
const upload = require("../middleware/uploadAvatar");

/**
 * @openapi
 * tags:
 *   - name: Profiles
 *     description: Profile management APIs
 */

/**
 * @openapi
 * /api/profiles:
 *   post:
 *     summary: Create a new profile
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       201:
 *         description: Profile created
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
  "/",
  commonValidate([
    body("userId").isInt().withMessage("userId must be an integer"),
    body("countryCode").optional().isString(),
    body("phoneNumber").optional().isString(),
    body("country").optional().isString(),
    body("state").optional().isString(),
    body("city").optional().isString(),
    body("streetAddress").optional().isString(),
    body("postalCode").optional().isString(),
    body("birthdate").optional().isISO8601().withMessage("Invalid birthdate"),
    body("gender")
      .optional()
      .isIn(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"])
      .withMessage("Invalid gender value"),
    body("avatar").optional().isString(),
    body("bio").optional().isString(),
  ]),
  profileController.createProfile
);

/**
 * @openapi
 * /api/profiles:
 *   get:
 *     summary: Get all profiles
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Get all profiles successfully
 *         content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profiles not found
 *       500:
 *         description: Server error
 */
router.get("/", profileController.getAllProfiles);

/**
 * @openapi
 * /api/profiles/page:
 *   get:
 *     summary: Get profiles with pagination
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (starting from 1)
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of profiles per page
 *       - in: query
 *         name: filters
 *         required: false
 *         schema:
 *           type: string
 *           example: '{"streetAddress":"100","bio":"Student","country":"China"}'
 *         description: JSON string of filter fields and values
 *       - in: query
 *         name: fuzzyKeys
 *         required: false
 *         schema:
 *           type: string
 *           example: "streetAddress,bio"
 *         description: Comma separated keys to apply fuzzy matching
 *     responses:
 *       200:
 *         description: Get paged profiles successfully
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  page:
 *                    type: integer
 *                  pageSize:
 *                    type: integer
 *                  total:
 *                    type: integer
 *                  totalPages:
 *                    type: integer
 *                  rows:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profiles with this page information not found
 *       500:
 *         description: Server error
 */
router.get(
  "/page",
  commonValidate([
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be an integer >= 1"),
    query("pageSize").optional().isInt({ min: 1 }).withMessage("Page size must be an integer >= 1"),
    query("fuzzyKeys").optional().isString(),
  ]),
  profileController.getProfilesByPage
);

/**
 * @openapi
 * /api/profiles/{id}:
 *   get:
 *     summary: Get profile by ID
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: Get profile by id successfully
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile with this id not found
 *       500:
 *         description: Server error
 */
router.get(
  "/:id",
  commonValidate([param("id").isInt().withMessage("Profile ID must be an integer")]),
  profileController.getProfileById
);

/**
 * @openapi
 * /api/profiles/by-user/{userId}:
 *   get:
 *     summary: Get profile by userId
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID associated with the profile
 *     responses:
 *       200:
 *         description: Get profile by userId successfully
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile with this userId not found
 *       500:
 *         description: Server error
 */
router.get(
  "/by-user/:userId",
  commonValidate([param("userId").isInt().withMessage("User ID must be an integer")]),
  profileController.getProfileByUserId
);

/**
 * @openapi
 * /api/profiles/{id}:
 *   put:
 *     summary: Update profile by ID
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdate'
 *     responses:
 *       201:
 *         description: Profile updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Profile with this id not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  commonValidate([
    param("id").isInt().withMessage("Profile ID must be an integer"),
    body("userId").optional().isInt().withMessage("userId must be an integer"),
    body("countryCode").optional().isString(),
    body("phoneNumber").optional().isString(),
    body("country").optional().isString(),
    body("state").optional().isString(),
    body("city").optional().isString(),
    body("streetAddress").optional().isString(),
    body("postalCode").optional().isString(),
    body("birthdate").optional().isISO8601().withMessage("Invalid birthdate"),
    body("gender")
      .optional()
      .isIn(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"])
      .withMessage("Invalid gender value"),
    body("avatar").optional().isString(),
    body("bio").optional().isString(),
  ]),
  profileController.updateProfile
);

/**
 * @openapi
 * /api/profiles/upload-avatar:
 *   post:
 *     summary: Upload profile avatar
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Upload failed
 */
router.post(
  "/upload-avatar",
  upload.single("avatar"), // expect a single file upload with the field name "avatar"
  profileController.uploadProfileAvatar
);

/**
 * @openapi
 * /api/profiles/{id}:
 *   delete:
 *     summary: Delete profile by ID
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: Profile deleted
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile with this id not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  commonValidate([param("id").isInt().withMessage("Profile ID must be an integer")]),
  profileController.deleteProfile
);

module.exports = router;
