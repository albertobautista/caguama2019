(function () {
  'use strict';

  angular
    .module('app')
    .factory('ProgressBar_Stage_Budget', ProgressBar_Stage_Budget);

    ProgressBar_Stage_Budget.$inject = ['$http', 'TokenService'];

  function ProgressBar_Stage_Budget($http, TokenService) {
    var data = null;
    var cont = 0,
      contadorurl = 0
    var baseUrl = localStorage.baseurl;
    var config = {
      method: "get",
      url: "",
      headers: {
        'Authorization': localStorage.tokenkey,
        "Content-Type": "application/json; charset=UTF-8"
      }
    };
    var service = {
      get: get
    };

    return service;

    function get(filter) {
      if (baseUrl != null) {
        config.url = baseUrl + '/services/apexrest/t2go1/Stage_Budge /?' + 'idStage=' + filter.idStage + '&codeAgent=' + filter.idStage
        contadorurl = 0
      } else {
        if (contadorurl == 0) {
          BaseUrlService.get().then(function (data) {
            baseUrl = data.BASEURL;
            localStorage.setItem("baseurl", data.BASEURL);
            get(filter);
          });
        } else {
          console.log("ERROR in category.service.js :::: BASEURL = NULL");
        }
        contadorurl++
      }
      return $http(config)
        .then(function (response) {
          cont = 0;
          return response.data;
        })
        .catch(function (e) {
          if (e.statusText == 'Unauthorized') {
            if (cont == 0) {
              TokenService.get().then(function (data) {
                cont++;
                localStorage.setItem("tokenkey", "Bearer " + data.TOKEN);
                config.headers.Authorization = "Bearer " + data.TOKEN;
                get(filter);
              });
            } else {
              console.log("ERROR in category.service.js");
              console.log(e);
              cont = 0;
              return e;
            }
          }
        });
    }
  }
})();