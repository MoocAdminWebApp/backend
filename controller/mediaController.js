const mediaService = require("../service/mediaService");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads/media');
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const baseName = path.parse(file.originalname).name.replace(/\s+/g, '-');
    const newFileName = `${baseName}-${uniqueSuffix}${fileExtension}`;
    
    cb(null, newFileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];
  const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  const allowedTypes = [...allowedVideoTypes, ...allowedDocTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, 
    files: 1 
  },
  fileFilter: fileFilter
});

/**
 * Get all media files with pagination and filters
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllMedia = async (req, res, next) => {
  try {
    const { 
      chapterId, 
      mediaType, 
      status, 
      page = 1, 
      pageSize = 10 
    } = req.query;

    const filters = {};
    const pagination = {
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };

    if (chapterId) filters.chapterId = parseInt(chapterId);
    if (mediaType) filters.mediaType = mediaType;
    if (status) filters.status = status;

    const result = await mediaService.getAllMedia(filters, pagination);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "success", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Failed to get media files");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get a media file by ID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getMediaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await mediaService.getMediaById(parseInt(id));
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "success", result.data);
    } else {
      res.sendCommonValue(404, result.message || "Media file not found");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Upload a new media file
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const uploadMedia = (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.sendCommonValue(400, "File too large. Maximum size is 500MB");
        }
        return res.sendCommonValue(400, `Upload error: ${err.message}`);
      }
      return res.sendCommonValue(400, `File validation error: ${err.message}`);
    }

    try {
      if (!req.file) {
        return res.sendCommonValue(400, "No file uploaded");
      }

      const { chapterId, mediaType, resourceType, resourceId, uploadedBy } = req.body;

      if (!chapterId || !mediaType || !uploadedBy) {
        return res.sendCommonValue(400, "chapterId, mediaType, and uploadedBy are required");
      }

      const mediaData = {
        chapterId: parseInt(chapterId),
        fileName: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        mediaType,
        resourceType: resourceType || 'chapter',
        resourceId: resourceId ? parseInt(resourceId) : parseInt(chapterId),
        uploadedBy: parseInt(uploadedBy),
        status: 'uploading'
      };

      const result = await mediaService.createMedia(mediaData);
      
      if (result.isSuccess) {
        res.sendCommonValue(201, "Media file uploaded successfully", result.data);
      } else {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        res.sendCommonValue(400, result.message || "Failed to save media metadata");
      }
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  });
};

/**
 * Update media file metadata
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const updateMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {};

    const allowedFields = ['originalName', 'mediaType', 'duration', 'thumbnail'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.sendCommonValue(400, "No fields to update");
    }

    const result = await mediaService.updateMedia(parseInt(id), updateData);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "Media metadata updated successfully", result.data);
    } else {
      res.sendCommonValue(404, result.message || "Media file not found");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a media file
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await mediaService.deleteMedia(parseInt(id));
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "Media file deleted successfully");
    } else {
      res.sendCommonValue(404, result.message || "Media file not found");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Download a media file
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const downloadMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await mediaService.getMediaById(parseInt(id));
    
    if (!result.isSuccess) {
      return res.sendCommonValue(404, "Media file not found");
    }

    const media = result.data;
    const filePath = media.filePath;

    if (!fs.existsSync(filePath)) {
      return res.sendCommonValue(404, "Physical file not found");
    }

    res.setHeader('Content-Disposition', `attachment; filename="${media.originalName}"`);
    res.setHeader('Content-Type', media.mimeType);
    res.setHeader('Content-Length', media.fileSize);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.sendCommonValue(500, "Error streaming file");
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Stream a video file with range support
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const streamMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await mediaService.getMediaById(parseInt(id));
    
    if (!result.isSuccess) {
      return res.sendCommonValue(404, "Media file not found");
    }

    const media = result.data;
  
    if (media.mediaType !== 'Video') {
      return res.sendCommonValue(400, "Streaming is only available for video files");
    }

    const filePath = media.filePath;

    if (!fs.existsSync(filePath)) {
      return res.sendCommonValue(404, "Physical file not found");
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
        return;
      }

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': media.mimeType,
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': media.mimeType,
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }

  } catch (error) {
    next(error);
  }
};

/**
 * Update media processing status
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const updateMediaStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, isProcessed, duration, thumbnail } = req.body;

    const updateData = { status };
    
    if (isProcessed !== undefined) updateData.isProcessed = isProcessed;
    if (duration !== undefined) updateData.duration = duration;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;

    const result = await mediaService.updateMedia(parseInt(id), updateData);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "Media status updated successfully", result.data);
    } else {
      res.sendCommonValue(404, result.message || "Media file not found");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get all media files for a specific chapter
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getMediaByChapter = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const { mediaType } = req.query;
    
    const filters = { chapterId: parseInt(chapterId) };
    if (mediaType) filters.mediaType = mediaType;

    const result = await mediaService.getMediaByChapter(filters);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "success", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Failed to get media files");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk delete multiple media files
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const bulkDeleteMedia = async (req, res, next) => {
  try {
    const { mediaIds } = req.body;

    if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
      return res.sendCommonValue(400, "mediaIds must be a non-empty array");
    }

    const result = await mediaService.bulkDeleteMedia(mediaIds);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "Media files deleted successfully", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Failed to delete media files");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get media statistics
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getMediaStats = async (req, res, next) => {
  try {
    const { chapterId, courseId } = req.query;
    
    const filters = {};
    if (chapterId) filters.chapterId = parseInt(chapterId);
    if (courseId) filters.courseId = parseInt(courseId);

    const result = await mediaService.getMediaStats(filters);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "success", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Failed to get media statistics");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Generate thumbnail for video media
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const generateThumbnail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { timeOffset = 10 } = req.body; 

    const result = await mediaService.generateThumbnail(parseInt(id), timeOffset);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "Thumbnail generated successfully", result.data);
    } else {
      res.sendCommonValue(404, result.message || "Media file not found or not a video");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMedia,
  getMediaById,
  uploadMedia,        
  updateMedia,
  deleteMedia,
  downloadMedia,
  streamMedia,
  updateMediaStatus,
  getMediaByChapter,
  bulkDeleteMedia,
  getMediaStats,
  generateThumbnail
};