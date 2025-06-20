const userService = require("../service/userService");

const createUser = async (req, res) => {
  try {
    const creatorId = req.user?.id || null; // get the creatorId from the request
    const newUser = await userService.createUserAsync(req.body, creatorId);
    res.status(201).json(newUser);
  } catch (err) {
    const statusCode = err.statusCode || 400;
    res.status(statusCode).json({ status: statusCode, error: err.message });
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
  updateUser,
  deleteUser,
};
