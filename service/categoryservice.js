const { Category } = require("../models");
const { EntityAlreadyExistsException } = require("../common/commonError");
const { Op } = require("sequelize");

/**
 * Check if a category with the same name and parentId already exists.
 * Used to enforce unique category names under the same parent.
 * Optionally excludes a given id (for update scenarios).
 */
const checkCategoryNameExists = async (name, parentId, id = null) => {
  const whereClause = { name, parentId: parentId !== undefined ? parentId : null };

  if (id) {
    whereClause.id = { [Op.ne]: id };
  }

  const isExisting = await Category.findOne({
    where: whereClause,
    attributes: ["id"],
    raw: true,
  });

  if (isExisting) {
    throw new EntityAlreadyExistsException("Category name already exists");
  }
};

/**
 * Create a new category.
 */
const createCategoryAsync = async categoryData => {
  const { name, parentId } = categoryData;

  await checkCategoryNameExists(name, parentId);

  const newCategory = await Category.create(categoryData);

  return newCategory;
};

/**
 * Get a paginated list of categories with optional keyword search.
 */
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

/**
 * Get category by primary key ID.
 */
const getCategoryByIdAsync = async id => {
  const category = await Category.findByPk(id);
  return category;
};

/**
 * Perform soft delete: mark category as deleted instead of removing it.
 */
const softDelete = async where => {
  await Category.update(
    {
      isPublic: false,
      isDeleted: true,
      deletedAt: new Date(),
    },
    { where }
  );

  // Return list of IDs that were soft-deleted
  const ids = Array.isArray(where.id) ? where.id : [where.id];
  const rows = await Category.findAll({
    attributes: ["id"],
    where: { id: ids },
    raw: true,
  });
  return rows.map(r => r.id);
};

/**
 * Soft delete a single category by ID.
 */
const softDeleteCategoryByIdAsync = async id => {
  const where = { id, isPublic: true, isDeleted: false };
  const [deletedId] = await softDelete(where);

  const deletedCategory = await Category.findByPk(deletedId);

  return deletedCategory;
};

/**
 * Soft delete multiple categories by a list of IDs.
 */
const softDeleteCategoriesByIdsAsync = async ids => {
  const where = { id: ids, isPublic: true, isDeleted: false };
  const deletedIds = await softDelete(where);

  const deletedCategories = await Category.findAll({ where: { id: deletedIds } });

  return deletedCategories;
};

/**
 * Update a category by ID, ensuring name uniqueness.
 */
const updateCategoryByIdAsync = async (category, updateData, userId) => {
  const { name, parentId } = updateData;

  if (name !== undefined) {
    await checkCategoryNameExists(
      name,
      parentId !== undefined ? parentId : category.parentId,
      category.id
    );
  }

  updateData.updatedBy = userId;
  updateData.updatedAt = new Date();

  await category.update(updateData);

  return category;
};

module.exports = {
  createCategoryAsync,
  getAllCategoriesAsync,
  getCategoryByIdAsync,
  softDeleteCategoryByIdAsync,
  softDeleteCategoriesByIdsAsync,
  updateCategoryByIdAsync,
};
