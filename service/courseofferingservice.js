const { CourseOffering } = require("../models");

function getNotNullProperties(obj) {
  const result={};
  for(let key in obj){
    if(obj[key] !== null && obj[key] !== undefined){
      result[key] = obj[key]
    }
  }
  return result;
}

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

    const updateModel={
      courseName:data.courseName ?? null,
      teacherName:data.teacherName ?? null,
      semester:data.semester ?? null,
      capacity:data.capacity ?? null,
      enrolledCount:data.enrolledCount ?? null,
      location:data.location ?? null,
      schedule:data.schedule ?? null,
      status:data.status ?? null,
      updateBy:data.updateBy ?? null,
    };

    const fieldsToUpdate= getNotNullProperties(updateModel);

    await CourseOffering.update(fieldsToUpdate,{
      where:{id},
      fields:Object.keys(fieldsToUpdate),
    })


    return { isSuccess: true, data: {id, ...fieldsToUpdate} };
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
    return { isSuccess: true, statusCode:204, message:"Deleted Successfully", data: null };
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
