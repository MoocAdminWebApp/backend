const { Permission, Role, RolePermission, UserRole, User } = require("../models");
const { paginateModelAsync } = require("../common/pagination");
const { EntityAlreadyExistsException, EntityNotFoundException } = require("../common//commonError");
const { SuccessResponse } = require("../common/response");
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
      id: {
        [Op.ne]: permitId,
      },
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
    permissions: role.permissions.map(p => ({
      permissionId: p.id,
      permissionName: p.permissionName,
    })),
  };
  // return rolePermissions;
  return {
    isSuccess: true,
    message: "Get permissions by role id successful",
    data: rolePermissions,
  };
};

/**
 * getPermissionByUserId(userId)
 * function to return a list of user's permissions that has been granted to user's role
 * @param {number} userId
 */
const getPermissionByUserId = async userId => {
  // Check whether the user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw new EntityNotFoundException(`User with id ${userId} doesn't exist`);
  }

  // Check the role(s) that the user has been assigned with
  // TODO: check whether the user can have more than one role
  const userRoles = await UserRole.findAll({
    where: { userId: userId },
  });
  if (userRoles.length < 1) {
    throw new EntityNotFoundException(`User with id ${userId} hasn't been granted with any role`);
  }
  const roleIds = userRoles.map(r => r.roleId);

  // Check the unique permission(s) that has been granted to the role(s) that user has been assign with
  const rolePermissions = await RolePermission.findAll({
    where: { roleId: roleIds },
  });
  if (rolePermissions.length < 1) {
    throw new EntityNotFoundException(
      `User ${userId} has been garnted with following role(s): [${roleIds.join(", ")}], but no permission has been granted to any of these roles.`
    );
  }
  const permissionIds = [...new Set(rolePermissions.map(rp => rp.permissionId))];

  // Retrieve the permission(s) detail
  const permissionList = await Permission.findAll({
    where: { id: permissionIds },
    attributes: ["id", "permissionName"],
  });

  return new SuccessResponse(
    `Successfully retrieved ${permissionList.length} permission(s) for user ${userId}.`,
    permissionList
  );
};

const getPermissionsByPageAsync = async (filters = {}, fuzzyKeys = [], page, pageSize) => {
  return await paginateModelAsync(Permission, {
    filters,
    fuzzyKeys,
    page,
    pageSize,
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: User,
        as: "updater",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
    orderBy: "id",
    orderDir: "ASC",
  });
};

/**
 * Returns a map of all the existing permissions and list of roles that have been assigned with corrsponding permission
 * used to render frontend props
 */
const getPermissionAndRole = async () => {
  const permissions = await Permission.findAll({
    attributes: ["id", "permissionName"],
    include: [
      {
        model: RolePermission,
        as: "rolePermissions",
        required: false,
        include: [
          {
            model: Role,
            as: "roleInfo",
            attributes: ["id", "roleName"],
          },
        ],
      },
    ],
  });

  const resultMap = {};
  for (const permission of permissions) {
    const permissionId = permission.id;
    const permissionName = permission.permissionName;
    const rolePermissions = permission.rolePermissions;
    const roleList = (permission.rolePermissions || []).map(r => {
      if (r.roleInfo && r.roleInfo.roleName) {
        return r.roleInfo.roleName;
      } else {
        return "Unknown";
      }
    });
    console.log(
      `Permission ${permissionId}- ${permissionName} has been assigned to following roles: ${roleList}`
    );
    resultMap[permissionId] = {
      permissionId: permissionId,
      permissionName: permissionName,
      roleList: roleList,
    };
  }
  return new SuccessResponse("Successfully build permission-role map", resultMap);
};

module.exports = {
  createPermission,
  updatePermission,
  deletePermission,
  getAllPermissionsAsync,
  getPermissionById,
  getPermissionsByRole,
  getPermissionsByPageAsync,
  getPermissionByUserId,
  getPermissionAndRole,
};
