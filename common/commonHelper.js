const { EntityNotFoundException, EntityAlreadyExistsException } = require("./commonError");
const { Menu, RoleMenu, UserRole, RolePermission, Role, Permission } = require("../models");
const { Op } = require("sequelize");

const statusCodes = {
  success: 200,
  badRequest: 400,
  authenticationError: 403,
  notFound: 404,
  internalError: 500,
};

const menuOperation = {
  insert: 0,
  update: 1,
  delete: 2,
  updateOrderNum: -1,
};

/**
 * ACCESS CHECKING FUNCTIONS
 * The functions listed below are used to check whether user has sufficient access (role + permission)
 * to perform the requested action
 */

const getAcceptedRoles = async menuId => {
  const acceptedRoles = await RoleMenu.findAll({
    where: { menuId },
    attributes: ["roleId"],
  });
  return acceptedRoles.map(r => r.roleId);
};
const getRoleNames = async roleIdList => {
  if (roleIdList.length < 1) return [];
  const roleNames = await Role.findAll({
    where: { id: roleIdList },
    attributes: ["roleName"],
  });
  return roleNames.map(t => t.roleName);
};

const getRequiredPermission = async menuId => {
  const menu = await Menu.findByPk(menuId);
  if (!menu) throw new EntityNotFoundException(`Menu ${menuId} not found`);
  return menu.permission;
};
const getRequiredPermissionName = async permissionId => {
  if (!permissionId) return "";
  const permission = await Permission.findByPk(permissionId);
  return permission.permissionName;
};

/**
 * TODO: remove this function before production if not used
 * Helper function to retrieve a list of menus that accessible by certain roles
 */
const getAllMenusByRoles = async roleIdList => {
  const menus = await RoleMenu.findAll({
    where: { roleId: roleIdList },
    attributes: ["menuId"],
    order: ["menuId", "ASC"],
  });
  if (menus.length < 1) return [];
  return menus.map(m => m.menuId);
};

/**
 * TODO: remove this function before production if not used
 * Helper function to retrieve a list of roles that required to access the corresponding menu
 */
const getAllRolesByMenu = async menuIdList => {
  if (!menuIdList || menuIdList.length === 0) return [];

  // Obtain all the records in RoleMenu table
  const allRoleMenus = await RoleMenu.findAll({
    where: { menuId: menuIdList },
    attributes: ["menuId", "roleId"],
  });

  // Create a map of roles accepted by each menu
  const menuIdToRoles = new Map();
  for (const { menuId, roleId } of allRoleMenus) {
    if (!menuIdToRoles.has(menuId)) {
      menuIdToRoles.set(menuId, []);
    }
    menuIdToRoles.get(menuId).push(roleId);
  }

  const menuRoleReqMap = menuIdList.map(menuId => ({
    menuId,
    roleIds: menuIdToRoles.get(menuId) || [],
  }));
  return menuRoleReqMap;
};

/**
 * Helper function to construct a requirement dict for all the existing menus
 */
const getMenuAccessDict = async () => {
  const menus = await Menu.findAll({
    attributes: ["id", "permission"],
    order: ["id", "ASC"],
  });
  if (!menus) return null;
  if (menus.length === 0) return [];

  const menuIds = menus.map(m => m.id);
  const allRolesByMenu = await RoleMenu.findAll({
    where: { menuId: menuIds },
    attributes: ["menuId", "roleId"],
  });

  const menuIdToRoles = new Map();
  for (const { menuId, roleId } of allRolesByMenu) {
    if (!menuIdToRoles.has(menuId)) menuIdToRoles.set(menuId, []);
    menuIdToRoles.get(menuId).push(roleId);
  }

  const menuAccessDict = menus.map(menu => ({
    menuId: menu.id,
    permissionId: menu.permission,
    roleIds: menuIdToRoles.get(menu.id) || [],
  }));

  return menuAccessDict;
};

/**
 * Verify user's access to a specific menu
 */
