'use strict';

const
    express = require('express'),
    // models = require('../../../models'),
    chatbot = require('../../../services/chatbot');

let router = express.Router();

console.log('apis/users/index.js called');

/**
 * users/
 */

/*
 * school (학사관련)
 */
router.post('/libraryRestSeat', chatbot.school.libraryRestSeat);
router.post('/noticeParse', chatbot.school.noticeParse);
router.post('/scholarParse', chatbot.school.scholarParse);
router.post('/foodParser', chatbot.school.foodParser);
router.post('/getWeather', chatbot.school.getWeather);
router.post('/getAir', chatbot.school.getAir);
router.post('/elecLibrary1F', chatbot.school.elecLibrary1F);
router.post('/elecLibrary2F', chatbot.school.elecLibrary2F);
router.post('/elecLibraryInit', chatbot.school.elecLibraryInit);
router.post('/libraryInit', chatbot.school.libraryInit);
router.post('/moodang', chatbot.school.moodang);
router.post('/selectCollege', chatbot.school.selectCollege);
router.post('/selectMajor', chatbot.school.selectMajor);
router.post('/updateMajor', chatbot.school.updateMajor);
router.post('/majorNoticeParse', chatbot.school.majorNoticeParse);
router.post('/majorParse', chatbot.school.majorParse);
router.post('/searchSchedule', chatbot.school.searchSchedule);
router.post('/scheduleByMonthInit', chatbot.school.scheduleByMonthInit);
router.post('/scheduleByMonthInit2', chatbot.school.scheduleByMonthInit2);
router.post('/scheduleByMonth', chatbot.school.scheduleByMonth);
router.post('/workParse', chatbot.school.workParse);
router.post('/getUser', chatbot.school.getUser);
/*
 * food (맛집관련)
 */
router.post('/foodRanking', chatbot.food.foodRanking);
router.post('/foodInit', chatbot.food.foodInit);
router.post('/foodByType', chatbot.food.foodByType);
router.post('/foodDetail', chatbot.food.foodDetail);
router.post('/foodLike', chatbot.food.foodLike);
router.post('/failLike', chatbot.food.failLike);
router.post('/foodImage', chatbot.food.foodImage);
router.post('/imageUpload', chatbot.food.imageUpload);
router.post('/foodRandom', chatbot.food.foodRandom);
router.post('/test', chatbot.food.test);

/*
 * basic (기타)
 */
router.post('/homeMenu', chatbot.basic.homeMenu);
// ^Middleware. Make sure to put all the routes which needs authentication below this middleware.

module.exports = router;
