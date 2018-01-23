var config = require('../../config').load(),
    controller = {};

controller.list = function(req, res) {
    var srv = config.apiServer.host + (config.apiServer.port ? ':' + config.apiServer.port : '');
    var api = {
        SERVER_URL: srv,
        ACCESS_TOKEN_HEADERNAME: config.token.access.headerName,
        REFRESH_TOKEN_HEADERNAME: config.token.refresh.headerName,
        EXPIRED_TOKEN_ERROR: config.token.access.expiredError,
        LOGGER: config.api.logger,
        ENDPOINTS: {
            LOGIN: {
                PATH: srv + config.api.base + config.api.login,
                METHOD: 'POST'
            },
            LOGOUT: {
                PATH: srv + config.api.base + config.api.logout,
                METHOD: 'GET'
            },
            REFRESHTOKEN: {
                PATH: srv + config.api.base + config.api.refresh,
                METHOD: 'GET'
            },
            PROXY_DOWNLOAD: {
                PATH: srv + config.proxy.zipFile,
                METHOD: 'GET'
            },
            PROXY_TEST: {
                PATH: srv + config.api.base + config.api.proxyTest,
                METHOD: 'GET'
            },
        }
    };
    return res.status(config.httpStatus.ok).json(api);
};

module.exports = controller;