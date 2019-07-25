(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['authService','TokenService'];

  function run(authService,TokenService) {
    // Handle the authentication
    // result in the hash
    TokenService.get().then(function(data) {
      localStorage.setItem("tokenkey", "Bearer " + data.TOKEN);
    });
    TokenService.getDateNotice().then(function(data) {
      localStorage.setItem("dateNotice", data.dateNotice);
    });
      authService.handleAuthentication();
    
   
  }
 
})();