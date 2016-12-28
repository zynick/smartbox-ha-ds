'use strict';

const express = require('express');
const https = require('https');
const router = express.Router();
const connector = require('../../utils/connector');

router.get('/', (req, res) => {

    const path = req.query.path || '';

    connector(path, (err, json) => {
        if (err) {
            return res.json({
                ok: false,
                message: err.message
            });
        }

        res.json(json);
    });

});

module.exports = router;
