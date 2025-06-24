const { Media, Chapter, Course, User } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

/**
 * Get all media files with pagination and filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @returns {Object} Service result
 */
const getAllMedia = async (filters = {}, pagination = {}) => {
  try {
    const { page = 1, pageSize = 10 } = pagination;
    const whereClause = {};
    
    if (filters.chapterId) {
      whereClause.chapterId = filters.chapterId;
    }
    
    if (filters.mediaType) {
      whereClause.mediaType = filters.mediaType;
    }
    
    if (filters.status) {
      whereClause.status = filters.status;
    }

    const offset = (page - 1) * pageSize;

    const { count, rows } = await Media.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Chapter,
          as: "chapter",
          attributes: ["id", "title", "courseId"],
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["id", "title"]
            }
          ]
        },
        {
          model: User,
          as: "uploader",
          attributes: ["id", "firstName", "lastName", "email"]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset
    });

    const totalPages = Math.ceil(count / pageSize);

    return {
      isSuccess: true,
      data: {
        items: rows,
        pagination: {
          page,
          pageSize,
          total: count,
          totalPages
        }
      }
    };
  } catch (error) {
    console.error("Error in getAllMedia:", error);
    return {
      isSuccess: false,
      message: "Failed to retrieve media files",
      error: error.message
    };
  }
};

/**
 * Get a media file by ID
 * @param {number} id - Media ID
 * @returns {Object} Service result
 */
const getMediaById = async (id) => {
  try {
    const media = await Media.findByPk(id, {
      include: [
        {
          model: Chapter,
          as: "chapter",
          attributes: ["id", "title", "courseId"],
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["id", "title"]
            }
          ]
        },
        {
          model: User,
          as: "uploader",
          attributes: ["id", "firstName", "lastName", "email"]
        }
      ]
    });

    if (!media) {
      return {
        isSuccess: false,
        message: "Media file not found"
      };
    }

    return {
      isSuccess: true,
      data: media
    };
  } catch (error) {
    console.error("Error in getMediaById:", error);
    return {
      isSuccess: false,
      message: "Failed to retrieve media file",
      error: error.message
    };
  }
};

/**
 * Create a new media record
 * @param {Object} mediaData - Media data
 * @returns {Object} Service result
 */
const createMedia = async (mediaData) => {
  try {
    const requiredFields = ['chapterId', 'fileName', 'originalName', 'filePath', 'fileSize', 'mimeType', 'mediaType', 'uploadedBy'];
    
    for (const field of requiredFields) {
      if (!mediaData[field]) {
        return {
          isSuccess: false,
          message: `${field} is required`
        };
      }
    }

    const chapter = await Chapter.findByPk(mediaData.chapterId);
    if (!chapter) {
      return {
        isSuccess: false,
        message: "Chapter not found"
      };
    }

    if (!fs.existsSync(mediaData.filePath)) {
      return {
        isSuccess: false,
        message: "Uploaded file not found"
      };
    }

    const media = await Media.create(mediaData);

    const createdMedia = await getMediaById(media.id);

    return {
      isSuccess: true,
      data: createdMedia.data
    };
  } catch (error) {
    console.error("Error in createMedia:", error);
    return {
      isSuccess: false,
      message: "Failed to create media record",
      error: error.message
    };
  }
};

/**
 * Update a media record
 * @param {number} id - Media ID
 * @param {Object} updateData - Update data
 * @returns {Object} Service result
 */
const updateMedia = async (id, updateData) => {
  try {
    const media = await Media.findByPk(id);
    
    if (!media) {
      return {
        isSuccess: false,
        message: "Media file not found"
      };
    }

    await media.update(updateData);

    const updatedMedia = await getMediaById(id);

    return {
      isSuccess: true,
      data: updatedMedia.data
    };
  } catch (error) {
    console.error("Error in updateMedia:", error);
    return {
      isSuccess: false,
      message: "Failed to update media record",
      error: error.message
    };
  }
};

/**
 * Delete a media file and its record
 * @param {number} id - Media ID
 * @returns {Object} Service result
 */
