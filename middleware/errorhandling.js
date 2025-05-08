const logger = require("../common/logsetting");

const errorhandling = (err, req, res, next) => {
  logger.error("global errorhandling", err);
  if (err.name === "UnauthorizedError") {
    return res.sendCommonValue(401, "Unauthorized");
  }

  if (
    err.name === "EntityNotFoundException" ||
    err.name === "EntityAlreadyExistsException" ||
    err.name === "UserFriendlyException" ||
    err.name === "ValidationException"
  ) {
    return res.sendCommonValue(err.statusCode, err.message);
  }

  if (err && err.sql) {
    return res.sendCommonValue(500, "server error");
  }
  res.sendCommonValue(500, err);
};

module.exports = {
  errorhandling,
};
