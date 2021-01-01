const createError = require('http-errors');
const mailClient = require('../clients/mailclient');
const logger = require('../config/logger')('scheduler.js');

Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function scheduleMail(sendEmailInput, scheduledTimeUTC) {
  logger.log('info', 'Scheduling the mail at:' + scheduledTimeUTC + ' for requestId:' + sendEmailInput.requestId, sendEmailInput);
  let now = new Date(new Date().toUTCString());
  let scheduledDateTime = new Date(scheduledTimeUTC);
  let delay = scheduledDateTime.getTime() - now.getTime();
  throwErrorOnPastDateTime(delay, scheduledTimeUTC, sendEmailInput.requestId);
  throwErrorOnDateTimeGreaterThan24Days(now, scheduledDateTime, sendEmailInput.requestId);
  setTimeout(() => mailClient(sendEmailInput), delay);
  logger.log('info', 'Mail scheduled succesfully at:' + scheduledTimeUTC + ' for requestId:' + sendEmailInput.requestId, sendEmailInput);
}

function throwErrorOnPastDateTime(delay, scheduledTimeUTC, requestId) {
  if (delay < 0) {
    logger.log('error', 'Past time are not supported for scheduling. UTC Time provided: ' + scheduledTimeUTC + ' for requestId:' + requestId);
    throw createError(400, 'Past time are not supported for scheduling. UTC Time provided: ' + scheduledTimeUTC);
  }
}

function throwErrorOnDateTimeGreaterThan24Days(now, scheduledTimeUTC, requestId) {
  if (now.addDays(24).getTime() - scheduledTimeUTC.getTime() < 0) {
    logger.log('error', 'Scheduled date cannot be more than 24 days from now. UTC Time provided: ' + scheduledTimeUTC + ' for requestId:' + requestId);
    throw createError(400, 'Scheduled date cannot be more than 24 days from now. UTC Time provided: ' + scheduledTimeUTC);
  }
}

module.exports = scheduleMail;