const express = require('express');
const bookingsController = require('../controllers/bookings.controller');
const verifyToken = require('../middleware/auth');
const validate = require('../middleware/validate');
const { bookingSchema } = require('../schemas/booking.schema');

const router = express.Router();

router.use(verifyToken);

router.post('/', validate(bookingSchema), bookingsController.create);
router.get('/my', bookingsController.getMyBookings);
router.get('/:id', bookingsController.getById);
router.patch('/:id/cancel', bookingsController.cancel);

module.exports = router;
