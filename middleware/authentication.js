const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../appConfig");
const { UserFriendlyException } = require("../common/commonError");

/**
 * Middleware to enforce authentication.
 * Verifies the JWT from the request cookies and attaches the decoded user payload to req.user.
 * Throws a UserFriendlyException if the token is missing or invalid.
 */

const requireAuth = (req, res, next) => {
  // Extract token from cookies
  const token = req.cookies?.token;

  // If no token is provided, block the request
  if (!token) {
    throw new UserFriendlyException("Unauthorized - Token not found", 401);
  }

  try {
    // Verify token signature and expiration; decode payload into req.user
    req.user = jwt.verify(token, jwtConfig.secret);
    next();
  } catch (err) {
    // If verification fails (expired, tampered, etc.), block the request
    throw new UserFriendlyException("Unauthorized - Invalid token", 401);
  }
};

module.exports = { requireAuth };