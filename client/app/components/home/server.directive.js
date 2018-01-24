(function(angular) {
	'use strict';

	angular.module('cloud.admin.client')
		.directive('serverSection', ServerSection)
		.directive('snapshotSection', SnapshotSection)
		.directive('artifactorySection', ArtifactorySection);

	ServerSection.$inject = [];

	function ServerSection() {
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
						scope.$emit('server-changed', {
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
						scope.$emit('snapshot-changed', {
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

	ArtifactorySection.$inject = ['API', 'ArtifactoryService'];

	function ArtifactorySection(API, ArtifactoryService) {
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
				scope.addEAR = function(ear) {
					scope.config.ears.push(ear);
				};
				scope.goToBeforeStep = function() {
					scope.gotobeforestep(scope.step.id);
				};
				scope.goToNextStep = function() {
					scope.gotonextstep(scope.step.id);
				};
                scope.getServerEarList = function() {
                    ArtifactoryService.getServerEarList(scope.config.server.id, scope.config.snapshot)
                    .then(function(response) {
                        console.log('RESPONSE ', response);
                    })
                    .catch(function(error) {
                        console.error('ERRRRROOOORRRRR', error);
                    });
                }
				scope.$on('server-changed', function(event, args) {
					// Refresh ears list
				});
				scope.$on('snapshot-changed', function(event, args) {
					if (args.current === true) {
						// Refresh SNAPSHOT
					} else {
                        // Refresh RELEASE
					}
				});
			}
		};
	}

})(angular);
