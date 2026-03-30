const usersService = require('../services/users.service');
const apiResponse = require('../utils/apiResponse');

const adminOnly = async (req, res, next) => {
  try {
    const user = await usersService.getByUid(req.user.uid);
    if (!user || user.role !== 'admin') {
      return res.status(403).json(apiResponse.error('Admin privileges required', 403));
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminOnly;