const UserAuthenticatorSingleMenu = async (menuId, userId) => {
  // Retrieve the roles and permissions required to access the target menu item
  const [acceptedRoles, requiredPermission] = await Promise.all([
    getAcceptedRoles(menuId),
    getRequiredPermission(menuId),
  ]);
  const acceptedRoleNames = await getRoleNames(acceptedRoles);
  const requiredPermissionName = await getRequiredPermissionName(requiredPermission);

  // Retrieve user's roles and permissions
  const userRole = await UserRole.findAll({
    where: { userId },
    attributes: ["roleId"],
  });
  if (!userRole || userRole.length === 0) {
    return {
      role: false,
      roleNames: acceptedRoleNames,
      permission: false,
      permissionName: "",
      isAuthenticated: false,
    };
  }

  const userRoleList = userRole.map(r => r.roleId);
  const userPermission = await RolePermission.findAll({
    where: { roleId: userRoleList },
    attributes: ["permissionId"],
  });
  const userPermissionList = userPermission.map(p => p.permissionId);

  // Verify user's access
  const hasRole = userRoleList.some(role => acceptedRoles.includes(role));
  const hasPermission =
    requiredPermission === null || userPermissionList.includes(requiredPermission);
  const result = {
    role: hasRole,
    roleNames: hasRole ? [] : acceptedRoleNames,
    permission: hasPermission,
    permissionName: hasPermission ? "" : requiredPermissionName,
    isAuthenticated: hasRole && hasPermission,
  };
  return result;
};

/**
 * Authenticate user and return a list of menus that accessible by the user
 */
const UserAuthenticatorAllMenu = async userId => {
  // Retrieve user's roles and permissions
  const userRole = await UserRole.findAll({
    where: { userId },
    attributes: ["roleId"],
  });
  if (!userRole || userRole.length < 1) {
    return [];
  }
  const userRoleList = userRole.map(r => r.roleId);
  const userPermission = await RolePermission.findAll({
    where: { roleId: userRoleList },
    attributes: ["permissionId"],
  });
  const userPermissionList = userPermission.map(p => p.permissionId);

  // Get the menu access dict for all the menus exist in database
  const menuAccessDict = await getMenuAccessDict();

  // Filter the access dict with user's roles and permission
  const menuAccessFilteredByRole = menuAccessDict.filter(menu =>
    menu.roleIds.some(roleId => userRoleList.includes(roleId))
  );
  const menuAccessFilteredByPermission = menuAccessFilteredByRole.filter(
    menu => menu.permissionId == null || userPermissionList.includes(menu.permissionId)
  );

  // return a list of user's accessible menus
  const filteredMenuList = menuAccessFilteredByPermission.map(m => m.menuId);
  return filteredMenuList;
};

/**
 * MENU HANDLING FUCTIONS
 * The functions lists below are used to edit the menu tree stucture when the user requests to:
 * Update, Insert, or Delete a menu record。
 * It assumes that the user is authenticated to perform the action, and the inputs are validated.
 * The user authenticated and input validation are processed in ../service/menuService
 */

/* Helper function to decide whether there's need to update tree structure */
const needToUpdateMenuTree = async (oldParentId, newParentId) => {
  if (newParentId === menuOperation.updateOrderNum) {
    return false;
  }
  const oldParentMenuItem = await Menu.findByPk(oldParentId);
  const newParentMenuItem = await Menu.findByPk(newParentId);
  const needChange =
    (oldParentMenuItem ? oldParentMenuItem.orderNum : 0) !=
    (newParentMenuItem ? newParentMenuItem.orderNum : 0);
  return {
    needUpdate: needChange,
    newParentOrderNum: newParentMenuItem ? newParentMenuItem.orderNum : 0,
  };
};

