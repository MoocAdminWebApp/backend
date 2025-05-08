const bcrypt = require("bcryptjs");
const logger = require("../common/logsetting");
const { jwtConfig } = require("../appConfig");
const jwt = require("jsonwebtoken");
const userservice = require("../service/userservice");

const cacheHelper = require("../common/cache/cacheHelper");

const loginAsync = async (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;
  let result = await userservice.getUserbyNameAsync(userName);
  if (!result.isSuccess) {
    res.sendCommonValue(400, "login fail userName or password not math");
  } else {
    let isMath = await bcrypt.compareSync(password, result.data.password);
    if (isMath) {
      let user = { id: result.data.id, username: result.data.username };
      let tokenStr = jwt.sign(user, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      });
      res.sendCommonValue(200, "login success", {
        accessToken: tokenStr,
        userId: result.data.id,
        username: userName,
        email: result.data.email,
        age: result.data.age,
        gender: result.data.gender,
        avatar: result.data.avatar
      });
    } else {
      res.sendCommonValue(400, "login fail username or password not math");
    }
  }

  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       res.sendCommonValue(
  //         { id: 1, name: "login", dt: new Date() },
  //         "loginOutAsync",
  //         1
  //       );
  //       resolve(1);
  //     }, 2000);
  //   });
};

const loginOutAsync = async (req, res) => {
  // let epassword = req.query.password;
  // let result = await bcrypt.compare("123456", epassword);
  res.sendCommonValue("ddd", "loginOutAsync", 1);
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       res.sendCommonValue(
  //         { id: 1, name: "loginOut", dt: new Date() },
  //         "loginOutAsync",
  //         1
  //       );
  //       resolve(1);
  //     }, 2000);
  //   });
};

module.exports = {
  loginAsync,
  loginOutAsync,
};
