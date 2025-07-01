const { ForbiddenException } = require("../common/commonError");

const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const roles = req?.auth?.roles;
    if (
      !Array.isArray(roles) ||
      !roles.some(role => role.roleName === requiredRole)
    ) {
      throw new ForbiddenException("You do not have the permission to access this module");
    }

    next();
  };
};

module.exports = {
  authorizeRole
}