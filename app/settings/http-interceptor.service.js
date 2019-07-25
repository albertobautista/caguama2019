(function () {
    'use strict';

    angular
        .module('app')
        .factory('httpInterceptorService', httpInterceptorService);

    httpInterceptorService.$inject = ['$injector', '$localStorage'];

    function httpInterceptorService($injector, $localStorage) {
        var service = {
            request: _request,
        };

        ////////////////

        var TOKEN_URL = 'data/token.txt';

        function _request(config) {
            if (config.url == TOKEN_URL || _isHTMLRequest(config)) {
                return config;
            }
            //Dejar pasar peticiones que ya tengan un header Authorization sin colocarle los headers estándar
            if (typeof config.headers.Authorization !== 'undefined') {
                return config;
            }

            _setHeaders(config);
            return config;
        }

        function _isHTMLRequest(config) {
            var isHtmlRequest = false;
            var strings = config.url.split('.');
            if (strings[strings.length - 1] == 'html') {
                isHtmlRequest = true;
            }
            return isHtmlRequest;
        }

        function _setHeaders(configObject) {
            configObject.headers = configObject.headers || {};
            if ($localStorage.authorizationData) {
                configObject.headers['Authorization'] = 'Bearer ' + $localStorage.authorizationData.token;
            }
            //configObject.headers['Accept-Language'] = 'es';
        }

        ////////////////

        return service;
    }
})();