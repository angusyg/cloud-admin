(function(angular) {
    'use strict';

    angular.module('cloud.admin.client')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['proxy', '$mdDialog', '$state', 'AuthenticationService', 'ToastService', '$scope'];

    function HomeController(proxy, $mdDialog, $state, AuthenticationService, ToastService, $scope) {
        var vm = this;

        vm.proxy = null;

        vm.doLogout = doLogout;
        vm.showProxyInfos = showProxyInfos;

        $scope.$on('proxy-test', function(event, args) {
            vm.proxy.up = args.up;
        });

        function doLogout() {
            AuthenticationService.logout()
                .then(function() {
                    ToastService.success('Au revoir !');
                    $state.go('app.login');
                })
                .catch(function(error) {
                    ToastService.error('Erreur lors de la déconnexion');
                });
        }

        function showProxyInfos(ev) {
            $mdDialog.show({
                controller: 'DialogProxyController',
                controllerAs: 'dialog',
                templateUrl: 'client/proxy-dialog',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    up: vm.proxy.up
                }
            });
        }

        function init(proxy) {
            vm.proxy = proxy;
        }

        init(proxy);
    }
})(angular);
