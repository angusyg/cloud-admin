var express = require('express'),
    router = express.Router(),
    config = require('../../config').load(),
    logger = require('../helpers/logger').client;

router.post('/:level', function(req, res, next) {
    logger[req.params.level]('[IP:' + req.ip + '] ' + req.body.message);
    res.status(config.httpStatus.noContent).end();
});

module.exports = router;