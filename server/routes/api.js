var express = require('express'),
    appMiddleware = require('../middlewares'),
    users = require('../controllers/users'),
    api = require('../controllers/api'),
    proxy = require('../controllers/proxy'),
    config = require('../../config').load(),
    router = express.Router();

router.get(config.api.list, api.list);

router.post(config.api.login, users.login);
router.get(config.api.refresh, users.refreshToken);

router.use('/secure/*', appMiddleware.loginRequired);
router.get(config.api.logout, users.logout);
router.get(config.api.proxyTest, proxy.test);

module.exports = router;