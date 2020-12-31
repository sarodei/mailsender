const properties = require('../config/properties');
const createError = require('http-errors');
const mailClient = require('../clients/mailclient');
const scheduleMail = require('./scheduler');
const moment = require('moment');
const logger = require('../config/logger')('mailService.js');

async function sendMail(input, requestId){
    //validate request
    validateMailRequest(input, requestId);
    //Create input for mail client
    let sendEmailInput = mapToSendSmtpEmailInput(input, requestId);
    if(input.scheduleMail && input.scheduledTimeUTC){
      scheduleMail(sendEmailInput, input.scheduledTimeUTC);
      return {result: 'Succesful', requestId: requestId, message: 'Scheduled Succesfully'};
    }else{
      //send mail
      let messageId = await mailClient(sendEmailInput);
      return {result: 'Succesful', requestId: requestId, messageId: messageId, message: 'Mail Sent Succesfully'};
    }
}

function mapToSendSmtpEmailInput(req, requestId){
    let clientInput = {};
    clientInput.requestId = requestId;
    clientInput.sender = { name : req.from };
    clientInput.subject = req.subject;
    clientInput.textContent = req.textContent;
    clientInput.to = req.to.split(properties.apiInput.multipleMailDelimiter).filter(element => element.trim())
        .map(emailId => ( {email:emailId} ) );
    if (req.cc) {
        clientInput.cc = req.cc.split(properties.apiInput.multipleMailDelimiter).filter(element => element.trim())
            .map(emailId => ( {email:emailId} ) );
    }
    if (req.bcc) {
        clientInput.bcc = req.bcc.split(properties.apiInput.multipleMailDelimiter).filter(element => element.trim())
            .map(emailId => ( {email:emailId} ) );
    }
    return clientInput;
}

function validateMailRequest(req, requestId){
  logger.log('debug', 'Validating the mail request for requestId:' + requestId);
  throwErrorOnEmptyString(req,'subject', requestId);
  throwErrorOnEmptyString(req,'textContent', requestId);
  throwErrorOnEmptyString(req,'from', requestId);
  throwErrorOnEmptyString(req,'to', requestId);
  validateMulitpleEmailField(req.to, requestId);
  validateMulitpleEmailField(req.cc, requestId);
  validateMulitpleEmailField(req.bcc, requestId);
  if(req.scheduleMail){
    throwErrorOnEmptyString(req,'scheduledTimeUTC', requestId);
    throwErrorOnInvalidISODate(req, 'scheduledTimeUTC', requestId);
  }
  logger.log('debug', 'Validating the mail request finished for requestId:' + requestId);
}

function validateMulitpleEmailField(recipients, requestId){
  if(recipients){
    recipients.split(properties.apiInput.multipleMailDelimiter).filter(element => element.trim())
      .forEach(element => { throwErrorOnInvalidEmailAddress(element, requestId)});
  }
}

function throwErrorOnEmptyString(obj, stringProperty, requestId){
  if(obj && stringProperty && !(obj[stringProperty] && obj[stringProperty].trim())){
    logger.log('error', 'Empty field provided: ' + stringProperty +' for requestId:' + requestId);
    throw createError(400, 'Field should not be empty: ' + stringProperty);
  }
}

function throwErrorOnInvalidEmailAddress(mail, requestId) {
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)){
    logger.log('error', 'Invalid field provided: ' + mail +' for requestId:' + requestId);
    throw createError(400, 'Invalid email address provided: ' + mail);
  }
}

function throwErrorOnInvalidISODate(obj, stringProperty, requestId){
  if(!moment(obj[stringProperty], moment.ISO_8601, true).isValid()){
    logger.log('error', 'Invalid time provided: ' + stringProperty +' for requestId:' + requestId);
    throw createError(400, 'Time provided is not a valid ISO date: ' + stringProperty);
  }
}

module.exports = sendMail;
