(function () {
    var app = angular.module(window['name']);

    var _baseModulesPath = {
        baseUrl:'database-layer/',
        dbControlsTemplateUrl:'app/database-layer/controls/'
    };
    
    function databaseLayerBaseController($scope, $routeParams, dbLayerService, appInfo) {
        dbLayerService.getUserDatabases().then(function (resp, status, headers, config) {
            $scope.dbInfos =  resp.data['data'];
        }, function (error) {});
        $scope.databasePanals = {
            postgress:{ class:'panel-default', dbName:'Postgress' },
            sql:{ class:'panel-default', dbName:'SQL' },
            mySql:{ class:'panel-default', dbName:'mySql' },
            mongodb:{ class:'panel-default', dbName:'Mongodb' },
            oracle:{ class:'panel-default', dbName:'Oracle' },
            IBMDB:{ class:'panel-default', dbName:'IBMDB' }
        };
        /*{
            postgress:{ class:'panel-default', dbName:'Postgress' },
            sql:{ class:'panel-primary', dbName:'SQL' },
            mySql:{ class:'panel-success', dbName:'mySql' },
            mongodb:{ class:'panel-info', dbName:'Mongodb' },
            oracle:{ class:'panel-warning', dbName:'Oracle' },
            IBMDB:{ class:'panel-danger', dbName:'IBMDB' }
        };*/

        var dbConfigs = {
            postgress:{
                username:'postgres',
                password:'password@123',
                server:'127.0.0.1',
                port:5432,
                database:'postgres'
            }
        };

        $scope.config = dbConfigs['postgress'];

        $scope.saveFormData = function (data) {
            dbLayerService.getViewConfigs(data).then(function (resp, status, headers, config) {

            }, function (error) {});
        }

        $scope.changeTab = function (index) {
            $scope.tab = index;
        }
    };
    
    function dbConfigOptions($compile) {
        return {
            restrict: 'AE',
            scope:{
                config:'=',
                saveForm:'&?'
            },
            templateUrl: function () {
                var userRole = true, _optionTemplates = {
                    view:'config-options.view.html',
                    edit:'config-options.edit.html'
                };
                var _template = _optionTemplates.view;
                if (userRole) {
                    _template = _optionTemplates.edit;
                };
                return _baseModulesPath['dbControlsTemplateUrl'] +_template;
            },
            controller: function ($scope, $element) {
                $scope.saveFormInfo = function (e) {
                    $scope.saveForm()(e.config);
                }
            }
        };
    };

    function dbLayerService($http) {
        var _service = {
            submit: function (data) {
                return $http({method: 'post', url: '/apis/projectView', data: data});
            },
            getUserDatabases: function (req) {
                return $http({method: 'get', url: '/dblayer/userDbs', params: req});
            },
            getViewConfigs: function (req) {
                return $http({method: 'post', url: '/dblayer/db', data: req});
            }
        };
        return _service;
    }

    app
        .controller('databaseLayerBaseController', ['$scope', '$routeParams', 'dbLayerService', 'appInfo', databaseLayerBaseController])
        .directive('dbConfigOptions', dbConfigOptions)
        .service('dbLayerService', ['$http', dbLayerService])
})();