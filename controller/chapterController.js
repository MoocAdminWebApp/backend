const chapterService = require("../service/chapterService");

/**
 * Get all chapters with optional filters
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllChapters = async (req, res, next) => {
  try {
    const { courseId, published } = req.query;
    const filters = {};
    
    if (courseId) {
      filters.courseId = parseInt(courseId);
    }
    
    if (published !== undefined) {
      filters.isPublished = published === 'true';
    }

    const result = await chapterService.getAllChapters(filters);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "success", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Failed to get chapters");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get a chapter by ID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getChapterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await chapterService.getChapterById(parseInt(id));
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "success", result.data);
    } else {
      res.sendCommonValue(404, result.message || "Chapter not found");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new chapter
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createChapter = async (req, res, next) => {
  try {
    const chapterData = {
      courseId: req.body.courseId,
      title: req.body.title,
      description: req.body.description,
      orderIndex: req.body.orderIndex || 0,
      content: req.body.content,
      videoUrl: req.body.videoUrl,
      duration: req.body.duration,
      createdBy: req.body.createdBy,
      updatedBy: req.body.createdBy
    };

    const result = await chapterService.createChapter(chapterData);
    
    if (result.isSuccess) {
      res.sendCommonValue(201, "Chapter created successfully", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Failed to create chapter");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Update a chapter
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const updateChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {};

    // Only include fields that are provided in the request
    const allowedFields = [
      'title', 'description', 'orderIndex', 'isPublished', 
      'content', 'videoUrl', 'duration', 'updatedBy'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.sendCommonValue(400, "No fields to update");
    }

    const result = await chapterService.updateChapter(parseInt(id), updateData);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "Chapter updated successfully", result.data);
    } else {
      res.sendCommonValue(404, result.message || "Chapter not found");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a chapter
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const deleteChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await chapterService.deleteChapter(parseInt(id));
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "Chapter deleted successfully");
    } else {
      res.sendCommonValue(404, result.message || "Chapter not found");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Publish/Unpublish a chapter
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const publishChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isPublished, updatedBy } = req.body;

    const result = await chapterService.updateChapter(parseInt(id), {
      isPublished,
      updatedBy
    });
    
    if (result.isSuccess) {
      const action = isPublished ? "published" : "unpublished";
      res.sendCommonValue(200, `Chapter ${action} successfully`, result.data);
    } else {
      res.sendCommonValue(404, result.message || "Chapter not found");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get all chapters for a specific course
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getChaptersByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { published } = req.query;
    
    const filters = { courseId: parseInt(courseId) };
    
    if (published !== undefined) {
      filters.isPublished = published === 'true';
    }

    const result = await chapterService.getChaptersByCourse(filters);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "success", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Failed to get chapters");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder chapters in a course
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const reorderChapters = async (req, res, next) => {
  try {
    const { chapterOrders, updatedBy } = req.body;
    
    if (!Array.isArray(chapterOrders) || chapterOrders.length === 0) {
      return res.sendCommonValue(400, "chapterOrders must be a non-empty array");
    }

    // Validate chapterOrders format: [{ id: 1, orderIndex: 0 }, { id: 2, orderIndex: 1 }]
    for (const item of chapterOrders) {
      if (!item.id || typeof item.orderIndex !== 'number') {
        return res.sendCommonValue(400, "Each item must have id and orderIndex");
      }
    }

    const result = await chapterService.reorderChapters(chapterOrders, updatedBy);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "Chapters reordered successfully", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Failed to reorder chapters");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get chapter statistics
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getChapterStats = async (req, res, next) => {
  try {
    const { courseId } = req.query;
    const result = await chapterService.getChapterStats(courseId ? parseInt(courseId) : null);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "success", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Failed to get chapter statistics");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Duplicate a chapter
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const duplicateChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { createdBy, targetCourseId } = req.body;

    if (!createdBy) {
      return res.sendCommonValue(400, "createdBy is required");
    }

    const result = await chapterService.duplicateChapter(
      parseInt(id), 
      createdBy, 
      targetCourseId ? parseInt(targetCourseId) : null
    );
    
    if (result.isSuccess) {
      res.sendCommonValue(201, "Chapter duplicated successfully", result.data);
    } else {
      res.sendCommonValue(404, result.message || "Chapter not found");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Search chapters
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const searchChapters = async (req, res, next) => {
  try {
    const { 
      keyword, 
      courseId, 
      isPublished, 
      page = 1, 
      pageSize = 10 
    } = req.query;

    const searchParams = {
      keyword,
      courseId: courseId ? parseInt(courseId) : null,
      isPublished: isPublished !== undefined ? isPublished === 'true' : null,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };

    const result = await chapterService.searchChapters(searchParams);
    
    if (result.isSuccess) {
      res.sendCommonValue(200, "success", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Search failed");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
  publishChapter,
  getChaptersByCourse,
  reorderChapters,
  getChapterStats,
  duplicateChapter,
  searchChapters
};