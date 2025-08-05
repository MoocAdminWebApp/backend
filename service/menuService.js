const db = require("../models");
const {
  SuccessResponse,
  UnauthoriseException,
  EntityNotFoundException,
  EntityConflictException,
  InternalServerErrorException,
  BadRequestException,
} = require("../common/response.js");
const { Op } = require("sequelize");
const { permission } = require("process");
const Menu = db.Menu;
const RolePermission = db.RolePermission;
const UserRole = db.UserRole;
const Permission = db.Permission;
const Role = db.Role;

const uniquenessCheckEnum = {
  success: 1,
  titleFails: 2,
  routeFails: 3,
  bothFail: 4,
};
const succssStatusCode = 200;
const neverExistRoute = "NeverExistRoute";
const isTitleAndRouteUniqueReturnBuilder = resultCase => {
  let passCheck = false;
  let msg = "";
  switch (resultCase) {
    case uniquenessCheckEnum.success:
      passCheck = true;
      msg = "The given title and route are valid";
      break;
    case uniquenessCheckEnum.titleFails:
      msg = "The given title already exists";
      break;
    case uniquenessCheckEnum.routeFails:
      msg = "The given route already exists";
      break;
    case uniquenessCheckEnum.bothFail:
      msg = "The given title and route both already exist";
      break;
  }
  return {
    passCheck: passCheck,
    resultCase: resultCase,
    msg: msg,
  };
};

/**
 * isTitleAndRouteUnique(title, route)
 * Function to check whether the given title and route already exist in the database
 * If the either of those two fields is invalid (already exists), the frontend will prevent the the form from actually submitting
 */
const isTitleAndRouteUnique = async inputs => {
  const { title, route, selfId } = inputs;
  if (!title) {
    throw new BadRequestException("Title cannot be empty");
  }
  const sameTitleMenu = await Menu.findOne({
    where: { title: title },
  });
  const targetRoute = route ? route : neverExistRoute;
  const sameRouteMenu = await Menu.findOne({ where: { route: targetRoute } });

  // if selfId is provided, check whether it's case where user requested to update the menu without updating the title and route
  if (selfId) {
    const isSelfTitle = sameTitleMenu ? sameTitleMenu.id === selfId : false;
    const isSelfRoute = sameRouteMenu ? sameRouteMenu.id === selfId : false;
    const isSelfMenu = isSelfTitle && isSelfRoute;
    const resultCase = isSelfMenu
      ? uniquenessCheckEnum.success
      : !isSelfRoute && !isSelfTitle
        ? uniquenessCheckEnum.bothFail
        : !isSelfTitle
          ? uniquenessCheckEnum.titleFails
          : uniquenessCheckEnum.routeFails;
    const returnContent = isTitleAndRouteUniqueReturnBuilder(resultCase);
    if (returnContent.passCheck) {
      return new SuccessResponse(returnContent.msg);
    }
    throw new EntityConflictException(returnContent.msg, returnContent.resultCase);
  } else {
    const isTitleUnique = !sameTitleMenu;
    const isRouteUnique = !sameRouteMenu;
    const isValidInput = isTitleUnique && isRouteUnique;
    const resultCase = isValidInput
      ? uniquenessCheckEnum.success
      : !isTitleUnique && !isRouteUnique
        ? uniquenessCheckEnum.bothFail
        : !isTitleUnique
          ? uniquenessCheckEnum.titleFails
          : uniquenessCheckEnum.routeFails;
    const returnContent = isTitleAndRouteUniqueReturnBuilder(resultCase);
    if (returnContent.passCheck) {
      return new SuccessResponse(returnContent.msg);
    }
    throw new EntityConflictException(returnContent.msg, returnContent.resultCase);
  }
};

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
    return [];
  }
  const userRoleIds = userRoles.map(r => r.roleId);
  return userRoleIds;
};

/**
 * hasActionPermission(userId, action)
 * Helpfer function to check whether user is permitted to perform the requested action
 * @param {number} userId - the user that performing the action
 * @param {string} action - menu action, e.g. "view", "delete"
 *    - default is "prevent" (an invalid action to ensure false return)
 */
