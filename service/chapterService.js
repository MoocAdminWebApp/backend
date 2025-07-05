const { Chapter, Course, Media, User } = require("../models");
const { Op } = require("sequelize");

/**
 * Get all chapters with optional filters
 * @param {Object} filters - Filter criteria
 * @returns {Object} Service result
 */
const getAllChapters = async (filters = {}) => {
  try {
    const whereClause = {};
    
    if (filters.courseId) {
      whereClause.courseId = filters.courseId;
    }
    
    if (filters.isPublished !== undefined) {
      whereClause.isPublished = filters.isPublished;
    }

    const chapters = await Chapter.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "title", "description"]
        },
        {
          model: Media,
          as: "mediaFiles",
          attributes: ["id", "fileName", "originalName", "mediaType", "fileSize", "status"]
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "email"],
          foreignKey: "createdBy"
        }
      ],
      order: [
        ["courseId", "ASC"],
        ["orderIndex", "ASC"],
        ["createdAt", "ASC"]
      ]
    });

    return {
      isSuccess: true,
      data: chapters
    };
  } catch (error) {
    console.error("Error in getAllChapters:", error);
    return {
      isSuccess: false,
      message: "Failed to retrieve chapters",
      error: error.message
    };
  }
};

/**
 * Get a chapter by ID
 * @param {number} id - Chapter ID
 * @returns {Object} Service result
 */
const getChapterById = async (id) => {
  try {
    const chapter = await Chapter.findByPk(id, {
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "title", "description"]
        },
        {
          model: Media,
          as: "mediaFiles",
          attributes: ["id", "fileName", "originalName", "mediaType", "fileSize", "duration", "status", "thumbnail"]
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "email"],
          foreignKey: "createdBy"
        },
        {
          model: User,
          as: "updater",
          attributes: ["id", "firstName", "lastName", "email"],
          foreignKey: "updatedBy"
        }
      ]
    });

    if (!chapter) {
      return {
        isSuccess: false,
        message: "Chapter not found"
      };
    }

    return {
      isSuccess: true,
      data: chapter
    };
  } catch (error) {
    console.error("Error in getChapterById:", error);
    return {
      isSuccess: false,
      message: "Failed to retrieve chapter",
      error: error.message
    };
  }
};

/**
 * Create a new chapter
 * @param {Object} chapterData - Chapter data
 * @returns {Object} Service result
 */
const createChapter = async (chapterData) => {
  try {
    if (!chapterData.courseId || !chapterData.title || !chapterData.createdBy) {
      return {
        isSuccess: false,
        message: "courseId, title, and createdBy are required"
      };
    }

    const course = await Course.findByPk(chapterData.courseId);
    if (!course) {
      return {
        isSuccess: false,
        message: "Course not found"
      };
    }

    if (chapterData.orderIndex === undefined || chapterData.orderIndex === null) {
      const maxOrderChapter = await Chapter.findOne({
        where: { courseId: chapterData.courseId },
        order: [["orderIndex", "DESC"]]
      });
      chapterData.orderIndex = maxOrderChapter ? maxOrderChapter.orderIndex + 1 : 0;
    }

    const chapter = await Chapter.create(chapterData);

    const createdChapter = await getChapterById(chapter.id);

    return {
      isSuccess: true,
      data: createdChapter.data
    };
  } catch (error) {
    console.error("Error in createChapter:", error);
    return {
      isSuccess: false,
      message: "Failed to create chapter",
      error: error.message
    };
  }
};

/**
 * Update a chapter
 * @param {number} id - Chapter ID
 * @param {Object} updateData - Update data
 * @returns {Object} Service result
 */
const updateChapter = async (id, updateData) => {
  try {
    const chapter = await Chapter.findByPk(id);
    
    if (!chapter) {
      return {
        isSuccess: false,
        message: "Chapter not found"
      };
    }

    await chapter.update(updateData);

    const updatedChapter = await getChapterById(id);

    return {
      isSuccess: true,
      data: updatedChapter.data
    };
  } catch (error) {
    console.error("Error in updateChapter:", error);
    return {
      isSuccess: false,
      message: "Failed to update chapter",
      error: error.message
    };
  }
};

/**
 * Delete a chapter
 * @param {number} id - Chapter ID
 * @returns {Object} Service result
 */
const deleteChapter = async (id) => {
  try {
    const chapter = await Chapter.findByPk(id);
    
    if (!chapter) {
      return {
        isSuccess: false,
        message: "Chapter not found"
      };
    }

    const mediaCount = await Media.count({
      where: { chapterId: id }
    });

    if (mediaCount > 0) {
      return {
        isSuccess: false,
        message: "Cannot delete chapter with associated media files. Please delete media files first."
      };
    }

    await chapter.destroy();

    return {
      isSuccess: true,
      message: "Chapter deleted successfully"
    };
  } catch (error) {
    console.error("Error in deleteChapter:", error);
    return {
      isSuccess: false,
      message: "Failed to delete chapter",
      error: error.message
    };
  }
};

/**
 * Get chapters by course
 * @param {Object} filters - Filter criteria including courseId
 * @returns {Object} Service result
 */
const getChaptersByCourse = async (filters) => {
  try {
    const whereClause = { courseId: filters.courseId };
    
    if (filters.isPublished !== undefined) {
      whereClause.isPublished = filters.isPublished;
    }

    const chapters = await Chapter.findAll({
      where: whereClause,
      include: [
        {
          model: Media,
          as: "mediaFiles",
          attributes: ["id", "fileName", "originalName", "mediaType", "fileSize", "duration", "status"]
        }
      ],
      order: [["orderIndex", "ASC"], ["createdAt", "ASC"]]
    });

    return {
      isSuccess: true,
      data: chapters
    };
  } catch (error) {
    console.error("Error in getChaptersByCourse:", error);
    return {
      isSuccess: false,
      message: "Failed to retrieve chapters for course",
      error: error.message
    };
  }
};

