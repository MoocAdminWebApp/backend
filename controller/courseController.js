const courseService = require("../services/course.service");

const createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await courseService.getCourses(req.query);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateCourseStatus = async (req, res) => {
  try {
    const course = await courseService.updateCourseStatus(
      req.params.id,
      req.body.status
    );
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const success = await courseService.deleteCourse(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCourse, 
  getCourses, 
  getCourseById, 
  updateCourse, 
  updateCourseStatus,
  deleteCourse
}
