const { Category } = require("../models");
const {
  createCategoryAsync,
  getAllCategoriesAsync,
  getCategoryByIdAsync,
  softDeleteCategoryByIdAsync,
  softDeleteCategoriesByIdsAsync,
  updateCategoryByIdAsync,
  getCategoryDetailsForFrontend,
  restoreCategoryByIdAsync,
  getAllCategoriesForTreeAsync,
  getCategoryPageIndexAsync,
} = require("../service/categoryservice");

const { parsePagination } = require("../common/pagination");
const { EntityNotFoundException, ValidationException } = require("../common/commonError");

// POST /api/categories
// Create a new category with user-provided data
const createAsync = async (req, res) => {
  // const user = req.user;
  const user = req.user || req.auth;
  const categoryData = req.body;
  categoryData.createdBy = user.id;

  const result = await createCategoryAsync(categoryData);

  res.sendCommonValue(201, "Category created successfully", result);
};

// GET /api/categories
// Get paginated list of categories with optional keyword search
const getAllAsync = async (req, res) => {
  const accessFilter = req.accessFilter;
  const isAdmin = !accessFilter;
  const { offset, limit, page, pageSize } = parsePagination(req.query);
  const keyword = req.query.keyword?.trim() || null;

  const { rows: categories, count: total } = await getAllCategoriesAsync(
    accessFilter,
    {
      offset,
      limit,
    },
    keyword,
    isAdmin
  );

  res.sendCommonValue(200, "Categories retrieved successfully", {
    items: categories,
    total,
    page,
    pageSize,
  });
};

// GET /api/categories/tree
// Get all categories for category tree
const getTreeAsync = async (req, res) => {
  const accessFilter = req.accessFilter;
  const isAdmin = !accessFilter;

  const data = await getAllCategoriesForTreeAsync(isAdmin, accessFilter);

  res.sendCommonValue(200, "Fetched all categories for tree", data);
};

// GET /api/categories/:id
// Retrieve a specific category by ID, checking access permissions
const getByIdAsync = async (req, res) => {
  const accessFilter = req.accessFilter;
  const categoryId = Number(req.params.id);
  const category = await getCategoryDetailsForFrontend(categoryId);

  if (!category || (accessFilter && (category.isPublic === false || category.isDeleted))) {
    throw new EntityNotFoundException("Category not found", 404);
  }

  res.sendCommonValue(200, "Category retrieved successfully", category);
};

// GET /api/categories/:id/children
// Retrieve child categories of a given parent category
const getChildrenByIdAsync = async (req, res) => {
  const accessFilter = req.accessFilter;
  const isAdmin = !accessFilter;
  const parentId = Number(req.params.id);

  const parentCategory = await getCategoryByIdAsync(parentId);

  // Check if parent exists and if access is allowed
  if (
    !parentCategory ||
    (accessFilter && (parentCategory.isPublic === false || parentCategory.isDeleted))
  ) {
    throw new EntityNotFoundException("Category not found", 404);
  }

  const { offset, limit, page, pageSize } = parsePagination(req.query);
  const keyword = req.query.keyword?.trim() || null;
  const baseFilter = { parentId, ...(accessFilter || {}) };

  const { rows: categories, count: total } = await getAllCategoriesAsync(
    baseFilter,
    { offset, limit },
    keyword,
    isAdmin
  );

  res.sendCommonValue(200, "Child categories retrieved successfully", {
    items: categories,
    total,
    page,
    pageSize,
  });
};

// GET /api/categories/root
// Retrieve all top-level categories
const getRootCategoriesAsync = async (req, res) => {
  const accessFilter = req.accessFilter;
  const isAdmin = !req.accessFilter;
  const { offset, limit, page, pageSize } = parsePagination(req.query);
  const keyword = req.query.keyword?.trim() || null;
  const baseFilter = { parentId: null, ...(accessFilter || {}) };

  const { rows: categories, count: total } = await getAllCategoriesAsync(
    baseFilter,
    { offset, limit },
    keyword,
    isAdmin
  );

  if (total === 0) {
    throw new EntityNotFoundException("No top-level categories found", 404);
  }

  res.sendCommonValue(200, "Top-level categories retrieved successfully", {
    items: categories,
    total,
    page,
    pageSize,
  });
};

