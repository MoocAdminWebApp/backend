const { db } = require("../db/mysqldb.js");
const logger = require("../common/logsetting");
const { User, Role, UserRole, Menu, RoleMenu } = require("../models/index.js");
const {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  UserFriendlyException,
} = require("../common/commonError");

const getUserbyNameAsync = async (name) => {
  let sql = "SELECT * FROM User where username=? ";
  let result = await db.query(sql, [name]);
  let user = { id: 0 };
  if (result[0].length > 0) {
    user.id = result[0][0].id;
    user.userName = result[0][0].username;
    user.password = result[0][0].password;
    user.email = result[0][0].email;
    user.age = result[0][0].age;
    user.gender = result[0][0].gender;
  }
  return { isSuccess: user.id > 0, message: "", data: user };
};

const addUserAsync = async (user) => {
  let sql =
    "insert into User(username,password,email,address,age,gender) values (?,?,?,?,?,?)";
  let result = await db.query(sql, [
    user.userName,
    user.password,
    user.email,
    user.address,
    user.age,
    user.gender,
  ]);
  return { isSuccess: true, message: "" };
};

const getUserListAsync = async (page, pageSize) => {
  let countSql = "SELECT count(*) total FROM User; ";
  let resultCount = await db.query(countSql);
  let total = resultCount[0][0].total;
  if (total == 0) {
    return { isSuccess: true, message: "", data: { items: [], total: 0 } };
  }
  let sql = "SELECT * FROM User limit ? offset ? ;";
  let resultData = await db.query(sql, [pageSize, (page - 1) * pageSize]);

  let userlist = [];
  if (resultData[0].length > 0) {
    resultData[0].forEach((element) => {
      let user = { id: 0 };
      user.id = element.id;
      user.username = element.username;
      //user.password = element.password;
      user.email = element.email;
      user.age = element.age;
      user.gender = element.gender;
      userlist.push(user);
    });
  }
  return {
    isSuccess: true,
    message: "",
    data: { items: userlist, total: total },
  };
};

const delUserByIdAsync = async (idsString) => {
  const ids = idsString.split(",").map((id) => parseInt(id));
  let sql = "Delete FROM User where id in (?); ";
  let reuslt = await db.query(sql, [ids]);
  if (reuslt[0].affectedRows > 0) {
    return { isSuccess: true, mesage: "" };
  }

  return { isSuccess: false, mesage: "" };
};

const uptUserByIdAsync = async (user) => {
  let sql =
    "Update User set username=?,email=?,address=?,age=?,gender=? where id =?";
  let result = await db.query(sql, [
    user.username,
    user.email,
    user.address,
    user.age,
    user.gender,
    user.id,
  ]);
  if (result[0].affectedRows > 0) {
    return { isSuccess: true, mesage: "" };
  }
  return { isSuccess: false, mesage: "" };
};

const checkUserNameAsync = async (uername, id) => {
  let sql = "SELECT * FROM User where username=? ";
  let result = await db.query(sql, [uername]);
  let user = { id: 0 };
  if (result[0].length > 0) {
    user.id = result[0][0].id;
    user.username = result[0][0].username;
    user.password = result[0][0].password;
    user.email = result[0][0].email;
    user.age = result[0][0].age;
    user.gender = result[0][0].gender;
  }

  if (user.id > 0 && user.id !== id) {
    throw new EntityAlreadyExistsException("username already exists");
  }

  return { isSuccess: true, message: "", data: user };
};

const getUserbyIdAsync = async (id) => {
  let sql = "SELECT * FROM User where id=? ";
  let result = await db.query(sql, [id]);
  let user = { id: 0 };
  if (result[0].length > 0) {
    user.id = result[0][0].id;
    user.userName = result[0][0].userName;
    //user.password = result[0][0].password;
    user.email = result[0][0].email;
    user.phone = result[0][0].phone;
    user.age = result[0][0].age;
    user.gender = result[0][0].gender;
    user.avatar = result[0][0].avatar;
  }
  return { isSuccess: true, message: "", data: user };
};

const getCurrentUserPermissListAsync = async (id) => {
  const user = await User.findByPk(id, {
    include: [
      {
        model: Role,
        as: "roles",
      },
    ],
  });

  if (!user) {
    throw new EntityNotFoundException("user not found");
  }

  if (user.roles && user.roles.length > 0) {
    const roleIds = user.roles.map((role) => role.id);
    const menus = await RoleMenu.findAll({
      where: {
        roleId: roleIds,
      },
      include: [
        {
          model: Menu,
          as: "menus",
        },
      ],
    });
    let menusList = [];
    if (menus && menus.length > 0) {
      menusList = menus.map((menu) => ({
        id: menu.menus.id,
        title: menu.menus.title,
        permission:
          menu.menus.permission == undefined || menu.menus.permission == null
            ? ""
            : menu.menus.permission,
        parentId: menu.menus.parentId,
        route: menu.menus.route,
        componentPath: menu.menus.componentPath,
        orderNum: menu.menus.orderNum,
        httpUrl: menu.menus.httpUrl,
        httpMethod: menu.menus.httpMethod,
        children: [],
      }));
    }

    let rootMenuTree = [];
    menusList.forEach((menu) => {
      if (
        menu.parentId == 0 ||
        menu.parentId == null ||
        menu.parentId == undefined
      ) {
        if (!rootMenuTree.some((x) => x.id == menu.id)) {
          rootMenuTree.push({
            id: menu.id,
            title: menu.title,
            parentId: menu.parentId,
            route: menu.route,
            componentPath: menu.componentPath,
            orderNum: menu.orderNum,
            httpUrl: menu.httpUrl,
            httpMethod: menu.httpMethod,
            children: [],
          });
        }
      }
    });

    for (let i = 0; i < rootMenuTree.length; i++) {
      buildMenuTree(menusList, rootMenuTree[i]);
    }

    return { isSuccess: true, message: "", data: { menus: rootMenuTree } };
  }

  return { isSuccess: true, message: "", data: [] };
};

const buildMenuTree = (menus, parentMenu) => {
  let childList = menus.filter((menu) => menu.parentId == parentMenu.id); //找到子菜单
  if (childList.length > 0) {
    childList.forEach((child) => {
      buildMenuTree(menus, child);
      if (!parentMenu.children.some((x) => x.id == child.id)) {
        parentMenu.children.push(child);
      }
    });
  }
};

const updateProfileAsync = async (id, user) => {
  if (user.gender !== undefined) {
    const genderMap = {
      0: "Other",
      1: "Male",
      2: "Female",
    };
    user.gender = genderMap[user.gender];
  }

  const [updatedUsers, affectedCount] = await User.update(user, {
    where: { id: id },
    returning: true, // Return the updated record(s)
  });

  if (affectedCount === 0) {
    throw new UserFriendlyException("User not found or no changes made");
  }

  return { isSuccess: true, message: "" };
};

module.exports = {
  getUserbyNameAsync,
  addUserAsync,
  getUserListAsync,
  delUserByIdAsync,
  uptUserByIdAsync,
  checkUserNameAsync,
  getUserbyIdAsync,
  getCurrentUserPermissListAsync,
  updateProfileAsync,
};