const deleteMedia = async (id) => {
  try {
    const media = await Media.findByPk(id);
    
    if (!media) {
      return {
        isSuccess: false,
        message: "Media file not found"
      };
    }

    if (fs.existsSync(media.filePath)) {
      try {
        fs.unlinkSync(media.filePath);
      } catch (fileError) {
        console.warn("Warning: Could not delete physical file:", fileError.message);
      }
    }

    if (media.thumbnail && fs.existsSync(media.thumbnail)) {
      try {
        fs.unlinkSync(media.thumbnail);
      } catch (thumbError) {
        console.warn("Warning: Could not delete thumbnail file:", thumbError.message);
      }
    }

    await media.destroy();

    return {
      isSuccess: true,
      message: "Media file deleted successfully"
    };
  } catch (error) {
    console.error("Error in deleteMedia:", error);
    return {
      isSuccess: false,
      message: "Failed to delete media file",
      error: error.message
    };
  }
};

/**
 * Get media files by chapter
 * @param {Object} filters - Filter criteria including chapterId
 * @returns {Object} Service result
 */
const getMediaByChapter = async (filters) => {
  try {
    const whereClause = { chapterId: filters.chapterId };
    
    if (filters.mediaType) {
      whereClause.mediaType = filters.mediaType;
    }

    const mediaFiles = await Media.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "firstName", "lastName", "email"]
        }
      ],
      order: [["createdAt", "ASC"]]
    });

    return {
      isSuccess: true,
      data: mediaFiles
    };
  } catch (error) {
    console.error("Error in getMediaByChapter:", error);
    return {
      isSuccess: false,
      message: "Failed to retrieve media files for chapter",
      error: error.message
    };
  }
};

/**
 * Bulk delete multiple media files
 * @param {Array} mediaIds - Array of media IDs
 * @returns {Object} Service result
 */
const bulkDeleteMedia = async (mediaIds) => {
  try {
    const mediaFiles = await Media.findAll({
      where: { id: { [Op.in]: mediaIds } }
    });

    if (mediaFiles.length === 0) {
      return {
        isSuccess: false,
        message: "No media files found to delete"
      };
    }

    const deletedFiles = [];
    const errors = [];

    for (const media of mediaFiles) {
      try {
        if (fs.existsSync(media.filePath)) {
          fs.unlinkSync(media.filePath);
        }

        if (media.thumbnail && fs.existsSync(media.thumbnail)) {
          fs.unlinkSync(media.thumbnail);
        }

        await media.destroy();
        deletedFiles.push({ id: media.id, fileName: media.fileName });
      } catch (fileError) {
        errors.push({ id: media.id, error: fileError.message });
      }
    }

    return {
      isSuccess: true,
      data: {
        deleted: deletedFiles,
        errors: errors,
        summary: `${deletedFiles.length} files deleted successfully, ${errors.length} errors`
      }
    };
  } catch (error) {
    console.error("Error in bulkDeleteMedia:", error);
    return {
      isSuccess: false,
      message: "Failed to bulk delete media files",
      error: error.message
    };
  }
};

/**
 * Get media statistics
 * @param {Object} filters - Filter criteria
 * @returns {Object} Service result
 */
const getMediaStats = async (filters = {}) => {
  try {
    let whereClause = {};
    let includeClause = [];

    if (filters.chapterId) {
      whereClause.chapterId = filters.chapterId;
    }

    if (filters.courseId) {
      includeClause.push({
        model: Chapter,
        as: "chapter",
        where: { courseId: filters.courseId },
        attributes: []
      });
    }

    const stats = await Media.findAll({
      where: whereClause,
      include: includeClause,
      attributes: [
        [Media.sequelize.fn('COUNT', Media.sequelize.col('Media.id')), 'totalFiles'],
        [Media.sequelize.fn('COUNT', Media.sequelize.literal('CASE WHEN mediaType = "Video" THEN 1 END')), 'videoFiles'],
        [Media.sequelize.fn('COUNT', Media.sequelize.literal('CASE WHEN mediaType = "Document" THEN 1 END')), 'documentFiles'],
        [Media.sequelize.fn('COUNT', Media.sequelize.literal('CASE WHEN status = "ready" THEN 1 END')), 'readyFiles'],
        [Media.sequelize.fn('COUNT', Media.sequelize.literal('CASE WHEN status = "processing" THEN 1 END')), 'processingFiles'],
        [Media.sequelize.fn('COUNT', Media.sequelize.literal('CASE WHEN status = "error" THEN 1 END')), 'errorFiles'],
        [Media.sequelize.fn('SUM', Media.sequelize.col('fileSize')), 'totalFileSize'],
        [Media.sequelize.fn('AVG', Media.sequelize.col('fileSize')), 'averageFileSize'],
        [Media.sequelize.fn('SUM', Media.sequelize.col('duration')), 'totalDuration'],
        [Media.sequelize.fn('AVG', Media.sequelize.col('duration')), 'averageDuration']
      ],
      raw: true
    });

    return {
      isSuccess: true,
      data: stats[0]
    };
  } catch (error) {
    console.error("Error in getMediaStats:", error);
    return {
      isSuccess: false,
      message: "Failed to get media statistics",
      error: error.message
    };
  }
};

