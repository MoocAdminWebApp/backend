const { query } = require("express-validator");

// Middleware to validate query parameters for pagination
const paginationValidator = [
  // Validate that "page" is an optional positive integer
  query("page").optional().toInt().isInt({ gt: 0 }).withMessage("page must be a positive integer"),

  // Validate that "pageSize" is an optional positive integer
  query("pageSize")
    .optional()
    .toInt()
    .isInt({ gt: 0 })
    .withMessage("pageSize must be a positive integer"),
];

/**
 * Parse pagination parameters from query string.
 * Defaults: page = 1, pageSize = 10
 * Returns offset and limit for database queries, along with original values.
 */
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

module.exports = {
  paginationValidator,
  parsePagination,
};
