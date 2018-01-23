(function(angular) {
    'use strict';

    angular.module('cloud.admin.client')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', 'store', '$q', 'API'];

    function AuthenticationService($http, store, $q, API) {
        const ACCESS_TOKEN = 'JWTToken';
        const REFRESH_TOKEN = 'RefreshToken';
        var refreshInProgress = false;

        return {
            getToken: getToken,
            getRefreshToken: getRefreshToken,
            isLoggedIn: isLoggedIn,
            login: login,
            logout: logout,
            refreshToken: refreshToken,
            refreshTokenAndRetry: refreshTokenAndRetry
        };

        function getToken() {
            return store.get(ACCESS_TOKEN);
        }

        function getRefreshToken() {
            return store.get(REFRESH_TOKEN);
        }

        function isLoggedIn() {
            return store.get(ACCESS_TOKEN) !== null;
        }

        function login(user) {
            return $http.post(API.ENDPOINTS.LOGIN.PATH, user)
                .then(function(response) {
                    store.set(ACCESS_TOKEN, response.data.accessToken);
                    store.set(REFRESH_TOKEN, response.data.refreshToken);
                    return $q.resolve();
                });
        }

        function logout() {
            return $http.get(API.ENDPOINTS.LOGOUT.PATH)
                .then(function(response) {
                    store.remove(ACCESS_TOKEN);
                    store.remove(REFRESH_TOKEN);
                    return $q.resolve();
                });
        }

        function refreshToken() {
            return $http.get(API.ENDPOINTS.REFRESHTOKEN.PATH)
                .then(function(response) {
                    store.set(ACCESS_TOKEN, response.data.accessToken);
                    return $q.resolve();
                });
        }

        function refreshTokenAndRetry(error) {
            if(!refreshInProgress) {
                refreshInProgress = true;
                return $http.get(API.ENDPOINTS.REFRESHTOKEN.PATH)
                    .then(function(response) {
                        store.set(ACCESS_TOKEN, response.data.accessToken);
                        refreshInProgress = false;
                        return retryRequest(error.config);
                    })
                    .catch(function(error) {
                        refreshInProgress = false;
                        return $q.reject(error);
                    });
            }
            return $q.reject(error);
        }

        function retryRequest(retry) {
            retry.headers[API.ACCESS_TOKEN_HEADERNAME] = 'Bearer ' + store.get(ACCESS_TOKEN);
            return $http(retry)
                .then(function(response) {
                    return $q.resolve(response);
                }, function(error) {
                    return $q.reject(error);
                });
        }
    }
})(angular);
