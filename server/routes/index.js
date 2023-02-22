const express = require('express');
const router = express.Router();
const mainRoutes = require('./main');
const userRoutes = require('./user');

router.use('/', mainRoutes);
router.use('/user', userRoutes);

module.exports = router;
