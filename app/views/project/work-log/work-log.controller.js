(function () {
  "use strict";

  var globalCallout = false
  angular.module("app").controller("WorkLogController", WorkLogController)
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
           angular.element('#formPrin')[0].style.opacity="0.4";
          }catch(e){}
            scope.globalCallout = true;
            elm.show();
          } else {
            try{
            angular.element('#formPrin')[0].style.opacity="1";
          }catch(e){}
            elm.hide();
            scope.globalCallout = false;
          }

        });
      }
    }
  }]);



  WorkLogController.$inject = [
    "$http",
    '$scope',
    "authService",
    "$state",
    "$filter",
    "WorkLogService",
    "$localStorage",
    "toastr"
  ];

  function WorkLogController(
    $http,
    $scope,
    authService,
    $state,
    $filter,
    WorkLogService,
    $localStorage,
    toastr
  ) {
    var vm = this;
    vm.worklogs = {};
    vm.auth = authService;
    activate();

    function activate() {
      if (vm.auth.isAuthenticated() == true) {
        getWorkLogs();
      } else {
        vm.auth.logout();
      }
    }

    /**
     * Get all worklogs from Salesforce API
     */

    function getWorkLogs() {
      return WorkLogService.get()
        .then(function (data) {
          var datos = JSON.stringify(data)
          $(document).ready(function () {
            $("#worklogs").DataTable({
              data: data,
              columns: [{
                  data: "project"
                },
                {
                  data: "stageName"
                },
                {
                  data: "category"
                },
                {
                  data: "workDate",
                  date: 'dd/MM/yyyy'
                },
                {
                  data: "wroklogTime"
                },
                {
                  data: "comment"
                },
                {
                  data: "status"
                }
              ],
              columnDefs: [{
                targets: 0
              }],

              aaSorting: [3, "desc"],
              pageLength: 10,
              info: false,
              language: {
                url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
              }
            });

            var table = $('#example').DataTable({
              "footerCallback": function (row, data, start, end, display) {
                var api = this.api(),
                  data;

                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                  return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                    i : 0;
                };

                // Total over all pages
                var total = api
                  .column(4)
                  .data()
                  .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                  }, 0);

                // Total over this page
                var pageTotal = api
                  .column(4, {
                    page: 'current'
                  })
                  .data()
                  .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                  }, 0);

                // Update footer
                $(api.column(4).footer()).html(
                  pageTotal + ' Horas'
                );
              },
              responsive: true,
              data: data,
              columns: [{
                  data: 'project'
                },
                {
                  data: 'stageName'
                },
                {
                  data: 'category'
                },
                {
                  data: 'workDate',

                },
                {
                  data: 'wroklogTime'
                },
                {
                  data: 'comment'
                },
                {
                  data: 'status'
                }
              ], 
              "columnDefs": [{
                  "targets": 7,
                  "data": data['idWorklog'],
                  "defaultContent": "<center><i class='material-icons' style='cursor:pointer;'>delete</i></center>"
                },
                {
                  targets: 1,
                  width: "20px"
                },
                {
                  targets: 5,
                  render: function (data, type, row) {
                    return data.substr(0, 20) + '…';
                  }
                }
              ],
              targets: 4,
              createdRow: function (row, data, index) {
                if(data.bDelete == false){
                  $('td', row).eq(7).addClass('graybutton');
                }
                if (data.status === 'Aprobado' || data.status == 'Aprobado') {
                  $('td', row).eq(6).addClass('approved');
                } else if (data.status === 'Rechazado' || data.status == 'Rechazado') {
                  $('td', row).eq(6).addClass('rejected');
                }
              },
              aaSorting: [3, "desc"],
              pageLength: 10,
              info: false,
              language: {
                url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
              }


            });

            $('#example tbody').on('click', 'i', function () {
              var data = table.row($(this).parents('tr')).data(); 

              var tr = $(this).closest('tr');
              var rowData = $('#example').DataTable().row(tr).data();

              myFunction(data);

              //alert(data['idWorklog'] + "'s salary is: " + data['project']);
            });

            function myFunction(data) {
              var txt;


              $('#numeroRegistro').innerHTML = data['idWorklog'];
              $('#numeroRegistroDOS').html('Hello World!');
              $('#numeroRegistroDos').innerHTML = 'ewew';
              //$("#myModal").modal("show")

              if (confirm("¿Deseas borrar el registro?")) {
                WorkLogService.deleteWorklog(data['idWorklog']).then(function (data) {
                  if (data != null) {
                    if (data.success == true) {
                      toastr.success(data.message, 'Notificación', {
                        closeButton: true,
                        //  iconClass: 'toast-blue',
                        positionClass: 'toast-bottom-left'
                      });
                      // getWorkLogs();

                    } else {
                      toastr.error(data.message, 'Notificación', {
                        closeButton: true,
                        //  iconClass: 'toast-blue',
                        positionClass: 'toast-bottom-left'
                      });
                    }
                  }

                });
              } else {
                txt = "You pressed Cancel!";
              }
              //alert(txt)
            }
          });
        })
        .catch(function (e) {
          console.log(e);
          //alert("Error al cargar tus registros");
        });
    }
  }
})();