(function () {
    'use strict';

    angular
        .module('app')
        .factory('PeriodService', PeriodService);

        PeriodService.$inject = ['$http'];

    function PeriodService($http) {

        var service = {
            get: get
        };
        return service;

        function get(filter) {
            return  $http
                .get('/app/data/periods.json')
                .then(function  (response) {
                    return  response.data;
                });


        }
    }
})();