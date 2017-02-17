'use strict';

const {
  // showroom configuration
  DS_HOST = 'dss.local',
  DS_PORT = 8080,
  DS_TOKEN = '94d0cd933b96e9176bef68f7bd6be746c135c286fa6b58884283ed3eb3bd8956',
  NODE_ENV = 'development',
  PORT = 3030,
  DEBUG = 'ds:*'
} = process.env;

module.exports = {
  DS_HOST,
  DS_PORT,
  DS_TOKEN,
  NODE_ENV,
  PORT,
  DEBUG
};