(function () {
    'use strict';

    angular
        .module('app')
        .factory('HoursService', HoursService);

        HoursService.$inject = ['$http'];

    function HoursService($http) {

        var service = {
            get: get
        };
        return service;

        function get(filter) {
            return  $http
                .get('/app/data/hours.json')
                .then(function  (response) {
                    return  response.data;
                });


        }
    }
})();