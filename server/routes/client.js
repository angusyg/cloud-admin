var express = require('express'),
    config = require('../../config').load(),
    router = express.Router();

// index
router.get('/', function(req, res, next) {
    res.render('index', {
        client: process.env.NODE_ENV === 'production' ? 'client.min.js' : 'client.js',
        apiListUrl: config.apiServer.host + (config.apiServer.port ? ':' + config.apiServer.port : '') + config.api.base + config.api.list
    });
});

// page of angular client
router.get('/client/:page', function(req, res, next) {
    res.render(req.params.page);
});

module.exports = router;