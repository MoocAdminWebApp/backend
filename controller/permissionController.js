const permissionService = require("../service/permissionService");

const createPermission = async (req, res, next) => {
  try {
    const permission = await permissionService.createPermission(req.body);
    res.sendCommonValue(201, "Permission created", permission);
  } catch (err) {
    next(err);
  }
};

const updatePermission = async (req, res, next) => {
  try {
    const permission = await permissionService.updatePermission(req.params.id, req.body);
    res.sendCommonValue(200, "Permission updated", permission);
  } catch (err) {
    next(err);
  }
};

const deletePermission = async (req, res, next) => {
  try {
    await permissionService.deletePermission(req.params.id);
    res.sendCommonValue(200, "Permission deleted");
  } catch (err) {
    next(err);
  }
};

const getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await permissionService.getAllPermissionsAsync();
    res.json(permissions);
  } catch (err) {
    next(err);
  }
};

const getPermissionById = async (req, res, next) => {
  try {
    const permission = await permissionService.getPermissionById(req.params.id);
    res.json(permission);
  } catch (err) {
    next(err);
  }
};

const getPermissionsByRole = async (req, res, next) => {
  try {
    const permissions = await permissionService.getPermissionsByRole(req.params.id);
    res.json(permissions);
  } catch (err) {
    next(err);
  }
};

const getPermissionsByPage = async (req, res) => {
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

  const result = await permissionService.getPermissionsByPageAsync(
    filters,
    fuzzyKeys,
    page,
    pageSize
  );
  res.sendCommonValue(200, result.message, result.data);
};

const getPermissionByUserId = async (req, res) => {
  console.log(req);
  try {
    const result = await permissionService.getPermissionByUserId(req.params.id);
    res.sendCommonValue(result.statusCode, result.message, result.data);
  } catch (err) {
    res.sendCommonValue(err.statusCode ? err.statusCode : 500, err.message);
  }
};

module.exports = {
  createPermission,
  updatePermission,
  deletePermission,
  getAllPermissions,
  getPermissionById,
  getPermissionsByRole,
  getPermissionsByPage,
  getPermissionByUserId,
};
