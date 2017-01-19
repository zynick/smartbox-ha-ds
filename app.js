'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const routes = require('./routes');
const isProd = process.env.NODE_ENV === 'production';


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(morgan('common'));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.text({
    // parse text/plain &
    // parse stupid python input (homeAssistant that does not contain content-type) as a string
    type: req => req.headers['content-type'] === 'text/plain' || req.headers['accept-encoding'] === 'gzip, deflate'
}));
app.use(cookieParser());
app.use('/', routes);


/* 404 & Error Handlers */
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    // hide error in production, show otherwise
    const error = isProd ? {} : err;
    res
        .status(status)
        .render('error', { message, error });
});


module.exports = app;
