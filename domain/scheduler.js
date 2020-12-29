const mailClient = require('../clients/mailclient');

function scheduleMail(sendEmailInput, scheduledTimeUTC){
    console.log('Starting to schedule');
    let now = new Date(new Date().toUTCString());
    let delay =new Date(scheduledTimeUTC).getTime() - now.getTime();
    setTimeout(()=>mailClient(sendEmailInput), delay);
    console.log('Scheduled succesfully');
}

module.exports = scheduleMail;