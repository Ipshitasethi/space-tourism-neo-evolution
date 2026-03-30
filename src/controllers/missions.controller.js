const missionsService = require('../services/missions.service');
const apiResponse = require('../utils/apiResponse');

const missionsController = {
  getAll: async (req, res, next) => {
    try {
      const { status, difficulty } = req.query;
      const missions = await missionsService.getAll({ status, difficulty });
      res.json(apiResponse.success({ missions, count: missions.length }));
    } catch (error) {
      next(error);
    }
  },

  getActive: async (req, res, next) => {
    try {
      const missions = await missionsService.getActive();
      res.json(apiResponse.success({ missions, count: missions.length }));
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const mission = await missionsService.getById(req.params.id);
      if (!mission) {
        return res.status(404).json(apiResponse.error('Mission not found', 404));
      }
      res.json(apiResponse.success({ mission }));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = missionsController;
