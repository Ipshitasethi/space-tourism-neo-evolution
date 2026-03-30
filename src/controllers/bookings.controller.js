const bookingsService = require('../services/bookings.service');
const apiResponse = require('../utils/apiResponse');

const bookingsController = {
  create: async (req, res, next) => {
    try {
      const { uid, email, name } = req.user;
      const result = await bookingsService.create(uid, email, name || 'Passenger', req.body);
      res.status(201).json(apiResponse.success(result, 'Mission confirmed. Your journey begins.'));
    } catch (error) {
      next(error);
    }
  },

  getMyBookings: async (req, res, next) => {
    try {
      const bookings = await bookingsService.getByUserId(req.user.uid);
      res.json(apiResponse.success({ bookings, count: bookings.length }));
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const booking = await bookingsService.getById(req.params.id);
      if (!booking) {
        return res.status(404).json(apiResponse.error('Booking not found', 404));
      }
      if (booking.uid !== req.user.uid && req.user.role !== 'admin') {
        return res.status(403).json(apiResponse.error('Unauthorized access', 403));
      }
      res.json(apiResponse.success({ booking }));
    } catch (error) {
      next(error);
    }
  },

  cancel: async (req, res, next) => {
    try {
      const booking = await bookingsService.cancel(req.params.id, req.user.uid);
      res.json(apiResponse.success({ booking }, 'Booking cancelled successfully.'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = bookingsController;
