(function(angular) {
    'use strict';

    angular.module('cloud.admin.client')
        .directive('serverSection', ServerSection)
        .directive('snapshotSection', SnapshotSection)
        .directive('artifactorySection', ArtifactorySection);

    ServerSection.$inject = ['$rootScope'];

    function ServerSection($rootScope) {
        return {
            restrict: 'E',
            templateUrl: '/client/server-section',
            scope: {
                flow: '=',
                step: '=',
                servers: '=',
                currentflowstep: '=',
                config: '=',
                gotonextstep: '='
            },
            link: function(scope, elements, attributes) {
                scope.isVisible = function() {
                    var index = scope.flow.findIndex(function(element) {
                        return element.id === scope.step.id;
                    });
                    return index === scope.currentflowstep;
                };
                scope.selectServer = function(server) {
                    if (scope.config.server !== server) {
                        $rootScope.$broadcast('server-changed', {
                            previous: scope.config.server,
                            current: server
                        });
                        scope.config.server = server;
                    }
                };
                scope.goToNextStep = function() {
                    scope.gotonextstep(scope.step.id);
                };
            }
        };
    }

    SnapshotSection.$inject = [];

    function SnapshotSection() {
        return {
            restrict: 'E',
            templateUrl: '/client/snapshot-section',
            scope: {
                flow: '=',
                step: '=',
                currentflowstep: '=',
                config: '=',
                gotobeforestep: '=',
                gotonextstep: '='
            },
            link: function(scope, elements, attributes) {
                scope.isVisible = function() {
                    var index = scope.flow.findIndex(function(element) {
                        return element.id === scope.step.id;
                    });
                    return index === scope.currentflowstep;
                };
                scope.selectSnapshot = function(snapshot) {
                    if (scope.config.snapshot !== snapshot) {
                        scope.$broadcast('snapshot-changed', {
                            previous: scope.config.snapshot,
                            current: snapshot
                        });
                        scope.config.snapshot = snapshot;
                    }
                };
                scope.goToBeforeStep = function() {
                    scope.gotobeforestep(scope.step.id);
                };
                scope.goToNextStep = function() {
                    scope.gotonextstep(scope.step.id);
                };
            }
        };
    }

    ArtifactorySection.$inject = ['$rootScope', 'API', 'ArtifactoryService', 'ToastService'];

    function ArtifactorySection($rootScope, API, ArtifactoryService, ToastService) {
        return {
            restrict: 'E',
            templateUrl: '/client/artifactory-section',
            scope: {
                flow: '=',
                step: '=',
                currentflowstep: '=',
                config: '=',
                gotobeforestep: '=',
                gotonextstep: '='
            },
            link: function(scope, elements, attributes) {
                scope.isVisible = function() {
                    var index = scope.flow.findIndex(function(element) {
                        return element.id === scope.step.id;
                    });
                    return index === scope.currentflowstep;
                };
                scope.addEAR = function(id, version) {
                    scope.config.ears.push({
                        id: id,
                        version: version
                    });
                };
                scope.goToBeforeStep = function() {
                    scope.gotobeforestep(scope.step.id);
                };
                scope.goToNextStep = function() {
                    scope.gotonextstep(scope.step.id);
                };
                $rootScope.$on('server-changed', function(event, args) {
                    refresh();
                });
                $rootScope.$on('snapshot-changed', function(event, args) {
                    refresh();
                });

                function refresh() {
                    if (scope.config.snapshot && scope.config.server) {
                        ArtifactoryService.getServerEarList(scope.config.server.id, scope.config.snapshot)
                            .then(function(response) {
                                scope.ears = response;
                            })
                            .catch(function(error) {
                                scope.ears = [];
                                ToastService.error('Erreur lors de la récupération de la liste des EARS du server');
                            });
                    }
                }
            }
        };
    }

})(angular);