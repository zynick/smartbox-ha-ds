'use strict';

const bodyParser = require('body-parser');
const debug = require('debug');
const express = require('express');
const http = require('http');
const morgan = require('morgan');

const log = debug('ds:app');
const logError = debug('ds:error');
const routes = require('./routes');
const { PORT } = require('./config.js');


/* Initialize Express */
const app = express();
app.use(morgan('common'));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.text({
  // parse text/plain &
  // parse stupid python input (homeAssistant that does not contain content-type) as a string
  type: req => req.headers['content-type'] === 'text/plain' || req.headers['accept-encoding'] === 'gzip, deflate'
}));
app.use('/', routes);

// normalize environment port into a number, string (named pipe), or false.
const normalizePort = val => {
  const port = parseInt(val, 10);
  return isNaN(port) ? val :
    port >= 0 ? port : false;
};
const port = normalizePort(PORT);
app.set('port', port);


/* Create HTTP server. */
const server = http.createServer(app);

server.listen(port);

server.on('error', err => {
  if (err.syscall !== 'listen') {
    throw err;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (err.code) {
    case 'EACCES':
      logError(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logError(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  log(`Listening on ${bind}`);
});
