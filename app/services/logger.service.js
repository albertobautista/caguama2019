(function () {
  "use strict";

  angular.module("app").factory("Logger", [
    "$http",
    "TokenService",
    "$localStorage",
    "$mdToast",
    "$state",
    "BaseUrlService",
    "dataauthService",
    "toastr",
    function Logger(
      $http,
      TokenService,
      $localStorage,
      $mdToast,
      $state,
      BaseUrlService,
      dataauthService,
      toastr
    ) {

      var contador = 0;
      var cont = 0,
        contadoragentCode = 0,
        contadorlogger = 0,
        contadorurl = 0;
      var baseUrl = localStorage.baseurl;
      var config = {
        method: "get",
        url: "",
        headers: {
          Authorization: localStorage.tokenkey,
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
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
        toastr.error('El usuario no tiene un agente ligado a él, contacta al administrador', 'Notificación', {
          closeButton: true,
          positionClass: 'toast-bottom-left'
        });
        try{
        angular.element('#formPrin')[0].style.opacity = "1";
        }catch(e){}
        localStorage.clear();
        $state.go("home");
      }

      function get() {
        if (localStorage.tokenkey != undefined) {
          if (baseUrl != undefined) {
            config.url =
              baseUrl +
              "/services/apexrest/t2go1/Login/?user_id=" +
              localStorage.codeAgent;
            contadorurl = 0;
          } else {
            if (contadorurl == 0) {
              BaseUrlService.get().then(function (data) {
                baseUrl = data.BASEURL;
                localStorage.setItem("baseurl", data.BASEURL);
                get();
              });
            } else {
              console.log("ERROR in logger.service.js :::: BASEURL = NULL");
            }
            contadorurl++;
          }
          config.headers.Authorization = localStorage.tokenkey;
          return $http(config)
            .then(function (response) {
              cont = 0;
              if (response.data.agentCode != null) {
                contadoragentCode = 0;
                localStorage.setItem("agentCode", response.data.agentCode);
                localStorage.setItem("name", response.data.name);
                localStorage.setItem("photo", response.data.photo);
                localStorage.setItem("myGroup", response.data.myGroup);
                localStorage.setItem("hours", response.data.hours);

                return response.data;
              } else {
                if (contadoragentCode == 0) {
                  setTimeout(function () {
                    get();
                    contadoragentCode++;
                  }, 500);
                } else {
                  contadoragentCode = 0;
                  unloggin();
                }
                contadoragentCode++;
              }
            })
            .catch(function (e) {
              if (e.statusText == "Unauthorized") {
                if (cont == 0) {
                  TokenService.get().then(function (data) {
                    cont++;
                    localStorage.setItem("tokenkey", "Bearer " + data.TOKEN);
                    config.headers.Authorization = "Bearer " + data.TOKEN;
                    get();
                  });
                } else {
                  console.log("ERROR in logger.service.js");
                  console.log(e);
                  cont = 0;
                  return e;
                }
              } else {
                if (e.statusText != "Not Found") {
                  if (e.data.name != "Usuario incorrecto") {
                    if (e.statusText == "Bad Request" && contador == 0) {
                      contador++;
                      get();
                    } else {
                      if (e.statusText != "Bad Request") {
                        contador = 0;
                      }
                    }
                  } else {
                    if (contadorlogger == 0) {
                      contadorlogger++;
                      setTimeout(function () {
                        get();
                      }, 500);
                    } else {
                      contadorlogger = 0;
                      unloggin();
                    }
                  }
                } else {
                  unloggin();
                }
              }
            });
        } else {
          TokenService.get().then(function (data) {
            localStorage.setItem("tokenkey", "Bearer " + data.TOKEN);
            config.headers.Authorization = "Bearer " + data.TOKEN;
            this.get(); //Lo ultimo
          });
        }
      }
    }
  ])
})();