'use strict';

const
    express = require('express'),
    // userService = require('../../../services/users'),
    // models = require('../../../models'),
    chatbotService = require('../../../services/users/chatbot');

let router = express.Router();

console.log('apis/users/index.js called');
/**
 * api/v1/users/
 */
router.get('/test', chatbotService.test);
router.post('/posttest', chatbotService.posttest);
router.post('/schoolFoodArt', chatbotService.schoolFoodArt);
router.post('/schoolFoodEdu', chatbotService.schoolFoodEdu);
router.post('/schoolFoodVision', chatbotService.schoolFoodVision);
router.post('/libraryRestSeat', chatbotService.libraryRestSeat);
router.post('/noticeParse', chatbotService.noticeParse);
router.post('/scholarParse', chatbotService.scholarParse);
router.post('/foodParser', chatbotService.foodParser);
// ^Middleware. Make sure to put all the routes which needs authentication below this middleware.

module.exports = router;
