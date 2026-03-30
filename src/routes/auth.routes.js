const express = require('express');
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userSchema } = require('../schemas/user.schema');

const router = express.Router();

router.post('/register', validate(userSchema), authController.register);
router.post('/login', verifyToken, authController.login);
router.get('/me', verifyToken, authController.me);

module.exports = router;
