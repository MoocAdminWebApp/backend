const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const { commonValidate } = require("../middleware/expressValidator");
const mediaController = require("../controller/mediaController");

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Media file management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Media:
 *       type: object
 *       required:
 *         - chapterId
 *         - fileName
 *         - originalName
 *         - filePath
 *         - fileSize
 *         - mimeType
 *         - mediaType
 *         - uploadedBy
 *       properties:
 *         id:
 *           type: integer
 *           description: Media ID
 *         chapterId:
 *           type: integer
 *           description: Chapter ID this media belongs to
 *         fileName:
 *           type: string
 *           maxLength: 255
 *           description: Generated file name
 *         originalName:
 *           type: string
 *           maxLength: 255
 *           description: Original file name
 *         filePath:
 *           type: string
 *           maxLength: 500
 *           description: File storage path
 *         fileSize:
 *           type: integer
 *           description: File size in bytes
 *         mimeType:
 *           type: string
 *           maxLength: 100
 *           description: File MIME type
 *         mediaType:
 *           type: string
 *           enum: [Video, Document]
 *           description: Media type
 *         resourceType:
 *           type: string
 *           enum: [course, chapter, section]
 *           description: Resource type
 *         resourceId:
 *           type: integer
 *           description: Resource ID
 *         duration:
 *           type: integer
 *           description: Duration in seconds (for videos)
 *         uploadedBy:
 *           type: integer
 *           description: Uploader user ID
 *         status:
 *           type: string
 *           enum: [uploading, processing, ready, error]
 *           description: Media processing status
 *         thumbnail:
 *           type: string
 *           maxLength: 500
 *           description: Thumbnail image path
 *         isProcessed:
 *           type: boolean
 *           description: Processing completion status
 */

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: Get all media files with optional filters
 *     tags: [Media]
 *     parameters:
 *       - in: query
 *         name: chapterId
 *         schema:
 *           type: integer
 *         description: Filter by chapter ID
 *       - in: query
 *         name: mediaType
 *         schema:
 *           type: string
 *           enum: [Video, Document]
 *         description: Filter by media type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [uploading, processing, ready, error]
 *         description: Filter by processing status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of media files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Media'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         pageSize:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 */
router.get("/",
  commonValidate([
    query("chapterId").optional().isInt({ min: 1 }).withMessage("ChapterId must be a valid integer"),
    query("mediaType").optional().isIn(["Video", "Document"]).withMessage("MediaType must be Video or Document"),
    query("status").optional().isIn(["uploading", "processing", "ready", "error"]).withMessage("Status must be valid"),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("PageSize must be between 1 and 100")
  ]),
  mediaController.getAllMedia
);

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     summary: Get a media file by ID
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Media file data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Media'
 *       404:
 *         description: Media file not found
 */
router.get("/:id",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("ID must be a valid integer")
  ]),
  mediaController.getMediaById
);

/**
 * @swagger
 * /api/media/upload:
 *   post:
 *     summary: Upload a new media file
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - chapterId
 *               - mediaType
 *               - uploadedBy
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Media file to upload
 *               chapterId:
 *                 type: integer
 *                 example: 1
 *               mediaType:
 *                 type: string
 *                 enum: [Video, Document]
 *                 example: "Video"
 *               resourceType:
 *                 type: string
 *                 enum: [course, chapter, section]
 *                 example: "chapter"
 *               resourceId:
 *                 type: integer
 *                 example: 1
 *               uploadedBy:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Media file uploaded successfully
 *       400:
 *         description: Validation error or upload failed
 *       413:
 *         description: File too large
 */
router.post("/upload",
  // Note: File upload validation will be handled by multer middleware in controller
  mediaController.uploadMedia
);

/**
 * @swagger
 * /api/media/{id}:
 *   put:
 *     summary: Update media file metadata
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Media ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalName:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Updated Video Name.mp4"
 *               mediaType:
 *                 type: string
 *                 enum: [Video, Document]
 *                 example: "Video"
 *               duration:
 *                 type: integer
 *                 example: 4200
 *               thumbnail:
 *                 type: string
 *                 maxLength: 500
 *                 example: "/uploads/thumbnails/video_thumb.jpg"
 *     responses:
 *       200:
 *         description: Media metadata updated successfully
 *       404:
 *         description: Media file not found
 *       400:
 *         description: Validation error
 */
