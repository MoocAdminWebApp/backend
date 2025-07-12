const { Op } = require("sequelize");

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

  for (const key in filters) {
    const value = filters[key];
    if (value == null || value === "") continue;

    if (fuzzyKeys.includes(key)) {
      whereClause[key] = { [Op.like]: `%${value}%` };
    } else {
      whereClause[key] = value;
    }
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
  });

  return {
    isSuccess: true,
    message: "paged successfully",
    data: {
      page,
      pageSize,
      total: count,
      totalPages: Math.ceil(count / pageSize),
      rows,
    },
  };
};

module.exports = {
  paginateModelAsync,
};
