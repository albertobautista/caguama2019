(function () {
  "use strict";

  angular.module("app").factory("ProjectService", ProjectService);

  ProjectService.inject = ["$http", "TokenService", "BaseUrlService"];

  function ProjectService($http, TokenService, BaseUrlService) {
    var cont = 0,
      contadorurl = 0,
      contadorAgenteIncorrecto = 0,
      contadoragente = 0;
    // contadorpeticion = 0;
    var baseUrl = localStorage.baseurl;
    var config = {
      method: "get",
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

    function unloggin() {
      // $mdToast.show(
      //   $mdToast
      //     .simple()
      //     .textContent(
      //       "El usuario no tiene un agente ligado a él, contacta al administrador"
      //     )
      //     .position("top left")
      // );
      toastr.error('Hubo un problema, reintenta por favor', 'Notificación', {
        closeButton: true,
        positionClass: 'toast-bottom-left'
      });
      localStorage.clear();
      $state.go("home");
    }

    function get(filter) {
      if (baseUrl != null) {
        if (localStorage.agentCode != undefined) {
          config.url =
            baseUrl +
            "/services/apexrest/t2go1/TipoProyectos/?" +
            "codigoagente=" +
            localStorage.agentCode +
            "&activo=1&tipoproyecto=" +
            filter.value;
        } else {
          if (contadoragente == 0) {
            contadoragente++;
            setTimeout(function () {
              get(filter);
            }, 1000);
          } else {
            if (contadoragente == 1) {
              contadoragente++;
              setTimeout(function () {
                get(filter);
              }, 1000);
            } else {
              console.log("ERROR in project.service.js :::: agentCode = NULL");
              contadoragente = 0;
              unloggin();
            }

          }
        }
        contadorurl = 0;
      } else {
        if (contadorurl == 0) {
          BaseUrlService.get().then(function (data) {
            baseUrl = data.BASEURL;
            localStorage.setItem("baseurl", data.BASEURL);
            get(filter);
          });
        } else {
          console.log("ERROR in project.service.js :::: BASEURL = NULL");
        }
        contadorurl++;
      }
      return $http(config)
        .then(function (response) {
          cont = 0;
          return response.data;
        })
        .catch(function (e) {
          if (e.statusText == "Unauthorized") {
            if (cont == 0) {
              TokenService.get().then(function (data) {
                cont++;
                localStorage.setItem("tokenkey", "Bearer " + data.TOKEN);
                config.headers.Authorization = "Bearer " + data.TOKEN;
                get(filter);
              });
            } else {
              console.log("ERROR in project.service.js");
              cont = 0;
              return e;
            }
          } else if (e.statusText == "Bad Request") {
            if (cont == 0) {
              TokenService.get().then(function (data) {
                cont++;
                get(filter);
              });
            } else {
              console.log("ERROR in AgentCode");
              cont = 0;
              return e;
            }
          } else if (e.statusText == "Server Error") {
            if (cont == 0) {
              TokenService.get().then(function (data) {
                cont++;
                get(filter);
              });
            } else {
              console.log("ERROR");
              cont = 0;
              return e;
            }
          }
        });
    }
  }
})();