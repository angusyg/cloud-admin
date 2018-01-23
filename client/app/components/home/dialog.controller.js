(function(angular) {
    'use strict';

    angular.module('cloud.admin.client')
        .controller('DialogProxyController', DialogProxyController);

    DialogProxyController.$inject = ['$mdDialog', 'API', 'ProxyService', 'ToastService', '$rootScope', 'up'];

    function DialogProxyController($mdDialog, API, ProxyService, ToastService, $rootScope, up) {
        var vm = this;

        vm.proxyUp = null;
        vm.proxyZipUrl = API.ENDPOINTS.PROXY_DOWNLOAD.PATH;

        vm.close = close;
        vm.testProxy = testProxy;

        function close() {
            $mdDialog.cancel();
        }

        function testProxy() {
            ProxyService.test()
                .then(function(response) {
                    vm.proxyUp = response;
                    $rootScope.$broadcast('proxy-test', {
                        up: response
                    });
                })
                .catch(function(error) {
                    ToastService.error('Erreur lors du test du proxy');
                });
        }

        function init(proxyUp) {
            vm.proxyUp = proxyUp;
        }

        init(up);
    }
})(angular);
