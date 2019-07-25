(function() {
  "use strict";

  angular.module("app").factory("DashboardService", DashboardService);

  DashboardService.$inject = [
    "$http",
    "TokenService",
    "$mdToast",
    "BaseUrlService",
    "toastr"
  ];

  function DashboardService($http, TokenService, $mdToast, BaseUrlService,toastr) {
    var cont = 0,
      contadorurl = 0;
    var baseUrl = localStorage.baseurl;
    var config = {
      method: "",
      url: "",
      headers: {
        Authorization: localStorage.tokenkey,
        "Content-Type": "application/json; charset=UTF-8"
      }
    };
    var service = {
      get: get
    };

    return service; 

    function get() {
      if (baseUrl != null) {
        var d = new Date().toISOString().slice(0,10); 

        config.url =
          baseUrl +
          "/services/apexrest/t2go1/dashboard/all?codeAgent=" +
          localStorage.agentCode +
          "&dateAgent="+d;
        config.method = "get";
        contadorurl = 0;
      } else {
        if (contadorurl == 0) {
          BaseUrlService.get().then(function(data) {
            localStorage.setItem("baseurl", data.BASEURL);
            get();
          });
        } else {
          console.log("ERROR in dashboard.service.js :::: BASEURL = NULL");
        }
        contadorurl++;
      }
      return $http(config)
        .then(function(response) {
          cont = 0;
          return response.data;
        })
        .catch(function(e) {
          if (e.statusText == "Unauthorized") {
            if (cont == 0) {
              TokenService.get().then(function(data) {
                cont++;
                localStorage.setItem("tokenkey", "Bearer " + data.TOKEN);
                config.headers.Authorization = "Bearer " + data.TOKEN;
                get();
              });
            } else {
              console.log(
                "ERROR in dashboard.service.js ::::: GET ALL "
              );
              console.log(e);
              cont = 0;
              return e;
            }
          }
        });
    }

   /* function get(filter) {
      return  $http
          .get('/app/data/hours.json')
          .then(function  (response) {
              return  response.data;
          });


    }*/


}
})();
