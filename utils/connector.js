'use strict';

// TODO should move to controller instead
// TODO should move to controller instead
// TODO should move to controller instead

/**
 * Trigger URL to dS server and
 * Ensure connectivity by refresh session token automatically
 */

// copy & modify from https://gitlab.com/smartboxasia/event-server/blob/master/api/dsConnector.js

const debug = require('debug')('app:connector');
const async = require('async');
const https = require('https');

const {
    host,
    port,
    appToken
} = require('../config.json');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // http://stackoverflow.com/a/21961005/1150427

let token;
let lastAccess = 0;


const httpsGet = (url, next) => {
    debug(url);

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

                    debug(JSON.stringify(json));
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

module.exports = (href, next) => {
    async.waterfall([
        (next) => {
            // token is not expired if last used < 60 seconds
            if (lastAccess > Date.now() - 60000) {
                debug(' * skip token validation');
                return next(null, true);
            }

            // check if token expired
            const url = `https://${host}:${port}/json/apartment/getName?token=${token}`;
            httpsGet(url, (err) => next(null, !err));
        },
        (valid, next) => {
            if (valid) {
                return next(); // token not expired, skip
            }

            // refresh (get new) token
            debug(' * refresh token');
            const url = `https://${host}:${port}/json/system/loginApplication?loginToken=${appToken}`;
            httpsGet(url, (err, json) => {
                if (err) {
                    return next(err);
                }
                token = json.result.token;
                next();
            });
        },
        (next) => {
            // query
            const symbol = href.indexOf('?') === -1 ? '?' : '&';
            const url = `https://${host}:${port}${href}${symbol}token=${token}`;
            httpsGet(url, next);
        },
        (json, next) => {
            lastAccess = Date.now();
            next(null, json);
        }
    ], next);
};
