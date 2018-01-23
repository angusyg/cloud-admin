// includes
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    sassMiddleware = require('node-sass-middleware'),
    helmet = require('helmet'),
    cors = require('cors'),
    // custom middlewares
    appMiddleware = require('./server/middlewares'),
    // modules routes
    apiRoute = require('./server/routes/api'),
    clientRoute = require('./server/routes/client'),
    loggerRoute = require('./server/routes/logger'),
    config = require('./config').load();

var app = express();

// configuration
app.set('config', config);

// view configuration
app.set('views', path.join(__dirname, 'client', 'views', 'pug'));
app.set('view engine', 'pug');

// middlewares
app.use(appMiddleware.generateRequestUUID);
app.use(favicon(path.join(__dirname, 'client', 'public', 'favicon.ico')));
app.use(helmet());
app.use(cors(config.crossOrigin));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(sassMiddleware({
    src: path.join(__dirname, 'client', 'views', 'stylesheets'),
    dest: path.join(__dirname, 'client', 'public', 'stylesheets'),
    indentedSyntax: true,
    sourceMap: true,
    prefix: '/stylesheets'
}));
app.use(express.static(path.join(__dirname, 'client', 'public')));

// map modules routes
app.use('/', clientRoute);
app.use('/api', apiRoute);
app.use('/logger', loggerRoute);

app.use(appMiddleware.errorMapper);
app.use(appMiddleware.errorHandler);

module.exports = app;