'use strict';

const {
  // dsdev configuration @ home
  DS_HOST = '192.168.1.69',
  DS_PORT = 8080,
  DS_TOKEN = 'e0ad6da9aa1cb79337d6b88eb8555706f4785b8dbc61ca0e4ef39b7270a300f0',
  NODE_ENV = 'development',
  PORT = 3030
} = process.env;

module.exports = {
  DS_HOST,
  DS_PORT,
  DS_TOKEN,
  NODE_ENV,
  PORT
};