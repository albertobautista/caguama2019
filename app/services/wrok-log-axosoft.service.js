(function() {
    "use strict";
  
    angular.module("app").factory("WorkLogAxosoftService", WorkLogAxosoftService);
  
    WorkLogAxosoftService.$inject = [
      "$http",
      "TokenService",
      "$mdToast",
      "BaseUrlService",
      "toastr"
    ];
  
    function WorkLogAxosoftService($http, TokenService, $mdToast, BaseUrlService,toastr) {
      var cont = 0,
        contadorurl = 0;
      var baseUrl = localStorage.baseurl;
      var config = {
        method: "",
        url: "",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
          }
      };
      var service = {
        get: get,
        post: post
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
          console.log('entro al get')     
          config.url ="https://tesselar.axosoft.com/api/v5/work_logs?access_token=88bb1320-f8a5-435d-ac7e-560041f22316&start_date=2019-07-10&release_id=374&project_id=102&assigned_to_id=123";
          config.method = "GET";          
        return $http(config)
          .then(function(response) {
            console.log('response')
            console.log(response)

            console.log('response.data')
            console.log(response.data)
            return response.data;
          })
          .catch(function(e) {
            console.log('EEEE')
            console.log(e)
          });
      }
    
  }
  })();
  