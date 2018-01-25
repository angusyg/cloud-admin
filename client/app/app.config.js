(function(angular) {
    'use strict';

    angular.module('cloud.admin.client')
        .config(Config);

    Config.$inject = ['$urlRouterProvider', '$httpProvider', '$mdAriaProvider', '$mdThemingProvider'];

    function Config($urlRouterProvider, $httpProvider, $mdAriaProvider, $mdThemingProvider) {
        $urlRouterProvider.otherwise('/cloud/login');
        //$httpProvider.interceptors.push('HttpBaseUrlInterceptor');
        $httpProvider.interceptors.push('HttpErrorInterceptor');
        $httpProvider.interceptors.push('AuthenticationInterceptor');
        $mdAriaProvider.disableWarnings();
        $mdThemingProvider
            .theme('default')
            .primaryPalette('indigo')
            .accentPalette('light-green')
            .warnPalette('red')
            .backgroundPalette('grey');
    }
})(angular);