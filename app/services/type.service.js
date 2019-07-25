(function () {
    'use strict';

    angular
        .module('app')
        .factory('TypeService', TypeService);

    TypeService.$inject = ['$http'];

    function TypeService($http) {

        var service = {
            get: get
        };
        return service;

        function get(filter) {
            return  $http
                .get('/app/data/types.json')
                .then(function  (response) {
                    return  response.data;
                });


        }
    }
})();