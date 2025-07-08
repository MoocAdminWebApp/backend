const courseService = require("../service/courseService");

const createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body);
    res.sendCommonValue(201, "Course created", course);
  } catch (err) {
    res.sendCommonValue(400, err.message, null);
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await courseService.getCourses(req.query);
    res.sendCommonValue(200, "Courses retrieved", courses);
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

const updateCourse = async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    if (!course) {
      return res.sendCommonValue(404, "Course not found", null);
    }
    res.sendCommonValue(200, "Course updated", course);
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
    const success = await courseService.deleteCourse(req.params.id);
    if (!success) {
      return res.sendCommonValue(404, "Course not found", null);
    }
    res.sendCommonValue(204, "Course deleted", null); // No data returned
  } catch (err) {
    res.sendCommonValue(500, err.message, null);
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  updateCourseStatus,
  deleteCourse,
};
