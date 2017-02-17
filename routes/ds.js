'use strict';

const router = require('express').Router();
const connector = require('../lib/connector');

router.get('/api', (req, res) => {

  const { path = '' } = req.query;

  connector(path, (err, json) => {
    if (err) {
      return res.json({ ok: false, message: err.message });
    }

    res.json(json);
  });

});


router.get('/getLastCallSceneName', (req, res) => {

  const { id = '', groupID = '' } = req.query;

  // 1. get last call scene id
  let path = `/json/zone/getLastCalledScene?id=${id}&groupID=${groupID}`;
  connector(path, (err, json) => {
    if (err) {
      return res.json({ ok: false, message: err.message });
    }

    const { scene } = json.result;

    // 2. get scene name
    path = `/json/zone/sceneGetName?id=${id}&groupID=${groupID}&sceneNumber=${scene}`;
    connector(path, (err, json) => {
      if (err) {
        return res.json({ ok: false, message: err.message });
      }

      res.json(json);
    });
  });

});

module.exports = router;
