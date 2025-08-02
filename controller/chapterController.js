const chapterService = require("../service/chapterService");
const { getCurrentUser } = require("../common/getCurrentUser");

/**
 * 获取所有章节，支持过滤参数（courseId, published）
 */
const getAllChapters = async (req, res, next) => {
  try {
    const { courseId, published } = req.query;
    const filters = {};

    if (courseId) filters.courseId = Number(courseId);
    if (published !== undefined) filters.isPublished = published === 'true';

    const result = await chapterService.getAllChapters(filters);

    if (result.isSuccess) {
      res.sendCommonValue(200, "Success", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Failed to get chapters");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * 根据ID获取章节详情
 */
const getChapterById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const result = await chapterService.getChapterById(id);

    if (result.isSuccess) {
      res.sendCommonValue(200, "Success", result.data);
    } else {
      res.sendCommonValue(404, result.message || "Chapter not found");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * 分页获取章节，支持filters和fuzzyKeys
 */
const getChapterByPage = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    let filters = {};
    if (typeof req.query.filters === 'string' && req.query.filters.trim()) {
      try {
        filters = JSON.parse(req.query.filters);
      } catch {
        return res.sendCommonValue(400, "Invalid filters format");
      }
    }

    let fuzzyKeys = req.query.fuzzyKeys || [];
    if (typeof fuzzyKeys === 'string') fuzzyKeys = fuzzyKeys.split(',');

    const result = await chapterService.getChaptersByPage(filters, fuzzyKeys, page, pageSize);

    res.sendCommonValue(200, "Success", result);
  } catch (error) {
    next(error);
  }
};

/**
 * 新建章节
 */
const createChapter = async (req, res, next) => {
  try {
    const currentUser = getCurrentUser(req);
    const chapterData = {
      courseId: req.body.courseId,
      title: req.body.title,
      description: req.body.description,
      orderIndex: req.body.orderIndex || 0,
      content: req.body.content,
      videoUrl: req.body.videoUrl,
      duration: req.body.duration,
      createdBy: currentUser?.userId || req.body.createdBy,
      updatedBy: currentUser?.userId || req.body.createdBy,
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
 * 更新章节，只更新请求中包含的字段
 */
const updateChapter = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const allowedFields = ['title', 'description', 'orderIndex', 'isPublished', 'content', 'videoUrl', 'duration', 'updatedBy'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.sendCommonValue(400, "No fields to update");
    }

    const result = await chapterService.updateChapter(id, updateData);

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
 * 删除章节
 */
const deleteChapter = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const result = await chapterService.deleteChapter(id);

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
 * 发布或取消发布章节
 */
const publishChapter = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { isPublished, updatedBy } = req.body;

    const result = await chapterService.updateChapter(id, { isPublished, updatedBy });

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
 * 获取某课程的所有章节
 */
const getChaptersByCourse = async (req, res, next) => {
  try {
    const courseId = Number(req.params.courseId);
    const { published } = req.query;

    const filters = { courseId };
    if (published !== undefined) filters.isPublished = published === 'true';

    const result = await chapterService.getChaptersByCourse(filters);

    if (result.isSuccess) {
      res.sendCommonValue(200, "Success", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Failed to get chapters");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * 调整章节排序
 */
const reorderChapters = async (req, res, next) => {
  try {
    const { chapterOrders, updatedBy } = req.body;

    if (!Array.isArray(chapterOrders) || chapterOrders.length === 0) {
      return res.sendCommonValue(400, "chapterOrders must be a non-empty array");
    }

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
 * 获取章节统计
 */
const getChapterStats = async (req, res, next) => {
  try {
    const courseId = req.query.courseId ? Number(req.query.courseId) : null;
    const result = await chapterService.getChapterStats(courseId);

    if (result.isSuccess) {
      res.sendCommonValue(200, "Success", result.data);
    } else {
      res.sendCommonValue(400, result.message || "Failed to get chapter statistics");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * 复制章节
 */
const duplicateChapter = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { createdBy, targetCourseId } = req.body;

    if (!createdBy) {
      return res.sendCommonValue(400, "createdBy is required");
    }

    const result = await chapterService.duplicateChapter(id, createdBy, targetCourseId ? Number(targetCourseId) : null);

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
 * 搜索章节
 */
const searchChapters = async (req, res, next) => {
  try {
    const { keyword, courseId, isPublished, page = 1, pageSize = 10 } = req.query;

    const searchParams = {
      keyword,
      courseId: courseId ? Number(courseId) : null,
      isPublished: isPublished !== undefined ? isPublished === 'true' : null,
      page: Number(page),
      pageSize: Number(pageSize),
    };

    const result = await chapterService.searchChapters(searchParams);

    if (result.isSuccess) {
      res.sendCommonValue(200, "Success", result.data);
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
  getChapterByPage,
  createChapter,
  updateChapter,
  deleteChapter,
  publishChapter,
  getChaptersByCourse,
  reorderChapters,
  getChapterStats,
  duplicateChapter,
  searchChapters,
};
