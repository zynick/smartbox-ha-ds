'use strict';

/**
 * Trigger URL to dS server and
 * Ensure connectivity by refresh session token automatically
 */

// copy & modify from https://gitlab.com/smartboxasia/event-server/blob/master/api/dsConnector.js

const async = require('async');
const https = require('https');
const log = require('debug')('ds:connector');

const { DS_HOST, DS_PORT, DS_TOKEN } = require('../config.js');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // http://stackoverflow.com/a/21961005/1150427

let sessionToken;
let lastAccess = 0;

const _httpsGet = (url, next) => {
  log(url);

  https
    .get(url, (res) => {
      let data = '';
      res
        .on('data', d => data += d)
        .on('end', () => {
          if (res.statusCode !== 200) {
            return next(new Error(`dS Response ${res.statusCode}: ${data}`));
          }

          const json = JSON.parse(data) || '';
          if (!json.ok) {
            return next(new Error(`dS Response ${res.statusCode}: ${json.message}`));
          }

          log(JSON.stringify(json));
          next(null, json);
        })
        .on('error', next);
    })
    .on('error', next)
    .on('socket', (socket) => {
      socket.setTimeout(30 * 1000); // 30 seconds;
      socket.on('timeout', () => next(new Error(`request timeout: ${url}`)));
    });
};

const stackCheckToken = (path, next) => {
  // token is not expired if last used < 60 seconds
  if (lastAccess > Date.now() - 60000) {
    return next(null, path, true);
  }

  // check if session token expired
  const url = `https://${DS_HOST}:${DS_PORT}/json/apartment/getName?token=${sessionToken}`;
  _httpsGet(url, err => next(null, path, !err));
};

const stackRefreshToken = (path, valid, next) => {
  if (valid) {
    // session token not expired, skip
    return next(null, path);
  }

  // refresh session token
  const url = `https://${DS_HOST}:${DS_PORT}/json/system/loginApplication?loginToken=${DS_TOKEN}`;
  _httpsGet(url, (err, json) => {
    if (err) {
      return next(err);
    }
    sessionToken = json.result.token;
    next(null, path);
  });
};

const stackHttpQuery = (path, next) => {
  // query
  const symbol = path.indexOf('?') === -1 ? '?' : '&';
  const url = `https://${DS_HOST}:${DS_PORT}${path}${symbol}token=${sessionToken}`;
  _httpsGet(url, next);
};

const stackUpdateLastAccess = (json, next) => {
  lastAccess = Date.now();
  next(null, json);
};

module.exports = (path, next) => {
  async.waterfall([
      next => next(null, path),
      stackCheckToken,
      stackRefreshToken,
      stackHttpQuery,
      stackUpdateLastAccess
    ],
    next);
};
