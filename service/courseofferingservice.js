const { CourseOffering } = require("../models");

const getAllAsync = async () => {
  try {
    const offerings = await CourseOffering.findAll();
    return { isSuccess: true, data: offerings };
  } catch (err) {
    return { isSuccess: false, message: err.message };
  }
};

const getByIdAsync = async (id) => {
  try {
    const offering = await CourseOffering.findByPk(id);
    if (!offering) {
      return { isSuccess: false, message: "Course offering not found" };
    }
    return { isSuccess: true, data: offering };
  } catch (err) {
    return { isSuccess: false, message: err.message };
  }
};

const createAsync = async (data) => {
  try {
    const newOffering = await CourseOffering.create(data);
    return { isSuccess: true, data: newOffering };
  } catch (err) {
    return { isSuccess: false, message: err.message };
  }
};

const updateAsync = async (id, data) => {
  try {
    const offering = await CourseOffering.findByPk(id);
    if (!offering) {
      return { isSuccess: false, statusCode: 404, message: "Course offering not found" };
    }

    await offering.update({
      courseName: data.courseName ?? offering.courseName,
      teacherName: data.teacherName ?? offering.teacherName,
      semester: data.semester ?? offering.semester,
      capacity: data.capacity ?? offering.capacity,
      enrolledCount: data.enrolledCount ?? offering.enrolledCount,
      location: data.location ?? offering.location,
      schedule: data.schedule ?? offering.schedule,
      status: data.status ?? offering.status,
      updatedBy: data.updatedBy ?? offering.updatedBy,
    });

    return { isSuccess: true, data: offering };
  } catch (err) {
    return { isSuccess: false, message: err.message };
  }
};

const deleteAsync = async (id) => {
  try {
    const offering = await CourseOffering.findByPk(id);
    if (!offering) {
      return { isSuccess: false, statusCode: 404, message: "Course offering not found" };
    }

    await offering.destroy();
    return { isSuccess: true, data: null };
  } catch (err) {
    return { isSuccess: false, message: err.message };
  }
};

module.exports = {
  getAllAsync,
  getByIdAsync,
  createAsync,
  updateAsync,
  deleteAsync,
};
