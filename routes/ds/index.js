'use strict';

const express = require('express');
const router = express.Router();

const api = require('./api');
const getLastCallSceneName = require('./getLastCallSceneName');

router.use('/api', api);
router.use('/getLastCallSceneName', getLastCallSceneName);

module.exports = router;