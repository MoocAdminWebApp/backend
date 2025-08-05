// Common response module for handling API responses in a consistent manner.

// 200 OK
class SuccessResponse {
  /**
   * @param {*} data
   * @param {*} message
   * @param {*} statusCode
   */
  constructor(message, data = null, statusCode = 200) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

// 400 Bad Request
class BadRequestException extends Error {
  /**
   * BadRequestException
   * @param {*} data
   * @param {*} message
   * @param {*} statusCode
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "BadRequestException";
    this.statusCode = statusCode; // HTTP  status
    // Maintain incorrect stack tracing
    Error.captureStackTrace(this, this.constructor);
  }
}

// 401 Unauthorized
class UnauthoriseException extends Error {
  /**
   * UnauthoriseException
   * @param {*} message
   * @param {*} statusCode
   */
  constructor(message, statusCode = 401) {
    super(message);
    this.name = "UnauthoriseException";
    this.statusCode = statusCode; // HTTP  status
    // Maintain incorrect stack tracing
    Error.captureStackTrace(this, this.constructor);
  }
}

// 403 Forbidden
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
    // Maintain incorrect stack tracing
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 Not Found
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

// 409 Conflict
class EntityConflictException extends Error {
  /**
   * EntityConflictException
   * @param {*} message
   * @param {*} statusCode
   * @param {*} data
   */
  constructor(message, data = null, statusCode = 409) {
    super(message);
    this.name = "EntityConflictException";
    this.data = data;
    this.statusCode = statusCode; // HTTP  status
    // Maintain incorrect stack tracing
    Error.captureStackTrace(this, this.constructor);
  }
}

// 500 Internal Server Error
class InternalServerErrorException extends Error {
  /**
   * InternalServerErrorException
   * @param {*} message
   * @param {*} statusCode
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "InternalServerErrorException";
    this.statusCode = statusCode; // HTTP  status
    // Maintain incorrect stack tracing
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  SuccessResponse,
  BadRequestException,
  UnauthoriseException,
  ForbiddenException,
  EntityNotFoundException,
  EntityConflictException,
  InternalServerErrorException,
};
