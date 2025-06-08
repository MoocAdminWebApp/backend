const db = require('../models');
const Menu = db.Menu;
const Role = db.Role;
const Permission = db.Permission;
const { assertFound, assertNotExists } = require("../common/assertions");

exports.validateMenus = async (menuIds) => {
  const menus = await Menu.findAll({ where: { id: menuIds } });
  console.log("Menus",menuIds,menus)
  return menus.length === menuIds.length ? menus : null;
 
};

exports.validatePermissions = async (permissionIds) => {
  const permissions = await Permission.findAll({ where: { id: permissionIds } });
  return permissions.length === permissionIds.length ? permissions : null;
};

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

exports.assignMenusAndPermissions = async(roleId,menuIds, permissionIds)=>{
  const role = await Role.findByPk(roleId);
  assertFound(role, "Role");

  await role.setMenus(menuIds);
  await role.setPermissions(permissionIds);

  return await Role.findByPk(role.id, {
    include: [
      { model: Menu, as: "menus" },
      { model: Permission, as: "permissions" },
    ],
  });

}

