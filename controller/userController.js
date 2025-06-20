const userService = require("../service/userService");
const {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  UserFriendlyException,
} = require("../common/commonError.js");

const createUser = async (req, res) => {
  try {
    const creatorId = req.user?.id || null; // get the creatorId from the request
    const newUser = await userService.createUserAsync(req.body, creatorId);
    res.status(201).json(newUser);
  } catch (err) {
    if (err instanceof EntityAlreadyExistsException) {
      return res.status(err.statusCode).json({ status: err.statusCode, error: err.message });
    }
    res.status(400).json({ error: err.message });
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
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserByIdAsync(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updaterId = req.user?.id || null;
    const updatedUser = await userService.updateUserAsync(req.params.id, req.body, updaterId);
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUserAsync(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
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
