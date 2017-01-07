'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Assistant - digitalSTROM API'
    });
});

router.use('/ds', require('./ds'));
router.use('/v2', require('./v2'));

module.exports = router;
