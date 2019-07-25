(function () {
    'use strict';

    angular
        .module('app')
        .factory('BaseUrlService', BaseUrlService);

        BaseUrlService.$inject = ['$http'];

    function BaseUrlService($http) {
        var service = {
            get: get
        };

        return service;

        ////////////////
        function get() {
            var config = {
                method: "get",
                url: "/api/salesforce/baseurl",
                headers: {
                  "Content-Type": "application/json; charset=UTF-8"
                }
              };
              var data={};
            return $http(config)
                .then(function (response) {
                    return response.data;                    
                });
        }
    }
})();