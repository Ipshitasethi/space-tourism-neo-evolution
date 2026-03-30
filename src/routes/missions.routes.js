const express = require('express');
const missionsController = require('../controllers/missions.controller');

const router = express.Router();

router.get('/', missionsController.getAll);
router.get('/active', missionsController.getActive);
router.get('/:id', missionsController.getById);

module.exports = router;
