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

module.exports = {
  paginationValidator,
};