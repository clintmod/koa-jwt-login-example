'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const app = require('./app');

const config = {
  port: process.env.PORT || 9000,
  env: process.env.NODE_ENV
}

app.listen(config.port, config.ip, function () {
  console.log('Koa server listening on %d, in %s mode', config.port, config.env);
});

// Expose app
exports = module.exports = app;