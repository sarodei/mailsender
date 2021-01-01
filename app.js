const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morganLogger = require('morgan');
const fs = require('fs');
const { v1: uuidv1 } = require('uuid');
const logger = require('./config/logger')('app.js');

const mailRouter = require('./routes/mailApi');

const app = express();

//append request id to each request
app.use(function(req, res, next) {
  req.headers['X-API-Request'] = uuidv1(); 
  next();
});

app.use(morganLogger('combined', { stream: fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' }) }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/web', express.static(path.join(__dirname, 'public')));

//routers
app.use('/mail', mailRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  let status = err.status || 500
  res.status(status);
  let message = err.message || 'Servers are facing some issues. Please try later.';
  logger.log('error', 'Request failed for requestId:' + req.headers['X-API-Request'], err);
  res.send({result: 'Failed', requestId: req.headers['X-API-Request'], message: message});
});

module.exports = app;
