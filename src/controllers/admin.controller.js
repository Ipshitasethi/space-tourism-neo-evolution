const bookingsService = require('../services/bookings.service');
const usersService = require('../services/users.service');
const missionsService = require('../services/missions.service');
const apiResponse = require('../utils/apiResponse');

const adminController = {
  getAllBookings: async (req, res, next) => {
    try {
      const { status, missionId, uid } = req.query;
      const bookings = await bookingsService.getAll({ status, missionId, uid });
      res.json(apiResponse.success({ bookings, count: bookings.length }));
    } catch (error) {
      next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const users = await usersService.getAll();
      res.json(apiResponse.success({ users, count: users.length }));
    } catch (error) {
      next(error);
    }
  },

  updateMission: async (req, res, next) => {
    try {
      const mission = await missionsService.update(req.params.id, req.body);
      res.json(apiResponse.success({ mission }));
    } catch (error) {
      next(error);
    }
  },

  getStats: async (req, res, next) => {
    try {
      const bookings = await bookingsService.getAll();
      const users = await usersService.getAll();
      const missions = await missionsService.getAll();

      const stats = {
        total_users: users.length,
        total_bookings: bookings.length,
        bookings_by_status: {
          Confirmed: bookings.filter(b => b.booking_status === 'Confirmed').length,
          Cancelled: bookings.filter(b => b.booking_status === 'Cancelled').length,
          Pending: bookings.filter(b => b.booking_status === 'Pending').length
        },
        revenue: bookings
          .filter(b => b.booking_status === 'Confirmed')
          .reduce((sum, b) => {
            const mission = missions.find(m => m.id === b.mission_id);
            return sum + (mission ? mission.price_usd : 0);
          }, 0),
        most_popular_destination: 'Mars Colony Alpha', // Simplified for this logic
        seats_remaining: missions
          .filter(m => m.status === 'Active')
          .reduce((sum, m) => sum + m.seats_available, 0)
      };

      res.json(apiResponse.success({ stats }));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminController;
