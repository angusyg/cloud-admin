var config = require('../../config').load(),
	request = require('../helpers/proxied-request'),
	service = {};

service.getServerEarList = function(proxy, server, param, callback) {
    request.get(proxy, (param.snapshot === true ? config.artifactory.snapshotUrl : config.artifactory.releaseUrl) + server, function(err, response, body) {
        if (err) return callback(err);
		if (response && response.statusCode === 200) return callback(null, JSON.parse(body));
        callback(new Error('Erreur lors de la récupération des versions des EAR pour le server ' + param.server));
	});
};

module.exports = service;
