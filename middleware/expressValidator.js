const { validationResult } = require("express-validator");

const commonValidate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ status: 400, data: {}, message: errors.array() });
  };
};

module.exports = {
  commonValidate,
};
