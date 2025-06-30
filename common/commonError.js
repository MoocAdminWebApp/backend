class EntityNotFoundException extends Error {
  /**
   * EntityNotFoundException
   * @param {*} message
   * @param {*} statusCode
   */
  constructor(message, statusCode = 404) {
    super(message);
    this.name = "EntityNotFoundException";
    this.statusCode = statusCode; // HTTP  status
    // Maintain incorrect stack tracing
    Error.captureStackTrace(this, this.constructor);
  }
}

class EntityAlreadyExistsException extends Error {
  /**
   * EntityAlreadyExistsException
   * @param {*} message
   * @param {*} statusCode
   */
  constructor(message, statusCode = 409) {
    super(message);
    this.name = "EntityAlreadyExistsException";
    this.statusCode = statusCode; // HTTP  status
    // Maintain incorrect stack tracing
    Error.captureStackTrace(this, this.constructor);
  }
}

class UserFriendlyException extends Error {
  /**
   * UserFriendlyException
   * @param {*} message
   * @param {*} statusCode
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "UserFriendlyException";
    this.statusCode = statusCode; // HTTP  status
    // Maintain incorrect stack tracing
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationException extends Error {
  /**
   * UserFriendlyException
   * @param {*} message
   * @param {*} statusCode
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "ValidationException";
    this.statusCode = statusCode; // HTTP  status
    // Maintain incorrect stack tracing
    Error.captureStackTrace(this, this.constructor);
  }
}

class ForbiddenException extends Error {
  /**
   * ForbiddenException
   * @param {*} message
   * @param {*} statusCode
   */
  constructor(message, statusCode = 403) {
    super(message);
    this.name = "ForbiddenException";
    this.statusCode = statusCode; // HTTP  status
    // Maintain correct stack tracing
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  EntityNotFoundException,
  EntityAlreadyExistsException,
  UserFriendlyException,
  ValidationException,
  ForbiddenException
};
