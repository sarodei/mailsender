const createError = require('http-errors');
const mailClient = require('../clients/mailclient');
const logger = require('../config/logger')('scheduler.js');

function scheduleMail(sendEmailInput, scheduledTimeUTC){
    logger.log('info', 'Scheduling the mail at:'+scheduledTimeUTC+ ' for requestId:' + sendEmailInput.requestId, sendEmailInput);
    let now = new Date(new Date().toUTCString());
    let delay =new Date(scheduledTimeUTC).getTime() - now.getTime();
    throwErrorOnPastDateTime(delay, scheduledTimeUTC, sendEmailInput.requestId);
    setTimeout(()=> mailClient(sendEmailInput), delay);
    logger.log('info', 'Mail scheduled succesfully at:'+scheduledTimeUTC+ ' for requestId:' + sendEmailInput.requestId, sendEmailInput);
}

function throwErrorOnPastDateTime(delay, scheduledTimeUTC, requestId){
    if(delay < 0){
      logger.log('error', 'Past time are not supported for scheduling. UTC Time provided: ' + scheduledTimeUTC +' for requestId:' + requestId);
      throw createError(400, 'Past time are not supported for scheduling. UTC Time provided: ' + scheduledTimeUTC);
    }
  }

module.exports = scheduleMail;