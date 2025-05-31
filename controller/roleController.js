const roleService = require("../service/roleService");

exports.createRole = async (req, res, next) => {
  try {
    const role = await roleService.createRole(req.body);
    res.sendCommonValue(201, "Role created", role);
  } catch (err) {
    next(err);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    res.sendCommonValue(200, "Role updated", role);
  } catch (err) {
    next(err);
  }
};

exports.deleteRole = async (req, res, next) => {
  try {
    await roleService.deleteRole(req.params.id);
    res.sendCommonValue(200, "Role deleted");
  } catch (err) {
    next(err);
  }
};

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json(roles);
  } catch (err) {
    next(err);
  }
};

exports.getRoleById = async (req, res, next) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    res.json(role);
  } catch (err) {
    next(err);
  }
};
