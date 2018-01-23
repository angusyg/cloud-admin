(function(angular) {
    'use strict';

    angular.module('cloud.admin.client')
        .config(LogDecorator)
        .config(ExceptionHandlerDecorator);

    LogDecorator.$inject = ['$provide'];

    function LogDecorator($provide) {
        $provide.decorator('$log', ['$delegate', '$window', 'API', function($delegate, $window, API) {
            var levels = ['debug', 'info', 'warn', 'error'];
            levels.forEach(function(level) {
                var original = $delegate[level];
                $delegate[level] = function() {
                    var message = Array.prototype.slice.call(arguments);
                    original.apply(null, arguments);
                    $.ajax({
                        type: 'POST',
                        url: API.LOGGER + '/' + level,
                        contentType: 'application/json',
                        data: angular.toJson({
                            url: $window.location.href,
                            message: message
                        })
                    });
                };
            });
            return $delegate;
        }]);
    }

    ExceptionHandlerDecorator.$inject = ['$provide'];

    function ExceptionHandlerDecorator($provide) {
        $provide.decorator('$exceptionHandler', ['$delegate', '$log', function($delegate, $log) {
            return function(exception, cause) {
                $log.error(exception, cause);
            };
        }]);
    }
})(angular);