// DELETE /api/categories/:id
// Soft delete a single category by ID after checking it has no children
const deleteByIdAsync = async (req, res) => {
  const categoryId = Number(req.params.id);

  const category = await getCategoryByIdAsync(categoryId);
  if (!category || category.isDeleted) {
    throw new EntityNotFoundException("Category not found", 404);
  }

  // Prevent deletion if category still has children categories
  const childCount = await Category.count({
    where: { parentId: categoryId, isDeleted: false },
  });

  if (childCount > 0) {
    throw new ValidationException(
      "This category has subcategories. Please delete subcategories first.",
      400
    );
  }

  const deletedCategory = await softDeleteCategoryByIdAsync(categoryId);

  res.sendCommonValue(200, "Category deleted successfully", deletedCategory);
};

// DELETE /api/categories
// Soft delete multiple categories by ID after ensuring none have children
const deleteByIdsAsync = async (req, res) => {
  const categoryIds = req.body.ids.map(id => Number(id));

  const categories = await Category.findAll({
    where: { id: categoryIds },
  });

  const invalidIds = categoryIds.filter(id => {
    const category = categories.find(c => c.id === id);
    return !category || category.isDeleted;
  });

  if (invalidIds.length > 0) {
    throw new EntityNotFoundException(`Categories [${invalidIds.join(", ")}] not found`, 404);
  }

  const children = await Category.findAll({
    where: {
      parentId: categoryIds,
      isDeleted: false,
    },
  });

  const withChildrenIds = [...new Set(children.map(c => c.parentId))];

  if (withChildrenIds.length > 0) {
    const withChildrenCategories = categories.filter(c => withChildrenIds.includes(c.id));
    const categoryLabels = withChildrenCategories.map(c => `${c.name} (ID: ${c.id})`);

    const message =
      withChildrenIds.length === 1
        ? `Category "${categoryLabels[0]}" has subcategories. Please delete its subcategories first.`
        : `Categories [${categoryLabels.join(", ")}] have subcategories. Please delete their subcategories first.`;

    throw new ValidationException(message, 400);
  }

  const deletedCategories = await softDeleteCategoriesByIdsAsync(categoryIds);

  return res.sendCommonValue(200, "Categories deleted successfully", deletedCategories);
};

// PUT /api/categories/:id
// Update category details by ID
const updateByIdAsync = async (req, res) => {
  const categoryId = req.params.id;
  // const user = req.user;
  const user = req.user || req.auth;

  const category = await getCategoryByIdAsync(categoryId);

  if (!category) {
    throw new EntityNotFoundException("Category not found", 404);
  }

  // Collect fields allowed for update
  const { name, description, icon, isPublic } = req.body;
  const updateData = { name, description, icon, isPublic };

  const updatedCategory = await updateCategoryByIdAsync(category, updateData, user.id);

  res.sendCommonValue(200, "Category updated successfully", updatedCategory);
};

// PUT /api/categories/:id/restore
// Restore deleted category
const restoreByIdAsync = async (req, res) => {
  const categoryId = req.params.id;
  const user = req.user || req.auth;

  const category = await getCategoryByIdAsync(categoryId);

  if (!category || !category.isDeleted) {
    throw new EntityNotFoundException("Category not found", 404);
  }

  const restoredCategory = await restoreCategoryByIdAsync(category, user.id);

  res.sendCommonValue(200, "Category restored successfully", restoredCategory);
};

const getPageOfCategoryAsync = async (req, res) => {
  const accessFilter = req.accessFilter;
  const isAdmin = !accessFilter;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const keyword = req.query.keyword?.trim() || null;
  const id = parseInt(req.params.id);

  const targetCategory = await getCategoryByIdAsync(id);

  if (
    !targetCategory ||
    (accessFilter && (targetCategory.isDeleted || targetCategory.isPublic === false))
  ) {
    throw new EntityNotFoundException("Category not accessible", 404);
  }

  const baseFilter = {
    parentId: targetCategory.parentId,
    ...(accessFilter || {}),
  };

  const page = await getCategoryPageIndexAsync(id, baseFilter, pageSize, keyword, isAdmin);

  if (page === null) {
    throw new EntityNotFoundException("Category not found in paginated results", 404);
  }

  res.sendCommonValue(200, "Page index calculated", { page });
};

module.exports = {
  createAsync,
  getAllAsync,
  getTreeAsync,
  getByIdAsync,
  getChildrenByIdAsync,
  getRootCategoriesAsync,
  deleteByIdAsync,
  deleteByIdsAsync,
  updateByIdAsync,
  restoreByIdAsync,
  getPageOfCategoryAsync,
};
