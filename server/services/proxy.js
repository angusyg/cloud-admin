var config = require('../../config').load(),
    tcpp = require('tcp-ping'),
    service = {};

service.test = function(proxy, callback) {
    tcpp.ping({
        address: proxy,
        port: config.proxy.port,
        attempts: 1,
        timeout: 5000
    }, function(err, data) {
        if (err) return callback(err);
        var available = data.min !== undefined;
        callback(null, available);
    });
};


module.exports = service;