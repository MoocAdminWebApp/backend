const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { EntityNotFoundException } = require("../common/commonError");
/**
 *
 * @param {*} email
 */
const checkEmailExists = async email => {
  var user = await User.findOne({ where: { email } });
  if (!user) {
    throw new EntityNotFoundException("User not exists");
  }
};

/**
 * @param {*} email
 * @param {*} password
 * @returns
 */
const login = async (email, password) => {
  await checkEmailExists(email);
  const user = await User.findOne({ where: { email } });
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return { isSuccess: false, message: "Invalid username or password", data: "" };
  }
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return { isSuccess: true, message: "login success", data: { token, user } };
};

module.exports = { login };