const hasActionPermission = async (userId, action = "prevent") => {
  const userRoleIds = await getUserRoleList(userId);
  if (userRoleIds.length < 1) {
    return false;
  }

  const permissionStr = `menu:${action}`;
  const permission = await Permission.findOne({
    where: { permissionName: permissionStr },
  });
  if (!permission) {
    return false;
  }
  const permissionId = permission.id;
  const isPermitted = await RolePermission.findOne({
    where: {
      roleId: {
        [Op.in]: userRoleIds,
      },
      permissionId: permissionId,
    },
  });
  return isPermitted ? true : false;
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
  const menus = await Menu.findAll({
    include: {
      model: Permission,
      as: "permissionInfo",
      attributes: ["permissionName"],
    },
  });
  const returnData = {
    items: menus,
  };
  return new SuccessResponse("Successfully retrieved menus.", returnData);
};

/**
 * getMenuById(id)
 * Retrieve full details of a menu item by id
 * @param {number} id - The ID of the menu to retrieve
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
 * Helper functions to handle changes in the menu tree structure
 * getChildMenuIdList(parentId): get a list of menus rooted at parent menu (parentId) that need to be re-sorted
 */
const getChildMenuIdList = async parentId => {
  const id = parentId ? parentId : null;
  const childMenus = await Menu.findAll({
    where: { parentId: id },
    attributes: ["id", "orderNum"],
    order: [["orderNum", "ASC"]],
  });
  const childMenuList = childMenus.map(child => child.id);
  return childMenuList;
};

const updateMenuOrderNum = async (menuId, orderNum) => {
  const menu = await Menu.findByPk(menuId);
  await menu.update({
    orderNum: orderNum,
  });
};

const updateChildMenus = async (childMenuList, menuId, targetOrderNum) => {
  if (childMenuList.length < 1) {
    return true;
  }
  const updateList = [...childMenuList.filter(id => id !== menuId)];

  if (menuId == null) {
    // Case 1: updating old parent menu's child menus, therefore don't need to insert menuId into the updateList
  } else {
    // Case 2: updating new parent menu's child menus (i.e. menuId provided and need to be inserted into the list)

    // Determine whether the targetOrderNum is valid
    if (targetOrderNum == null || targetOrderNum <= 0 || targetOrderNum > updateList.length) {
      // Insert to the last position
      updateList.push(menuId);
    } else {
      // Insert into corresponding position (targetOrderNum=n --> index=n-1)
      const targetIndex = targetOrderNum - 1;
      updateList.splice(targetIndex, 0, menuId);
    }
  }
  try {
    for (let i = 0; i < updateList.length; i++) {
      await updateMenuOrderNum(updateList[i], i + 1); //i-th index -->(i+1)th item --> orderNum=i+1
    }
    return true;
  } catch (err) {
    console.log(`Failed to update orderNum: ${err}`);
    return false;
  }
};

/**
 * updateMenuById(id, menuData, userId)
 * Function to update existing menu item
 * @param {number} id - The ID of the menu to update
 * @param {*} menuData - The fields to update
 * @param {number} userId - ID of the user performing the update
 */
const updateMenuById = async (id, menuData, userId) => {
  // check if menu exists
  const menu = await Menu.findByPk(id);
  if (!menu) {
    throw new EntityNotFoundException(`Menu with id ${id} not found`);
  }
  // if at least one inputs is invalid, throw err in isTitleAndRouteUnique()
  await isTitleAndRouteUnique({
    title: menuData.title,
    route: menuData.route,
    selfId: id,
  });

  const oldParentId = menu.parentId;
  const oldOrderNum = menu.orderNum;
  const newParentId = menuData.parentId;
  const newOrderNum = menuData.orderNum;

  // check whether there's need to update tree structure
  const isParentChanged = newParentId !== undefined && newParentId !== oldParentId;
  const isOrderChanged = newOrderNum !== undefined && newOrderNum !== oldOrderNum;

  if (isParentChanged || isOrderChanged) {
    if (!isParentChanged) {
      // only the orderNum changed, reorder the sibling menus
      const siblingsMenuIdList = await getChildMenuIdList(oldParentId);
      const updateResult = await updateChildMenus(siblingsMenuIdList, id, newOrderNum);
      if (!updateResult) {
        throw new InternalServerErrorException("Failed to sort sibling menus");
      }
      await menu.reload();
    } else {
      // need to update the child menus rooted at old and new parent menus
      const oldSiblingsMenuIdList = await getChildMenuIdList(oldParentId);
      const updateOldSiblingsResult = await updateChildMenus(
        oldSiblingsMenuIdList.filter(menuId => menuId !== id),
        null
      );

      const newSiblingsMenuIdList = await getChildMenuIdList(newParentId);
      const updateNewSiblingsResult = await updateChildMenus(
        newSiblingsMenuIdList,
        id,
        newOrderNum
      );
      const updateResult = updateOldSiblingsResult && updateNewSiblingsResult;

      if (!updateResult) {
        throw new InternalServerErrorException("Failed to sort sibling menus");
      }
      await menu.reload();
    }
  } else {
    // neither the parentId nor the orderNum changed, complete update
  }
  // update menu details
  const { orderNum, ...safeMenuData } = menuData;
  await menu.update({
    ...safeMenuData,
    updatedBy: userId ? userId : null,
  });
  await menu.reload();
  const allMenus = await getMenuTree();
  return new SuccessResponse(`Successfully updated menu with id ${id}`, menu);
};

