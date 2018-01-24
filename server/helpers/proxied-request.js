var request = require('request'),
	config = require('../../config').load(),
	service = {};

service.get = function(proxy, url, callback) {
	var proxyUrl = 'http://' + proxy + ':' + config.proxy.port;
	var proxiedRequest = request.defaults({
		'proxy': proxyUrl
	});
	proxiedRequest.get(url, callback);
};

module.exports = service;
