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

// TODO create a token and validate the token in order to access api below
// but doing this will break api call from home-assistant...
// but still it's requried for security purposes

// version 1
router.get('/ds/api', ds.getApi);
router.get('/ds/getLastCallSceneName',
  ds.getLastCallSceneId,
  ds.getLastCallSceneName);
router.use('/ds', ds.errorHandler);

// version 2
router.get('/v2/zones', v2.getZones);
router.get('/v2/structure', ...v2.structure);

router.use(controller.notFound);
router.use(controller.errorHandlerJSON);


module.exports = router;
