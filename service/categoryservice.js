const { Category, User } = require("../models");
const { EntityAlreadyExistsException } = require("../common/commonError");
const { Op } = require("sequelize");
const { sequelize } = require("../db/sequelizedb");

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
  const { name } = categoryData;
  const parentId = categoryData.parentId ?? null;

  await checkCategoryNameExists(name, parentId);

  const newCategory = await Category.create({
    ...categoryData,
    parentId,
  });

  return newCategory.get({ plain: true });
};

/**
 * Get a paginated list of categories with optional keyword search.
 */
const getAllCategoriesAsync = async (
  baseFilter,
  pagination = {},
  keyword = null,
  isAdmin = false
) => {
  const { offset, limit } = pagination;

  const mainWhere = {
    ...(isAdmin ? {} : { isDeleted: false, isPublic: true }),
    ...(baseFilter || {}),
    ...(keyword ? { name: { [Op.like]: `%${keyword}%` } } : {}),
  };

  const categories = await Category.findAll({
    where: mainWhere,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  const ids = categories.map(cat => cat.id);
  if (ids.length === 0) {
    return { rows: [], count: 0 };
  }

  const childWhere = {
    parentId: { [Op.in]: ids },
    ...(isAdmin ? {} : { isDeleted: false, isPublic: true }),
  };

  const childCounts = await Category.findAll({
    attributes: ["parentId", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
    where: childWhere,
    group: ["parentId"],
    raw: true,
  });

  const countMap = {};
  childCounts.forEach(({ parentId, count }) => {
    countMap[parentId] = parseInt(count);
  });

  const mapped = categories.map(cat => ({
    ...cat,
    hasChildren: countMap[cat.id] > 0,
  }));

  const total = await Category.count({ where: mainWhere });

  return {
    rows: mapped,
    count: total,
  };
};

/**
 * Get all categories for category tree
 */
const getAllCategoriesForTreeAsync = async (isAdmin, accessFilter) => {
  const whereClause = {
    ...(isAdmin ? {} : { isDeleted: false, isPublic: true }),
    ...(accessFilter || {}),
  };

  const categories = await Category.findAll({
    where: whereClause,
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  return categories;
};

/**
 * Get category by primary key ID.
 */
const getCategoryByIdAsync = async id => {
  const category = await Category.findByPk(id, {
    include: [
      { model: User, as: "creator", attributes: ["firstName", "lastName"] },
      { model: User, as: "updater", attributes: ["firstName", "lastName"] },
    ],
  });

  return category;
};

const getCategoryDetailsForFrontend = async id => {
  const category = await getCategoryByIdAsync(id);
  if (!category) return null;

  const json = category.toJSON();

  const creatorName = json.creator ? `${json.creator.firstName} ${json.creator.lastName}` : null;

  const updaterName = json.updater ? `${json.updater.firstName} ${json.updater.lastName}` : null;

  let parentName = null;
  if (json.parentId) {
    const parentCategory = await Category.findByPk(json.parentId, {
      attributes: ["name"],
    });
    if (parentCategory) {
      parentName = parentCategory.name;
    }
  }

  delete json.creator;
  delete json.updater;

  return {
    ...json,
    parentName,
    creator: creatorName,
    updater: updaterName,
  };
};

/**
 * Perform soft delete: mark category as deleted instead of removing it.
 */
const softDelete = async where => {
  await Category.update(
    {
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
  const where = { id, isDeleted: false };
  const [deletedId] = await softDelete(where);

  const deletedCategory = await Category.findByPk(deletedId);

  return deletedCategory;
};

/**
 * Soft delete multiple categories by a list of IDs.
 */
const softDeleteCategoriesByIdsAsync = async ids => {
  const where = { id: ids, isDeleted: false };
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

/**
 * Restore a deleted category by ID.
 */
const restoreCategoryByIdAsync = async (category, userId) => {
  category.isDeleted = false;
  category.deletedAt = null;
  category.updatedBy = userId;
  category.updatedAt = new Date();

  await category.save();

  return category;
};

module.exports = {
  createCategoryAsync,
  getAllCategoriesAsync,
  getAllCategoriesForTreeAsync,
  getCategoryByIdAsync,
  getCategoryDetailsForFrontend,
  softDeleteCategoryByIdAsync,
  softDeleteCategoriesByIdsAsync,
  updateCategoryByIdAsync,
  restoreCategoryByIdAsync,
};
