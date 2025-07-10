const db = require("../models");
const User = db.User;
const Role = db.Role;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { EntityNotFoundException } = require("../common/commonError");
const { jwtConfig } = require("../appConfig");
const { bcryptConfig } = require("../appConfig");

const checkNewUserEmailExists = async email => {
  const user = await User.findOne({ where: { email } });
  if (user) {
    throw new EntityNotFoundException("User exists, please use another email");
  }
};

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
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
    }
  );
  return { isSuccess: true, message: "login success", data: token };
};

/**
 * @param {*} email
 * @param {*} password
 * @param {*} firstName
 * @param {*} lastName
 * @param {*} access
 * @returns
 */
const signup = async userData => {
  await checkNewUserEmailExists(userData.email);
  const hashedPassword = await bcrypt.hash(userData.password, bcryptConfig.saltRounds);
  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
    createdBy: null,
  });
  return { isSuccess: true, message: "Sign Up a New User Successfully", data: newUser };
};

module.exports = { login, signup };
