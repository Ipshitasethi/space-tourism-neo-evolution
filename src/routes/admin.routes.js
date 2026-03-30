const express = require('express');
const adminController = require('../controllers/admin.controller');
const verifyToken = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.use(verifyToken);
router.use(adminOnly);

router.get('/bookings', adminController.getAllBookings);
router.get('/users', adminController.getAllUsers);
router.patch('/missions/:id', adminController.updateMission);
router.get('/stats', adminController.getStats);

module.exports = router;
