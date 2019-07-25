(function() {
  "use strict";

  angular.module("app").factory('dataauthService', dataauthService);

  dataauthService.$inject = ["$http"];

  function dataauthService($http) {
    var service = {
      get: get
    };

    return service;

    ////////////////
    function get() {
      var config = {
        method: "get",
        url: "/api/auth0/data",
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      };
      return $http(config).then(function(response) {
        return response.data;
      });
    }
  }
})();
