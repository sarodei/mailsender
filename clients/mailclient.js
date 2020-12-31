const properties = require('../config/properties');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const logger = require('../config/logger')('mailclient.js');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = properties.mailClient.apikey;

async function sendMail(sendSmtpEmailInput){
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = {
        sender: {
            email : properties.mailClient.senderEmailAddress,
            name : sendSmtpEmailInput.sender.name
        },
        to : sendSmtpEmailInput.to,
        subject : sendSmtpEmailInput.subject,
        textContent : sendSmtpEmailInput.textContent,
        cc : sendSmtpEmailInput.cc,
        bcc : sendSmtpEmailInput.bcc
    };
    logger.log('info', 'Sending mail for requestId:' + sendSmtpEmailInput.requestId, sendSmtpEmail);
    let messageId = await apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
      logger.log('info', 'Mail sent succesfully for requestId:' + sendSmtpEmailInput.requestId, data);
      return data.messageId;
    }, function(error) {
      logger.log('error', 'Error sending mail for requestId:' + sendSmtpEmailInput.requestId, error);
      throw error;
    });
    return messageId;
}

module.exports = sendMail;
