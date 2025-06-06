const Role = require("../models/role");
const { assertFound, assertNotExists } = require("../common/assertions");

exports.createRole = async data => {
  const role = await Role.findOne({ where: { roleName: data.roleName } });
  assertNotExists(role, "Role");
  return await Role.create(data);
};

exports.updateRole = async (id, data) => {
  const role = await Role.findByPk(id);
  assertFound(role, "Role");
  await role.update(data);
  return role;
};

exports.deleteRole = async id => {
  const role = await Role.findByPk(id);
  assertFound(role, "Role");
  await role.destroy();
  return;
};

exports.getAllRoles = async () => {
  const roles = await Role.findAll();
  assertFound(roles, "Roles");
  return roles;
};

exports.getRoleById = async id => {
  const role = await Role.findByPk(id);
  assertFound(role, "Role");
  return role;
};
