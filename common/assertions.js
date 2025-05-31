function assertFound(entity, entityName = "Entity") {
  if (!entity) {
    const err = new Error(`${entityName} not found`);
    err.name = "EntityNotFoundException";
    err.statusCode = 404;
    throw err;
  }
}

function assertNotExists(entity, entityName = "Entity") {
  if (entity) {
    const err = new Error(`${entityName} already exists`);
    err.name = "EntityAlreadyExistsException";
    err.statusCode = 409;
    throw err;
  }
}

module.exports = {
  assertFound,
  assertNotExists,
};