/* Helper function to bulk update orderNum and parentId (if necessary) */
const bulkUpdateMenuRecords = async updateMenuList => {
  let updateMenuResult = [];

  // Sequencially update the orderNum for all the descendant menus
  for (const menuData of updateMenuList) {
    const menuItem = await Menu.findByPk(menuData.id);
    if (!menuItem) {
      return {
        statusCode: statusCodes.notFound,
        data: null,
        message: `Error: Failed to find menu item - menu ${menuData.id}`,
      };
    }

    const updateFields =
      menuData.parentId === menuOperation.updateOrderNum
        ? {
            orderNum: menuData.orderNum,
          }
        : {
            orderNum: menuData.orderNum,
            parentId: menuData.parentId,
          };
    try {
      const updateMenuItem = await menuItem.update({
        ...updateFields,
        updatedAt: new Date(),
      });
      updateMenuResult.push(updateMenuItem.toJSON());
    } catch (err) {
      return {
        statusCode: statusCodes.internalError,
        data: null,
        message: `Update menu ${menuData.id} failed: ${err.message}`,
      };
    }
  }
  return {
    statusCode: statusCodes.success,
    data: updateMenuResult,
    message: "Successfully updated all the relevant menu records",
  };
};

/* Helper function to create a map of child rooted at each menu */
const getDescendantMenuMap = async () => {
  const allMenus = await Menu.findAll({
    attributes: ["id", "parentId"],
  });
  const descendantMenuMap = new Map();
  for (const menu of allMenus) {
    const parentId = menu.parentId || 0;
    if (!descendantMenuMap.has(parentId)) {
      descendantMenuMap.set(parentId, []);
    }
    descendantMenuMap.get(parentId).push(menu);
  }
  return descendantMenuMap;
};

const traverseMenuTree = async (rootMenuId, rootMenuOrderNum, newParentId) => {
  // Check whether the target menu item exists
  const rootMenuItem = await Menu.findByPk(rootMenuId);
  if (rootMenuItem === null) {
    return {
      statusCode: statusCodes.notFound,
      data: null,
      message: `Error: Failed to find child menu item - menu ${rootMenuId}`,
    };
  }

  // Get child menu map
  const childMenuMap = await getDescendantMenuMap();

  // Traverse the menu items and record the change
  const menusToUpdate = [];
  const preorderTraverseUpdate = async (currentMenuId, currentOrderNum) => {
    // Get the list of child menus rooted at current menu (if any)
    const childMenuList = childMenuMap.get(currentMenuId) || [];
    for (const childMenu of childMenuList) {
      const nextOrderNum = currentOrderNum + 1;
      menusToUpdate.push({
        id: childMenu.id,
        orderNum: nextOrderNum,
        parentId: menuOperation.updateOrderNum, // will not update parentId when parentId is menuOperation.updateOrderNum(-1)
      });
      console.log(`Menu ${childMenu.id} has a new orderNum: ${nextOrderNum}`);
      await preorderTraverseUpdate(childMenu.id, nextOrderNum);
    }
  };
  menusToUpdate.push({ id: rootMenuId, orderNum: rootMenuOrderNum, parentId: newParentId });
  await preorderTraverseUpdate(rootMenuId, rootMenuOrderNum);

  // Update the record in the database and return result
  const updatedMenuResult = await bulkUpdateMenuRecords(menusToUpdate);
  return updatedMenuResult;
};

/* Helper function to handle the case where the user requests to change parentId of a menu item */
const updateMenuInTree = async (menuId, menuData) => {
  // Check whether the menu item exits
  const menu = await Menu.findByPk(menuId);
  if (!menu) {
    return {
      statusCode: statusCodes.notFound,
      data: null,
      message: `Error: Failed to find menu item - menu "${menu.title}"`,
    };
  }

  const oldParentId = menu.parentId;
  const newParentId = menuData.parentId;

  // Check whether the old and new parent menus have the same orderNum
  //   If yes, then don't need to bulk update the orderNum for descendant menus
  //   If no, then traverse all the descendant menus and update the orderNum respectively
  const shouldUpdateTree = await needToUpdateMenuTree(oldParentId, newParentId);
  try {
    const menuUpdateResult = await menu.update({
      ...menuData,
      updatedAt: new Date(),
    });
    if (!shouldUpdateTree.needUpdate) {
      return {
        statusCode: statusCodes.success,
        data: menuUpdateResult.toJSON(),
        message: `Successfullt updated the menu ${menu.title} without modifying menu tree structure`,
      };
    }

    // Update orderNum for descendant menus
    const newMenuOrderNum = shouldUpdateTree.newParentOrderNum + 1; // +1 for child level
    const updatedResult = await traverseMenuTree(menuId, newMenuOrderNum);
    return updatedResult;
  } catch (err) {
    return {
      statusCode: statusCodes.internalError,
      data: null,
      message: `Update menu "${menu.title}" failed: ${err.message}`,
    };
  }
};

