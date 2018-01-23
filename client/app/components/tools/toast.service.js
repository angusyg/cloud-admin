(function(angular) {
    'use strict';

    angular.module('cloud.admin.client')
        .factory('ToastService', ToastService);

    ToastService.$inject = ['$mdToast'];

    function ToastService($mdToast) {
        return {
            error: error,
            success: success,
            info: info
        };

        function error(message) {
            show('error', message);
        }

        function success(message) {
            show('success', message);
        }

        function info(message) {
            show('info', message);
        }

        function show(level, message) {
            $mdToast.show($mdToast.simple()
                .textContent(message)
                .theme(level + '-toast'));
        }
    }
})(angular);