const { ForbiddenException } = require("../common/commonError");

const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    console.log(requiredRole)
    const roles = req?.auth?.roles;
    console.log(roles)
    if (
      !Array.isArray(roles) ||
      !roles.some(role => requiredRole.includes(role.roleName.toLowerCase()))
    ) {
      throw new ForbiddenException("You do not have the permission to access this module");
    }

    next();
  };
};

module.exports = {
  authorizeRole
}