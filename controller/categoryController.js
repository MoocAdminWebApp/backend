const { Category } = require("../models");
const {
  createCategoryAsync,
  getAllCategoriesAsync,
  getCategoryByIdAsync,
  softDeleteCategoryByIdAsync,
  softDeleteCategoriesByIdsAsync,
  updateCategoryByIdAsync,
} = require("../service/categoryservice");

const { parsePagination } = require("../middleware/pagination");
const { EntityNotFoundException, ValidationException } = require("../common/commonError");

// POST /api/categories
// Create a new category with user-provided data
const createAsync = async (req, res) => {
  const user = req.user;
  const categoryData = req.body;
  categoryData.createdBy = user.id;

  const result = await createCategoryAsync(categoryData);

  res.sendCommonValue(201, "Category created successfully", result);
};

// GET /api/categories
// Get paginated list of categories with optional keyword search
const getAllAsync = async (req, res) => {
  const accessFilter = req.accessFilter;
  const { offset, limit, page, pageSize } = parsePagination(req.query);
  const keyword = req.query.keyword?.trim() || null;

  const { rows: categories, count: total } = await getAllCategoriesAsync(
    accessFilter,
    {
      offset,
      limit,
    },
    keyword
  );

  res.sendCommonValue(200, "Categories retrieved successfully", {
    list: categories,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
};

// GET /api/categories/:id
// Retrieve a specific category by ID, checking access permissions
const getByIdAsync = async (req, res) => {
  const accessFilter = req.accessFilter;
  const categoryId = Number(req.params.id);
  const category = await getCategoryByIdAsync(categoryId);

  if (!category || (accessFilter && category.isPublic === false)) {
    throw new EntityNotFoundException("Category not found", 404);
  }

  res.sendCommonValue(200, "Category retrieved successfully", category);
};

// GET /api/categories/:id/children
// Retrieve child categories of a given parent category
const getChildrenByIdAsync = async (req, res) => {
  const accessFilter = req.accessFilter;
  const parentId = Number(req.params.id);

  const parentCategory = await getCategoryByIdAsync(parentId);

  // Check if parent exists and if access is allowed
  if (!parentCategory || (accessFilter && parentCategory.isPublic === false)) {
    throw new EntityNotFoundException("Category not found", 404);
  }

  const { offset, limit, page, pageSize } = parsePagination(req.query);
  const keyword = req.query.keyword?.trim() || null;
  const baseFilter = { parentId, ...(accessFilter || {}) };

  const { rows: categories, count: total } = await getAllCategoriesAsync(
    baseFilter,
    { offset, limit },
    keyword
  );

  if (total === 0) {
    throw new EntityNotFoundException("No child categories found", 404);
  }

  res.sendCommonValue(200, "Child categories retrieved successfully", {
    list: categories,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
};

// GET /api/categories/root
// Retrieve all top-level categories
const getRootCategoriesAsync = async (req, res) => {
  const accessFilter = req.accessFilter;
  const { offset, limit, page, pageSize } = parsePagination(req.query);
  const keyword = req.query.keyword?.trim() || null;
  const baseFilter = { parentId: null, ...(accessFilter || {}) };

  const { rows: categories, count: total } = await getAllCategoriesAsync(
    baseFilter,
    { offset, limit },
    keyword
  );

  if (total === 0) {
    throw new EntityNotFoundException("No top-level categories found", 404);
  }

  res.sendCommonValue(200, "Top-level categories retrieved successfully", {
    list: categories,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
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

  // Prevent deletion if category still has visible children categories
  const childCount = await Category.count({
    where: { parentId: categoryId, isPublic: true, isDeleted: false },
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

  // Check if all provided category IDs exist
  for (const categoryId of categoryIds) {
    const category = await getCategoryByIdAsync(categoryId);
    if (!category || category.isDeleted) {
      throw new EntityNotFoundException(`Category ${categoryId} not found`, 404);
    }
  }

  // Prevent deletion if any category still has visible subcategories
  const withChildren = [];
  for (const id of categoryIds) {
    const childCount = await Category.count({
      where: { parentId: id, isPublic: true, isDeleted: false },
    });
    if (childCount > 0) {
      withChildren.push(id);
    }
  }

  if (withChildren.length > 0) {
    throw new ValidationException(
      `Categories [${withChildren.join(", ")}] have subcategories. Please delete subcategories first.`,
      400
    );
  }

  const deletedCategories = await softDeleteCategoriesByIdsAsync(categoryIds);

  return res.sendCommonValue(200, "Categories deleted successfully", deletedCategories);
};

// PUT /api/categories/:id
// Update category details by ID
const updateByIdAsync = async (req, res) => {
  const categoryId = req.params.id;
  const user = req.user;

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

module.exports = {
  createAsync,
  getAllAsync,
  getByIdAsync,
  getChildrenByIdAsync,
  getRootCategoriesAsync,
  deleteByIdAsync,
  deleteByIdsAsync,
  updateByIdAsync
};
