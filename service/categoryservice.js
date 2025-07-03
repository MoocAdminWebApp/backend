const { Category } = require("../models");
const { EntityAlreadyExistsException } = require("../common/commonError");
const { Op } = require("sequelize");

/**
 * Check if a category with the same name already exists under the same parent.
 * Used for both creation and update operations.
 * @param {string} name - Category name to check.
 * @param {number|null} parentId - Parent category ID (null for top-level categories).
 * @param {number|null} id - Current record ID (used to exclude self when updating).
 */

const checkCategoryNameExists = async (name, parentId, id = null) => {
  const whereClause = { name, parentId: parentId !== undefined ? parentId : null };

  if (id) {
    whereClause.id = { [Op.ne]: id };
  }

  const existingCategory = await Category.findOne({
    where: whereClause,
    attributes: ["id"],
    raw: true,
  });

  if (existingCategory) {
    throw new EntityAlreadyExistsException("Category name already exists under this parent");
  }
};

const createCategoryAsync = async categoryData => {
  const { name, parentId } = categoryData;

  await checkCategoryNameExists(name, parentId);

  const newCategory = await Category.create(categoryData);

  return newCategory;
};

const getAllCategoriesAsync = async (baseFilter, pagination = {}, keyword = null) => {
  const { offset, limit } = pagination;

  const keywordFilter = keyword ? { name: { [Op.like]: `%${keyword}%` } } : {};

  const where = {
    ...(baseFilter || {}),
    ...keywordFilter,
  };

  const categories = await Category.findAndCountAll({
    where,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  return categories;
};

const getCategoryByIdAsync = async id => {
  const category = await Category.findByPk(id);
  return category;
};

module.exports = {
  createCategoryAsync,
  getAllCategoriesAsync,
  getCategoryByIdAsync,
};
