var usersService = require('../services/users'),
    jsonwebtoken = require("jsonwebtoken"),
    config = require('../../config').load(),
    logger = require('../helpers/logger').server,
    controller = {};

controller.login = function(req, res) {
    usersService.login(req.body, function(err, tokens) {
        if (err) throw err;
        if (tokens) {
            res.status(config.httpStatus.ok).json(tokens);
        } else res.status(config.httpStatus.unauthorizedAccess).json({
            error: 'AuthenticationError',
            message: 'Bad credentials',
            reqId: req.uuid
        });
    });
};

controller.logout = function(req, res) {
    checkTokens(req, res, function(err, user) {
        if (err) {
            logger.error('[Request:' + req.uuid + '][IP:' + req.ip + '] - ' + req.method + ' "' + req.originalUrl + '" - ' + 'JWT Token verify error: ' + err.name + (err.message ? ' - ' + err.message : ''));
            res.status(config.httpStatus.noContent).end();
        } else usersService.logout(req.headers[config.token.refresh.headerName], user.login, function(err) {
            if (err) logger.error('[Request:' + req.uuid + '][IP:' + req.ip + '] - ' + req.method + ' "' + req.originalUrl + '" - ' + 'Logout error: ' + err.name + (err.message ? ' - ' + err.message : ''));
            res.status(config.httpStatus.noContent).end();
        });
    });
};

controller.refreshToken = function(req, res) {
    checkTokens(req, res, function(err, user) {
        if (err) {
            logger.error('[Request:' + req.uuid + '][IP:' + req.ip + '] - ' + req.method + ' "' + req.originalUrl + '" - ' + 'JWT Token verify error: ' + err.name + (err.message ? ' - ' + err.message : ''));
            if (err.name === 'NoAccessToken') res.status(config.httpStatus.unauthorizedAccess).json({
                error: 'RefreshingAuthenticationError',
                message: 'No access token to refresh found in headers',
                reqId: req.uuid
            });
            else res.status(config.httpStatus.unauthorizedAccess).json({
                error: 'RefreshingAuthenticationError',
                message: 'Bad access token in headers',
                reqId: req.uuid
            });
        } else {
            usersService.refreshLogin(req.headers[config.token.refresh.headerName], user.login, function(err, tokens) {
                if (err) throw err;
                if (tokens) res.status(config.httpStatus.ok).json(tokens);
                else res.status(config.httpStatus.unauthorizedAccess).json({
                    error: 'RefreshingAuthenticationError',
                    message: 'No valid refresh token found in headers',
                    reqId: req.uuid
                });
            });
        }
    });
};

var checkTokens = function(req, res, callback) {
    if (req.headers && req.headers[config.token.access.headerName] && req.headers[config.token.access.headerName].split(' ')[0] === 'Bearer' && req.headers[config.token.refresh.headerName]) {
        jsonwebtoken.verify(req.headers[config.token.access.headerName].split(' ')[1], config.token.secretKey, function(err, decode) {
            if ((err && err.name === config.token.access.expiredError) || !err) {
                var user = jsonwebtoken.decode(req.headers[config.token.access.headerName].split(' ')[1]);
                callback(null, user);
            } else callback(err);
        });
    } else callback({
        name: 'NoAccessToken'
    }, null);
};

module.exports = controller;