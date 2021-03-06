const property = {
    'service':{
        'port' : process.env.PORT || 3000
    },
    'log':{
        'isDebugEnabled': true
    },
    'apiInput':{
        'multipleMailDelimiter': ','
    },
    'mailClient': {
        apikey : process.env.SendInBlueAPIKEY,
        senderEmailAddress: 'noreply@example.com'
    }
}

module.exports = property;
