(function() {
  "use strict";

  angular.module("app").factory("WorkLogService", WorkLogService);

  WorkLogService.$inject = [
    "$http",
    "TokenService",
    "$mdToast",
    "BaseUrlService",
    "toastr"
  ];

  function WorkLogService($http, TokenService, $mdToast, BaseUrlService,toastr) {
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
      get: get,
      post: post,
      getWithId: getWithId,
      deleteWorklog: deleteWorklog
    };

    return service;

    ////////////////
    function post(log) {
      if(post!=null){
      if (baseUrl != null) {
        config.url = baseUrl + "/services/apexrest/t2go1/RegistroTrabajo/";
        config.method = "post";
        contadorurl = 0;
      } else {
        if (contadorurl == 0) {
          BaseUrlService.get().then(function(data) {
            baseUrl = data.BASEURL;
            localStorage.setItem("baseurl", data.BASEURL);
            post(log);
          });
        } else {
          console.log("ERROR in work-log.service.js :::: BASEURL = NULL");
        }
        contadorurl++;
      }

      // @todo Check log's properties
      return $http
        .post(config.url, log, config)
        .then(function(response) {
          return response.data;
        })
        .catch(function(e) {
          if (e.statusText == "Unauthorized") {
            if (cont == 0) {
              TokenService.get().then(function(data) {
                cont++;
                localStorage.setItem("tokenkey", "Bearer " + data.TOKEN);
                config.headers.Authorization = "Bearer " + data.TOKEN;
                post(log);
              });
            }
          } else {
            console.log("ERROR in work-log.service.js :::: POST");
            console.log(e.data.message);
            // $mdToast.show(
            //   $mdToast
            //     .simple()
            //     .toastClass("md-toast-error")
            //     .textContent(e.data.message)
            //     .position("top left")
            //     .hideDelay(6000)
            // );
            // DevExpress.ui.notify(e.data.message, "success", 8000);
            toastr.error(e.data.message,'Notificación',{
              positionClass: 'toast-top-center',
              closeButton: false //,
           //   iconClass: 'toast-gray'
              
            });

            cont = 0;
            return e;
          }
        });}
    }

   

    function get() {
      if (baseUrl != null) {
        config.url =
          baseUrl +
          "/services/apexrest/t2go1/RegistroTrabajo/?codigoagente=" +
          localStorage.agentCode +
          "&todoslosregistros=1";
        config.method = "get";
        contadorurl = 0;
      } else {
        if (contadorurl == 0) {
          BaseUrlService.get().then(function(data) {
            localStorage.setItem("baseurl", data.BASEURL);
            get();
          });
        } else {
          console.log("ERROR in work-log.service.js :::: BASEURL = NULL");
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
                "ERROR in work-log.service.js ::::: GET ALL WORKLOGS"
              );
              console.log(e);
              cont = 0;
              return e;
            }
          }
        });
    }

    function getWithId(filter) {
      if( filter.idStage!=null){
      if (baseUrl != null) {
        config.url =
          baseUrl +
          "/services/apexrest/t2go1/RegistroTrabajo/?codigoagente=" +
          localStorage.agentCode +
          "&todoslosregistros=0&idetapa=" +
          filter.idStage;
        config.method = "get";
        contadorurl = 0;
      } else {
        if (contadorurl == 0) {
          BaseUrlService.get().then(function(data) {
            localStorage.setItem("baseurl", data.BASEURL);
            get(filter);
          });
        } else {
          console.log("ERROR in work-log.service.js :::: BASEURL = NULL");
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
                get(filter);
              });
            } else {
              console.log("ERROR in work.log.service.js ::::: GET");
              console.log(e);
              cont = 0;
              return e;
            }
          }
        });
    }
  }
  function deleteWorklog (log) {
    if (baseUrl != null) {
      config.url =
        baseUrl +
        "/services/apexrest/t2go1/RegistroTrabajo/?idWorklog="+log;
      config.method = "delete";
      contadorurl = 0;
    } else {
      if (contadorurl == 0) {
        BaseUrlService.get().then(function(data) {
          localStorage.setItem("baseurl", data.BASEURL);
          deleteWorklog();
        });
      } else {
        console.log("ERROR in work-log.service.js :::: BASEURL = NULL");
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
              deleteWorklog();
            });
          } else {
            console.log(
              "ERROR in work-log.service.js ::::: DELETE"
            );
            console.log(e);
            toastr.error(e.data.message,'Notificación',{
              positionClass: 'toast-top-center',
              closeButton: false //,
           //   iconClass: 'toast-gray'
              
            });
            cont = 0;
            return e;
          }
        }
      });
  }

}
})();
