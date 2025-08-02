const db = require("../models");
const {
  SuccessResponse,
  UnauthoriseException,
  EntityNotFoundException,
  EntityConflictException,
} = require("../common/response.js");
const { Op } = require("sequelize");
const { permission } = require("process");
const Menu = db.Menu;
const RoleMenu = db.RoleMenu;
const RolePermission = db.RolePermission;
const UserRole = db.UserRole;
const Permission = db.Permission;
const Role = db.Role;
const { getPermissionAndRole } = require("../common/crossDBInfoBuilder.js");

/**
 * getUserRoleList(userId)
 * Obtain a list of roles that the user has been assigned with
 */
const getUserRoleList = async userId => {
  const userRoles = await UserRole.findAll({
    where: { userId: userId },
    attr: ["roleId"],
  });

  if (!userRoles || userRoles.length === 0) {
    return null;
  }

  return userRoles;
};

/**
 * getMenus()
 * Function to get a list of menus that can be displayed in the sidemenu
 */
const getMenus = async query => {
  const dispMenusTypes = ["DIRECTORY", "MENU"];
  const menus = await Menu.findAll({
    where: { menuType: dispMenusTypes, status: "ACTIVE" },
    order: [
      // ["menuType", "ASC"],
      ["parentId", "ASC"],
      ["orderNum", "ASC"],
    ],
  });

  if (!menus || menus.length === 0) {
    throw new EntityNotFoundException("No menus found");
  }
  console.log(menus);
  return new SuccessResponse("Successfully retrieved menus.", menus);
};

/**
 * getMenuTree()
 * Function to get a list of all the menus that will be used for frontend tree-structure rendering
 */
const getMenuTree = async query => {
  const rp = await getPermissionAndRole();
  console.log(rp);
  const menus = await Menu.findAll({
    include: [
      {
        model: Permission,
        as: "permissionInfo",
        attributes: ["id", "permissionName"], // return id and permissionName for frontend readability
      },
    ],
  });
  if (!menus || menus.length === 0) {
    throw new EntityNotFoundException("No menus found");
  }
  const returnData = {
    items: menus,
  };
  return new SuccessResponse("Successfully retrieved menus.", returnData);
};

/**
 * getMenuById(id)
 * Retrieve full details of a menu item by id
 */
const getMenuById = async id => {
  console.log(id);
  const menu = await Menu.findByPk(id);
  if (!menu) {
    throw new EntityNotFoundException(`Menu with id ${id} not found`);
  }

  return new SuccessResponse(`Successfully retrieve menu ${id}`, menu);
};

/**
 * getMenuPermissionPrefixById(menuId)
 * Get permission prefix (e.g., "user" from "user:view") by menuId
 */
const getMenuPermissionPrefixById = async menuId => {
  const menu = await Menu.findByPk(menuId);
  if (!menu) {
    throw new EntityNotFoundException(`menu with id=${menuId} not found in the database`);
  }
  if (menu.permission) {
    const permission = await Permission.findByPk(menu.permission);
    if (!permission) {
      throw new EntityNotFoundException(
        `permission with id=${menu.permission} not found in the database`
      );
    }
    const prefix = permission.permissionName.split(":")[0];
    return new SuccessResponse(`Premission prefix obtained as ${prefix}`, prefix);
  } else {
    return new SuccessResponse("Premission prefix obtained as empty", "");
  }
};

/**
 * searchMenus(query)
 * Function to search for menus based on a query
 */
