(function() {
  "use strict";

  angular.module("app").service("authService", authService);

  authService.$inject = [
    "$state",
    "angularAuth0",
    "$timeout",
    "TokenService",
    "Logger",
    "BaseUrlService"
  ];

  function authService(
    $state,
    angularAuth0,
    $timeout,
    TokenService,
    Logger,
    BaseUrlService
  ) {
    function login() {
      angularAuth0.authorize();
    }

    function handleAuthentication() {
      return angularAuth0.parseHash(function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          setSession(authResult);
          angularAuth0.client.userInfo(authResult.accessToken, function(
            err,
            user
          ) {
            var temp = user["sub"];
            var array = temp.split("|");
            const userinforesult = array[1];
            localStorage.setItem("codeAgent", userinforesult);
            return TokenService.get().then(function(data) {
              localStorage.setItem("tokenkey", "Bearer " + data.TOKEN);
              if (localStorage.tokenkey != undefined) {
                return Logger.get().then(function() {
                  setTimeout(function() {
                    $state.go("home");
                  }, 500);
                });
              } else {
                return Logger.get().then(function() {
                  setTimeout(function() {
                    $state.go("home");
                  }, 1000);
                });
              }
            });
          });
        } else if (err) {
          $timeout(function() {
            $state.go("home");
          });
          console.log(err);
          alert(
            "Error: " + err.error + ". Check the console for further details."
          );
        }
      });
    }

    function setSession(authResult) {
      // Set the time that the access token will expire at
      return BaseUrlService.get().then(function(data0) {
        localStorage.setItem("baseurl", data0.BASEURL);
        return TokenService.get().then(function(data) {
          localStorage.setItem("tokenkey", "Bearer " + data.TOKEN);
          var expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
          );

          localStorage.setItem("access_token", authResult.accessToken);
          localStorage.setItem("id_token", authResult.idToken);
          localStorage.setItem("expires_at", expiresAt);
        });
      });
    }

    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.clear();
      $state.go("home");
    }

    function isAuthenticated() {
      // Check whether the current time is past the
      // access token's expiry time
      var expiresAt = JSON.parse(localStorage.getItem("expires_at"));
      return new Date().getTime() < expiresAt;
    }

    return {
      login: login,
      handleAuthentication: handleAuthentication,
      logout: logout,
      isAuthenticated: isAuthenticated
    };
  }
})();
