require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./src/routes');

const { globalErrorHandler } = require('./src/utils/error');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  app.use(routes);

  app.get('/ping', (req, res) => {
    res.json({ message: 'pong!' });
  });

  app.all('*', (req, res, next) => {
    const err = new Error(`Can't fine ${req.originalUrl} on this server!`);

    err.statuscode = 404;

    next(err);
  });

  app.use(globalErrorHandler);

  return app;
};

module.exports = { createApp };
