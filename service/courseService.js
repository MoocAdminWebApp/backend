const { Course, User, Chapter } = require("../models");

const createCourse = async (data) => {
  return await Course.create(data);
};

const getCourses = async (filters) => {
  const where = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.instructorId) {
    where.instructorId = filters.instructorId;
  }
  return await Course.findAll({ where });
};

const getCourseById = async (id) => {
  return await Course.findByPk(id, {
    include: [
      { model: User, as: "instructor", attributes: ["id", "name"] },
      { model: Chapter, as: "chapters" },
    ],
  });
};

const updateCourse = async (id, data) => {
  const course = await Course.findByPk(id);
  if (!course) return null;
  await course.update(data);
  return course;
};

const updateCourseStatus = async (id, status) => {
  const course = await Course.findByPk(id);
  if (!course) return null;
  course.status = status;
  await course.save();
  return course;
};

const deleteCourse = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) return false;
  await course.destroy();
  return true;
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  updateCourseStatus,
  deleteCourse
}
