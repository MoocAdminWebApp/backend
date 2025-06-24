const menuService = require('../service/menuService');
const {
    ValidationException,
    EntityNotFoundException,
  } = require('../common/commonError');

const getMenuById = async (req, res, next) => {
    const menuId = req.params.id;
    // const userId = req.user.id; // TODO: change to req.user.id when authentication is implemented
    const userId = 1; // TODO: remove this line when authentication is implemented

    try {
        const menuItem = await menuService.getMenuByIdAsync({ menuId, userId });
        return res.status(200).json(menuItem);
    } catch(error) {
        if (error instanceof EntityNotFoundException) {
            return res.status(error.statusCode).json({ message: error.message });
        } 
        if (error instanceof ValidationException) {
            return res.status(error.statusCode).json({ message: error.message });
        }   
        return next(error);
    }

}

const getAllMenus = async (req, res, next) => {
    // const userId = req.user.id; // TODO: change to req.user.id when authentication is implemented
    const userId = 1; // TODO: remove this line when authentication is implemented

    try {
        const menus = await menuService.getAllMenusAsync({ userId });
        return res.status(200).json(menus);
    } catch(error) {
        if (error instanceof EntityNotFoundException) {
            return res.status(error.statusCode).json({ message: error.message });
        } 
        return next(error);
    }
}

module.exports = {
    getMenuById,
    getAllMenus
};