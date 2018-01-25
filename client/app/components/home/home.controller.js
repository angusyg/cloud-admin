(function(angular) {
    'use strict';

    angular.module('cloud.admin.client')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['proxy', '$mdDialog', '$state', 'AuthenticationService', 'ToastService', '$scope', 'Helper', '$location', '$anchorScroll', 'API'];

    function HomeController(proxy, $mdDialog, $state, AuthenticationService, ToastService, $scope, Helper, $location, $anchorScroll, API) {
        var vm = this;

        vm.proxy = null;
        vm.config = {
            server: null,
            snapshot: null
        };
        vm.steps = {
            server: {
                id: 'server'
            },
            snapshot: {
                id: 'snapshot'
            },
            artifactory: {
                id: 'artifactory'
            },
            end: {
                id: 'end'
            }
        };
        vm.flows = {
            deployment: [vm.steps.server, vm.steps.snapshot, vm.steps.artifactory, vm.steps.end]
        };
        vm.currentFlow = {};
        vm.currentFlowStep = 0;
        vm.servers = API.SERVERS;

        vm.doLogout = doLogout;
        vm.goToBeforeStep = goToBeforeStep;
        vm.goToNextStep = goToNextStep;
        vm.selectFlow = selectFlow;
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

        function selectFlow(flow) {
            vm.currentFlow = vm.flows[flow];
        }

        function scrollTo(x) {
            //$location.hash(x);
            //$anchorScroll();
        }

        function goToBeforeStep(stepId) {
            var index = getFlowIndexOfStep(stepId);
            if (index > 0) {
                vm.currentFlowStep = index - 1;
                scrollTo(vm.currentFlow[vm.currentFlowStep].id);
                $scope.$broadcast('step-changed', vm.currentFlowStep);
            }
        }

        function goToNextStep(stepId) {
            var index = getFlowIndexOfStep(stepId);
            if (vm.currentFlow.length > index) {
                vm.currentFlowStep = index + 1;
                scrollTo(vm.currentFlow[vm.currentFlowStep].id);
                $scope.$broadcast('step-changed', vm.currentFlowStep);
            }
        }

        function getFlowIndexOfStep(stepId) {
            return vm.currentFlow.findIndex(function(element) {
                return element.id === stepId;
            });
        }

        function init(proxy) {
            vm.proxy = proxy;
            vm.currentFlow = vm.flows.deployment;
        }

        init(proxy);
    }
})(angular);