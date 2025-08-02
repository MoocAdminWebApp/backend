const { Permission, Role } = require("../models");
const { paginateModelAsync } = require("../common/pagination");
const { EntityAlreadyExistsException, EntityNotFoundException } = require("../common//commonError");
const { Op } = require("sequelize");

const createPermission = async data => {
  const existing = await Permission.findOne({
    where: {
      permissionName: data.permissionName,
    },
  });

  if (existing) {
    throw new EntityAlreadyExistsException("Permission name already exists!");
  }

  const [permission, created] = await Permission.findOrCreate({
    where: { permissionName: data.permissionName },
    defaults: {
      permissionName: data.permissionName,
      description: data.description,
    },
  });

  // console.log(permission.permissionName);
  // console.log(permission.description);
  // console.log(created);
  if (created) {
    // console.log(permission.description);
  } else {
    throw new EntityAlreadyExistsException("Permission already exists!");
  }

  return permission;
};

const updatePermission = async (permitId, data) => {
  const existing = await Permission.findOne({
    where: {
      permissionName: data.permissionName,
      id: { [Op.ne]: permitId },
    },
  });

  if (existing) {
    throw new EntityAlreadyExistsException("Permission name already exists!");
  }
  const permission = await Permission.findByPk(permitId);
  if (!permission) throw new EntityNotFoundException("Permission not found!");
  const updatedPermission = await permission.update(
    {
      permissionName: data.permissionName,
      description: data.description,
    },
    { where: { id: permitId } }
  );

  // console.log(updatedPermission);
};

const deletePermission = async id => {
  const permission = await Permission.findByPk(id);
  if (permission === null) {
    throw new EntityNotFoundException("Permission not found!");
  } else {
    await permission.destroy();
  }
};

const getAllPermissionsAsync = async () => {
  const permissions = await Permission.findAll();
  return permissions;
};

const getPermissionById = async id => {
  const permission = await Permission.findByPk(id);
  return permission;
};

const getPermissionsByRole = async roleId => {
  const role = await Role.findByPk(roleId, {
    include: {
      model: Permission,
      as: "permissions",
      attributes: ["id", "permissionName"],
      through: { attributes: [] },
    },
  });

  console.log(role);

  if (!role) return [];
  const rolePermissions = {
    "permissions": role.permissions.map(p => ({
    permissionId: p.id,
    permissionName: p.permissionName,
  }))
};
  // return rolePermissions;
    return { isSuccess: true, message: "Get permissions by role id successful", data: rolePermissions };

};

const { User } = require('../models');
const getPermissionsByPageAsync = async (filters = {}, fuzzyKeys = [], page, pageSize) => {
  return await paginateModelAsync(Permission, {
    filters,
    fuzzyKeys,
    page,
    pageSize,
    include: [
      { model: User, as: "creator", attributes: ['id', 'firstName', 'lastName'],
      },
      { model: User, as: "updater", attributes: ['id', 'firstName', 'lastName'],
      },
    ],
    orderBy: "id",
    orderDir: "ASC",
  });
};

module.exports = {
  createPermission,
  updatePermission,
  deletePermission,
  getAllPermissionsAsync,
  getPermissionById,
  getPermissionsByRole,
  getPermissionsByPageAsync,
};
