const usersService = require('../services/users.service');
const apiResponse = require('../utils/apiResponse');

const authController = {
  register: async (req, res, next) => {
    try {
      const { id, user_metadata } = req.user; // Supabase user from middleware
      const existing = await usersService.getByUid(id);
      if (existing) {
        return res.status(409).json(apiResponse.error('User already registered', 409));
      }
      const user = await usersService.create({
        uid: id,
        name: user_metadata.full_name || req.body.name,
        username: user_metadata.username || req.body.username,
        email: req.user.email
      });
      res.status(201).json(apiResponse.success({ user }));
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { id } = req.user;
      const user = await usersService.getByUid(id);
      if (!user) {
        return res.status(404).json(apiResponse.error('User profile not found', 404));
      }
      res.json(apiResponse.success({ user }));
    } catch (error) {
      next(error);
    }
  },

  me: async (req, res, next) => {
    try {
      const { id } = req.user;
      const user = await usersService.getByUid(id);
      res.json(apiResponse.success({ user }));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
