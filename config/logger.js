const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(format.json(),format.timestamp()),
    transports: [
        new transports.File({
            level: 'info',
            dirname: __dirname + '/../logs',
            filename: 'application.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new transports.File({
            level: 'debug',
            dirname: __dirname + '/../logs',
            filename: 'app-debug.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new transports.File({
            level: 'error',
            dirname: __dirname + '/../logs',
            filename: 'app-error.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        })
    ],
    exitOnError: false
});

function createChildLogger(sourceName){
    if(!sourceName){
        logger.alert('Unable to initialise a child logger with empty sourceName');
        throw Error("Missing source name for creating logger");
    }
    return logger.child({ source: sourceName })
}

module.exports = createChildLogger;