const searchMenus = async query => {
  const {
    search,
    page = 1,
    pageSize = 10,
    sortBy = "createdAt",
    sortOrder = "asc",
    ...rest
  } = query; // defaultly sort by
  const filterField = ["permission", "type", "parentId", "status"]; // only allow filtering the mentioned fields

  const where = {};
  // Search by menu title or comment
  if (search) {
    where[Op.or] = [
      {
        title: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        comment: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
  }
  // Construct filter conditions
  for (const field in rest) {
    if (rest[field] !== undefined && filterField.includes(field)) {
      where[field] = rest[field];
    }
  }

  console.log(where);
  const menus = await Menu.findAndCountAll({
    where,
    order: [[sortBy, sortOrder]],
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });

  if (!menus || menus.rows.length === 0) {
    throw new EntityNotFoundException("No menu matching the search conditions");
  }
  return new SuccessResponse("Successfully retrieved menus.", menus.rows);
};

/**
 * updateMenuById(id, menuData, userId)
 * Function to update existing menu item
 * @param {number} id - The ID of the menu to update
 * @param {*} menuData - The fields to update
 * @param {number} userId - ID of the user performing the update
 */
const updateMenuById = async (id, menuData, userId) => {
  // TODO: fix the logic of checking whether the user has access
  // const menuAccessList = await getMenusByUser(userId);
  // if (!menuAccessList || menuAccessList.length === 0 || !menuAccessList.includes(id)) {
  //     throw new UnauthoriseException(`User is not authorised to update menu with id ${id}`);
  // }

  // check if menu exists
  const menu = await Menu.findByPk(id);
  if (!menu) {
    throw new EntityNotFoundException(`Menu with id ${id} not found`);
  }

  // check if menu with given title exists
  const duplicateMenu = await Menu.findOne({
    where: { title: menuData.title },
  });
  if (duplicateMenu) {
    throw new EntityConflictException(
      `The menu with title ${menuData.title} already exists. Please change the title and retry.`
    );
  }

  // update menu details
  await menu.update({
    ...menuData,
    updatedBy: userId ? userId : null,
  });
  return new SuccessResponse(`Successfully updated menu with id ${id}`, menu);
};

/**
 * deleteMenuById(id, permanent)
 * Function to remove menu item
 * @param {number} id - The ID of the menu to delete
 * @param {boolean} [permanent=false] - Whether to perform hard delete (true) or soft delete (false), defaultly perform soft delete
 * @param {number} userId - ID of the user performing the deletion (only required for soft delete)
 */
const deleteMenuById = async (id, permanent = false, userId) => {
  // TODO: fix the logic of checking whether the user has access
  // const menuAccessList = await getMenusByUser(userId);
  // if (!menuAccessList || menuAccessList.length === 0 || !menuAccessList.includes(id)) {
  //     throw new UnauthoriseException(`User is not authorised to delete menu with id ${id}`);
  // }

  // check if menu exists
  const menu = await Menu.findByPk(id);
  if (!menu) {
    throw new EntityNotFoundException(`Menu with id ${id} not found`);
  }

  // case 1: soft delete -- set status to "deleted"
  if (!permanent) {
    await menu.update({
      status: "DELETED",
      updatedBy: userId ? userId : null,
    });
    return new SuccessResponse(`Menu with id ${id} successfully deleted`, menu);
  }

  // case 2: hard delete -- delete record from DB
  await menu.destroy();
  return new SuccessResponse(`Menu with id ${id} permanently deleted`);
};

const createMenu = async (menuData, userId) => {
  // check whether the user is a super admin (ONLY super admin is allowed to create menu)
  const userRoles = await getUserRoleList(userId);
  if (userRoles === null) {
    throw new UnauthoriseException("User is not authorised to create new menu");
  }

  // check if menu exists
  const menu = await Menu.findOne({
    where: { title: menuData.title },
  });
  if (menu) {
    throw new EntityConflictException(
      `The menu with title ${menuData.title} already exists. Please change the title and retry.`
    );
  }

  // create menu
  const newMenu = await Menu.create({
    ...menuData,
    createdBy: userId ? userId : null,
    updatedBy: userId ? userId : null,
  });

  return new SuccessResponse(`Successfully created menu ${menuData.title}`, newMenu);
};

module.exports = {
  getMenus,
  getMenuById,
  updateMenuById,
  deleteMenuById,
  createMenu,
  searchMenus,
  getMenuTree,
  getMenuPermissionPrefixById,
};
