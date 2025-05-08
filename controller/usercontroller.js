const userservice = require("../service/userservice");
const bcrypt = require("bcryptjs");
const { bcryptConfig } = require("../appConfig");
const { getBase64Extension } = require("../common/convertHelper");
const fs = require("fs");
const path = require("path");
const addUserAsync = async (req, res) => {
  //check username not in db
  let dbResult = await userservice.getUserbyNameAsync(req.body.username);
  if (dbResult.isSuccess && dbResult.data.id > 0) {
    res.sendCommonValue({}, "Username already exists", 400, 400);
    return;
  }

  let user = {};
  user.userName = req.body.userName;
  user.password = req.body.password;
  user.email = req.body.email;
  user.address = req.body.address;
  user.age = req.body.age;
  user.gender = req.body.gender;

  let password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptConfig.saltRounds);
  let encrypPassword = await bcrypt.hashSync(user.password, salt);
  user.password = encrypPassword;
  let result = await userservice.addUserAsync(user);
  if (result.isSuccess) {
    user.password = password;
    res.sendCommonValue(user, "success", 1);
  } else {
    res.sendCommonValue({}, "", 0);
  }
};

const getUserAsync = (req, res) => {
  res.sendCommonValue(
    { id: 1, name: "admin", age: 22, dt: new Date() },
    "getUserAsync",
    1
  );
};

const getUserListAsync = async (req, res) => {
  let page = parseInt(req.params.page);
  let pageSize = parseInt(req.params.pageSize);
  let result = await userservice.getUserListAsync(page, pageSize);
  if (result.isSuccess) {
    res.sendCommonValue(result.data, "success", 1);
  } else {
    res.sendCommonValue([], "failed", 0);
  }
};

const deUserByIdAsync = async (req, res) => {
  let ids = req.params.ids;
  let result = await userservice.delUserByIdAsync(ids);
  if (result.isSuccess) {
    res.sendCommonValue({}, "success", 1);
  } else {
    res.sendCommonValue({}, "failed", 0);
  }
};

const updateUserAsync = async (req, res) => {
  //check username not in db
  let user = {};
  user.id = req.body.id;
  user.userName = req.body.userName;
  user.email = req.body.email;
  user.address = req.body.address;
  user.age = req.body.age;
  user.gender = req.body.gender;

  await userservice.checkUserNameAsync(user.userName, user.id);
  // if (!checkUserResult.isSuccess) {
  //   res.sendCommonValue(400, "userName already exists");
  //   return;
  // }
  let dbResult = await userservice.uptUserByIdAsync(user);
  if (dbResult.isSuccess) {
    res.sendCommonValue(200, "update success", user);
    return;
  } else {
    res.sendCommonValue(200, "");
  }
};

const getUserByIdAsync = async (req, res) => {
  let id = parseInt(req.query.id);
  let result = await userservice.getUserbyIdAsync(id);
  res.sendCommonValue(200, "success", result.data);
};

const getCurrentUserPermissListAsync = async (req, res) => {
  let id = parseInt(req.auth.id);
  let result = await userservice.getCurrentUserPermissListAsync(id);
  res.sendCommonValue(200, "success", result.data);
};

const updateProfileAsync = async (req, res) => {
  let id = parseInt(req.auth.id);
  let user = {};
  user.userName = req.body.userName;
  user.email = req.body.email;
  user.address = req.body.address;
  user.age = req.body.age;
  user.phone = req.body.phone;
  user.gender = req.body.gender;

  const uploadDir = path.join(__dirname, "..", "public", "upload", "avatar");
  if (!req.body.avatar || req.body.avatar == "") {
    user.avatar = "";//no avatar upload delete avatar file
    if (!(await fs.existsSync(uploadDir))) {
      await fs.mkdirSync(uploadDir, { recursive: true });
    }
  } else {
    //Extract pure Base64 data (remove data: image/png; base64, Prefix)
    const base64Data = req.body.avatar.replace(/^data:image\/\w+;base64,/, "");
    //Verify if it is a valid Base64
    if (base64Data === req.body.avatar) {
      return res.sendCommonValue(400, "Invalid base64 string");
    } else {
      if (!(await fs.existsSync(uploadDir))) {
        await fs.mkdirSync(uploadDir, { recursive: true });
      }
      //save file
      const exName = getBase64Extension(req.body.avatar);
      const fileName = `avatar_${id}${exName}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFileSync(filePath, base64Data, "base64");
      user.avatar = `upload/avatar/${fileName}`;
    }
  }

  let result = await userservice.updateProfileAsync(id, user);
  if (result.isSuccess) {
    return res.sendCommonValue(200, "success");
  } else {
    return res.sendCommonValue(400, "error", result.message);
  }
};

module.exports = {
  addUserAsync,
  getUserAsync,
  getUserListAsync,
  deUserByIdAsync,
  updateUserAsync,
  getUserByIdAsync,
  getCurrentUserPermissListAsync,
  updateProfileAsync,
};
