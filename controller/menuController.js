const menuService = require("../service/menuService");

const statusCodes = {
  success: 200,
  badRequest: 400,
  authenticationError: 403,
  notFound: 404,
  internalError: 500,
};

const commonRoleId = {
  superAdmin: 1, // TODO: change to actual superAdmin id in the role table by Role -> GET
};

const errorMessages = {
  role: "Role Denied: User must be assigned with at least one of the following roles to",
  permission: "Permission Denied: User must have the following permission to",
  syntax: "Syntax Error: Please check the following fields:",
};

const getMenuById = async (req, res) => {
  const menuId = req.params.id;
  const userId = req.header("userid"); // TODO: change to req.user.id when authentication is implemented

  try {
    const menu = await menuService.getMenuByIdAsync(menuId, userId);
    return res.status(menu.statusCode).json(menu);
  } catch (error) {
    console.error(error);

    const resultStatus = error.statusCode ? error.statusCode : statusCodes.internalError;
    const resultMessage = error.message ? error.message : "Internal Server Error";
    return res.status(resultStatus).json({
      statusCode: resultStatus,
      message: resultMessage,
      data: null,
    });
  }
};

const getAllMenus = async (req, res) => {
  const userId = req.header("userid"); // TODO: change to req.user.id when authentication is implemented

  try {
    const menus = await menuService.getAllMenusAsync(userId);
    return res.status(statusCodes.success).json(menus);
  } catch (error) {
    console.error(error);

    const resultStatus = error.statusCode ? error.statusCode : statusCodes.internalError;
    const resultMessage = error.message ? error.message : "Internal Server Error";
    return res.status(resultStatus).json({
      statusCode: resultStatus,
      message: resultMessage,
      data: null,
    });
  }
};

const updateMenuById = async (req, res) => {
  const menuId = req.params.id;
  const userId = req.header("userid"); // TODO: change to req.user.id when authentication is implemented
  const menuData = req.body;

  try {
    const menu = await menuService.updateMenuByIdAsync(menuId, userId, menuData);
    return res.status(menu.statusCode).json(menu);
  } catch (error) {
    console.error(error);

    const resultStatus = error.statusCode ? error.statusCode : statusCodes.internalError;
    const resultMessage = error.message ? error.message : "Internal Server Error";
    return res.status(resultStatus).json({
      statusCode: resultStatus,
      message: resultMessage,
      data: null,
    });
  }
};

const deleteMenuById = async (req, res) => {
  const menuId = req.params.id;
  const userId = req.header("userid"); // TODO: change to req.user.id when authentication is implemented

  try {
    const menu = await menuService.deleteMenuByIdAsync(menuId, userId);
    return res.status(menu.statusCode).json(menu);
  } catch (error) {
    console.error(error);

    const resultStatus = error.statusCode ? error.statusCode : statusCodes.internalError;
    const resultMessage = error.message ? error.message : "Internal Server Error";
    return res.status(resultStatus).json({
      statusCode: resultStatus,
      message: resultMessage,
      data: null,
    });
  }
};

const createMenu = async (req, res) => {
  const userId = req.header("userid"); // TODO: change to req.user.id when authentication is implemented
  const menuData = req.body;

  try {
    const menu = await menuService.createMenuAsync(userId, menuData);
    return res.status(menu.statusCode).json(menu);
  } catch (error) {
    console.error(error);

    const resultStatus = error.statusCode ? error.statusCode : statusCodes.internalError;
    const resultMessage = error.message ? error.message : "Internal Server Error";
    return res.status(resultStatus).json({
      statusCode: resultStatus,
      message: resultMessage,
      data: null,
    });
  }
};

module.exports = {
  getMenuById,
  getAllMenus,
  updateMenuById,
  deleteMenuById,
  createMenu,
};
