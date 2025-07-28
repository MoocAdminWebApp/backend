const { Role, Menu, Permission, User } = require('../models');
const { assertFound, assertNotExists } = require("../common/assertions");
const { paginateModelAsync } = require("../common/pagination");

const validateMenus = async (menuIds) => {
  const menus = await Menu.findAll({ where: { id: menuIds } });
  return menus.length === menuIds.length ? menus : null;
};

const validatePermissions = async (permissionIds) => {
  const permissions = await Permission.findAll({ where: { id: permissionIds } });
  return permissions.length === permissionIds.length ? permissions : null;
};

const createRoleAsync = async (data, creatorId) => {
  const existing = await Role.findOne({ where: { roleName: data.roleName } });
  assertNotExists(existing, "Role");

  const role = await Role.create({
    ...data,
    createdBy: creatorId || null,
  });

  return {
    isSuccess: true,
    message: "Role created successfully",
    data: role,
  };
};

const updateRoleAsync = async (id, data, updaterId) => {
  const role = await Role.findByPk(id);
  assertFound(role, "Role");

  await role.update({
    ...data,
    updatedBy: updaterId || null,
  });

  return {
    isSuccess: true,
    message: "Role updated successfully",
    data: role,
  };
};

const deleteRoleAsync = async (id) => {
  const role = await Role.findByPk(id);
  assertFound(role, "Role");

  await role.destroy();

  return {
    isSuccess: true,
    message: "Role deleted successfully",
    data: role,
  };
};

const getAllRolesAsync = async () => {
  const roles = await Role.findAll({
    include: [
      { model: Menu, as: "menus", through: { attributes: [] } },
      { model: Permission, as: "permissions", through: { attributes: [] } },
      { model: User, as: "creator", attributes: ["id", "firstName", "lastName"] },
      { model: User, as: "updater", attributes: ["id", "firstName", "lastName"] },
    ],
    order: [["id", "ASC"]],
  });

  return {
    isSuccess: true,
    message: "Get all roles successfully",
    data: roles,
  };
};

const getRoleByIdAsync = async (id) => {
  const role = await Role.findByPk(id, {
    include: [
      { model: Menu, as: "menus", through: { attributes: [] } },
      { model: Permission, as: "permissions", through: { attributes: [] } },
      { model: User, as: "creator", attributes: ["id", "firstName", "lastName"] },
      { model: User, as: "updater", attributes: ["id", "firstName", "lastName"] },
    ],
  });

  assertFound(role, "Role");

  return {
    isSuccess: true,
    message: "Get role by id successfully",
    data: role,
  };
};

const getRolesByPageAsync = async (filters = {}, fuzzyKeys = [], page, pageSize) => {
  return await paginateModelAsync(Role, {
    filters,
    fuzzyKeys,
    page,
    pageSize,
    include: [
      { model: Menu, as: "menus", through: { attributes: [] } },
      { model: Permission, as: "permissions", through: { attributes: [] } },
      { model: User, as: "creator", attributes: ["id", "firstName", "lastName"] },
      { model: User, as: "updater", attributes: ["id", "firstName", "lastName"] },
    ],
    orderBy: "id",
    orderDir: "ASC",
  });
};

const assignMenusAndPermissions = async (roleId, menuIds, permissionIds) => {
  const role = await Role.findByPk(roleId);
  assertFound(role, "Role");

  await role.setMenus(menuIds);
  await role.setPermissions(permissionIds);

  const updated = await Role.findByPk(roleId, {
    include: [
      { model: Menu, as: "menus", through: { attributes: [] } },
      { model: Permission, as: "permissions", through: { attributes: [] } },
    ],
  });

  return {
    isSuccess: true,
    message: "Menus and permissions assigned successfully",
    data: updated,
  };
};

module.exports = {
  validateMenus,
  validatePermissions,
  createRoleAsync,
  updateRoleAsync,
  deleteRoleAsync,
  getAllRolesAsync,
  getRoleByIdAsync,
  getRolesByPageAsync,
  assignMenusAndPermissions,
};
