var uuidv4 = require('uuid/v4'),
    path = require('path'),
    fs = require('fs'),
    tsFormat = function() {
        return (new Date()).toLocaleString();
    },
    logFolder = function() {
        var folder = path.join(__dirname, 'logs');
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
        return folder;
    },
    whitelistOrigins = ['http://localhost:8080', 'http://127.0.0.1:8080'],
    crossOrigin = {
        origin: function(origin, callback) {
            if (whitelistOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
        maxAge: 600
    },
    expirationTimeAccessToken = 60 * 60,
    expirationTimeRefreshToken = 24 * 60 * 60,
    httpStatus = {
        serverError: 500,
        unauthorizedAccess: 401,
        unauthorizedOperation: 403,
        notFound: 404,
        ok: 200,
        noContent: 204
    },
    token = {
        access: {
            expirationTime: expirationTimeAccessToken,
            headerName: 'authorization',
            expiredError: 'TokenExpiredError'
        },
        refresh: {
            expirationTime: expirationTimeRefreshToken,
            headerName: 'refreshToken'
        },
        saltFactor: 10,
        secretKey: 'PROBTP-CLOUD-ADMIN-OPENSTACK2018'
    },
    api = {
        base: '/api',
        list: '/list',
        logger: '/logger',
        login: '/auth',
        logout: '/secure/logout',
        proxyTest: '/secure/proxy/test',
        refresh: '/auth/refresh'
    },
    proxy = {
        port: 8888,
        zipFile: '/proxy.zip'
    },
    log = {
        server: {
            file: {
                level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
                filename: logFolder() + '/-server.log',
                datePattern: 'dd-MM-yyyy',
                prepend: true,
                handleExceptions: true,
                json: true,
                maxsize: 5242880,
                maxFiles: 5,
                colorize: false,
                maxDays: 7,
                timestamp: tsFormat
            },
            console: {
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true,
                timestamp: tsFormat
            },
            exitOnError: false
        },
        client: {
            file: {
                level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
                filename: logFolder() + '/-client.log',
                datePattern: 'dd-MM-yyyy',
                prepend: true,
                handleExceptions: true,
                json: true,
                maxsize: 5242880,
                maxFiles: 5,
                colorize: false,
                maxDays: 7,
                timestamp: tsFormat
            },
            console: {
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true,
                timestamp: tsFormat
            },
            exitOnError: false
        }
    },
    cfg = {
        development: {
            server: {
                host: 'http://localhost',
                port: 8080
            },
            apiServer: {
                host: 'http://localhost',
                port: 8080
            },
            log: log,
            token: token,
            api: api,
            proxy: proxy,
            httpStatus: httpStatus
        },
        production: {
            server: {
                host: 'http://localhost',
                port: 8080
            },
            apiServer: {
                host: 'http://localhost',
                port: 8080
            },
            log: log,
            token: token,
            api: api,
            proxy: proxy,
            httpStatus: httpStatus
        }
    };

module.exports = {
    load: function() {
        var env = process.env.NODE_ENV || 'development';
        var config = cfg[env];
        return config;
    }
};
