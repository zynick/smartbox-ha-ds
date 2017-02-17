'use strict';

const router = require('express').Router();
const { NODE_ENV } = require('../config.js');
const controller = require('../controllers/index.js');
const ds = require('../controllers/ds.js');
const v2 = require('../controllers/v2.js');


if (NODE_ENV !== 'production') {
    router.use(controller.debug);
}

router.get('/', controller.index);

// version 1
router.get('/ds/api', ds.getApi);
router.get('/ds/getLastCallSceneName', ds.getLastCallSceneId, ds.getLastCallSceneName);
router.use('/ds', ds.errorHandler);

// version 2
router.use('/v2/zones', v2.getZones);

router.use(controller.notFound);
router.use(controller.errorHandlerJSON);


module.exports = router;
