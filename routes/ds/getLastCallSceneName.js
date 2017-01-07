'use strict';

const express = require('express');
const https = require('https');
const router = express.Router();
const connector = require('../../utils/connector');


router.get('/', (req, res) => {

    const {
        id = '',
        groupID = ''
    } = req.query;

    // 1. get last call scene id
    let path = `/json/zone/getLastCalledScene?id=${id}&groupID=${groupID}`;
    connector(path, (err, json) => {
        if (err) {
            return res.json({
                ok: false,
                message: err.message
            });
        }

        if (!json.ok) {
            return res.json(json);
        }

        const scene = json.result.scene;

        // 2. get scene name
        path = `/json/zone/sceneGetName?id=${id}&groupID=${groupID}&sceneNumber=${scene}`;
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

});

module.exports = router;
