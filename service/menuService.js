const db = require("../models");
const {
    SuccessResponse,
    EntityNotFoundException,
    EntityConflictException,
} = require("../common/response.js");
const { Op } = require("sequelize");
const Menu = db.Menu;

/**
 * getMenus()
 * Function to get a full list of menus
 */
const getMenus = async query => {
    console.log(query);
    const page = Number(query.page) ? Number(query.page) : 1;
    const pageSize = Number(query.pageSize) ? Number(query.pageSize) : 10;
    // const { page = 1, pageSize = 10 } = query;
    const menus = await Menu.findAndCountAll({ offset: (page - 1) * pageSize, limit: pageSize });
    if (!menus || menus.rows.length === 0) {
        throw new EntityNotFoundException("No menus found");
    }
    return new SuccessResponse("Successfully retrieved menus.", menus.rows);
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
        where[Op.or] = [{
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
        order: [
            [sortBy, sortOrder]
        ],
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
const updateMenuById = async(id, menuData, userId) => {
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
const deleteMenuById = async(id, permanent = false, userId) => {
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

const createMenu = async(menuData, userId) => {
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
};