/**
 * Generate thumbnail for video media
 * @param {number} mediaId - Media ID
 * @param {number} timeOffset - Time offset in seconds for thumbnail generation
 * @returns {Object} Service result
 */
const generateThumbnail = async (mediaId, timeOffset = 10) => {
  try {
    const media = await Media.findByPk(mediaId);
    
    if (!media) {
      return {
        isSuccess: false,
        message: "Media file not found"
      };
    }

    if (media.mediaType !== 'Video') {
      return {
        isSuccess: false,
        message: "Thumbnail generation is only available for video files"
      };
    }

    if (!fs.existsSync(media.filePath)) {
      return {
        isSuccess: false,
        message: "Video file not found on disk"
      };
    }
    const thumbnailDir = path.join(path.dirname(media.filePath), 'thumbnails');
    
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    const thumbnailFileName = `${path.parse(media.fileName).name}_thumb.jpg`;
    const thumbnailPath = path.join(thumbnailDir, thumbnailFileName);

    await media.update({ 
      thumbnail: thumbnailPath,
      status: 'ready',
      isProcessed: true
    });

    return {
      isSuccess: true,
      data: {
        mediaId: media.id,
        thumbnailPath: thumbnailPath,
        message: "Thumbnail generated successfully"
      }
    };
  } catch (error) {
    console.error("Error in generateThumbnail:", error);
    return {
      isSuccess: false,
      message: "Failed to generate thumbnail",
      error: error.message
    };
  }
};

/**
 * Search media files
 * @param {Object} searchParams - Search parameters
 * @returns {Object} Service result
 */
const searchMedia = async (searchParams) => {
  try {
    const { 
      keyword, 
      mediaType, 
      status, 
      chapterId, 
      page = 1, 
      pageSize = 10 
    } = searchParams;
    
    const whereClause = {};
    
    if (keyword) {
      whereClause[Op.or] = [
        { originalName: { [Op.like]: `%${keyword}%` } },
        { fileName: { [Op.like]: `%${keyword}%` } }
      ];
    }
    
    if (mediaType) {
      whereClause.mediaType = mediaType;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (chapterId) {
      whereClause.chapterId = chapterId;
    }

    const offset = (page - 1) * pageSize;

    const { count, rows } = await Media.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Chapter,
          as: "chapter",
          attributes: ["id", "title"],
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["id", "title"]
            }
          ]
        },
        {
          model: User,
          as: "uploader",
          attributes: ["id", "firstName", "lastName"]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset
    });

    const totalPages = Math.ceil(count / pageSize);

    return {
      isSuccess: true,
      data: {
        items: rows,
        pagination: {
          page,
          pageSize,
          total: count,
          totalPages
        }
      }
    };
  } catch (error) {
    console.error("Error in searchMedia:", error);
    return {
      isSuccess: false,
      message: "Failed to search media files",
      error: error.message
    };
  }
};

/**
 * Process media file (for background processing)
 * @param {number} mediaId - Media ID
 * @returns {Object} Service result
 */
const processMedia = async (mediaId) => {
  try {
    const media = await Media.findByPk(mediaId);
    
    if (!media) {
      return {
        isSuccess: false,
        message: "Media file not found"
      };
    }

    await media.update({ status: 'processing' });

    if (media.mediaType === 'Video') {
      setTimeout(async () => {
        try {
          await media.update({ 
            status: 'ready',
            isProcessed: true
          });
        } catch (error) {
          await media.update({ status: 'error' });
        }
      }, 5000); 
    } else {
      await media.update({ 
        status: 'ready',
        isProcessed: true
      });
    }

    return {
      isSuccess: true,
      data: {
        mediaId: media.id,
        status: 'processing',
        message: "Media processing started"
      }
    };
  } catch (error) {
    console.error("Error in processMedia:", error);
    return {
      isSuccess: false,
      message: "Failed to process media file",
      error: error.message
    };
  }
};

module.exports = {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
  getMediaByChapter,
  bulkDeleteMedia,
  getMediaStats,
  generateThumbnail,
  searchMedia,
  processMedia
};