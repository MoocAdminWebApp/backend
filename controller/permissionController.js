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

module.exports = {
  createPermission,
  updatePermission,
  deletePermission,
  getAllPermissions,
  getPermissionById,
};
