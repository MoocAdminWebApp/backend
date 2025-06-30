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
  try {
    const users = await userService.getAllUsersAsync();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// get user by email only used in register, login or reset password
const getUserByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await userService.getUserByEmailAsync(email);
    res.json(user);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: statusCode,
      error: err.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserByIdAsync(req.params.id);
    res.json(user);
  } catch (err) {
    const statusCode = err.statusCode || 404;
    res.status(statusCode).json({ status: statusCode, error: err.message });
  }
};

const getUsersByPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const pagedUsers = await userService.getUsersByPageAsync(page, pageSize);
    res.json(pagedUsers);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ status: statusCode, error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updaterId = req.user?.id || null;
    const updatedUser = await userService.updateUserAsync(req.params.id, req.body, updaterId);
    res.json(updatedUser);
  } catch (err) {
    const statusCode = err.statusCode || 400;
    res.status(statusCode).json({ status: statusCode, error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUserAsync(req.params.id);
    res.json(result);
  } catch (err) {
    const statusCode = err.statusCode || 404;
    res.status(statusCode).json({ status: statusCode, error: err.message });
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
