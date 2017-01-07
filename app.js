'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const dsApi = require('./routes/ds/api');
const dsGetLastCallSceneName = require('./routes/ds/getLastCallSceneName');
const dsProcessStructure = require('./routes/ds/processStructure');
const apiv2 = require('./routes/v2');

const app = express();


/* View Engine Setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


/* App Stacks */
app.use(logger('dev'));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ // parse application/x-www-form-urlencoded
    extended: false
}));
// parse text/plain
// parse stupid python input (homeAssistant that does not contain content-type) as a string
app.use(bodyParser.text({
    type: req => req.headers['content-type'] === 'text/plain' || req.headers['accept-encoding'] === 'gzip, deflate'
}));
app.use(cookieParser());
app.use('/', index);
app.use('/ds/api', dsApi);
app.use('/ds/getLastCallSceneName', dsGetLastCallSceneName);
app.use('/ds/processStructure', dsProcessStructure);
app.use('/v2', apiv2);


/* Catch 404 and Forward to Error Handler */
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


/* Error Handlers */
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    // only print stacktrace in development, hide in production
    err = app.get('env') === 'development' ? err : {};
    res.render('error', {
        message: err.message,
        error: err
    });
});


module.exports = app;
