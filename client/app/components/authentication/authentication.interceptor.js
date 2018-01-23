(function(angular) {
    'use strict';

    angular.module('cloud.admin.client')
        .factory('AuthenticationInterceptor', AuthenticationInterceptor);

    AuthenticationInterceptor.$inject = ['$q', '$injector'];

    function AuthenticationInterceptor($q, $injector) {
        return {
            request: request,
            responseError: responseError
        };

        function request(config) {
            var AuthenticationService = $injector.get('AuthenticationService');
            if (config.url.indexOf('/api/secure/') > -1) {
                if (!AuthenticationService.isLoggedIn()) {
                    $injector.get('$state').go('app.login');
                    return $q.reject(new Error('Call to secure api endpoint while not authenticated'));
                } else {
                    var API = $injector.get('API');
                    config.headers[API.ACCESS_TOKEN_HEADERNAME] = 'Bearer ' + AuthenticationService.getToken();
                    config.headers[API.REFRESH_TOKEN_HEADERNAME] = AuthenticationService.getRefreshToken();
                }
            }
            return config;
        }

        function responseError(error) {
            if (error.status === 401) {
                var API = $injector.get('API');
                if (error.data.error === API.EXPIRED_TOKEN_ERROR) {
                    var AuthenticationService = $injector.get('AuthenticationService');
                    return AuthenticationService.refreshTokenAndRetry(error);
                } else {
                    $injector.get('$state').go('app.login');
                    return $q.reject(error);
                }
            } else return $q.reject(error);
        }
    }
})(angular);
