(function(angular) {
    'use strict';

    angular.module('cloud.admin.client')
        .factory('HttpBaseUrlInterceptor', HttpBaseUrlInterceptor);

    HttpBaseUrlInterceptor.$inject = ['$injector'];

    function HttpBaseUrlInterceptor($injector) {
        return {
            request: request
        };

        function request(config) {
            var API = $injector.get('API');
            if (!config.url.startsWith('http') && config.url.indexOf('/api') > -1) config.url = API.SERVER_URL + config.url;
            return config;
        }
    }
})(angular);