/* Helper function to create a new menu record */
const insertMenuIntoTree = async menuItem => {
  // Check whether the menu item already exits in the system
  const fieldsToCheck = [{ title: menuItem.title }];
  if (menuItem.path != null && menuItem.path.length > 0) {
    fieldsToCheck.push({ path: menuItem.path });
  }
  if (menuItem.component != null && menuItem.component.length > 0) {
    fieldsToCheck.push({ component: menuItem.component });
  }

  // TODO: change the method from findOne to findAll and update conflict fields checking criteria
  const menu = await Menu.findOne({
    where: {
      [Op.or]: fieldsToCheck,
    },
    attributes: ["id", "title", "path", "component"],
  });

  if (menu) {
    // Further check the conflict field for frontend to display precise error message
    const conflictFields = [];
    if (menu.title === menuItem.title) conflictFields.push("Title");
    if (menu.path === menuItem.path) conflictFields.push("Path");
    if (menu.component === menuItem.component) conflictFields.push("Component");

    return {
      statusCode: statusCodes.badRequest,
      data: null,
      message: `Error: menu with given ${conflictFields.join(", ")} already exists`,
    };
  }

  try {
    const result = await Menu.create({
      ...menuItem,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    return {
      statusCode: statusCodes.success,
      data: result.toJSON(),
    };
  } catch (err) {
    return {
      statusCode: statusCodes.internalError,
      data: null,
      message: `Failed to create new menu item: ${err.message}`,
    };
  }
};

/* Helper function to delete existing menu record from the database and handle possible tree structure update */
const deleteMenuFromTree = async menuId => {
  // Check whether the menu item exits
  const menu = await Menu.findByPk(menuId);
  if (!menu) {
    return {
      statusCode: statusCodes.notFound,
      data: null,
      message: `Error: Failed to find menu item - menu "${menu.title}"`,
    };
  }
  const menuTitle = menu.title;

  // Check whether the menu item has child menus
  const childMenuMap = await getDescendantMenuMap();
  const childMenuList = childMenuMap.get(menuId) || [];
  if (childMenuList.length < 1) {
    // There's no need to update the tree structure
    try {
      await menu.destroy();
      return {
        statusCode: statusCodes.success,
        message: `Successfully delete menu item - "${menuTitle}"`,
      };
    } catch (err) {
      return {
        statusCode: statusCodes.internalError,
        message: `Failed to delete menu item - "${menuTitle}"`,
      };
    }
  }

  // Handle the case where need to update the child menus' parentId and orderNum
  const newParentId = menu.parentId ? menu.parentId : 0;
  const newOrderNum = menu.orderNum ? menu.orderNum : 1;
  const resultList = [];
  // Update rules:
  // 1) the child menus of the deleting menu inheret the parentId and orderNum of the deleting menu
  // 2) update the orderNum for all the descendant menus
  for (const childMenu of childMenuList) {
    const result = await traverseMenuTree(childMenu.id, newOrderNum, newParentId);
    if (!result || result.statusCode === statusCodes.badRequest) {
      return {
        statusCode: statusCodes.badRequest,
      };
    }
    resultList.push(result);
  }
  return {
    statusCode: statusCodes.success,
    data: resultList,
  };
};

/* Main function to edit the menu tree */
const MenuHandler = async (method, menuId, data) => {
  let result = new Map();
  switch (method) {
    case menuOperation.insert:
      result = await insertMenuIntoTree(data);
      break;
    case menuOperation.update:
      result = await updateMenuInTree(menuId, data);
      break;
    case menuOperation.delete:
      result = await deleteMenuFromTree(menuId);
      break;
  }

  // all the possible results are in the same format for menuService to use
  return result;
};

module.exports = {
  MenuHandler,
  UserAuthenticatorSingleMenu,
  UserAuthenticatorAllMenu,
};
