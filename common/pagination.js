const { Op } = require("sequelize");

/**
 * Parse pagination parameters from query.
 * Defaults: page = 1, pageSize = 10
 * Returns offset and limit for database queries, along with original values.
 */
const parsePagination = (query = {}) => {
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 10;
  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
    limit: pageSize,
  };
};

/**
 * Generic pagination query function with support for mixed fuzzy and exact filters.
 * @param {Model} model Sequelize model (e.g. User, Profile)
 * @param {Object} options Query options
 * @param {Object} options.filters Query filters (all fields as strings)
 * @param {string[]} options.fuzzyKeys Keys to apply fuzzy search (LIKE)
 * @param {number} options.page Current page number (default: 1)
 * @param {number} options.pageSize Items per page (default: 10)
 * @param {Object[]} options.include Sequelize include array for associations
 * @param {string[]} options.excludeFields Fields to exclude from result
 * @param {string} options.orderBy Field to sort by (default: "id")
 * @param {'ASC'|'DESC'} options.orderDir Sort direction (default: "ASC")
 * @returns {Object} Paginated result { isSuccess, message, data: { page, pageSize, total, totalPages, rows } }
 */
const paginateModelAsync = async (
  model,
  {
    filters = {},
    fuzzyKeys = [],
    page = 1,
    pageSize = 10,
    include = [],
    excludeFields = [],
    orderBy = "id",
    orderDir = "ASC",
  }
) => {
  const whereClause = {};
  let orConditions = [];

  for (const key in filters) {
    const value = filters[key];
    if (value == null || value === "") continue;

    if (fuzzyKeys.includes(key)) {
      orConditions.push({ [key]: { [Op.like]: `%${value}%` } });
    } else {
      whereClause[key] = value;
    }
  }

  if (orConditions.length > 0) {
    whereClause[Op.or] = orConditions;
  }

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const { count, rows } = await model.findAndCountAll({
    where: whereClause,
    attributes: excludeFields.length > 0 ? { exclude: excludeFields } : undefined,
    include,
    order: [[orderBy, orderDir]],
    limit,
    offset,
    distinct: true,
  });

  return {
    isSuccess: true,
    message: "paged successfully",
    data: {
      page,
      pageSize,
      total: count,
      totalPages: Math.ceil(count / pageSize),
      items: rows,
    },
  };
};

module.exports = {
  parsePagination,
  paginateModelAsync,
};
