(function () {
    'use strict';

    angular
        .module('app')
        .factory('TokenService', TokenService);

        TokenService.$inject = ['$http'];

    function TokenService($http) {
        var service = {
            get: get,
            getDateNotice:getDateNotice
        };

        return service;

        ////////////////
        function get() {
            var configtoken = {
                method: "get",
                url: "/api/salesforce/token",
                headers: {
                  "Content-Type": "application/json; charset=UTF-8"
                }
              };
              var data={};
            return $http(configtoken)
                .then(function (response) {
                    return response.data;                    
                });
        }
        
        function getDateNotice() {
            var configtoken = {
                method: "get",
                url: "/api/salesforce/dateNotice",
                headers: {
                  "Content-Type": "application/json; charset=UTF-8"
                }
              };
              var data={};
            return $http(configtoken)
                .then(function (response) {
                    return response.data;                    
                });
        }
    }
})();