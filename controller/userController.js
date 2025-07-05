const userService = require("../service/userService");
const { getCurrentUser } = require("../common/getCurrentUser");

const createUser = async (req, res) => {
  //const creatorId = req.auth?.id || null; // get the creatorId from the request
  const creatorId = getCurrentUser(req).userId; // get the creatorId from the common function
  const result = await userService.createUserAsync(req.body, creatorId);

  if (result.isSuccess) {
    res.sendCommonValue(201, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};
const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsersAsync();
  res.json(users);
  if (result.isSuccess) {
    res.sendCommonValue(201, "success", result.data);
  } else {
    res.sendCommonValue(500, "fail");
  }
};
// get user by email only used in register, login or reset password
const getUserByEmail = async (req, res) => {
  const { email } = req.query;
  const result = await userService.getUserByEmailAsync(email);
  res.sendCommonValue(200, "success", result.data);
};

const getUserById = async (req, res) => {
  const result = await userService.getUserByIdAsync(req.params.id);
  res.sendCommonValue(200, "success", result.data);
};

const getUsersByPage = async (req, res) => {
  let access = req.query.access ?? null;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const result = await userService.getUsersByPageAsync(access, page, pageSize);

  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

const updateUser = async (req, res) => {
  const updaterId = getCurrentUser(req).userId;
  const result = await userService.updateUserAsync(req.params.id, req.body, updaterId);
  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

const deleteUser = async (req, res) => {
  const result = await userService.deleteUserAsync(req.params.id);

  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  getUsersByPage,
  updateUser,
  deleteUser,
};
