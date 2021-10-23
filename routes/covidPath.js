const express = require('express');
const router = express.Router();

const feedController = require('../controllers/wrapperCovid');
const redisController = require('../controllers/wrapperCovid')
// const config = require('../config/config');
console.log(config.App.newProjEndpoint.testAPI)

// router.get(config.App.newProjEndpoint.testAPI, redisController.getDataFromRedis, feedController.getDB);
router.get(config.App.newProjEndpoint.testAPI, feedController.getDB);
//Covid endpoint

module.exports = router;