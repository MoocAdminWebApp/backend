const menuService = require("../service/menuService");
const { getCurrentUser } = require("../common/getCurrentUser");

const getMenus = async(req, res) => {
    try {
        const result = await menuService.getMenus(req.query);
        res.sendCommonValue(result.statusCode, result.message, result.data);
    } catch (err) {
        res.sendCommonValue(err.statusCode ? err.statusCode : 500, err.message);
    }
};

const getMenuById = async(req, res) => {
    console.log(req);
    try {
        const result = await menuService.getMenuById(req.params.id);
        res.sendCommonValue(result.statusCode, result.message, result.data);
    } catch (err) {
        res.sendCommonValue(err.statusCode ? err.statusCode : 500, err.message);
    }
};

const searchMenus = async(req, res) => {
    try {
        const result = await menuService.searchMenus(req.query);
        res.sendCommonValue(result.statusCode, result.message, result.data);
    } catch (err) {
        res.sendCommonValue(err.statusCode ? err.statusCode : 500, err.message);
    }
};

const updateMenuById = async(req, res) => {
    const userId = getCurrentUser(req).userId ? getCurrentUser(req).userId : null;
    try {
        const result = await menuService.updateMenuById(req.params.id, req.body, userId);
        res.sendCommonValue(result.statusCode, result.message, result.data);
    } catch (err) {
        res.sendCommonValue(err.statusCode ? err.statusCode : 500, err.message);
    }
};

const deleteMenuById = async(req, res) => {
    const userId = getCurrentUser(req).userId ? getCurrentUser(req).userId : null;
    const isPermanent = req.body.permanent === true;
    try {
        const result = await menuService.deleteMenuById(req.params.id, isPermanent, userId);
        res.sendCommonValue(result.statusCode, result.message, result.data);
    } catch (err) {
        res.sendCommonValue(err.statusCode ? err.statusCode : 500, err.message);
    }
};

const createMenu = async(req, res) => {
    const userId = getCurrentUser(req).userId ? getCurrentUser(req).userId : null;
    try {
        const result = await menuService.createMenu(req.body, userId);
        res.sendCommonValue(result.statusCode, result.message, result.data);
    } catch (err) {
        res.sendCommonValue(err.statusCode ? err.statusCode : 500, err.message);
    }
};

module.exports = {
    getMenus,
    getMenuById,
    searchMenus,
    updateMenuById,
    deleteMenuById,
    createMenu,
};