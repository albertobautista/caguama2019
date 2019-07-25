(function () {
    "use strict";

    angular.module("app").controller("Navbar", navbar);

    navbar.$inject = [
        "$scope",
        "$localStorage"
    ];
    $("#buttonTest").hover(function(){
        $(this).css("background", "#575757");
        }, function(){
        $(this).css("background", "#FFFFFF");
      });
    function navbar(
        $scope,
        $localStorage
    ) {
        var vm = this;


        activate();

        function activate() {
            getUser();
            getPhoto();

        }


            function getUser() {
                return setTimeout(function(){
                    return $scope.agentName = localStorage.name;
                }, 2000);

            }

            function getPhoto() {
                return setTimeout(function(){
                        return $scope.photo = localStorage.photo;
                    },2000);
                }

    }
})();