var proxyService = require('../services/proxy'),
    config = require('../../config').load(),
    logger = require('../helpers/logger').server,
    controller = {};

controller.test = function(req, res) {
    proxyService.test(req.user.proxy, function(err, available) {
        if (err) throw err;
        res.status(config.httpStatus.ok).json({
            up: available
        });
    });
};

module.exports = controller;
