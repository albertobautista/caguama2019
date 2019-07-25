(function () {
  "use strict";
  var globalCallout = true
  angular.module("app").controller("HomeController", homeController)
    .directive('loading', ['$http', function ($http) {
      return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
          scope.isLoading = function () {
            return $http.pendingRequests.length > 0;
          };
          scope.$watch(scope.isLoading, function (v) {
            if (v) {
              try{
              angular.element('#formPrin')[0].style.opacity = "0.4";
            }catch(e){}
              scope.globalCallout = true;
              elm.show();
            } else {
              try{
            angular.element('#formPrin')[0].style.opacity = "1";
          }catch(e){}
            elm.hide();
            scope.globalCallout = false;
          }
          });
        }
      }
    }]);

  homeController.$inject = [
    "$http",
    "authService",
    "$state",
    "$scope",
    "$filter",
    "$mdToast",
    "$stateParams",
    "$mdDialog",
    "ProjectService",
    "StageService",
    "CategoryService",
    "TypeService",
    "WorkLogService",
    "DashboardService",
    "HomeService",
    "Logger",
    "$localStorage",
    "toastr",
    "$document",
    "TokenService"
  ];
 
  function homeController(
    $http,
    authService,
    $state,
    $scope,
    $filter,
    $mdToast,
    $stateParams,
    $mdDialog,
    ProjectService,
    StageService,
    CategoryService,
    TypeService,
    WorkLogService,
    DashboardService,
    HomeService,
    Logger,
    $localStorage,
    toastr,
    $document,
    TokenService
  ) {
    var vm = this;
    vm.auth = authService;
    vm.categories = [{}];
    vm.types = [];
    vm.masterprojects = [];
    vm.stages = [{}];
    vm.logs = [];
    vm.myLogs = [];
    vm.stageModel = null;
    vm.selectedtype = null;
    vm.params = $stateParams;
    vm.logForm = getCleanForm();
    vm.getLogs = {};
    vm.addLog = addLog;
    vm.logout = logout;
    vm.setNotice = true;
    $scope.setSpinnerLoad = true;
    $scope.varOpacity = 1;
    vm.allowed = {
      minutes: [0, 15, 30, 45],
      hours: []
    };
    $scope.project = {};
    $scope.stage = {};
    for (var i = 0; i < 25; i++) {
      vm.allowed.hours.push(i);
    }
    activate();
    angular.element(function () {
      appController();
    });

    function appController() {
      TokenService.get().then(function (data) {
        localStorage.setItem("tokenkey", "Bearer " + data.TOKEN);
      });

    }
    
    function activate() {


      if (vm.auth.isAuthenticated() == true) {
        getTypes();
        getUser();
      } else {
        vm.auth.logout();
      }
    }

    function logout() {
      $localStorage.$reset();
      $state.go("login", vm.loginForm);
    }

    function getData() {
      return DashboardService.get()
    }

    function getWeekData() {
      return HomeService.get()
    }

    function addLog(log) {
      if (!log || log.horas === 0) {
        // $mdToast.show(
        //   $mdToast
        //   .simple()
        //   .textContent("Es necesario registrar al menos 1 hora")
        //   .position("top left")
        // );
        return;
      }
      var object = {
        reg: {
          agentCode: localStorage.agentCode,
          idProject: log.project.idProject,
          hours: log.hours,
          idStage: log.stage.idStage,
          minutes: log.minutes,
          workDate: moment(log.date).format("YYYY-MM-DD"),
          comment: log.comment,
          idCategory: log.category.idCategory
        }
      };

      WorkLogService.post(object).then(function (data) {
        if (data != null) {
          if (data.success == true) {
            getMyLogs(vm.logForm.stage);
            midataWeek = getWeekData();
            vm.logForm.comment = ''
            //vm.logForm.date = $filter("date")(Date.now(), "yyyy/MM/dd")
            vm.logForm.hours = 1
            vm.logForm.minutes = 0
            // setTimeout(() => {
            //   $mdToast.show(
            //     $mdToast
            //     .simple()
            //     .toastClass("md-toast-success")
            //     .textContent("Se ha ingresado de forma exitosa el registro de trabajo")
            //     .position("top left")
            //     .hideDelay(6000)
            //   );
            // }, 500);
            toastr.success('Se ha ingresado de forma exitosa el registro de trabajo', 'Notificación', {
              closeButton: true,
              //  iconClass: 'toast-blue',
              positionClass: 'toast-bottom-left'
            });


          }
        }

      });
    }
    $scope.$watch('vm.logForm.comment', function (newVal, oldVal) {
      if (newVal = !undefined) {
        if (newVal.length >= 149) {
          $scope.vm.logForm.comment = oldVal;
        }
      }
    });
   
    function getCleanForm() {
      return {
        date: $filter("date")(Date.now(), "yyyy/MM/dd"),
        hours: 1,
        minutes: 0
        // comment: ""
      };
    }

    function getTypes() {
      $scope.types = null
      return TypeService.get().then(function (data) {
        $scope.types = data;
      });
    }

    function getUser() {
      return $scope.alberto = localStorage.agentCode;
    }

    function getMyLogs(data0) {
      if (data0 != undefined) {
        var filter = {
          idStage: data0.idStage
        };
        return WorkLogService.getWithId(filter).then(function (data) {
          if (data != undefined) {
            if (data.statusText != "Unauthorized") {
              $scope.worklogs = data;
              var dateNotice = new Date(localStorage.dateNotice);
              var lastWorklog
              try {
                lastWorklog = new Date(data[0].workDate);
              } catch (e) {}
              if (dateNotice > lastWorklog || lastWorklog == undefined) {
                var bnotice = localStorage.getItem("Notice");
                if (bnotice == null || bnotice < 1) {
                  $('#myModal').modal('show');
                  vm.setNotice = true;
                  localStorage.setItem("Notice", 1);
                }
              } else {
                vm.setNotice = false;
                localStorage.setItem("Notice", 0);
              }
            } else {
              getMyLogs(data0)
            }
          } else {
            getMyLogs(data0)
          }
        });
      }
    }


    var midata;
    midata = getData();
    //console.log('midata');
    //console.log(midata)

    var midataWeek;
    midataWeek = getWeekData();
    //console.log('midataWeek');
    //console.log(midataWeek)


    $scope.myFunca = function (type) {
      if (type != null) {
        var filter = {
          value: type.value,
          name: type.name
        };
        return ProjectService.get(filter).then(function (data) {
          if (data != undefined) {
            if (data.statusText != "Unauthorized") {
              vm.projects = data;
              $scope.projects = vm.projects;
            } else {
              $scope.myFunca(type)
            }
          } else {
            $scope.myFunca(type)
          }
        });
      }
    };


    $scope.myFunc = function (project) {
      if (project != null) {
        var filter = {
          idProject: project.idProject,
          projectName: project.projectName
        };
        return StageService.get(filter).then(function (data) {
          if (data != undefined) {
            if (data.statusText != "Unauthorized") {
              $scope.stages = data;
            } else {
              $scope.myFunc(project)
            }
          } else {
            $scope.myFunc(project)
          }
        });
      }
    };

    $scope.myFunc2 = function (stage) {
      if (stage != null) {
        var filter = {
          idStage: stage.idStage,
          stageName: stage.stageName
        };
        return CategoryService.get(filter).then(function (data) {
          if (data != undefined) {
            if (data.statusText != "Unauthorized") {
              $scope.categories = data;
            } else {
              $scope.myFunc2(stage)
            }
          } else {
            $scope.myFunc2(stage)

          }
        });
      }
    };

    $scope.$watch("vm.selectedtype", function () {
      return $scope.myFunca(vm.selectedtype);
    });

    $scope.$watch("vm.logForm.project", function () {
      return $scope.myFunc(vm.logForm.project);
    });

    $scope.$watch("vm.logForm.stage", function () {
      if (vm.logForm.stage != undefined) {
        getMyLogs(vm.logForm.stage);
      }
      return $scope.myFunc2(vm.logForm.stage);
    });

    midataWeek.then(function (data) {
        ///////////////////////////////////////////
        var data
        try {

          data = JSON.parse(data);
        } catch (error) {
          console.log(error)
        }
        // console.log('data')
        // console.log(data)
        // console.log('data[7]')
        //console.log(data[7].totalHoursProjectXDay)

        var miArray = [];
        var miArreglo = []

        var miArray = [];
        var miArreglo = []
        var arregloValues = []
        var arregloNombresValues = []
        var arreglosValues = []
        var general = []
        var finalDataArray = [];
        var mio = 0;
        var obj = {}
        // rgba(210,208,205,1) - Gris
        // rgba(100,32,119, 1) - Morado
        // rgba(52,217,195, 1) - Azul turquesa
        var arrayColores = ['rgba(100,32,119, 1)', 'rgba(52,217,195, 1)', 'rgba(66,109,169, 1)', 'rgba(167,230,217, 1)', 'rgba(104,2,2, 1)', 'rgba(210,208,205,1)'];
        //var dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
        var fecha = new Date();
        var check = 0;
        for (var index = 0; index < data[0].totalHoursProjectXDay.length; index++) {
          miArray.push(data[0].totalHoursProjectXDay[index]);
        }
        for (var prop in miArray) {
          for (var prop2 in miArray[prop]) {
            arregloValues.push(miArray[prop][prop2])
            miArreglo.push(Object.keys((miArray[prop])))
          }
        }
        /*  if (arregloValues === undefined || arregloValues.length == 0) {
            if (check === (dias.length - 1)) {
              for (var x = fecha.getDay(); x >= 0; x--) {
                arregloValues.push(dias[x])
                console.log(dias[x]);
              }

            } else {
              for (var x = fecha.getDay(); x >= 0; x--) {
                arregloValues.push(dias[x])
                console.log(dias[x]);
              }
              for (var i = dias.length - 1; i > fecha.getDay(); i--) {
                arregloValues.push(dias[i])
                console.log(dias[i]);
              }
            }
          }*/

        for (var prop in miArreglo) {
          for (var prop2 in miArreglo[prop]) {
            arregloNombresValues.push(miArreglo[prop][prop2])
          }
        }

        var unique = [new Set(arregloNombresValues)];

        for (var index = 0; index < arregloValues.length; index++) {
          arreglosValues.push(arregloValues[index]);
        }

        for (var prop in arreglosValues) {
          for (var prop2 in arreglosValues[prop]) {
            general.push(arreglosValues[prop][prop2])

          }
        }

        for (var index = 0; index < general.length; index += 7) {
          obj[mio] = {
            label: unique[mio],
            data: general.slice(index, (index + 7)),
            backgroundColor: [arrayColores[mio], arrayColores[mio], arrayColores[mio], arrayColores[mio], arrayColores[mio], arrayColores[mio], arrayColores[mio]],
            borderColor: [arrayColores[mio], arrayColores[mio], arrayColores[mio], arrayColores[mio], arrayColores[mio], arrayColores[mio], arrayColores[mio]],
            borderWidth: 3,
            type: 'bar'

          }
          mio++
        }

        finalDataArray.push(obj)

        var dataArray = []
        for (var prop in finalDataArray) {
          for (var prop2 in finalDataArray[prop]) {
            dataArray.push(finalDataArray[prop][prop2])

          }
        }

        var miObjeto = {}
        var objetoVacio = {}

        objetoVacio = {
          label: 'Sin registros',
          data: 0
        }

        function renderChart(infoData) {
          var lastElemnt = Object.keys(arregloValues[0]).reverse()[Object.keys(arregloValues[0]).reverse().length - 1] + ' - Actual'
          var arrayNewDays = []
          arrayNewDays = Object.keys(arregloValues[0]).reverse()
          arrayNewDays.pop()
          arrayNewDays.push(lastElemnt)

          var data = {
            labels: arrayNewDays,
            datasets: []
          };


          var contador = 0
          infoData.forEach(function (o) {
            miObjeto[contador] = {
              label: [o.label],
              data: [o.data[6], o.data[5], o.data[4], o.data[3], o.data[2], o.data[1], o.data[0]],
              backgroundColor: [arrayColores[contador], arrayColores[contador], arrayColores[contador], arrayColores[contador], arrayColores[contador], arrayColores[contador], arrayColores[contador]],

            }
            data.datasets.push(miObjeto[contador])
            contador++
          })
          var ctxWeek = document.getElementById("myChartWeek");
          var titulo = document.getElementById("titulo");
          /* Gráfica de Horas Disponibles a registrar / Horas registradas */
          var myChartWeek = new Chart(ctxWeek, {
            type: 'bar',
            data: data,
            options: {
              maintainAspectRatio: false,
              scales: {
                yAxes: [{
                  stacked: true,
                  ticks: {
                    beginAtZero: true
                  }
                }],
                xAxes: [{
                  stacked: true,
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
          myChartWeek.update();
        }
        $(document).ready(function () {
          $("button").hover(function(){

            $(this).css("background", "#F5F5F5");
            $(this).css("border-radius", "90%");
            }, function(){
            $(this).css("background", "#FFFFFF");
            $(this).css("border-radius", "0%");
          });
         
          setTimeout(function(){
            titulo.style.visibility = "visible";
            renderChart(dataArray);
          }, 2000);
        });

      })
      .catch(function (e) {
        console.log(e);
        //alert("Error al cargar tus registros");
      }); //
    var userProfile;
  }
})();