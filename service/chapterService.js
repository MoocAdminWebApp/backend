const { Chapter, Course, Media, User } = require("../models");
const { Op } = require("sequelize");
const { paginateModelAsync } = require("../common/pagination");
const {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} = require("../common/commonError.js");

const getChaptersByPage = async (filters = {}, fuzzyKeys = [], page = 1, pageSize = 10) => {
  let where = {};

  // 处理精确过滤字段（除 filter 以外）
  for (const key in filters) {
    if (key !== "filter" && filters[key] !== undefined && filters[key] !== null) {
      where[key] = filters[key];
    }
  }

  // 处理模糊搜索 filter
  if (fuzzyKeys.length > 0 && filters.filter && filters.filter.trim() !== "") {
    where[Op.or] = fuzzyKeys.map(key => ({
      [key]: { [Op.like]: `%${filters.filter.trim()}%` }
    }));
  }

  const result = await paginateModelAsync(Chapter, {
    filters: where,
    fuzzyKeys,
    page,
    pageSize,
    orderBy: "orderNum", // 按章节排序字段排序，跟模型一致
    orderDir: "ASC",
    include: [
      {
        model: Course,
        as: "course",
        attributes: ["id", "courseName", "courseDescription"],
      },
      {
        model: Media,
        as: "mediaFiles",
        attributes: ["id", "fileName", "originalName", "mediaType", "fileSize"],
      },
      {
        model: User,
        as: "creator",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  // 返回分页数据对象，包括 data、total 等
  return result.data;
};


// 获取所有章节，带过滤条件（支持分页可用 paginateModelAsync）
const getAllChapters = async (filters = {}, fuzzyKeys = [], page = 1, pageSize = 10) => {
  try {
    let where = {};
    for (const key in filters) {
      if (key !== "filter" && filters[key] !== undefined && filters[key] !== null) {
        where[key] = filters[key];
      }
    }
    // 模糊搜索字段处理
    if (fuzzyKeys.length > 0 && filters.filter && filters.filter.trim() !== "") {
      where[Op.or] = fuzzyKeys.map(key => ({
        [key]: { [Op.like]: `%${filters.filter.trim()}%` }
      }));
    }

    const result = await paginateModelAsync(Chapter, {
      filters: where,
      fuzzyKeys,
      page,
      pageSize,
      orderBy: "orderIndex",
      orderDir: "ASC",
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "courseName", "courseDescription"]
        },
        {
          model: Media,
          as: "mediaFiles",
          attributes: ["id", "fileName", "originalName", "mediaType", "fileSize"]
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
          foreignKey: "createdBy"
        }
      ],
    });

    return {
      isSuccess: true,
      message: "Get chapters successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error in getAllChapters:", error);
    return {
      isSuccess: false,
      message: "Failed to get chapters",
      error: error.message,
    };
  }
};

// 通过ID获取章节详情（含关联课程、媒体、创建者、更新者）
const getChapterById = async (id) => {
  try {
    const chapter = await Chapter.findByPk(id, {
      include: [
        { model: Course, as: "course", attributes: ["id", "courseName", "courseDescription"] },
        { model: Media, as: "mediaFiles", attributes: ["id", "fileName", "mediaType", "status", "duration", "thumbnail"] },
        { model: User, as: "creator", attributes: ["id", "firstName", "lastName" ], foreignKey: "createdBy" },
        { model: User, as: "updater", attributes: ["id", "firstName", "lastName"], foreignKey: "updatedBy" },
      ],
    });

    if (!chapter) throw new EntityNotFoundException("Chapter not found");

    return {
      isSuccess: true,
      message: "Get chapter by id successfully",
      data: chapter,
    };
  } catch (error) {
    console.error("Error in getChapterById:", error);
    return {
      isSuccess: false,
      message: error.message || "Failed to get chapter by id",
      error: error.message,
    };
  }
};

// 创建章节，自动处理orderIndex最大值
const createChapter = async (chapterData) => {
  try {
    if (!chapterData.courseId || !chapterData.title || !chapterData.createdBy) {
      throw new Error("courseId, title and createdBy are required");
    }

    const course = await Course.findByPk(chapterData.courseId);
    if (!course) throw new EntityNotFoundException("Course not found");

    if (chapterData.orderIndex === undefined || chapterData.orderIndex === null) {
      // 计算当前课程最大orderIndex
      const maxOrderChapter = await Chapter.findOne({
        where: { courseId: chapterData.courseId },
        order: [["orderIndex", "DESC"]],
      });
      chapterData.orderIndex = maxOrderChapter ? maxOrderChapter.orderIndex + 1 : 0;
    }

    const newChapter = await Chapter.create(chapterData);

    const createdChapter = await getChapterById(newChapter.id);

    return createdChapter;

  } catch (error) {
    console.error("Error in createChapter:", error);
    return {
      isSuccess: false,
      message: error.message || "Failed to create chapter",
      error: error.message,
    };
  }
};

// 更新章节
const updateChapter = async (id, updateData) => {
  try {
    const chapter = await Chapter.findByPk(id);
    if (!chapter) throw new EntityNotFoundException("Chapter not found");

    await chapter.update(updateData);

    const updatedChapter = await getChapterById(id);

    return updatedChapter;
  } catch (error) {
    console.error("Error in updateChapter:", error);
    return {
      isSuccess: false,
      message: error.message || "Failed to update chapter",
      error: error.message,
    };
  }
};

// 删除章节，禁止有媒体文件时删除
const deleteChapter = async (id) => {
  try {
    const chapter = await Chapter.findByPk(id);
    if (!chapter) throw new EntityNotFoundException("Chapter not found");

    const mediaCount = await Media.count({ where: { chapterId: id } });
    if (mediaCount > 0) {
      return {
        isSuccess: false,
        message: "Cannot delete chapter with associated media files. Delete media first.",
      };
    }

    await chapter.destroy();

    return {
      isSuccess: true,
      message: "Chapter deleted successfully",
    };
  } catch (error) {
    console.error("Error in deleteChapter:", error);
    return {
      isSuccess: false,
      message: error.message || "Failed to delete chapter",
      error: error.message,
    };
  }
};

// 根据课程获取章节列表（包含媒体文件）
const getChaptersByCourse = async (courseId) => {
  try {
    if (!courseId) throw new Error("courseId is required");

    const chapters = await Chapter.findAll({
      where: { courseId },
      include: [
        {
          model: Media,
          as: "mediaFiles",
          attributes: ["id", "fileName", "originalName", "mediaType", "fileSize", "duration", "status"],
        },
      ],
      order: [["orderIndex", "ASC"], ["createdAt", "ASC"]],
    });

    return {
      isSuccess: true,
      message: "Get chapters by course successfully",
      data: chapters,
    };
  } catch (error) {
    console.error("Error in getChaptersByCourse:", error);
    return {
      isSuccess: false,
      message: error.message || "Failed to get chapters by course",
      error: error.message,
    };
  }
};

// 重新排序章节（传入id和orderIndex数组）
const reorderChapters = async (chapterOrders, updatedBy) => {
  try {
    if (!Array.isArray(chapterOrders)) throw new Error("chapterOrders must be an array");

    const updates = [];
    for (const { id, orderIndex } of chapterOrders) {
      const chapter = await Chapter.findByPk(id);
      if (chapter) {
        await chapter.update({ orderIndex, updatedBy });
        updates.push({ id, orderIndex });
      }
    }

    return {
      isSuccess: true,
      message: "Chapters reordered successfully",
      data: { updatedChapters: updates },
    };
  } catch (error) {
    console.error("Error in reorderChapters:", error);
    return {
      isSuccess: false,
      message: error.message || "Failed to reorder chapters",
      error: error.message,
    };
  }
};

// 统计章节数据（数量、时长等）
const getChapterStats = async (courseId = null) => {
  try {
    const whereClause = courseId ? { courseId } : {};

    const stats = await Chapter.findAll({
      where: whereClause,
      attributes: [
        [Chapter.sequelize.fn('COUNT', Chapter.sequelize.col('id')), 'totalChapters'],
        [Chapter.sequelize.fn('COUNT', Chapter.sequelize.literal('CASE WHEN status = "PUBLISHED" THEN 1 END')), 'publishedChapters'],
        [Chapter.sequelize.fn('COUNT', Chapter.sequelize.literal('CASE WHEN status = "DRAFT" THEN 1 END')), 'draftChapters'],
        [Chapter.sequelize.fn('AVG', Chapter.sequelize.col('duration')), 'averageDuration'],
        [Chapter.sequelize.fn('SUM', Chapter.sequelize.col('duration')), 'totalDuration']
      ],
      raw: true,
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
      raw: true,
    });

    return {
      isSuccess: true,
      message: "Get chapter statistics successfully",
      data: {
        chapters: stats[0],
        media: mediaStats[0],
      },
    };
  } catch (error) {
    console.error("Error in getChapterStats:", error);
    return {
      isSuccess: false,
      message: error.message || "Failed to get chapter statistics",
      error: error.message,
    };
  }
};

// 复制章节
const duplicateChapter = async (sourceId, createdBy, targetCourseId = null) => {
  try {
    const sourceChapter = await Chapter.findByPk(sourceId);
    if (!sourceChapter) throw new EntityNotFoundException("Source chapter not found");

    const duplicateData = {
      courseId: targetCourseId || sourceChapter.courseId,
      title: `${sourceChapter.title} (Copy)`,
      description: sourceChapter.description,
      content: sourceChapter.content,
      videoUrl: sourceChapter.videoUrl,
      duration: sourceChapter.duration,
      status: "DRAFT",
      createdBy,
      updatedBy: createdBy,
      orderIndex: sourceChapter.orderIndex + 1, // 可调整排序
    };

    const duplicatedChapter = await createChapter(duplicateData);

    return duplicatedChapter;
  } catch (error) {
    console.error("Error in duplicateChapter:", error);
    return {
      isSuccess: false,
      message: error.message || "Failed to duplicate chapter",
      error: error.message,
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
  getChaptersByPage
};
