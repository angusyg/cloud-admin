var winston = require('winston'),
    config = require('../../config').load();

winston.emitErrs = false;

var loggerServer = new winston.Logger({
    transports: [
        new(require('winston-daily-rotate-file'))(config.log.server.file),
        new winston.transports.Console(config.log.server.console)
    ],
    exitOnError: config.log.exitOnError
});

var loggerClient = new winston.Logger({
    transports: [
        new(require('winston-daily-rotate-file'))(config.log.client.file),
        new winston.transports.Console(config.log.client.console)
    ],
    exitOnError: config.log.exitOnError
});

module.exports = {
    server: loggerServer,
    client: loggerClient
};