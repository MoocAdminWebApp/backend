const db = require("../models");
const User = db.User;
const Role = db.Role;
const Profile =db.Profile;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { EntityNotFoundException } = require("../common/commonError");
const { jwtConfig } = require("../appConfig");
const { bcryptConfig } = require("../appConfig");
const { resetPwdConfig } = require("../appConfig");
const nodemailer = require("nodemailer");

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
  const userWithRolesAndProfile = await User.findByPk(user.id, {
    include:[ {
      model: Role,
      as: "roles",
      through: { attributes: [] },
      attributes: ["roleName"]
    },
    { model: Profile, as: "profile",
        attributes: ["id","phoneNumber", "gender", "birthdate", "streetAddress"], },
    ]
  });

  return userWithRolesAndProfile;
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
      userId: user.id,
      profileId: user.profile.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
      phone: user.profile.phoneNumber,
      address: user.profile.streetAddress,
      gender: user.profile.gender,
      birthdate:user.profile.birthdate
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

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: resetPwdConfig.userEmail, //gmail address
    pass: resetPwdConfig.appPwd, //app password
  },
});

/**
 * @param {*} to
 * @param {*} link
 * @returns
 */

const sendResetEmail = async (to, link) => {
  await transporter.sendMail({
    from: `"MOOC Course" <${resetPwdConfig.userEmail}>`,
    to,
    subject: "Reset your password",
    html: `<p>Click <a href="${link}"> here</a> to reset your password. This link is valid for 15 minutes.</p>`,
  });
  console.log("Email sent to", to);
};

/**
 * @param {*} email
 * @returns
 */
const sendEmail = async email => {
  const user = await checkEmailExists(email);
  if (user) {
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
        expiresIn: jwtConfig.resetPasswordExpiresIn,
      }
    );
    console.log("resetPwdConfig.frontendURL", resetPwdConfig.frontendURL);
    await sendResetEmail(email, `http://${resetPwdConfig.frontendURL}/resetPwd?token=${token}`);
  }
  return {
    isSuccess: true,
    message: "This user exists, a reset link has been sent to your email",
    data: {},
  };
};

/**
 * @param {*} token
 * @param {*} password
 * @returns
 */

const resetPwd = async (token, password) => {
  const payload = jwt.verify(token, jwtConfig.secret);
  const user = await User.findByPk(payload.id);
  if (user) {
    user.password = await bcrypt.hash(password, bcryptConfig.saltRounds);
    await user.save();
  }
  return { isSuccess: true, message: "Password reset successfully", data: {} };
};

module.exports = { login, signup, resetPwd, sendEmail };
