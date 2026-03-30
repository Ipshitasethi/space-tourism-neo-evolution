const apiResponse = {
  success: (data, message = '') => ({
    success: true,
    data,
    message
  }),
  error: (error, code = 500) => ({
    success: false,
    error,
    code
  }),
  validationError: (error, details = []) => ({
    success: false,
    error,
    details
  })
};

module.exports = apiResponse;
