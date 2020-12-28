const properties = require('../config/properties');
const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = properties.mailClient.apikey;

function sendMail(sendSmtpEmailInput){
  console.log("Input to client"+sendSmtpEmailInput);
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
    console.log('Sending mail: ' + sendSmtpEmail);
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
      console.log('API called successfully. Returned data: ' + data);
      console.log(data);
    }, function(error) {
      console.error("Error sending mail:"+error);
      console.error(error);
      throw error;
    });
}

module.exports = sendMail;
