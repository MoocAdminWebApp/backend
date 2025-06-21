const db = require("../models");
const User = db.User;
const Role = db.Role;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { EntityNotFoundException } = require("../common/commonError");
const { jwtConfig } = require("../appConfig");

/**
 *
 * @param {*} email
 */
const checkEmailExists = async email => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new EntityNotFoundException("User not exists");
  }
  /*get user with roles*/
  const userWithRoles = await User.findByPk(user.id, {
    include: {
      model: Role,
      as: "roles",
      through: { attributes: [] },
    },
  });
  return userWithRoles;
};

/**
 * @param {*} email
 * @param {*} password
 * @returns
 */
const login = async (email, password) => {
  const user = await checkEmailExists(email);
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return { isSuccess: false, message: "Invalid username or password", data: "" };
  }
  const token = jwt.sign(
    { id: user.id,  email: user.email, roles: user.roles },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
    }
  );
  return { isSuccess: true, message: "login success", data: token };
};
module.exports = { login };
