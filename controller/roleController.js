const roleService = require("../service/roleService");
const { getCurrentUser } = require("../common/getCurrentUser");

const createRole = async (req, res) => {
  const creatorId = getCurrentUser(req).userId;
  const result = await roleService.createRoleAsync(req.body, creatorId);
  res.sendCommonValue(201, result.message, result.data);
};

const updateRole = async (req, res) => {
  const updaterId = getCurrentUser(req).userId;
  const result = await roleService.updateRoleAsync(req.params.id, req.body, updaterId);
  res.sendCommonValue(200, result.message, result.data);
};

const deleteRole = async (req, res) => {
  const result = await roleService.deleteRoleAsync(req.params.id);
  res.sendCommonValue(200, result.message, result.data);
};

const getAllRoles = async (req, res) => {
  const result = await roleService.getAllRolesAsync();
  res.sendCommonValue(200, result.message, result.data);
};

const getRoleById = async (req, res) => {
  const result = await roleService.getRoleByIdAsync(req.params.id);
  res.sendCommonValue(200, result.message, result.data);
};

const getRolesByPage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  let filters = {};
  if (typeof req.query.filters === "string") {
    try {
      filters = JSON.parse(req.query.filters);
    } catch (err) {
      return res.sendCommonValue(400, "Invalid filters format");
    }
  }

  let fuzzyKeys = req.query.fuzzyKeys || [];
  if (typeof fuzzyKeys === "string") {
    fuzzyKeys = fuzzyKeys.split(",");
  }

  const result = await roleService.getRolesByPageAsync(filters, fuzzyKeys, page, pageSize);
  res.sendCommonValue(200, result.message, result.data);
};

const assignMenuAndPermission = async (req, res) => {
  const roleId = req.params.id;
  const { menuIds = [], permissionIds = [] } = req.body;

  const menus = await roleService.validateMenus(menuIds);
  if (!menus) {
    return res.sendCommonValue(400, "Some menuIds are invalid");
  }

  const permissions = await roleService.validatePermissions(permissionIds);
  if (!permissions) {
    return res.sendCommonValue(400, "Some permissionIds are invalid");
  }

  const result = await roleService.assignMenusAndPermissions(roleId, menuIds, permissionIds);
  res.sendCommonValue(200, result.message, result.data);
};

module.exports = {
  createRole,
  updateRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  getRolesByPage,
  assignMenuAndPermission,
};
