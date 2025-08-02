// service/commonInfoService.js
// This file contains functions to retrieve data from several database to build-up readable information to feed into frontend rendering

const db = require("../models/index.js");
const {
  SuccessResponse,
  UnauthoriseException,
  EntityNotFoundException,
  EntityConflictException,
} = require("./response.js");
const { Op } = require("sequelize");
const { permission } = require("process");

const Menu = db.Menu;
const RolePermission = db.RolePermission;
const Permission = db.Permission;
const Role = db.Role;

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
    const pId = permission.id;
    const pName = permission.permissionName;
    const rp = permission.rolePermissions;
    const rList = rp.map(r => {
      if (r.roleInfo && r.roleInfo.roleName) {
        return r.roleInfo.roleName;
      } else {
        return "Unknown";
      }
    });
    console.log(`Permission ${pId}- ${pName} has been assigned to following roles: ${rList}`);
    resultMap[pId] = {
      permissionId: pId,
      permissionName: pName,
      roleList: rList,
    };
  }
  return resultMap;
};

module.exports = {
  getPermissionAndRole,
};
