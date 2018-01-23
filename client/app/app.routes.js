(function(angular) {
    'use strict';

    angular.module('cloud.admin.client')
        .config(routing);

    routing.$inject = ['$stateProvider'];

    function routing($stateProvider) {
        var templateState = {
            name: 'app',
            url: '/cloud'
        };

        var authState = {
            name: 'app.login',
            url: '/login',
            views: {
                'content@': {
                    templateUrl: '/client/login',
                    controller: 'LoginController',
                    controllerAs: 'login'
                }
            }
        };

        var homeState = {
            name: 'app.secure',
            url: '/app',
            views: {
                'content@': {
                    templateUrl: '/client/home',
                    controller: 'HomeController',
                    controllerAs: 'home'
                }
            },
            resolve: {
                proxy: ['AuthenticationService', 'Helper', 'ProxyService', 'ToastService', function(AuthenticationService, Helper, ProxyService, ToastService) {
                    var proxy = {
                        host: Helper.decodeToken(AuthenticationService.getToken()).proxy
                    };
                    ProxyService.test()
                        .then(function(response) {
                            proxy.up = response;
                        })
                        .catch(function(error) {
                            ToastService.error('Erreur lors du test du proxy');
                            throw error;
                        });
                    return proxy;
                }]
            }
        };

        $stateProvider.state(templateState);
        $stateProvider.state(authState);
        $stateProvider.state(homeState);
    }
})(angular);
