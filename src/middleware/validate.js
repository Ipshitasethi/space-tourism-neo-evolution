const apiResponse = require('../utils/apiResponse');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    return res.status(400).json(apiResponse.validationError('Validation failed', details));
  }
};

module.exports = validate;
