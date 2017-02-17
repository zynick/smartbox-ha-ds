'use strict';

const router = require('express').Router();
const { NODE_ENV } = require('../config.js');
const controller = require('../controllers/index.js');


if (NODE_ENV !== 'production') {
    router.use(controller.debug);
}

router.get('/', controller.index);
router.use('/ds', require('./ds'));
router.use('/v2', require('./v2'));
router.use(controller.notFound);
router.use(controller.errorHandlerJSON);


module.exports = router;
