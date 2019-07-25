(function () {
  "use strict";
  angular
    .module("app")
    .controller("DashboardController", DashboardController)
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
            angular.element('#details')[0].style.opacity="0";
          }catch(e){}
             elm.show();
           } else {
             try{
             angular.element('#details')[0].style.opacity="1";
            }catch(e){}
             elm.hide();
           }
 
        });
      }
    }
  }]);


  DashboardController.$inject = [
    "$http",
    "authService",
    "$state",
    "$filter",
    "DashboardService",
    "$localStorage",
    "$scope",
    "HoursService",
    "ProjectService",
    "PeriodService"
  ];

  function DashboardController(
    $http,
    authService,
    $state,
    $filter,
    DashboardService,
    $localStorage,
    $scope,
    HoursService,
    ProjectService,
    PeriodService
  ) {
    var vm = this;
    vm.worklogs = {};
    vm.hours = [];
    vm.auth = authService;
    vm.selectedtype = null;
    $scope.setSpinnerLoad = true;
    activate();
    //getTypes();
    
    function activate() {

      if (vm.auth.isAuthenticated() == true) {
        getPeriods();
        getUser();
        $scope.$watch("vm.selectedperiod", function () {
          return $scope.myFunca(vm.selectedperiod);
        });
      

      } else {
        vm.auth.logout();
      }
    }

    function getData() {
      return DashboardService.get()
    }

    var midata;

    //console.log('Antes Local')
    //console.log(localStorage.check)
    localStorage.setItem("check", true)
    var check = localStorage.check;

    if (check == 'true') {
     // console.log('Entro por el check')
      midata = getData();
      localStorage.setItem("check", false)
      //console.log('midata dentroo')
      //console.log(midata)
    } else {
      //console.log('midata else')
      //console.log(midata)
      //console.log('ELSEE del c')
      midata = JSON.parse(localStorage.getItem('dsd'));
      //console.log('naaanananananananan')
    }
    //console.log('midata fuera')
    //console.log(midata)

    $scope.myFunca = function (period) {
      if (period != null) {
        var filter = {
          value: period.value,
          name: period.name
        };
        return midata.then(function (data) {
          //console.log('----------Entro a myFunca----------')
          if (data != undefined) {
            var data = JSON.parse(data);
            //localStorage.setItem("dsd", JSON.stringify(data))

            if (data.statusText != "Unauthorized") {
              var arrayAgentSummary = [];
              var arrayFields = [];
              var arrayValueFields = [];
              var arrayProjects = [];
              var arrayHours = [];
              var arrayPercentage = [];

              /* Se llena el arreglo arrayAgentSummary con la información de resumen del agente*/
              for (var x = 0; x < data[6].agentSummary.length; x++) {
                arrayAgentSummary.push(data[6].agentSummary[x])
              }

              /* Se llena el arreglo arrayFields con el resumen del agente separado por Semana, Mes, Año y quincena*/
              for (var prop in arrayAgentSummary) {
                for (var prop2 in arrayAgentSummary[prop]) {
                  arrayFields.push(arrayAgentSummary[prop][prop2])
                }
              }

              /* Se llena el arreglo arrayValueFields con los valores de cada uno de los campos de Semana, Mes, Año y quincena*/
              for (var prop3 in arrayFields) {
                for (var prop4 in arrayFields[prop3]) {
                  arrayValueFields.push(arrayFields[prop3][prop4])
                }
              }

              /* Se llena el arreglo arrayProjects con los valores de cantidad de los proyectos*/
              /* Se llena el arreglo arrayHours con los valores de cantidad de horas de los proyectos*/
              /* Se llena el arreglo arrayPercentage con los valores de procentaje de horas de los proyectos*/
              for (var prop3 in arrayValueFields) {
                for (var prop4 in arrayValueFields[prop3]) {
                  arrayProjects.push(arrayValueFields[prop3][prop4].Proyectos)
                  arrayHours.push(arrayValueFields[prop3][prop4].Horas)
                  arrayPercentage.push(arrayValueFields[prop3][prop4].Porcentaje)
                }
              }

              //console.log('selecccionado Value')
              //console.log(period.value)
              if (period.value == "7" || period.value == '7') {
                //console.log('Dentro del primero')
                $scope.namePeriod = '7 días';
                $scope.myNumberProject = arrayProjects[6];
                $scope.myHoursProject = arrayHours[6];
                $scope.myPercentageProject = arrayPercentage[6];
                $scope.myProjectNumber = arrayProjects[7];
                $scope.myProjectHours = arrayHours[7];
                $scope.myProjectPercentage = arrayPercentage[7];
              } else if (period.value == "15" || period.value == '15') {
                $scope.namePeriod = '15 días';
                $scope.myNumberProject = arrayProjects[4];
                $scope.myHoursProject = arrayHours[4];
                $scope.myPercentageProject = arrayPercentage[4];
                $scope.myProjectNumber = arrayProjects[5];
                $scope.myProjectHours = arrayHours[5];
                $scope.myProjectPercentage = arrayPercentage[5];
              } else if (period.value == "30" || period.value == '30') {
                $scope.namePeriod = 'Mes';
                $scope.myNumberProject = arrayProjects[2];
                $scope.myHoursProject = arrayHours[2];
                $scope.myPercentageProject = arrayPercentage[2];
                $scope.myProjectNumber = arrayProjects[3];
                $scope.myProjectHours = arrayHours[3];
                $scope.myProjectPercentage = arrayPercentage[3];
              } else if (period.value == "365" || period.value == '365') {
                $scope.namePeriod = 'Año';
                $scope.myNumberProject = arrayProjects[0];
                $scope.myHoursProject = arrayHours[0];
                $scope.myPercentageProject = arrayPercentage[0];
                $scope.myProjectNumber = arrayProjects[1];
                $scope.myProjectHours = arrayHours[1];
                $scope.myProjectPercentage = arrayPercentage[1];
              }

            } else {
              $scope.myFunca(period)
            }
          } else {
            $scope.myFunca(period)
          }
        });
      }
    };

    midata.then(function (data) {
        var data = JSON.parse(data);
        //console.log('data')
       // console.log(data)
        //console.log('data[7]')
        //console.log(data[7].totalHoursProjectXDay)

        var arrayDatosHorasDisponibles = [];
        var arrayDatosHorasRegistradas = [];

        var colorsArray = [];
        var colorsArrayHorasAlAnio = [];
        var colorsArrayHorasPorMes = [];

        var arrayNombreProyectos = [];
        var arrayHorasProyectos = [];
        var arrayNombreProyectosMeses = [];
        var arrayHorasProyectosMeses = [];

        var arrayAux = [];
        var arrayAuxMeses = [];
        var arrayAuxProyecto = [];
        var arrayAuxProyectoMeses = [];

        var arrayHorasAprobadas = [];
        var arrayHorasRechazadas = [];
        var arrayHorasPendientes = [];
        var colorsArrayEstadoHorasAnio = [];

        var arrayHorasAprobadasMes = [];
        var arrayHorasRechazadasMes = [];
        var arrayHorasPendientesMes = [];
        var colorsArrayEstadoHorasMes = [];

        var arrayHorasEstadoAprobadasMes = [];
        var arrayHorasEstadoRechazadasMes = [];
        var arrayHorasEstadoPendientesMes = [];
        var colorsArrayEstadoHorasRegistroMes = [];
        var colorsArrayEstadoHorasRegistroMesMorado = [];

        /*var miArray = [];
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
        var arrayColores = ['rgba(210,208,205,1)', 'rgba(100,32,119, 1)', 'rgba(52,217,195, 1)', 'rgba(66,109,169, 1)', 'rgba(167,230,217, 1)','rgba(104,2,2, 1)'];*/



        /* Se llena el arreglo arrayDatosHorasDisponibles con las horas disponibles a registrar al año por Mes*/
        /* Se llena el arreglo arrayDatosHorasRegistradas con las horas registradas al año por Mes*/
        /* Se llena el arreglo colorsArray el numero de registros de color para cada mes del año*/
        for (var x = 0; x < data[0].totalhoursxmonth.length; x++) {
          arrayDatosHorasDisponibles.push(data[0].totalhoursxmonth[x][x + 1].horasDisponibles);
          arrayDatosHorasRegistradas.push(data[0].totalhoursxmonth[x][x + 1].horasRegistradas);
          colorsArray.push('rgba(100,32,119, 1)');
        }

        /* Se llena el arreglo arrayAux con cada uno de los proyectos al AÑO */
        for (var a = 0; a < data[1].totalhoursxmonthxproyectYEAR.length; a++) {
          arrayAux.push(data[1].totalhoursxmonthxproyectYEAR[a]);
        }

        /* Se llena el arreglo arrayAux con cada uno de los proyectos por MES */
        for (var a = 0; a < data[2].totalhoursxmonthxproyectMONTH.length; a++) {
          arrayAuxMeses.push(data[2].totalhoursxmonthxproyectMONTH[a]);
        }

        /* Se llena el arreglo arrayAuxProyecto con cada uno de los registros de los proyectos al AÑO*/
        for (var a = 0; a < arrayAux.length; a++) {
          arrayAuxProyecto.push(arrayAux[a]);
        }

        /* Se llena el arreglo arrayAuxProyectoMeses con cada uno de los registros de los proyectos por MES*/
        for (var a = 0; a < arrayAuxMeses.length; a++) {
          arrayAuxProyectoMeses.push(arrayAuxMeses[a]);
        }

        /* Se llena el arreglo arrayNombreProyectos con el nombre de cada proyecto al AÑO*/
        /* Se llena el arreglo arrayHorasProyectos con las horas de cada proyecto al AÑO*/
        /* Se llena el arreglo colorsArrayHorasAlAnio el numero de registros de color para cada mes del año*/
        for (var prop in arrayAuxProyecto) {
          for (var prop2 in arrayAuxProyecto[prop]) {
            arrayNombreProyectos.push(arrayAuxProyecto[prop][prop2].Nombre);
            arrayHorasProyectos.push(arrayAuxProyecto[prop][prop2].Horas);
            colorsArrayHorasAlAnio.push('rgba(' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', 1)');
          }
        }

        /* Se llena el arreglo arrayNombreProyectos con el nombre de cada proyecto al AÑO*/
        /* Se llena el arreglo arrayHorasProyectos con las horas de cada proyecto al AÑO*/
        /* Se llena el arreglo colorsArrayHorasAlAnio el numero de registros de color para cada mes del año*/
        for (var prop in arrayAuxProyectoMeses) {
          for (var prop2 in arrayAuxProyectoMeses[prop]) {
            arrayNombreProyectosMeses.push(arrayAuxProyectoMeses[prop][prop2].Nombre);
            arrayHorasProyectosMeses.push(arrayAuxProyectoMeses[prop][prop2].Horas);
            colorsArrayHorasPorMes.push('rgba(' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', 1)');
          }
        }

        if(arrayNombreProyectosMeses === undefined  || arrayNombreProyectosMeses.length == 0){
          arrayNombreProyectosMeses.push('Sin registros');
            arrayHorasProyectosMeses.push(0);
        }
        if(arrayNombreProyectos === undefined  || arrayNombreProyectos.length == 0){
          arrayNombreProyectos.push('Sin registros');
          arrayHorasProyectos.push(0);
        }

        /* Se llena el arreglo arrayHorasAprobadas con los estados de Aprobado de los registros de trabajo al AÑO*/
        /* Se llena el arreglo arrayHorasRechazadas con los estados de Rechazado de los registros de trabajo al AÑO*/
        /* Se llena el arreglo arrayHorasPendientes con los estados de Pendiente de los registros de trabajo al AÑO*/
        /* Se llena el arreglo colorsArrayEstadoHorasAnio el numero de registros de color estado de registros de trabajo al AÑO*/
        for (var x = 0; x < data[3].totalhoursxstatusxYEAR.length; x++) {
          arrayHorasAprobadas.push(data[3].totalhoursxstatusxYEAR[x].Aprobado);
          arrayHorasRechazadas.push(data[3].totalhoursxstatusxYEAR[x].Rechazado);
          arrayHorasPendientes.push(data[3].totalhoursxstatusxYEAR[x].Pendiente);
          colorsArrayEstadoHorasAnio.push('rgba(' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', 1)');
        }

        /* Se llena el arreglo arrayHorasAprobadas con los estados de Aprobado de los registros de trabajo al AÑO*/
        /* Se llena el arreglo arrayHorasRechazadas con los estados de Rechazado de los registros de trabajo al AÑO*/
        /* Se llena el arreglo arrayHorasPendientes con los estados de Pendiente de los registros de trabajo al AÑO*/
        /* Se llena el arreglo colorsArrayEstadoHorasAnio el numero de registros de color estado de registros de trabajo al AÑO*/
        for (var x = 0; x < data[4].totalhoursxstatusMONTH.length; x++) {
          arrayHorasAprobadasMes.push(data[4].totalhoursxstatusMONTH[x].Aprobado);
          arrayHorasRechazadasMes.push(data[4].totalhoursxstatusMONTH[x].Rechazado);
          arrayHorasPendientesMes.push(data[4].totalhoursxstatusMONTH[x].Pendiente);
          colorsArrayEstadoHorasMes.push('rgba(' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', 1)');
        }

        /* Se llena el arreglo arrayHorasEstadoAprobadasMes con los estados de Aprobado de los registros de trabajo por Mes*/
        /* Se llena el arreglo arrayHorasEstadoRechazadasMes con los estados de Rechazado de los registros de trabajo por Mes*/
        /* Se llena el arreglo arrayHorasEstadoPendientesMes con los estados de Pendiente de los registros de trabajo por Mes*/
        /* Se llena el arreglo colorsArrayEstadoHorasRegistroMes con los estados de los registros de trabajo por Mes*/
        for (var x = 0; x < data[5].totalhoursxmonthxSTATUS.length; x++) {
          arrayHorasEstadoAprobadasMes.push(data[5].totalhoursxmonthxSTATUS[x][x + 1].Aprobado);
          arrayHorasEstadoRechazadasMes.push(data[5].totalhoursxmonthxSTATUS[x][x + 1].Rechazado);
          arrayHorasEstadoPendientesMes.push(data[5].totalhoursxmonthxSTATUS[x][x + 1].Pendiente);
          colorsArrayEstadoHorasRegistroMes.push('rgba(66,109,169, 1)');
          colorsArrayEstadoHorasRegistroMesMorado.push('rgba(100,32,119, 1)');
        }

        /*for (var index = 0; index < data[7].totalHoursProjectXDay.length; index++) {
          miArray.push(data[7].totalHoursProjectXDay[index])
        }

        for (var prop in miArray) {
          for (var prop2 in miArray[prop]) {
            arregloValues.push(miArray[prop][prop2])
            miArreglo.push(Object.keys((miArray[prop])))
          }
        }

        for (var prop in miArreglo) {
          for (var prop2 in miArreglo[prop]) {
            arregloNombresValues.push(miArreglo[prop][prop2])
          }
        }

        var unique = [...new Set(arregloNombresValues)];

        for (var index = 0; index < arregloValues.length; index++) {
          arreglosValues.push(arregloValues[index]);
        }

        for (var prop in arreglosValues) {
          for (var prop2 in arreglosValues[prop]) {
            general.push(arreglosValues[prop][prop2])

          }
        }
        console.log('GENERAL 1')
        console.log(general)

        console.log('GENERAL 2')
        console.log(general)

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


        function renderChart(infoData) {
          console.log('infodata')
          console.log(infoData)
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
          
          Gráfica de Horas Disponibles a registrar / Horas registradas 
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
       }*/

        $(document).ready(function () {

          //renderChart(dataArray);

          /* Variables para obtener cada una de las gráficas */
          var ctx = document.getElementById("myChart");
          var ctxEstadoRegistrosMes = document.getElementById("myChartEstadoRegistrosMes");
          var ctxDoughnutMonth = document.getElementById("myChartDoughnutMonth");
          var ctxDoughnutYear = document.getElementById("myChartDoughnutYear");
          var ctxPieYear = document.getElementById("myChartPieYear");
          var ctxPieMonth = document.getElementById("myChartPieMonth");


          /* Gráfica de Estado de Registros de Trabajo AProbado / Rechazado / Pendiente por cada mes */
          var myChartEstadoRegistrosMes = new Chart(ctxEstadoRegistrosMes, {
            type: 'bar',
            data: data,
            data: {
              labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
              datasets: [{
                  label: 'Horas Aprobadas',
                  data: [arrayHorasEstadoAprobadasMes[0], arrayHorasEstadoAprobadasMes[1], arrayHorasEstadoAprobadasMes[2], arrayHorasEstadoAprobadasMes[3], arrayHorasEstadoAprobadasMes[4], arrayHorasEstadoAprobadasMes[5], arrayHorasEstadoAprobadasMes[6], arrayHorasEstadoAprobadasMes[7], arrayHorasEstadoAprobadasMes[8], arrayHorasEstadoAprobadasMes[9], arrayHorasEstadoAprobadasMes[10], arrayHorasEstadoAprobadasMes[11]],
                  backgroundColor: colorsArrayEstadoHorasRegistroMes,
                  borderColor: colorsArrayEstadoHorasRegistroMes

                }, {
                  label: 'Horas Rechazadas',
                  data: [arrayHorasEstadoRechazadasMes[0], arrayHorasEstadoRechazadasMes[1], arrayHorasEstadoRechazadasMes[2], arrayHorasEstadoRechazadasMes[3], arrayHorasEstadoRechazadasMes[4], arrayHorasEstadoRechazadasMes[5], arrayHorasEstadoRechazadasMes[6], arrayHorasEstadoRechazadasMes[7], arrayHorasEstadoRechazadasMes[8], arrayHorasEstadoRechazadasMes[9], arrayHorasEstadoRechazadasMes[10], arrayHorasEstadoRechazadasMes[11]],
                  backgroundColor: colorsArrayEstadoHorasRegistroMesMorado,
                  borderColor: colorsArrayEstadoHorasRegistroMesMorado,
                  borderWidth: 2,
                  type: 'bar'
                },
                {
                  label: 'Horas Pendientes',
                  data: [arrayHorasEstadoPendientesMes[0], arrayHorasEstadoPendientesMes[1], arrayHorasEstadoPendientesMes[2], arrayHorasEstadoPendientesMes[3], arrayHorasEstadoPendientesMes[4], arrayHorasEstadoPendientesMes[5], arrayHorasEstadoPendientesMes[6], arrayHorasEstadoPendientesMes[7], arrayHorasEstadoPendientesMes[8], arrayHorasEstadoPendientesMes[9], arrayHorasEstadoPendientesMes[10], arrayHorasEstadoPendientesMes[11]],

                  borderWidth: 2,
                  type: 'bar'
                }
              ],
              labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
              labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
            },
            options: {
              easing: 'easeOutSine',
              maintainAspectRatio: false,
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });

          /* Gráfica de Horas Disponibles a registrar / Horas registradas */
          var myChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            data: {
              labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
              datasets: [{
                label: 'Horas Esperadas',
                data: [arrayDatosHorasDisponibles[0], arrayDatosHorasDisponibles[1], arrayDatosHorasDisponibles[2], arrayDatosHorasDisponibles[3], arrayDatosHorasDisponibles[4], arrayDatosHorasDisponibles[5], arrayDatosHorasDisponibles[6], arrayDatosHorasDisponibles[7], arrayDatosHorasDisponibles[8], arrayDatosHorasDisponibles[9], arrayDatosHorasDisponibles[10], arrayDatosHorasDisponibles[11]],

              }, {
                label: 'Horas Aprobadas',
                data: [arrayDatosHorasRegistradas[0], arrayDatosHorasRegistradas[1], arrayDatosHorasRegistradas[2], arrayDatosHorasRegistradas[3], arrayDatosHorasRegistradas[4], arrayDatosHorasRegistradas[5], arrayDatosHorasRegistradas[6], arrayDatosHorasRegistradas[7], arrayDatosHorasRegistradas[8], arrayDatosHorasRegistradas[9], arrayDatosHorasRegistradas[10], arrayDatosHorasRegistradas[11]],
                backgroundColor: colorsArray,
                borderColor: colorsArray,
                borderWidth: 2,
                type: 'bar'
              }],
              labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
            },
            options: {
              maintainAspectRatio: false,
              scales: {
                /*yAxes: [{
                    stacked: true,
                    ticks: {
                      beginAtZero: true
                    }
                  }],
                  yAxes: [{
                    stacked: true,
                    ticks: {
                      beginAtZero: true
                    }
                  }]*/
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });

          /* Gráfica de Estado de Horas registradas al año */
          var myChartDoughnutYear = new Chart(ctxDoughnutYear, {
            type: 'doughnut',
            data: data,
            cutoutPercentage: 50,
            data: {
              labels: arrayNombreProyectos,
              datasets: [{
                data: arrayHorasProyectos,
                backgroundColor: ['rgba(100,32,119, 1)', 'rgba(52,217,195, 1)', 'rgba(66,109,169, 1)', 'rgba(167,230,217, 1)', 'rgba(104,2,2, 1)','rgba(210,208,205,1)'],
                borderColor: ['rgba(100,32,119, 1)', 'rgba(52,217,195, 1)', 'rgba(66,109,169, 1)', 'rgba(167,230,217, 1)', 'rgba(104,2,2, 1)','rgba(210,208,205,1)']

              }]
            },
            options: {
              cutoutPercentage: 50,
              maintainAspectRatio: false
            }
          });

          /* Gráfica de Horas registradas por proyecto al mes actual */
          var myChartDoughnutMonth = new Chart(ctxDoughnutMonth, {
            type: 'doughnut',
            data: data,
            data: {
              labels: arrayNombreProyectosMeses,
              datasets: [{
                label: 'Horas Esperadas',
                data: arrayHorasProyectosMeses,
                backgroundColor: ['rgba(100,32,119, 1)', 'rgba(52,217,195, 1)', 'rgba(66,109,169, 1)', 'rgba(167,230,217, 1)', 'rgba(104,2,2, 1)','rgba(210,208,205,1)'],
                borderColor: ['rgba(100,32,119, 1)', 'rgba(52,217,195, 1)', 'rgba(66,109,169, 1)', 'rgba(167,230,217, 1)', 'rgba(104,2,2, 1)','rgba(210,208,205,1)']

              }]
            },
            options: {

              maintainAspectRatio: false
            }
          });

          /* Gráfica de estado de horas registradas al Año */
          var myChartPieYear = new Chart(ctxPieYear, {
            type: 'pie',
            data: data,
            data: {
              labels: ['Aprobadas', 'Rechazadas', 'Pendientes'],
              datasets: [{
                label: 'Horas Esperadas',
                data: [arrayHorasAprobadas[0], arrayHorasRechazadas[1], arrayHorasPendientes[2]],
                backgroundColor: ['rgba(66,109,169, 1)', 'rgba(100,32,119, 1)'],
                borderColor: ['rgba(66,109,169, 1)', 'rgba(100,32,119, 1)']

              }]
            },
            options: {

              maintainAspectRatio: false
            }
          });

          /* Gráfica de estado de horas registradas al Mes Actual */
          var myChartPieMonth = new Chart(ctxPieMonth, {
            type: 'pie',
            data: data,
            data: {
              labels: ['Aprobadas', 'Rechazadas', 'Pendientes'],
              datasets: [{
                label: 'Horas Esperadas',
                data: [
                  [0], arrayHorasRechazadasMes[1], arrayHorasPendientesMes[2]
                ],
                backgroundColor: ['rgarrayHorasAprobadasMesba(66,109,169, 1)', 'rgba(100,32,119, 1)'],
                borderColor: ['rgba(66,109,169, 1)', 'rgba(100,32,119, 1)']

              }]
            },
            options: {

              maintainAspectRatio: false
            }
          });






        });
        getPhoto();
        getUser();
        getGroup();
        getMyHours();

      })
      .catch(function (e) {
        console.log(e);
        //alert("Error al cargar tus registros");
      });//

    function getHours() {
      return DashboardService.get()
        .then(function (data) {
          //console.log('----------Entro a getHours----------')
          var t0 = performance.now();
          var data = JSON.parse(data);

          /*console.log('ADENTRO Data')
          // console.log(data)
          console.log('ADENTRO [7]')
          console.log(data[7])
          console.log('ADENTRO dias')
          console.log(data[7]['dias'])/*
          /* Arreglos para la funcionalidad de las gráficas */
          var arrayDatosHorasDisponibles = [];
          var arrayDatosHorasRegistradas = [];

          var colorsArray = [];
          var colorsArrayHorasAlAnio = [];
          var colorsArrayHorasPorMes = [];

          var arrayNombreProyectos = [];
          var arrayHorasProyectos = [];
          var arrayNombreProyectosMeses = [];
          var arrayHorasProyectosMeses = [];

          var arrayAux = [];
          var arrayAuxMeses = [];
          var arrayAuxProyecto = [];
          var arrayAuxProyectoMeses = [];

          var arrayHorasAprobadas = [];
          var arrayHorasRechazadas = [];
          var arrayHorasPendientes = [];
          var colorsArrayEstadoHorasAnio = [];

          var arrayHorasAprobadasMes = [];
          var arrayHorasRechazadasMes = [];
          var arrayHorasPendientesMes = [];
          var colorsArrayEstadoHorasMes = [];

          var arrayHorasEstadoAprobadasMes = [];
          var arrayHorasEstadoRechazadasMes = [];
          var arrayHorasEstadoPendientesMes = [];
          var colorsArrayEstadoHorasRegistroMes = [];
          var colorsArrayEstadoHorasRegistroMesMorado = [];

          /*var arrayDias = [];
          var arrayDiasAux = [];
          var arrayDiasNombre = [];
          var arrayDiasProyectos = [];
          var arrayProyectoDiasCompletos =[];
          var arrayProyectoDia0 =[];
          var arrayNombrePordia=[];
          var ejemplotexto = '';*/

          /* Se llena el arreglo arrayDatosHorasDisponibles con las horas disponibles a registrar al año por Mes*/
          /* Se llena el arreglo arrayDatosHorasRegistradas con las horas registradas al año por Mes*/
          /* Se llena el arreglo colorsArray el numero de registros de color para cada mes del año*/
          for (var x = 0; x < data[0].totalhoursxmonth.length; x++) {
            arrayDatosHorasDisponibles.push(data[0].totalhoursxmonth[x][x + 1].horasDisponibles);
            arrayDatosHorasRegistradas.push(data[0].totalhoursxmonth[x][x + 1].horasRegistradas);
            colorsArray.push('rgba(100,32,119, 1)');
          }

          /* Se llena el arreglo arrayAux con cada uno de los proyectos al AÑO */
          for (var a = 0; a < data[1].totalhoursxmonthxproyectYEAR.length; a++) {
            arrayAux.push(data[1].totalhoursxmonthxproyectYEAR[a]);
          }

          /* Se llena el arreglo arrayAux con cada uno de los proyectos por MES */
          for (var a = 0; a < data[2].totalhoursxmonthxproyectMONTH.length; a++) {
            arrayAuxMeses.push(data[2].totalhoursxmonthxproyectMONTH[a]);
          }

          /* Se llena el arreglo arrayAuxProyecto con cada uno de los registros de los proyectos al AÑO*/
          for (var a = 0; a < arrayAux.length; a++) {
            arrayAuxProyecto.push(arrayAux[a]);
          }

          /* Se llena el arreglo arrayAuxProyectoMeses con cada uno de los registros de los proyectos por MES*/
          for (var a = 0; a < arrayAuxMeses.length; a++) {
            arrayAuxProyectoMeses.push(arrayAuxMeses[a]);
          }

          /* Se llena el arreglo arrayNombreProyectos con el nombre de cada proyecto al AÑO*/
          /* Se llena el arreglo arrayHorasProyectos con las horas de cada proyecto al AÑO*/
          /* Se llena el arreglo colorsArrayHorasAlAnio el numero de registros de color para cada mes del año*/
          for (var prop in arrayAuxProyecto) {
            for (var prop2 in arrayAuxProyecto[prop]) {
              arrayNombreProyectos.push(arrayAuxProyecto[prop][prop2].Nombre);
              arrayHorasProyectos.push(arrayAuxProyecto[prop][prop2].Horas);
              colorsArrayHorasAlAnio.push('rgba(' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', 1)');
            }
          }

          /* Se llena el arreglo arrayNombreProyectos con el nombre de cada proyecto al AÑO*/
          /* Se llena el arreglo arrayHorasProyectos con las horas de cada proyecto al AÑO*/
          /* Se llena el arreglo colorsArrayHorasAlAnio el numero de registros de color para cada mes del año*/
          for (var prop in arrayAuxProyectoMeses) {
            for (var prop2 in arrayAuxProyectoMeses[prop]) {
              arrayNombreProyectosMeses.push(arrayAuxProyectoMeses[prop][prop2].Nombre);
              arrayHorasProyectosMeses.push(arrayAuxProyectoMeses[prop][prop2].Horas);
              colorsArrayHorasPorMes.push('rgba(' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', 1)');
            }
          }

         

          /* Se llena el arreglo arrayHorasAprobadas con los estados de Aprobado de los registros de trabajo al AÑO*/
          /* Se llena el arreglo arrayHorasRechazadas con los estados de Rechazado de los registros de trabajo al AÑO*/
          /* Se llena el arreglo arrayHorasPendientes con los estados de Pendiente de los registros de trabajo al AÑO*/
          /* Se llena el arreglo colorsArrayEstadoHorasAnio el numero de registros de color estado de registros de trabajo al AÑO*/
          for (var x = 0; x < data[3].totalhoursxstatusxYEAR.length; x++) {
            arrayHorasAprobadas.push(data[3].totalhoursxstatusxYEAR[x].Aprobado);
            arrayHorasRechazadas.push(data[3].totalhoursxstatusxYEAR[x].Rechazado);
            arrayHorasPendientes.push(data[3].totalhoursxstatusxYEAR[x].Pendiente);
            colorsArrayEstadoHorasAnio.push('rgba(' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', 1)');
          }

          /* Se llena el arreglo arrayHorasAprobadas con los estados de Aprobado de los registros de trabajo al AÑO*/
          /* Se llena el arreglo arrayHorasRechazadas con los estados de Rechazado de los registros de trabajo al AÑO*/
          /* Se llena el arreglo arrayHorasPendientes con los estados de Pendiente de los registros de trabajo al AÑO*/
          /* Se llena el arreglo colorsArrayEstadoHorasAnio el numero de registros de color estado de registros de trabajo al AÑO*/
          for (var x = 0; x < data[4].totalhoursxstatusMONTH.length; x++) {
            arrayHorasAprobadasMes.push(data[4].totalhoursxstatusMONTH[x].Aprobado);
            arrayHorasRechazadasMes.push(data[4].totalhoursxstatusMONTH[x].Rechazado);
            arrayHorasPendientesMes.push(data[4].totalhoursxstatusMONTH[x].Pendiente);
            colorsArrayEstadoHorasMes.push('rgba(' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', 1)');
          }

          /* Se llena el arreglo arrayHorasEstadoAprobadasMes con los estados de Aprobado de los registros de trabajo por Mes*/
          /* Se llena el arreglo arrayHorasEstadoRechazadasMes con los estados de Rechazado de los registros de trabajo por Mes*/
          /* Se llena el arreglo arrayHorasEstadoPendientesMes con los estados de Pendiente de los registros de trabajo por Mes*/
          /* Se llena el arreglo colorsArrayEstadoHorasRegistroMes con los estados de los registros de trabajo por Mes*/
          for (var x = 0; x < data[5].totalhoursxmonthxSTATUS.length; x++) {
            arrayHorasEstadoAprobadasMes.push(data[5].totalhoursxmonthxSTATUS[x][x + 1].Aprobado);
            arrayHorasEstadoRechazadasMes.push(data[5].totalhoursxmonthxSTATUS[x][x + 1].Rechazado);
            arrayHorasEstadoPendientesMes.push(data[5].totalhoursxmonthxSTATUS[x][x + 1].Pendiente);
            colorsArrayEstadoHorasRegistroMes.push('rgba(66,109,169, 1)');
            colorsArrayEstadoHorasRegistroMesMorado.push('rgba(100,32,119, 1)');
          }


          $(document).ready(function () {
            /* Variables para obtener cada una de las gráficas */
            var ctx = document.getElementById("myChart");
            var ctxEstadoRegistrosMes = document.getElementById("myChartEstadoRegistrosMes");
            var ctxDoughnutMonth = document.getElementById("myChartDoughnutMonth");
            var ctxDoughnutYear = document.getElementById("myChartDoughnutYear");
            var ctxPieYear = document.getElementById("myChartPieYear");
            var ctxPieMonth = document.getElementById("myChartPieMonth");
            var ctxWeek = document.getElementById("myChartWeek");

            /* Gráfica de Estado de Registros de Trabajo AProbado / Rechazado / Pendiente por cada mes */
            var myChartEstadoRegistrosMes = new Chart(ctxEstadoRegistrosMes, {
              type: 'bar',
              data: data,
              data: {
                labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                datasets: [{
                    label: 'Horas Aprobadas',
                    data: [arrayHorasEstadoAprobadasMes[0], arrayHorasEstadoAprobadasMes[1], arrayHorasEstadoAprobadasMes[2], arrayHorasEstadoAprobadasMes[3], arrayHorasEstadoAprobadasMes[4], arrayHorasEstadoAprobadasMes[5], arrayHorasEstadoAprobadasMes[6], arrayHorasEstadoAprobadasMes[7], arrayHorasEstadoAprobadasMes[8], arrayHorasEstadoAprobadasMes[9], arrayHorasEstadoAprobadasMes[10], arrayHorasEstadoAprobadasMes[11]],
                    backgroundColor: colorsArrayEstadoHorasRegistroMes,
                    borderColor: colorsArrayEstadoHorasRegistroMes

                  }, {
                    label: 'Horas Rechazadas',
                    data: [arrayHorasEstadoRechazadasMes[0], arrayHorasEstadoRechazadasMes[1], arrayHorasEstadoRechazadasMes[2], arrayHorasEstadoRechazadasMes[3], arrayHorasEstadoRechazadasMes[4], arrayHorasEstadoRechazadasMes[5], arrayHorasEstadoRechazadasMes[6], arrayHorasEstadoRechazadasMes[7], arrayHorasEstadoRechazadasMes[8], arrayHorasEstadoRechazadasMes[9], arrayHorasEstadoRechazadasMes[10], arrayHorasEstadoRechazadasMes[11]],
                    backgroundColor: colorsArrayEstadoHorasRegistroMesMorado,
                    borderColor: colorsArrayEstadoHorasRegistroMesMorado,
                    borderWidth: 2,
                    type: 'bar'
                  },
                  {
                    label: 'Horas Pendientes',
                    data: [arrayHorasEstadoPendientesMes[0], arrayHorasEstadoPendientesMes[1], arrayHorasEstadoPendientesMes[2], arrayHorasEstadoPendientesMes[3], arrayHorasEstadoPendientesMes[4], arrayHorasEstadoPendientesMes[5], arrayHorasEstadoPendientesMes[6], arrayHorasEstadoPendientesMes[7], arrayHorasEstadoPendientesMes[8], arrayHorasEstadoPendientesMes[9], arrayHorasEstadoPendientesMes[10], arrayHorasEstadoPendientesMes[11]],

                    borderWidth: 2,
                    type: 'bar'
                  }
                ],
                labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
              },
              options: {
                easing: 'easeOutSine',
                maintainAspectRatio: false,
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }
              }
            });

            /* Gráfica de Horas Disponibles a registrar / Horas registradas */
            var myChart = new Chart(ctx, {
              type: 'bar',
              data: data,
              data: {
                labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                datasets: [{
                  label: 'Horas Esperadas',
                  data: [arrayDatosHorasDisponibles[0], arrayDatosHorasDisponibles[1], arrayDatosHorasDisponibles[2], arrayDatosHorasDisponibles[3], arrayDatosHorasDisponibles[4], arrayDatosHorasDisponibles[5], arrayDatosHorasDisponibles[6], arrayDatosHorasDisponibles[7], arrayDatosHorasDisponibles[8], arrayDatosHorasDisponibles[9], arrayDatosHorasDisponibles[10], arrayDatosHorasDisponibles[11]],

                }, {
                  label: 'Horas Aprobadas',
                  data: [arrayDatosHorasRegistradas[0], arrayDatosHorasRegistradas[1], arrayDatosHorasRegistradas[2], arrayDatosHorasRegistradas[3], arrayDatosHorasRegistradas[4], arrayDatosHorasRegistradas[5], arrayDatosHorasRegistradas[6], arrayDatosHorasRegistradas[7], arrayDatosHorasRegistradas[8], arrayDatosHorasRegistradas[9], arrayDatosHorasRegistradas[10], arrayDatosHorasRegistradas[11]],
                  backgroundColor: colorsArray,
                  borderColor: colorsArray,
                  borderWidth: 2,
                  type: 'bar'
                }],
                labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
              },
              options: {
                maintainAspectRatio: false,
                scales: {
                  /*yAxes: [{
                      stacked: true,
                      ticks: {
                        beginAtZero: true
                      }
                    }],
                    yAxes: [{
                      stacked: true,
                      ticks: {
                        beginAtZero: true
                      }
                    }]*/
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }
              }
            });

            /* Gráfica de Estado de Horas registradas al año */
            var myChartDoughnutYear = new Chart(ctxDoughnutYear, {
              type: 'doughnut',
              data: data,
              cutoutPercentage: 50,
              data: {
                labels: arrayNombreProyectos,
                datasets: [{
                  data: arrayHorasProyectos,
                  backgroundColor: ['rgba(100,32,119, 1)', 'rgba(52,217,195, 1)', 'rgba(66,109,169, 1)', 'rgba(167,230,217, 1)', 'rgba(104,2,2, 1)','rgba(210,208,205,1)'],
                  borderColor: ['rgba(100,32,119, 1)', 'rgba(52,217,195, 1)', 'rgba(66,109,169, 1)', 'rgba(167,230,217, 1)', 'rgba(104,2,2, 1)','rgba(210,208,205,1)']

                }]
              },
              options: {
                cutoutPercentage: 50,
                maintainAspectRatio: false
              }
            });

            /* Gráfica de Horas registradas por proyecto al mes actual */
            var myChartDoughnutMonth = new Chart(ctxDoughnutMonth, {
              type: 'doughnut',
              data: data,
              data: {
                labels: arrayNombreProyectosMeses,
                datasets: [{
                  label: 'Horas Esperadas',
                  data: arrayHorasProyectosMeses,
                  backgroundColor: ['rgba(210,208,205,1)', 'rgba(100,32,119, 1)', 'rgba(52,217,195, 1)', 'rgba(66,109,169, 1)', 'rgba(167,230,217, 1)', 'rgba(104,2,2, 1)'],
                  borderColor: ['rgba(210,208,205,1)', 'rgba(100,32,119, 1)', 'rgba(52,217,195, 1)', 'rgba(66,109,169, 1)', 'rgba(167,230,217, 1)', 'rgba(104,2,2, 1)']

                }]
              },
              options: {

                maintainAspectRatio: false
              }
            });

            /* Gráfica de estado de horas registradas al Año */
            var myChartPieYear = new Chart(ctxPieYear, {
              type: 'pie',
              data: data,
              data: {
                labels: ['Aprobadas', 'Rechazadas', 'Pendientes'],
                datasets: [{
                  label: 'Horas Esperadas',
                  data: [arrayHorasAprobadas[0], arrayHorasRechazadas[1], arrayHorasPendientes[2]],
                  backgroundColor: ['rgba(66,109,169, 1)', 'rgba(100,32,119, 1)'],
                  borderColor: ['rgba(66,109,169, 1)', 'rgba(100,32,119, 1)']

                }]
              },
              options: {

                maintainAspectRatio: false
              }
            });

            /* Gráfica de estado de horas registradas al Mes Actual */
            var myChartPieMonth = new Chart(ctxPieMonth, {
              type: 'pie',
              data: data,
              data: {
                labels: ['Aprobadas', 'Rechazadas', 'Pendientes'],
                datasets: [{
                  label: 'Horas Esperadas',
                  data: [arrayHorasAprobadasMes[0], arrayHorasRechazadasMes[1], arrayHorasPendientesMes[2]],
                  backgroundColor: ['rgba(66,109,169, 1)', 'rgba(100,32,119, 1)'],
                  borderColor: ['rgba(66,109,169, 1)', 'rgba(100,32,119, 1)']

                }]
              },
              options: {

                maintainAspectRatio: false
              }
            });





          });
          getPhoto();
          getUser();
          getGroup();
          getMyHours();
          var t1 = performance.now();
          console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.  GET HOURS")
        })
        .catch(function (e) {
          console.log(e);
          alert("Error al cargar tus registros");
        });





    }


    /**
     * Get all hours from Salesforce API
     */
    function getPeriods() {
      $scope.periods = null
      return PeriodService.get().then(function (data) {
        $scope.periods = data;
      });
    }

    function getUser() {
      return $scope.agentName = localStorage.name;
    }

    function getPhoto() {
      return $scope.photo = localStorage.photo;
    }

    function getGroup() {
      return $scope.myGroup = localStorage.myGroup;
    }

    function getMyHours() {
      return $scope.hours = localStorage.hours;
    }


  }
})();