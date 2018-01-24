(function(angular) {
	'use strict';

	angular.module('cloud.admin.client')
		.factory('ArtifactoryService', ArtifactoryService);

	ArtifactoryService.$inject = ['$http', '$q', 'API'];

	function ArtifactoryService($http, $q, API) {
		return {
			getServerEarList: getServerEarList
		};

		function getServerEarList(server, snapshot) {
			return $http.post(API.ENDPOINTS.SERVER_EARS.PATH + server, {
					snapshot: snapshot
				})
				.then(function(response) {
					return $q.resolve(response.data);
				});
		}
	}
})(angular);
