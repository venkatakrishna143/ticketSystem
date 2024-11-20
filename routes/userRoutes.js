const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../controllers/userController');

const router = express.Router();

router.post('/register',user.createUser);
router.post('/deleteuser',user.deleteUser); // it should be called by admin only
router.post('/register',user.getUser);
router.post('/userById',user.getUsers); // it should be called by admin only
router.post('/updateById',user.updateUser);

module.exports = router;