/**
 * Reorder chapters in a course
 * @param {Array} chapterOrders - Array of {id, orderIndex} objects
 * @param {number} updatedBy - User ID who is updating
 * @returns {Object} Service result
 */
const reorderChapters = async (chapterOrders, updatedBy) => {
  try {
    const updates = [];
    
    for (const item of chapterOrders) {
      const chapter = await Chapter.findByPk(item.id);
      if (chapter) {
        await chapter.update({ 
          orderIndex: item.orderIndex,
          updatedBy 
        });
        updates.push({ id: item.id, orderIndex: item.orderIndex });
      }
    }

    return {
      isSuccess: true,
      data: { updatedChapters: updates }
    };
  } catch (error) {
    console.error("Error in reorderChapters:", error);
    return {
      isSuccess: false,
      message: "Failed to reorder chapters",
      error: error.message
    };
  }
};

/**
 * Get chapter statistics
 * @param {number} courseId - Optional course ID filter
 * @returns {Object} Service result
 */
const getChapterStats = async (courseId = null) => {
  try {
    const whereClause = courseId ? { courseId } : {};

    const stats = await Chapter.findAll({
      where: whereClause,
      attributes: [
        [Chapter.sequelize.fn('COUNT', Chapter.sequelize.col('id')), 'totalChapters'],
        [Chapter.sequelize.fn('COUNT', Chapter.sequelize.literal('CASE WHEN isPublished = true THEN 1 END')), 'publishedChapters'],
        [Chapter.sequelize.fn('COUNT', Chapter.sequelize.literal('CASE WHEN isPublished = false THEN 1 END')), 'draftChapters'],
        [Chapter.sequelize.fn('AVG', Chapter.sequelize.col('duration')), 'averageDuration'],
        [Chapter.sequelize.fn('SUM', Chapter.sequelize.col('duration')), 'totalDuration']
      ],
      raw: true
    });

    const mediaStats = await Media.findAll({
      include: [{
        model: Chapter,
        as: "chapter",
        where: courseId ? { courseId } : {},
        attributes: []
      }],
      attributes: [
        [Media.sequelize.fn('COUNT', Media.sequelize.col('Media.id')), 'totalMediaFiles'],
        [Media.sequelize.fn('COUNT', Media.sequelize.literal('CASE WHEN mediaType = "Video" THEN 1 END')), 'videoFiles'],
        [Media.sequelize.fn('COUNT', Media.sequelize.literal('CASE WHEN mediaType = "Document" THEN 1 END')), 'documentFiles'],
        [Media.sequelize.fn('SUM', Media.sequelize.col('fileSize')), 'totalFileSize']
      ],
      raw: true
    });

    return {
      isSuccess: true,
      data: {
        chapters: stats[0],
        media: mediaStats[0]
      }
    };
  } catch (error) {
    console.error("Error in getChapterStats:", error);
    return {
      isSuccess: false,
      message: "Failed to get chapter statistics",
      error: error.message
    };
  }
};

/**
 * Duplicate a chapter
 * @param {number} sourceId - Source chapter ID
 * @param {number} createdBy - User ID creating the duplicate
 * @param {number} targetCourseId - Target course ID (optional)
 * @returns {Object} Service result
 */
const duplicateChapter = async (sourceId, createdBy, targetCourseId = null) => {
  try {
    const sourceChapter = await Chapter.findByPk(sourceId);
    
    if (!sourceChapter) {
      return {
        isSuccess: false,
        message: "Source chapter not found"
      };
    }

    const duplicateData = {
      courseId: targetCourseId || sourceChapter.courseId,
      title: `${sourceChapter.title} (Copy)`,
      description: sourceChapter.description,
      content: sourceChapter.content,
      videoUrl: sourceChapter.videoUrl,
      duration: sourceChapter.duration,
      isPublished: false,
      createdBy,
      updatedBy: createdBy
    };

    const duplicatedChapter = await createChapter(duplicateData);

    return duplicatedChapter;
  } catch (error) {
    console.error("Error in duplicateChapter:", error);
    return {
      isSuccess: false,
      message: "Failed to duplicate chapter",
      error: error.message
    };
  }
};

/**
 * Search chapters
 * @param {Object} searchParams - Search parameters
 * @returns {Object} Service result
 */
const searchChapters = async (searchParams) => {
  try {
    const { keyword, courseId, isPublished, page = 1, pageSize = 10 } = searchParams;
    
    const whereClause = {};
    
    if (keyword) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
        { content: { [Op.like]: `%${keyword}%` } }
      ];
    }
    
    if (courseId) {
      whereClause.courseId = courseId;
    }
    
    if (isPublished !== null) {
      whereClause.isPublished = isPublished;
    }

    const offset = (page - 1) * pageSize;

    const { count, rows } = await Chapter.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "title"]
        },
        {
          model: Media,
          as: "mediaFiles",
          attributes: ["id", "mediaType", "status"]
        }
      ],
      order: [["orderIndex", "ASC"], ["createdAt", "DESC"]],
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
    console.error("Error in searchChapters:", error);
    return {
      isSuccess: false,
      message: "Failed to search chapters",
      error: error.message
    };
  }
};

module.exports = {
  getAllChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
  getChaptersByCourse,
  reorderChapters,
  getChapterStats,
  duplicateChapter,
  searchChapters
};