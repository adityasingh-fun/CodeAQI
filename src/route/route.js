const express = require('express');
const requestController = require('../controllers/requestController.js');

const router = express.Router();

// router to get data based on city name
router.post('/getCity', requestController.gettingCities);

// API to get nearest five locations based on latitude and longitude passed
router.post('/getNearestLocations', requestController.getNearestLocations);

// API to get one day historic Data 

// API to get weekly historic Data
// router.get('/oneWeekData',)

// API to get on month historic Data

router.get('/checkingCronLogs',requestController.cronLogs);

// router to test Linear functions to calculate aqi india data
router.get('/testingLinearWorking',requestController.testingLinearWorking);

// router for testing AQI working fine 
router.get('/aqiIn',requestController.aqiIn);

// router to check Dominent pollutant
router.get('/checkingDominentPollutant',requestController.checkingDominentPollutant);

router.get('/allAQIsInDatabase',requestController.allAQIsInDatabase);

module.exports = router;