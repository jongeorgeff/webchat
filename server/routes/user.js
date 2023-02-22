const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.all('/logout', userController.logout);
router.delete('/', userController.delete);

module.exports = router;
