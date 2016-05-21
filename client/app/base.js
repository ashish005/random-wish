/**
 * Created by wiznidev on 5/21/16.
 */
(function () {
    var appName = 'goLive';
    window['name'] = appName;

    var app = angular.module(appName, ['ui.bootstrap']);
    var _rootPath = './app/';

    function config($routeProvider) {

    }
    function angularHelper( $controllerProvider, $provide, $compileProvider ) {
        // Let's keep the older references.
        app._controller = app.controller;
        app._service = app.service;
        app._factory = app.factory;
        app._value = app.value;
        app._directive = app.directive;

        // Provider-based controller.
        app.controller = function( name, constructor ) {
            $controllerProvider.register( name, constructor );
            return(this);
        };

        // Provider-based service.
        app.service = function( name, constructor ) {
            $provide.service( name, constructor );
            return(this);
        };

        // Provider-based factory.
        app.factory = function( name, factory ) {
            $provide.factory( name, factory );
            return(this);
        };

        // Provider-based value.
        app.value = function( name, value ) {
            $provide.value( name, value );
            return(this);
        };
        // Provider-based directive.
        app.directive = function( name, factory ) {
            $compileProvider.directive( name, factory );
            return(this);
        };
    }

    function ideController($scope){
    };

    function landingScrollspy(){
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.scrollspy({
                    target: '.navbar-fixed-top',
                    offset: 80
                });
            }
        }
    }

    app
        .config(angularHelper)
        .directive('ideHeader', ['appMenu', 'appInfo','userInfo', function (appMenu, appInfo, userInfo) {
            return {
                restrict: 'AE',
                templateUrl: _rootPath+'header.html',
                link: function (scope, elem) {},
                controller:function($scope){
                    $scope.menuInfo = appMenu;
                    $scope.appInfo = appInfo;
                    $scope.userInfo = userInfo;
                }
            };
        }])
        .directive('ideHome', function () {
            return {
                restrict: 'AE',
                templateUrl: _rootPath+'home.html',
                link: function (scope, elem) {},
                controller:function($scope){
                }
            };
        })
        .directive('landingScrollspy', landingScrollspy)
        .controller('ideController', ideController)
        .run(['$rootScope', function($rootScope) {
            $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {});
            $rootScope.$on('$routeChangeSuccess', function (event, nextRoute, currentRoute) {});
            $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {});
            $rootScope.$on('$viewContentLoaded', function () {});
        }]);

    angular.element(document).ready(function () {
        var initInjector = angular.injector(["ng"]);
        var $http = initInjector.get("$http");
        $http({method: 'GET', url: '/apis/setup'}).then(function (resp)
        {
            app.constant('appMenu', resp['data']['menu']);
            app.constant('appInfo', resp['data']['app']);
            app.constant('userInfo', resp['data']['user']);
            document.body.innerHTML='<div><div ide-header></div><div landing-scrollspy ng-view ng-controller="ideController" ide-home> </div></div>';
            angular.bootstrap(document, [appName]);
        }, function (error) {
            throw new Error('Config file has error : ' + error);
        });
    });
    return;
})();