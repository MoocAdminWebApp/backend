const { Course, User, Chapter } = require("../models");
const { Op } = require("sequelize");
const { paginateModelAsync } = require("../common/pagination");
const {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} = require("../common/commonError.js");

// 创建课程
const createCourse = async (data) => {
  const existing = await Course.findOne({ where: { courseName: data.courseName } });
  if (existing) {
    throw new EntityAlreadyExistsException("A course with this name already exists");
  }

  const newCourse = await Course.create(data);
  return {
    isSuccess: !!newCourse.id,
    message: "Course created successfully",
    data: newCourse,
  };
};

// 获取所有课程（包含讲师和章节）
const getAllCourses = async () => {
  try {
    const allCourses = await Course.findAll({
      order: [["id", "ASC"]],
      include: [
        {
          model: User,
          as: "instructor",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    return {
      isSuccess: true,
      message: "Get all courses successfully",
      data: allCourses,
    };
  } catch (error) {
    console.error("Error in getAllCourses:", error);
    return {
      isSuccess: false,
      message: "Failed to get courses",
      data: [],
      error,
    };
  }
};


// 获取分页课程
const getCoursesByPage = async (filters = {}, fuzzyKeys = [], page = 1, pageSize = 10) => {
  let where = {};

  for (const key in filters) {
    if (key !== "filter" && filters[key] !== undefined && filters[key] !== null) {
      where[key] = filters[key];
    }
  }


  if (fuzzyKeys.length > 0 && filters.filter && filters.filter.trim() !== "") {
    where[Op.or] = fuzzyKeys.map(key => ({
      [key]: { [Op.like]: `%${filters.filter.trim()}%` }
    }));
  }

  const result = await paginateModelAsync(Course, {
    filters: where,
    fuzzyKeys,
    page,
    pageSize,
    orderBy: "id",
    orderDir: "ASC",
    include: [
      {
        model: User,
        as: "instructor",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  return result.data;
};



// 通过ID获取课程
const getCourseById = async (id) => {
  const course = await Course.findByPk(id);

  if (!course) throw new EntityNotFoundException("Course with this id not found");

  return {
    isSuccess: true,
    message: "Get course by id successfully",
    data: course,
  };
};

// 更新课程
const updateCourse = async (id, data, updaterId) => {
  const course = await Course.findByPk(id);
  if (!course) throw new EntityNotFoundException("Course with this id not found");

  await course.update({
    ...data,
    updatedBy: updaterId || course.updatedBy,
  });

  return {
    isSuccess: true,
    message: "Course updated successfully",
    data: course,
  };
};

// 修改课程状态
const updateCourseStatus = async (id, status) => {
  const course = await Course.findByPk(id);
  if (!course) throw new EntityNotFoundException("Course with this id not found");

  course.status = status;
  await course.save();

  return {
    isSuccess: true,
    message: "Course status updated successfully",
    data: course,
  };
};

// 删除课程
const deleteCourse = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) throw new EntityNotFoundException("Course with this id not found");

  await course.destroy();

  return {
    isSuccess: true,
    message: "Course deleted successfully",
    data: null,
  };
};


module.exports = {
  createCourse,
  getAllCourses,
  getCoursesByPage,
  getCourseById,
  updateCourse,
  updateCourseStatus,
  deleteCourse,
};
