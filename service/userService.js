const { User, Role, Profile } = require("../models/index.js");
const { Op } = require("sequelize");
const { paginateModelAsync } = require("../common/pagination");

const {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} = require("../common/commonError.js");

const bcrypt = require("bcryptjs");
const { bcryptConfig } = require("../appConfig");

// function getALLCacheKey() {
//   //Return all cached keys
//   return "user_all";
// }
const createUserAsync = async (userData, creatorId) => {
  const existing = await User.findOne({ where: { email: userData.email } });
  if (existing) throw new EntityAlreadyExistsException("A user with this email already exists");

  const hashedPassword = await bcrypt.hash(userData.password, bcryptConfig.saltRounds);

  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
    createdBy: creatorId || null,
  });

  //await cacheHelper.delAsync(getALLCacheKey());

  return {
    isSuccess: newUser.id > 0 ? true : false,
    message: "create user successfully",
    data: newUser,
  };
};

const getAllUsersAsync = async () => {
  // let cacheValue = await cacheHelper.getAsync(getALLCacheKey());
  // if (cacheValue) {
  //   return { isSuccess: true, message: "", data: JSON.parse(cacheValue) };
  // }
  var allUsers = await User.findAll({
    attributes: { exclude: ["password"] },
    include: [{ model: Role, as: "roles", through: { attributes: [] } }],
    order: [["id", "ASC"]],
  });

  //await cacheHelper.setAsync(getALLCacheKey(), JSON.stringify(allUsers), 10);
  return { isSuccess: true, message: "get all users successfully", data: allUsers };
};

// get user by email only used in register, login or reset password
const getUserByEmailAsync = async email => {
  const user = await User.findOne({ where: { email: email.trim() } });
  if (!user) throw new EntityNotFoundException("User with this email not found", 404);
  return { isSuccess: true, message: "", data: user };
};

const getUserByIdAsync = async id => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
    include: [
      { model: Role, as: "roles", through: { attributes: [] } },
      { model: Profile, as: "profile" },
    ],
  });

  if (!user) throw new EntityNotFoundException("User with this id not found");

  return { isSuccess: true, message: "Get user by id successfully", data: user };
};
const getUsersByPageAsync = async (filters = {}, fuzzyKeys = [], page, pageSize) => {
  return await paginateModelAsync(User, {
    filters,
    fuzzyKeys,
    page,
    pageSize,
    excludeFields: ["password"],
    include: [{ model: Role, as: "roles", through: { attributes: [] } }],
    orderBy: "id",
    orderDir: "ASC",
  });
};

const updateUserAsync = async (id, updateData, updaterId) => {
  const user = await User.findByPk(id);
  if (!user) throw new EntityNotFoundException("User with this idnot found");

  //id and email cannot be updated
  delete updateData.id;
  delete updateData.email;

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, bcryptConfig.saltRounds);
  }

  await user.update({
    ...updateData,
    updatedBy: updaterId,
  });

  return { isSuccess: true, message: "User updated successfully", data: updateData };
};

const deleteUserAsync = async id => {
  const user = await User.findByPk(id);
  if (!user) throw new EntityNotFoundException("User with this id not found");
  await user.destroy();
  return { isSuccess: true, message: "User deleted successfully", data: user };
};

module.exports = {
  createUserAsync,
  getAllUsersAsync,
  getUserByEmailAsync,
  getUserByIdAsync,
  getUsersByPageAsync,
  updateUserAsync,
  deleteUserAsync,
};
