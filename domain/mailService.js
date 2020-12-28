const createError = require('http-errors');
const mailClient = require('../clients/mailclient');

function sendMail(input){
    //validate request
    validateMailRequest(input);
    console.log('Validation succesful');
    //Create input for mail client
    let sendEmailInput = mapToSendSmtpEmailInput(input);
    console.log(sendEmailInput);
    //send mail
    mailClient(sendEmailInput);
}

function mapToSendSmtpEmailInput(req){
    let clientInput = {};
    clientInput.sender = { name : req.from };
    clientInput.subject = req.subject;
    clientInput.textContent = req.textContent;
    clientInput.to = req.to.split(';').filter(element => element.trim())
        .map(emailId => ( {email:emailId} ) );
    if (req.cc) {
        clientInput.cc = req.cc.split(';').filter(element => element.trim())
            .map(emailId => ( {email:emailId} ) );
    }
    if (req.bcc) {
        clientInput.bcc = req.bcc.split(';').filter(element => element.trim())
            .map(emailId => ( {email:emailId} ) );
    }
    return clientInput;
}

function validateMailRequest(req){
  throwErrorOnEmptyString(req,'subject');
  throwErrorOnEmptyString(req,'textContent');
  throwErrorOnEmptyString(req,'from');
  throwErrorOnEmptyString(req,'to');
  validateMulitpleEmailField(req.to);
  validateMulitpleEmailField(req.cc);
  validateMulitpleEmailField(req.bcc);
}

function validateMulitpleEmailField(recipients){
  if(recipients){
    recipients.split(';').filter(element => element.trim())
      .forEach(element => { throwErrorOnInvalidEmailAddress(element)});
  }
}

function throwErrorOnEmptyString(obj, stringProperty){
  if(obj && stringProperty && !(obj[stringProperty] && obj[stringProperty].trim())){
    throw createError(400, 'Field should not be empty: ' + stringProperty);
  }
}

function throwErrorOnInvalidEmailAddress(mail) {
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)){
    throw createError(400, 'Invalid email address provided: ' + mail);
  }
}

module.exports = sendMail;
