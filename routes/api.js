var express = require('express');
var https = require('https');
var router = express.Router();
var connector = require('./dsConnector');


router.get('/', function(req, res, next) {

    let path = req.query.path || '';

    connector(path, function(err, json) {
        if (err) {
          res.json({ ok: false, message: err.message });
        } else {
          res.json(json);
        }
    });

});

module.exports = router;
