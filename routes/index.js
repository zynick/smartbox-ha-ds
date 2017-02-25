'use strict';

const router = require('express').Router();
const { NODE_ENV } = require('../config.js');
const controller = require('../controllers/index.js');
const v1 = require('../controllers/v1.js');
const v2 = require('../controllers/v2.js');


if (NODE_ENV !== 'production') {
  router.use(controller.debug);
}

router.get('/', controller.index);

// TODO authentication in order to access api below
// but doing this will break api call from home-assistant...
// but still it's requried for security purposes

// version 1
router.get('/ds/api', v1.getApi);
router.get('/ds/getLastCallSceneName',
  v1.getLastCallSceneId,
  v1.getLastCallSceneName);
router.use('/ds', v1.errorHandler);

// version 2
router.post('/v2/api', v2.postApi);

router.get('/v2/structure',
  v2.structGetReachableGroups,
  v2.structGetScenes,
  v2.structGetDevices,
  v2.structMergeStructure,
  v2.structCleanStructure,
  v2.structResponse
);

router.use(controller.notFound);
router.use(controller.errorHandlerJSON);


module.exports = router;
