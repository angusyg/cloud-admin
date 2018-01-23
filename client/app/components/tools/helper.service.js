(function(angular) {
	'use strict';

	angular.module('cloud.admin.client')
		.factory('Helper', Helper);

	Helper.$inject = [];

	function Helper() {
		return {
			decodeToken: decodeToken
		};

		function decodeToken(token) {
			var parts = token.split('.');
			if (parts.length !== 3) {
				throw new Error('JWT must have 3 parts');
			}
			return angular.fromJson(atob(parts[1]));
		}
	}
})(angular);
