const {Menu, RoleMenu, UserRole, RolePermission} = require('../models');
const {EntityNotFoundException,EntityAlreadyExistsException,ValidationException} = require('../common/commonError.js');

const getMenuByIdAsync = async ({menuId, userId}) => {
    // Check whether the menu item exists
    const menuItem = await Menu.findByPk(menuId);
    
    console.log(`Menu item with id ${menuId} found:`, menuItem);
    if (menuItem === null) {
        throw new EntityNotFoundException(`Menu item with id ${menuId} not found`);
    }

    // Check user's roles and corresponding permissions
    const userRoles = await UserRole.findAll({ 
        where: { userId },
        attributes: ['roleId']}
    );
    if (!userRoles || userRoles.length === 0) {
        throw new EntityNotFoundException(`User with id ${userId} not found`);
    }
    const userPermissions = await RolePermission.findAll({
        where: { roleId: userRoles.map(role => role.roleId) },
        attributes: ['permissionId']
    });
    if (!userPermissions || userPermissions.length === 0) {
        throw new EntityNotFoundException(`User's permission not found`);
    }

    // Retrieve accepted role(s) and required permission(s)
    const acceptedRoles = await RoleMenu.findAll({
        where: { menuId },
        attributes: ['roleId']
    });
    const acceptedRolesIds = acceptedRoles.map(role => role.roleId);
    const requiredPermissions = menuItem.permission
        ? menuItem.split(',').map(p => p.trim())
        : [];

    console.log(`Accepted roles for menu item ${menuId}:`, acceptedRolesIds);
    console.log(`Required permissions for menu item ${menuId}:`, requiredPermissions);

    // Check whether the user has the access to menu item
    const userRolesIds = userRoles.map(role => role.roleId);
    const userPermissionsIds = userPermissions.map(permission => permission.permissionId);
    const roleAccess = acceptedRolesIds.some(roleId => userRolesIds.includes(roleId));
    const permissionAccess = requiredPermissions.every(permissionId => userPermissionsIds.includes(permissionId));
    if (!roleAccess) {
        throw new ValidationException(`User with id ${userId} does not have access to menu item with id ${menuId} -- role access denied`);
    }
    if (!permissionAccess) {
        throw new ValidationException(`User with id ${userId} does not have access to menu item with id ${menuId} -- permission access denied`);
    }
    return menuItem.toJSON();
}

const getAllMenusAsync = async ({userId}) => {
    // Get user's roles
    const userRoles = await UserRole.findAll({ 
        where: { userId },
        attributes: ['roleId']}
    );
    if (!userRoles || userRoles.length === 0) {
        throw new EntityNotFoundException(`User with id ${userId} not found`);
    }
    const userRoleIds = userRoles.map(r => r.roleId);

    // Get all the menus accessible by those roles
    const roleMenus = await RoleMenu.findAll({
        where: { roleId: userRoleIds },
        attributes: ['menuId']
    });
    if (!roleMenus || roleMenus.length === 0) {
        throw new EntityNotFoundException(`User's roles do not have access to any menus`);
    }
    const menuIds = roleMenus.map(r => r.menuId);

    // Retrieve an abstract of all the accessible menu items --> to build up the tree structure
    const accessibleMenus = await Menu.findAll({
        where: { 
            id: menuIds,
            type: ['DIRECTORY', 'MENU'] // Only directories and menus, not buttons
         },
        attributes: ['id', 'title', 'parentId', 'orderNum', 'path', 'component'],  // Only retrieve essential data to build up the sidebar
        order: [['orderNum', 'ASC'], ['parentId', 'ASC']],
    });
    return accessibleMenus;
}

const updateMenuByIdAsync = async({menuId, userId, menuData}) => {
    // Check whether the menu item exists
    const menuItem = await Menu.findByPk(menuId);
    if (menuItem === null) {
        throw new EntityNotFoundException(`Menu item with id ${menuId} not found`);
    }

    // Check whether user's allowed to update the menu item
    const userRoles = await UserRole.findAll({ 
        where: { userId },
        attributes: ['roleId']}
    );
    if (!userRoles || userRoles.length === 0) {
        throw new EntityNotFoundException(`User with id ${userId} not found`);
    }
    const userRoleIds = userRoles.map(role => role.roleId);
    const acceptedRoles = await RoleMenu.findAll({
        where: { menuId },
        attributes: ['roleId']
    });
    const acceptedRolesIds = acceptedRoles.map(role => role.roleId);
    const roleAccess = acceptedRolesIds.some(roleId => userRoleIds.includes(roleId));
    if (!roleAccess) {
        throw new ValidationException(`User with id ${userId} does not have access to update menu item with id ${menuId}`);
    }

    // Update the menu item
    const updatedMenuItem = await menuItem.update(menuData, {
        where: { id: menuId },    
    });

}

const deleteMenuByIdAsync = async({menuId, userId}) => {
}

const createMenuAsync = async({userId, menuData}) => {}

module.exports = {
    getMenuByIdAsync,
    getAllMenusAsync,
    updateMenuByIdAsync,
    deleteMenuByIdAsync,
    createMenuAsync
};