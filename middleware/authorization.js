const { ForbiddenException } = require("../common/commonError");

/**
 * Middleware to check if the current user has one of the allowed roles.
 * Throws a 403 Forbidden error if permission is denied.
 */
const checkPermissionByRole =
  (...allowedRoles) =>
  (req, res, next) => {
    const user = req.auth;
    const rolesArray = Array.isArray(user?.roles) ? user.roles : [];

    const userRoles = rolesArray.map(role =>
      typeof role === "string" ? role.toLowerCase() : role.roleName?.toLowerCase?.()
    );

    // Check if any of the user's roles are in the allowedRoles list
    const hasPermission = userRoles.some(role => allowedRoles.includes(role));

    if (!hasPermission) {
      throw new ForbiddenException("No permission", 403);
    }

    next();
  };

/**
 * Middleware to add an access filter to the request based on user roles.
 * - Admin: no filter (can see all categories)
 * - Non-admin: only see public categories
 */
const getCategoryAccessFilter = (req, res, next) => {
  const user = req.auth;
  const rolesArray = Array.isArray(user?.roles) ? user.roles : [];

  const userRoles = rolesArray.map(role =>
    typeof role === "string" ? role.toLowerCase() : role.roleName?.toLowerCase?.()
  );

  // Only public categories for non-admins
  req.accessFilter = userRoles.includes("admin") ? null : { isPublic: true, isDeleted: false };

  next();
};

module.exports = { checkPermissionByRole, getCategoryAccessFilter };
