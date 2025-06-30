const { Menu, RoleMenu, UserRole, RolePermission } = require("../models");
const {
  EntityNotFoundException,
  EntityAlreadyExistsException,
  ValidationException,
} = require("../common/commonError.js");

const { MenuValidator } = require("../common/inputValidator.js");
const {
  UserAuthenticatorSingleMenu,
  UserAuthenticatorAllMenu,
  MenuHandler,
} = require("../common/commonHelper.js");

const errorMessages = {
  role: "Role Denied: User must be assigned with at least one of the following roles to",
  permission: "Permission Denied: User must have the following permission to",
};

/**
 * Function to retreive a specific menu
 */
const getMenuByIdAsync = async ({ menuId, userId }) => {
  // Check whether the menu item exists
  const menuItem = await Menu.findByPk(menuId);
  if (menuItem === null) {
    throw new EntityNotFoundException(`Menu item with id ${menuId} not found`);
  }

  // Check whether the user has sufficient access
  const userAuthResult = await UserAuthenticatorSingleMenu(menuId, userId);
  if (!userAuthResult.isAuthenticated) {
    if (!userAuthResult.role)
      throw new ValidationException(
        `${errorMessages.role} view this menu: ${userAuthResult.roleNames.join(", ")}`
      );
    if (!userAuthResult.permission)
      throw new ValidationException(
        `${errorMessages.permission} view this menu: ${userAuthResult.permissionName}`
      );
  }

  return menuItem.toJSON();
};

/**
 * Function to retrieve a list of menus that accessible by the user
 */
const getAllMenusAsync = async ({ userId }) => {
  // Get all the menus accessible by user
  const menuIds = await UserAuthenticatorAllMenu(userId);

  // Retrieve an abstract of all the accessible menu items --> to build up the tree structure
  const accessibleMenus = await Menu.findAll({
    where: {
      id: menuIds,
      type: ["DIRECTORY", "MENU"], // Only directories and menus, not buttons
    },
    attributes: ["id", "title", "parentId", "orderNum", "path", "component"], // Only retrieve essential data to build up the sidebar
    order: [
      ["orderNum", "ASC"],
      ["parentId", "ASC"],
    ],
  });
  return accessibleMenus.map(m => m.toJSON());
};

/**
 * Function to update an existing menu record
 */
const updateMenuByIdAsync = async ({ menuId, userId, menuData }) => {
  // Check whether the menu item exists
  const menuItem = await Menu.findByPk(menuId);
  if (menuItem === null) {
    throw new EntityNotFoundException(`Menu item with id ${menuId} not found`);
  }

  // Check whether user's allowed to update the menu item
  const userRoles = await UserRole.findAll({
    where: { userId },
    attributes: ["roleId"],
  });
  if (!userRoles || userRoles.length === 0) {
    throw new EntityNotFoundException(`User with id ${userId} not found`);
  }
  const userRoleIds = userRoles.map(role => role.roleId);
  const acceptedRoles = await RoleMenu.findAll({
    where: { menuId },
    attributes: ["roleId"],
  });
  const acceptedRolesIds = acceptedRoles.map(role => role.roleId);
  const roleAccess = acceptedRolesIds.some(roleId => userRoleIds.includes(roleId));
  if (!roleAccess) {
    throw new ValidationException(
      `User with id ${userId} does not have access to update menu item with id ${menuId}`
    );
  }

  // Update the menu item
  const updatedMenuItem = await menuItem.update(menuData, {
    where: { id: menuId },
  });
};

const deleteMenuByIdAsync = async ({ menuId, userId }) => {};

const createMenuAsync = async ({ userId, menuData }) => {};

module.exports = {
  getMenuByIdAsync,
  getAllMenusAsync,
  updateMenuByIdAsync,
  deleteMenuByIdAsync,
  createMenuAsync,
};
