var express = require('express');
var router = express.Router();
const usersController = require('../controllers/apis/users');

router.use('/users', usersController) // Chatbot Server

module.exports = router;
