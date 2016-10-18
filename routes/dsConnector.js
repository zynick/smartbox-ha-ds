'use strict';

// https://gitlab.com/smartboxasia/event-server/blob/master/api/dsConnector.js

/**
 * Trigger URL to dS server and
 * Ensure connectivity by get/refresh token automatically
 */

var async = require('async');
var https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // http://stackoverflow.com/a/21961005/1150427
var isDevelopment = !process.env.NODE_ENV ? true : process.env.NODE_ENV === 'development';

const HOST = 'dsdev.lan';
const PORT = 8080;
const APP_TOKEN = 'e0ad6da9aa1cb79337d6b88eb8555706f4785b8dbc61ca0e4ef39b7270a300f0';
const HTTP_Timeout = 30 * 10000; // 30 seconds

var token;
var lastAccess = 0;


function _httpsGet(url, next) {
    if (isDevelopment) {
        console.log(`  [dsConnector] ${url}`);
    }
    https
        .get(url, function(res) {
            var data = '';
            res
                .on('data', function(d) {
                    data += d;
                })
                .on('end', function() {
                    if (res.statusCode !== 200) {
                        return next(new Error(`DS Server Response ${res.statusCode}: ${data}`));
                    }
                    var json = JSON.parse(data) || '';
                    if (!json.ok) {
                        return next(new Error(`DS Server Response ${res.statusCode}: ${json.message}`));
                    }
                    if (isDevelopment) {
                        console.log(`  [dsConnector] ${JSON.stringify(json)}`);
                    }
                    next(null, json);
                })
                .on('error', next);
        })
        .on('error', next)
        .on('socket', function(socket) {
            socket.setTimeout(HTTP_Timeout);
            socket.on('timeout', function() {
                if (isDevelopment) {
                    console.log(`  [dsConnector] [TIMEOUT] ${url}`);
                }
                next(new Error(`request timeout: ${url}`));
            });
        });
}

function _isTokenValid(next) {
    // bypass http query if token haven't expire
    if (lastAccess > Date.now() - 60000) {
        console.log(`  [dsConnector] SKIP http token check`);
        return next(null, true);
    }
    console.log(`  [dsConnector] http token check`);
    var url = `https://${HOST}:${PORT}/json/apartment/getName?token=${token}`;
    _httpsGet(url, function(err) {
        next(null, !err);
    });
}

function _refreshToken(next) {
    var url = `https://${HOST}:${PORT}/json/system/loginApplication?loginToken=${APP_TOKEN}`;
    _httpsGet(url, function(err, json) {
        if (err) {
            return next(err);
        }
        token = json.result.token;
        next();
    });
}

module.exports = function(href, next) {
    async.waterfall([
        _isTokenValid,
        function(valid, next) {
            if (valid) {
                lastAccess = Date.now();
                return next();
            }
            _refreshToken(next);
        },
        function(next) {
            var symbol = href.indexOf('?') === -1 ? '?' : '&';
            var url = `https://${HOST}:${PORT}${href}${symbol}token=${token}`;
            _httpsGet(url, next);
        },
        function(json, next) {
            lastAccess = Date.now();
            next(null, json);
        }
    ], next);
};
