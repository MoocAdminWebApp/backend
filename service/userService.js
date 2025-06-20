const { User, Role, Profile } = require("../models/index.js");
const {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} = require("../common/commonError.js");

const bcrypt = require("bcryptjs");
const { bcryptConfig } = require("../appConfig");

const createUserAsync = async (userData, creatorId) => {
  const existing = await User.findOne({ where: { email: userData.email } });
  if (existing) throw new EntityAlreadyExistsException("A user with this email already exists");

  const hashedPassword = await bcrypt.hash(userData.password, bcryptConfig.saltRounds);

  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
    createdBy: creatorId || null,
  });

  return newUser.toJSON();
};

const getAllUsersAsync = async () => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    include: [{ model: Role, as: "roles", through: { attributes: [] } }],
    order: [["createdAt", "DESC"]],
  });
  return users.map(u => u.toJSON());
};
// get user by email only used in register, login or reset password
const getUserByEmailAsync = async email => {
  return await User.findOne({ where: { email: email.trim() } });
};

const getUserByIdAsync = async id => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
    include: [
      { model: Role, as: "roles", through: { attributes: [] } },
      { model: Profile, as: "profile" },
    ],
  });

  if (!user) throw new EntityNotFoundException("User not found");
  return user.toJSON();
};

const updateUserAsync = async (id, updateData, updaterId) => {
  const user = await User.findByPk(id);
  if (!user) throw new EntityNotFoundException("User not found");

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, bcryptConfig.saltRounds);
  }

  await user.update({
    ...updateData,
    updatedBy: updaterId || null,
  });

  return user.toJSON();
};

const deleteUserAsync = async id => {
  const user = await User.findByPk(id);
  if (!user) throw new EntityNotFoundException("User not found");
  await user.destroy();
  return { message: "User deleted successfully" };
};

module.exports = {
  createUserAsync,
  getAllUsersAsync,
  getUserByEmailAsync,
  getUserByIdAsync,
  updateUserAsync,
  deleteUserAsync,
};
