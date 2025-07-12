const userService = require("../service/userService");
const { getCurrentUser } = require("../common/getCurrentUser");

const createUser = async (req, res) => {
  //const creatorId = req.auth?.id || null; // get the creatorId from the request
  const creatorId = getCurrentUser(req).userId; // get the creatorId from the common function
  const result = await userService.createUserAsync(req.body, creatorId);
  res.sendCommonValue(201, result.message, result.data);
};
const getAllUsers = async (req, res) => {
  const result = await userService.getAllUsersAsync();
  res.sendCommonValue(200, result.message, result.data);
};
// get user by email only used in register, login or reset password
const getUserByEmail = async (req, res) => {
  const { email } = req.query;
  const result = await userService.getUserByEmailAsync(email);
  res.sendCommonValue(200, result.message, result.data);
};

const getUserById = async (req, res) => {
  const result = await userService.getUserByIdAsync(req.params.id);
  res.sendCommonValue(200, result.message, result.data);
};

const getUsersByPage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  let filters = {};
  if (typeof req.query.filters === "string") {
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

  const result = await userService.getUsersByPageAsync(filters, fuzzyKeys, page, pageSize);
  res.sendCommonValue(200, result.message, result.data);
};
const updateUser = async (req, res) => {
  const updaterId = getCurrentUser(req).userId;
  const result = await userService.updateUserAsync(req.params.id, req.body, updaterId);
  res.sendCommonValue(200, result.message, result.data);
};

const deleteUser = async (req, res) => {
  const result = await userService.deleteUserAsync(req.params.id);
  res.sendCommonValue(200, result.message, result.data);
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
