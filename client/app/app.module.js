(function(angular) {
    'use strict';

    angular.module('cloud.admin.client', ['ui.router', 'ngAnimate', 'ngMaterial', 'angular-storage', 'ngMessages'])
        .run(['$transitions', '$log', 'AuthenticationService', function($transitions, $log, AuthenticationService) {
            // secure path for private states
            $transitions.onBefore({
                to: 'app.secure.**'
            }, function(transition) {
                if (!AuthenticationService.isLoggedIn()) {
                    $log.warn('Access to a secure state while not being connected: (fromState: ' + (transition.$from().name ? transition.$from().name : 'index') + ') -> (toState: ' + transition.$to().name + ')');
                    return transition.router.stateService.target('app.login');
                }
            });

            // redirect if already logged in
            $transitions.onBefore({
                to: 'app.login'
            }, function(transition) {
                if (AuthenticationService.isLoggedIn()) {
                    return transition.router.stateService.target('app.secure');
                }
            });
        }]);
})(angular);