router.put("/:id",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("ID must be a valid integer"),
    body("originalName").optional().trim().isLength({ max: 255 }).withMessage("OriginalName max 255 characters"),
    body("mediaType").optional().isIn(["Video", "Document"]).withMessage("MediaType must be Video or Document"),
    body("duration").optional().isInt({ min: 0 }).withMessage("Duration must be a non-negative integer"),
    body("thumbnail").optional().isLength({ max: 500 }).withMessage("Thumbnail path max 500 characters")
  ]),
  mediaController.updateMedia
);

/**
 * @swagger
 * /api/media/{id}:
 *   delete:
 *     summary: Delete a media file
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Media file deleted successfully
 *       404:
 *         description: Media file not found
 */
router.delete("/:id",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("ID must be a valid integer")
  ]),
  mediaController.deleteMedia
);

/**
 * @swagger
 * /api/media/{id}/download:
 *   get:
 *     summary: Download a media file
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Media file content
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Media file not found
 */
router.get("/:id/download",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("ID must be a valid integer")
  ]),
  mediaController.downloadMedia
);

/**
 * @swagger
 * /api/media/{id}/stream:
 *   get:
 *     summary: Stream a video file
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Media ID
 *       - in: header
 *         name: Range
 *         schema:
 *           type: string
 *         description: Range header for partial content
 *     responses:
 *       206:
 *         description: Partial content for video streaming
 *       200:
 *         description: Full video content
 *       404:
 *         description: Media file not found
 *       416:
 *         description: Range not satisfiable
 */
router.get("/:id/stream",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("ID must be a valid integer")
  ]),
  mediaController.streamMedia
);

/**
 * @swagger
 * /api/media/{id}/status:
 *   patch:
 *     summary: Update media processing status
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Media ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [uploading, processing, ready, error]
 *                 example: "ready"
 *               isProcessed:
 *                 type: boolean
 *                 example: true
 *               duration:
 *                 type: integer
 *                 example: 3600
 *               thumbnail:
 *                 type: string
 *                 example: "/uploads/thumbnails/video_thumb.jpg"
 *     responses:
 *       200:
 *         description: Media status updated successfully
 *       404:
 *         description: Media file not found
 */
router.patch("/:id/status",
  commonValidate([
    param("id").isInt({ min: 1 }).withMessage("ID must be a valid integer"),
    body("status").isIn(["uploading", "processing", "ready", "error"]).withMessage("Status must be valid"),
    body("isProcessed").optional().isBoolean().withMessage("IsProcessed must be a boolean"),
    body("duration").optional().isInt({ min: 0 }).withMessage("Duration must be a non-negative integer"),
    body("thumbnail").optional().isLength({ max: 500 }).withMessage("Thumbnail path max 500 characters")
  ]),
  mediaController.updateMediaStatus
);

/**
 * @swagger
 * /api/media/chapter/{chapterId}:
 *   get:
 *     summary: Get all media files for a specific chapter
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chapter ID
 *       - in: query
 *         name: mediaType
 *         schema:
 *           type: string
 *           enum: [Video, Document]
 *         description: Filter by media type
 *     responses:
 *       200:
 *         description: List of media files for the chapter
 */
router.get("/chapter/:chapterId",
  commonValidate([
    param("chapterId").isInt({ min: 1 }).withMessage("ChapterId must be a valid integer"),
    query("mediaType").optional().isIn(["Video", "Document"]).withMessage("MediaType must be Video or Document")
  ]),
  mediaController.getMediaByChapter
);

/**
 * @swagger
 * /api/media/bulk-delete:
 *   delete:
 *     summary: Delete multiple media files
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mediaIds
 *             properties:
 *               mediaIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Media files deleted successfully
 *       400:
 *         description: Validation error
 */
router.delete("/bulk-delete",
  commonValidate([
    body("mediaIds").isArray({ min: 1 }).withMessage("MediaIds must be a non-empty array"),
    body("mediaIds.*").isInt({ min: 1 }).withMessage("Each mediaId must be a valid integer")
  ]),
  mediaController.bulkDeleteMedia
);

module.exports = router;