var config = require('../../config').load(),
    request = require('../helpers/proxied-request'),
    service = {};

service.getServerEarList = function(proxy, server, param, callback) {
    var ears = [];
    var serverConfig = config.servers.find(function(element) {
        return element.id === server;
    });
    serverConfig.ears.forEach(function(ear) {
        request.get(proxy, (param.snapshot === true ? config.artifactory.snapshotUrl : config.artifactory.releaseUrl) + ear.path, function(err, response, body) {
            if (err) return callback(err);
            if (response && response.statusCode === 200) {
                var currentEar = {
                    id: ear.name,
                    versions: []
                };
                var responseJson = JSON.parse(body);
                responseJson.forEach(function(element) {
                    currentEar.versions.push(element.version);
                });
                ears.push(currentEar);
            } else return callback(new Error('Erreur lors de la récupération des versions des EAR pour le server ' + param.server));
        });
    });
    callback(null, ears);
};

module.exports = service;