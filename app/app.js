(function() {
  "use strict";

  angular
    .module("app", [
      "auth0.auth0",
      "ui.router",
      "ngMaterial",
      "ngMessages",
      "datePicker",
      "angular-loading-bar",
      "ngStorage",
      "toastr"
    ])
    .config(config);

  config.$inject = [
    "$stateProvider",
    "$locationProvider",
    "$urlRouterProvider",
    "angularAuth0Provider"
  ];

  function config(
    $stateProvider,
    $locationProvider,
    $urlRouterProvider,
    angularAuth0Provider
  ) {
    $stateProvider
      .state("home", {
        url: "/",
        controller: "HomeController",
        templateUrl: "app/views/project/home.html",
        controllerAs: "vm"
      })
      .state("worklogs", {
        url: "/work-log",
        controller: "WorkLogController",
        name: "worklog",
        templateUrl: "app/views/project/work-log/work-log.html",
        controllerAs: "vm"
      })
      .state("callback", {
        url: "/callback",
        controller: "CallbackController",
        templateUrl: "app/callback/callback.html",
        controllerAs: "vm"
      }) 
      .state("dashboards", {
      url: "/dashboard",
      controller: "DashboardController",
      name: "dashboard",
      templateUrl: "app/views/dashboard/dashboard.html",
      controllerAs: "vm"
      }) 
       
      ;

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: "Y1aXIhePV5mr8fE3_5ySm6qxHwfMECm-",
      domain: "time2go.auth0.com",
      responseType: "token id_token",
      audience: "https://time2go.auth0.com/userinfo",
      redirectUri: "https://t2goproductopruebas.herokuapp.com/callback",
      scope: "openid",
      theme: {
        authButtons: {
          "testConnection": {
            displayName: "Test Conn",
            primaryColor: "#b7b7b7",
            foregroundColor: "#000000",
            icon: "http://icons.veryicon.com/ico/Emoticon/Chat/away%20girl.ico"
          },
          "testConnection2": {
            primaryColor: "#000000",
            foregroundColor: "#ffffff",
          }
        }
      }
    });

    $urlRouterProvider.otherwise("/");

    $locationProvider.hashPrefix("");

    /// Comment out the line below to run the app
    // without HTML5 mode (will use hashes in routes)
    $locationProvider.html5Mode(true);
  }
})();