(function(angular) {
    'use strict';

    angular.module('cloud.admin.client')
        .factory('ProxyService', ProxyService);

    ProxyService.$inject = ['$http', '$q', 'API'];

    function ProxyService($http, $q, API) {
        return {
            test: test
        };

        function test() {
            return $http.get(API.ENDPOINTS.PROXY_TEST.PATH)
                .then(function(response) {
                    return $q.resolve(response.data.up);
                });
        }
    }
})(angular);
