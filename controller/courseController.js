const courseService = require("../service/courseService");
const { getCurrentUser } = require("../common/getCurrentUser");

const createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body);
    res.sendCommonValue(201, "Course created", course);
  } catch (err) {
    res.sendCommonValue(400, err.message, null);
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.sendCommonValue(200, "Courses retrieved", courses.data);
  } catch (err) {
    res.sendCommonValue(500, err.message, null);
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.sendCommonValue(404, "Course not found", null);
    }
    res.sendCommonValue(200, "Course retrieved", course);
  } catch (err) {
    res.sendCommonValue(500, err.message, null);
  }
};

const getCoursesByPage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  let filters = {};
  if (typeof req.query.filters === "string" && req.query.filters.trim() !== "") {
    try {
      filters = JSON.parse(req.query.filters);
    } catch (err) {
      return res.sendCommonValue(400, "Invalid filters format");
    }
  }

  let fuzzyKeys = req.query.fuzzyKeys || [];
  if (typeof fuzzyKeys === "string") {
    fuzzyKeys = fuzzyKeys.split(",");
  }

  try {
    const result = await courseService.getCoursesByPage(filters, fuzzyKeys, page, pageSize);
    res.sendCommonValue(200, "Courses retrieved", result); // 👈 只传 result.data
  } catch (err) {
    res.sendCommonValue(500, err.message || "Failed to retrieve courses", null);
  }
};



const updateCourse = async (req, res) => {
  try {
    const updaterId = getCurrentUser(req).userId;
    const course = await courseService.updateCourse(
      req.params.id,
      req.body,
      updaterId
    );
    if (!course) {
      return res.sendCommonValue(404, "Course not found", null);
    }
    res.sendCommonValue(200, "Course updated", course.data);
  } catch (err) {
    res.sendCommonValue(400, err.message, null);
  }
};

const updateCourseStatus = async (req, res) => {
  try {
    const course = await courseService.updateCourseStatus(
      req.params.id,
      req.body.status
    );
    if (!course) {
      return res.sendCommonValue(404, "Course not found", null);
    }
    res.sendCommonValue(200, "Course status updated", course);
  } catch (err) {
    res.sendCommonValue(400, err.message, null);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const result = await courseService.deleteCourse(req.params.id);
    if (!result.isSuccess) {
      return res.sendCommonValue(404, result.message || "Course not found", null);
    }
    return res.sendCommonValue(200, result.message || "Course deleted", null);
  } catch (err) {
    return res.sendCommonValue(500, err.message || "Delete failed", null);
  }
};


module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  getCoursesByPage,
  updateCourse,
  updateCourseStatus,
  deleteCourse,
};
