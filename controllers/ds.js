'use strict';

const connector = require('../lib/connector');

const getApi = (req, res, next) => {

  connector(req.query.path,
    (err, json) => {
      if (err) {
        return next(err);
      }

      res.json(json);
    });
};

const getLastCallSceneId = (req, res, next) => {

  const { id = '', groupID = '' } = req.query;

  connector(`/json/zone/getLastCalledScene?id=${id}&groupID=${groupID}`,
    (err, json) => {
      if (err) {
        return next(err);
      }

      req.scene = json.result.scene;
      next();
    });
};

const getLastCallSceneName = (req, res, next) => {

  const { id = '', groupID = '' } = req.query;
  const { scene = '' } = req;

  connector(`/json/zone/sceneGetName?id=${id}&groupID=${groupID}&sceneNumber=${scene}`,
    (err, json) => {
      if (err) {
        return next(err);
      }

      res.json(json);
    });
};

const errorHandler = (err, req, res, next) => {
  res.json({ ok: false, message: err.message });
};

module.exports = {
  getApi,
  getLastCallSceneId,
  getLastCallSceneName,
  errorHandler
};
