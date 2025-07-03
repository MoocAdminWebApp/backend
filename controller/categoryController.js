const {
  createCategoryAsync,
  getAllCategoriesAsync,
  getCategoryByIdAsync,
} = require("../service/categoryService");
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../appConfig");
const {
  UserFriendlyException,
  EntityNotFoundException,
  ForbiddenException,
} = require("../common/commonError");

const requireAuthUser = req => {
  const token = req.cookies?.token;

  if (!token) {
    throw new UserFriendlyException("Unauthorized - Token not found", 401);
  }
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    throw new UserFriendlyException("Unauthorized - Invalid token", 401);
  }
};

const extractRoleNames = roles =>
  Array.isArray(roles)
    ? roles.map(role =>
        typeof role === "string" ? role.toLowerCase() : role.roleName?.toLowerCase()
      )
    : [];

const checkPermissionByRole = (roles, allowedRoles = ["admin"]) => {
  const roleNames = extractRoleNames(roles);
  const hasPermission = roleNames.some(role => allowedRoles.includes(role));

  if (!hasPermission) {
    throw new ForbiddenException("No permission to create category", 403);
  }
};

const getCategoryAccessFilter = roles => {
  const roleNames = extractRoleNames(roles);

  if (roleNames.includes("admin")) {
    return null;
  }

  return { isPublic: true };
};

const parsePagination = query => {
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 10;
  return {
    offset: (page - 1) * pageSize,
    limit: pageSize,
    page,
    pageSize,
  };
};

const createAsync = async (req, res) => {
  const user = requireAuthUser(req);
  checkPermissionByRole(user.roles, ["admin"]);

  const categoryData = req.body;
  categoryData.createdBy = user.id;

  const result = await createCategoryAsync(categoryData);

  res.sendCommonValue(201, "Category created successfully", result);
};

const getAllAsync = async (req, res) => {
  const user = requireAuthUser(req);
  const accessFilter = getCategoryAccessFilter(user.roles);

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

const getByIdAsync = async (req, res) => {
  const user = requireAuthUser(req);
  const accessFilter = getCategoryAccessFilter(user.roles);

  const categoryId = Number(req.params.id);

  const category = await getCategoryByIdAsync(categoryId);

  if (!category || (accessFilter && category.isPublic === false)) {
    throw new EntityNotFoundException("Category not found", 404);
  }

  res.sendCommonValue(200, "Category retrieved successfully", category);
};

const getChildrenByIdAsync = async (req, res) => {
  const user = requireAuthUser(req);
  const accessFilter = getCategoryAccessFilter(user.roles);
  const parentId = Number(req.params.id);

  const parentCategory = await getCategoryByIdAsync(parentId);

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

const getRootCategoriesAsync = async (req, res) => {
  const user = requireAuthUser(req);
  const accessFilter = getCategoryAccessFilter(user.roles);

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

module.exports = {
  createAsync,
  getAllAsync,
  getByIdAsync,
  getChildrenByIdAsync,
  getRootCategoriesAsync,
};
