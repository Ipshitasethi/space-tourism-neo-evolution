const express = require('express');
const usersService = require('../services/users.service');
const verifyToken = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userUpdateSchema } = require('../schemas/user.schema');
const apiResponse = require('../utils/apiResponse');

const router = express.Router();

router.use(verifyToken);

router.get('/profile', async (req, res, next) => {
  try {
    const user = await usersService.getByUid(req.user.uid);
    res.json(apiResponse.success({ user }));
  } catch (error) {
    next(error);
  }
});

router.patch('/profile', validate(userUpdateSchema), async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (updateData.name) updateData.profile_complete = true;
    
    const user = await usersService.update(req.user.uid, updateData);
    res.json(apiResponse.success({ user }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
