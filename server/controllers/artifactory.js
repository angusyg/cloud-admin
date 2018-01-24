var artifactoryService = require('../services/artifactory'),
	config = require('../../config').load(),
	controller = {};

controller.getServerEarList = function(req, res) {
	artifactoryService.getServerEarList(req.user.proxy, req.params.id, req.body, function(err, ears) {
		if (err) return res.status(config.httpStatus.serverError).json({
			error: 'ServerEARListError',
			message: err.message,
			reqId: req.uuid
		});
        return res.status(config.httpStatus.ok).json(ears);
	});
};

module.exports = controller;
