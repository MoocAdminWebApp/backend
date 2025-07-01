const { Menu, UserRole } = require("../models");
const { MenuValidator } = require("../common/inputValidator.js");

const {
  UserAuthenticatorSingleMenu,
  UserAuthenticatorAllMenu,
  MenuHandler,
} = require("../common/commonHelper.js");
const { permission } = require("process");

const menuOperation = {
  insert: 0,
  update: 1,
  delete: 2,
};
const statusCodes = {
  success: 200,
  badRequest: 400,
  authenticationError: 403,
  notFound: 404,
  internalError: 500,
};
const errorMessages = {
  role: "Role Denied: User must be assigned with at least one of the following roles to",
  permission: "Permission Denied: User must have the following permission to",
  syntax: "Syntax Error: Please check the following fields:",
};
const commonRoleId = {
  superAdmin: 1, // TODO: change to actual superAdmin id in the role table
};

/**
 * Function to retreive a specific menu
 */
const getMenuByIdAsync = async (menuId, userId) => {
  // Check whether the menu item exists
  const menu = await Menu.findByPk(menuId);
  if (!menu) {
    return {
      statusCode: statusCodes.notFound,
      data: null,
      message: `Error: Menu item with id ${menuId} not found`,
    };
  }

  // Check whether the user has sufficient access
  const userAuthResult = await UserAuthenticatorSingleMenu(menuId, userId);
  if (!userAuthResult.isAuthenticated) {
    const errorMsg = userAuthResult.role
      ? `${errorMessages.permission} view this menu: ${userAuthResult.permissionName}`
      : `${errorMessages.role} view this menu: ${userAuthResult.roleNames.join(", ")}`;
    return {
      statusCode: statusCodes.authenticationError,
      message: errorMsg,
    };
  }

  return {
    statusCode: statusCodes.success,
    data: menu.toJSON(),
    message: `Successfully retrieved menu ${menu.title} by menuId ${menuId}`,
  };
};

/**
 * Function to retrieve a list of menus that accessible by the user
 */
const getAllMenusAsync = async userId => {
  // Get all the menus accessible by user
  const menuIds = await UserAuthenticatorAllMenu(userId);

  // Retrieve an abstract of all the accessible menu items --> to build up the tree structure
  const accessibleMenus = await Menu.findAll({
    where: {
      id: menuIds,
      type: ["DIRECTORY", "MENU"], // Only directories and menus, not buttons
    },
    attributes: ["id", "title", "parentId", "orderNum", "path", "component"], // Only retrieve essential data to build up the sidebar
    order: [
      ["orderNum", "ASC"],
      ["parentId", "ASC"],
    ],
  });
  return {
    statusCode: statusCodes.success,
    data: accessibleMenus.map(m => m.toJSON()),
    message: "Successfully retrieved all accessible menus",
  };
};

/**
 * Function to update an existing menu record
 */
const updateMenuByIdAsync = async (menuId, userId, menuData) => {
  // Check whether the menu item exists
  const menu = await Menu.findByPk(menuId);
  if (!menu) {
    return {
      statusCode: statusCodes.notFound,
      message: `Error: Menu item with id ${menuId} not found`,
    };
  }

  // Check whether user has sufficient access to update the menu item
  const userAuthResult = await UserAuthenticatorSingleMenu(menuId, userId);
  if (!userAuthResult.isAuthenticated) {
    const errorMsg = userAuthResult.role
      ? `${errorMessages.permission} update this menu: ${userAuthResult.permissionName}`
      : `${errorMessages.role} update this menu: ${userAuthResult.roleNames.join(", ")}`;
    return {
      statusCode: statusCodes.authenticationError,
      message: errorMsg,
    };
  }

  // Check whether the inputs are legal and satisfy the requirements
  const checkInputResult = await MenuValidator({
    title: menuData.title ? menuData.title : "",
    type: menuData.type ? menuData.type : "",
    status: menuData.status ? menuData.status : "",
    comment: menuData.comment,
  });
  if (!checkInputResult.finalResult) {
    return {
      statusCode: statusCodes.badRequest,
      message: `${errorMessages.syntax} ${checkInputResult.invalidKeys.join(", ")}`,
      invalidKeys: checkInputResult.invalidKeys,
    };
  }

  // Update the menu item
  const updateResult = await MenuHandler(menuOperation.update, menuId, userId, menuData);
  // TODO: continue working on this place after unifying all the return
  return updateResult;
};

const deleteMenuByIdAsync = async (menuId, userId) => {
  // Check whether the menu item exists
  const menu = await Menu.findByPk(menuId);
  if (!menu) {
    return {
      statusCode: statusCodes.notFound,
      message: `Error: Menu item with id ${menuId} not found`,
    };
  }
  const menuTitle = menu.title ? menu.title : "";

  // Check whether user has sufficient access to update the menu item
  const userAuthResult = await UserAuthenticatorSingleMenu(menuId, userId);
  if (!userAuthResult.isAuthenticated) {
    const errorMsg = userAuthResult.role
      ? `${errorMessages.permission} delete this menu: ${userAuthResult.permissionName}`
      : `${errorMessages.role} delete this menu: ${userAuthResult.roleNames.join(", ")}`;
    return {
      statusCode: statusCodes.authenticationError,
      message: errorMsg,
    };
  }

  // Delete the menu
  const deleteResult = await MenuHandler(menuOperation.delete, menuId, null, null);
  if (deleteResult.statusCode !== statusCodes.success) {
    return deleteResult;
  }

  // Obtain a list of current menu tree for the front end to re-render the tree structure display
  const newMenuTree = await getAllMenusAsync(userId);
  return {
    statusCode: statusCodes.success,
    data: newMenuTree,
    message: deleteResult.message,
    deletedMenu: menuTitle,
  };
};

const createMenuAsync = async (userId, menuData) => {
  // Check whether user has sufficient access to update the menu item
  // By default, ONLY superAdmin has the access to create new menu
  const userRole = await UserRole.findAll({
    where: { userId },
    attributes: ["roleId"],
  });
  if (!userRole || userRole.length === 0)
    return {
      statusCode: statusCodes.authenticationError,
      message: `${errorMessages.role} create a new menu: superAdmin`,
    };

  const userRoleList = userRole.map(r => r.roleId);
  if (!userRoleList.includes(commonRoleId.superAdmin))
    return {
      statusCode: statusCodes.authenticationError,
      message: `${errorMessages.role} create a new menu: superAdmin}`,
    };

  // Check whether the inputs are legal and satisfy the requirements
  // TODO: make a helper function for input checking
  const checkInputResult = await MenuValidator({
    title: menuData.title ? menuData.title : "",
    type: menuData.type ? menuData.type : "",
    status: menuData.status ? menuData.status : "",
    comment: menuData.comment ? menuData.comment : null,
    path: menuData.path ? menuData.path : null,
    component: menuData.component ? menuData.component : null,
    permission: menuData.permission ? menuData.permission : null,
  });
  if (!checkInputResult.finalResult) {
    return {
      statusCode: statusCodes.badRequest,
      message: `${errorMessages.syntax} ${checkInputResult.invalidKeys.join(", ")}`,
      invalidKeys: checkInputResult.invalidKeys,
    };
  }

  // Create new menu item in the database, and
  // MenuHandler will check whether another menu item with same title/path/component already exists
  const createResult = await MenuHandler(menuOperation.insert, null, userId, menuData);
  return createResult;
};

module.exports = {
  getMenuByIdAsync,
  getAllMenusAsync,
  updateMenuByIdAsync,
  deleteMenuByIdAsync,
  createMenuAsync,
};
