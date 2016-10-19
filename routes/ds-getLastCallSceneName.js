var express = require('express');
var https = require('https');
var router = express.Router();
var connector = require('./dsConnector');


router.get('/', function(req, res, next) {

    const id = req.query.id || '';
    const groupID = req.query.groupID || '';

    // 1. get last call scene id
    let path = `/json/zone/getLastCalledScene?id=${id}&groupID=${groupID}`;
    connector(path, function(err, json) {
        if (err) {
            return res.json({ ok: false, message: err.message });
        }
        if (!json.ok) {
            return res.json(json);
        }

        const scene = json.result.scene;

        // 2. get scene name
        path = `/json/zone/sceneGetName?id=${id}&groupID=${groupID}&sceneNumber=${scene}`;
        connector(path, function(err, json) {
            if (err) {
                return res.json({ ok: false, message: err.message });
            }
            res.json(json);
        });
    });

});

module.exports = router;