/**
 * deleteMenuById(id, permanentDelete)
 * Function to remove menu item
 * @param {number} id - The ID of the menu to delete
 * @param {boolean} [permanentDelete=false] - Whether to perform hard delete (true) or soft delete (false), defaultly perform soft delete
 * @param {number} userId - ID of the user performing the deletion (only required for soft delete)
 */
const deleteMenuById = async (id, permanentDelete = false, userId) => {
  // check if menu exists
  const menu = await Menu.findByPk(id);
  if (!menu) {
    throw new EntityNotFoundException(`Menu with id ${id} not found`);
  }
  const childMenus = await getChildMenuIdList(id);
  if (childMenus.length > 0) {
    throw new BadRequestException("Cannot delete a menu that has child menus");
  }

  // case 1: soft delete -- set status to "deleted"
  if (!permanentDelete) {
    await menu.update({
      status: "DELETED",
      updatedBy: userId ? userId : null,
    });
    return new SuccessResponse(`Menu with id ${id} successfully deleted`, menu);
  }

  // case 2: hard delete -- delete record from DB
  const oldParentId = menu.parentId;
  await menu.destroy();
  if (oldParentId == null) {
    return new SuccessResponse(`Menu with id ${id} permanently deleted`);
  }
  // Update parent menu's child menus' orderNum
  const oldSiblingsMenuIdList = await getChildMenuIdList(oldParentId);
  const updateOldSiblingsResult = await updateChildMenus(
    oldSiblingsMenuIdList.filter(menuId => menuId !== id),
    null
  );
  if (updateOldSiblingsResult) return new SuccessResponse(`Menu with id ${id} permanently deleted`);
  throw new InternalServerErrorException("Failed to sort sibling menus");
};

/**
 * createMenu(menuData, userId)
 * Function to create a new menu item
 * @param {*} menuData - The initial menu data
 * @param {number} userId - ID of the user performing the creation
 */
const createMenu = async (menuData, userId) => {
  // check if menu exists
  // if at least one inputs is invalid, throw err in isTitleAndRouteUnique()
  await isTitleAndRouteUnique({
    title: menuData.title,
    route: menuData.route,
  });

  // create menu
  const { orderNum, ...safeMenuData } = menuData;
  const newMenu = await Menu.create({
    ...safeMenuData,
    createdBy: userId ? userId : null,
    updatedBy: userId ? userId : null,
  });

  // sort sibling menus
  const newParentId = menuData.parentId ? menuData.parentId : null;
  const newOrderNum = menuData.orderNum ? menuData.orderNum : null;
  const newSiblingsMenuIdList = await getChildMenuIdList(newParentId);
  const updateNewSiblingsResult = await updateChildMenus(
    newSiblingsMenuIdList,
    newMenu.id,
    newOrderNum
  );

  if (!updateNewSiblingsResult) {
    throw new InternalServerErrorException("Failed to sort sibling menus");
  }
  await newMenu.reload();
  return new SuccessResponse(`Successfully created menu ${menuData.title}`, newMenu);
};

/**
 * getMenuPermissionPrefixById(menuId)
 * Get permission prefix (e.g., "user" from "user:view") by menuId
 * Utilized to implement frontend button-level permission control
 * @param {number} menuId - The ID of the menu to retrieve
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
 * getMenuRoute()
 * Function to get a list of menus' corresponding route
 */
const getMenuRoute = async () => {
  const menus = await Menu.findAll({
    where: {
      route: {
        [Op.ne]: "", // Finds records where 'route' is not an empty string
      },
    },
    attributes: ["id", "route"],
  });

  if (!menus || menus.length === 0) {
    throw new EntityNotFoundException("No menus found");
  }
  console.log(menus);
  return new SuccessResponse("Successfully retrieved menus-route mapping.", menus);
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
  getMenuRoute,
  isTitleAndRouteUnique,
};
