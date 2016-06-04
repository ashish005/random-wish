/**
 * Created by wiznidev on 5/21/16.
 */
(function () {
    var appName = 'goLive';
    window['name'] = appName;

    var app = angular.module(appName, ['ngRoute', appName+'.core', 'ui.bootstrap', 'ui.grid', 'ui.grid.infiniteScroll', 'ui.sortable']);
    var _rootPath = './app/';
    var _baseModulesPath = {
        templateUrl:'./app/'
    };

    var routeConfig = {
        home:{
            templateUrl: _baseModulesPath.templateUrl +'home.html'
        },
        projects:{
            templateUrl: _baseModulesPath.templateUrl +'projects/projects.html',
            controller:draggablePanels
        },
        apiTracker:{
            templateUrl: _baseModulesPath.templateUrl +'projects/projects.html',
            controller:ideViewController
        },
        admin:{
            templateUrl: _baseModulesPath.templateUrl +'admin/dashboard.html',
            controller:draggablePanels
        }
    };

    function config($routeProvider) {
        $routeProvider
            .when('/', routeConfig['home'])
            .when('/projects', routeConfig['projects'])
            .when('/admin', routeConfig['admin'])
            .when('/api-tracker', routeConfig['apiTracker'])
            .otherwise({redirectTo: '/'});//Handle all exceptions
    };

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

    function ideController($scope){};
    function ideViewController($scope){
    };

    function landingScrollspy(){
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                /*element.scrollspy({
                    target: '.navbar-fixed-top',
                    offset: 80
                });*/
            }
        }
    }
    function draggablePanels($scope) {

        $scope.sortableOptions = {
            connectWith: ".connectPanels",
            handler: ".ibox-title",
            helper: function (e, li) {
                this.copyHelper = li.clone().insertAfter(li);

                $(this).data('copied', false);

                return li.clone();
            },
            stop: function () {
                var copied = $(this).data('copied');

                if (!copied) {
                    this.copyHelper.remove();
                }

                this.copyHelper = null;
            },
            receive: function (e, ui) {
                ui.sender.data('copied', true);
            }
        };


        $scope.sortableReceiverOptions = {
            //placeholder: ".receiver-container",
            connectWith: "#receiver-container",
            receive: function (e, ui) {
                ui.sender.data('copied', true);
            }
        };
    }


    /**
     *   - Directive for iBox tools elements in right corner of ibox
     */
    function iboxTools($timeout) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: _rootPath+'controls/ibox_tools.html',
            controller: function ($scope, $element) {
                // Function for collapse ibox
                $scope.showhide = function () {
                    var ibox = $element.closest('div.ibox');
                    var icon = $element.find('i:first');
                    var content = ibox.find('div.ibox-content');
                    content.slideToggle(200);
                    // Toggle icon from up to down
                    icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    $timeout(function () {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, 50);
                },
                    // Function for close ibox
                    $scope.closebox = function () {
                        var ibox = $element.closest('div.ibox');
                        ibox.remove();
                    }
            }
        };
    };

    function ideGrid($q, $http, $timeout) {
        return {
            restrict: 'AE',
            templateUrl: _rootPath+'controls/grid.html',
            link: function (scope, elem) {

            },
            controller:function($scope, $element){
                $scope.gridHeight =  $(window).height()-270 +"px";
                $scope.gridOptions = {
                    infiniteScrollRowsFromEnd: 40,
                    infiniteScrollUp: true,
                    infiniteScrollDown: true,
                    columnDefs: [
                        { name:'id'},
                        { name:'name' },
                        { name:'age' }
                    ],
                    data: 'data',
                    onRegisterApi: function(gridApi){
                        gridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.getDataDown);
                        gridApi.infiniteScroll.on.needLoadMoreDataTop($scope, $scope.getDataUp);
                        $scope.gridApi = gridApi;
                    }
                };

                $scope.data = [];

                $scope.firstPage = 2;
                $scope.lastPage = 2;

                $scope.getFirstData = function() {
                    var promise = $q.defer();
                    $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/10000_complex.json')
                        .success(function(data) {
                            var newData = $scope.getPage(data, $scope.lastPage);
                            $scope.data = $scope.data.concat(newData);
                            promise.resolve();
                        });
                    return promise.promise;
                };

                $scope.getDataDown = function() {
                    var promise = $q.defer();
                    $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/10000_complex.json')
                        .success(function(data) {
                            $scope.lastPage++;
                            var newData = $scope.getPage(data, $scope.lastPage);
                            $scope.gridApi.infiniteScroll.saveScrollPercentage();
                            $scope.data = $scope.data.concat(newData);
                            $scope.gridApi.infiniteScroll.dataLoaded($scope.firstPage > 0, $scope.lastPage < 4).then(function() {$scope.checkDataLength('up');}).then(function() {
                                promise.resolve();
                            });
                        })
                        .error(function(error) {
                            $scope.gridApi.infiniteScroll.dataLoaded();
                            promise.reject();
                        });
                    return promise.promise;
                };

                $scope.getDataUp = function() {
                    var promise = $q.defer();
                    $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/10000_complex.json')
                        .success(function(data) {
                            $scope.firstPage--;
                            var newData = $scope.getPage(data, $scope.firstPage);
                            $scope.gridApi.infiniteScroll.saveScrollPercentage();
                            $scope.data = newData.concat($scope.data);
                            $scope.gridApi.infiniteScroll.dataLoaded($scope.firstPage > 0, $scope.lastPage < 4).then(function() {$scope.checkDataLength('down');}).then(function() {
                                promise.resolve();
                            });
                        })
                        .error(function(error) {
                            $scope.gridApi.infiniteScroll.dataLoaded();
                            promise.reject();
                        });
                    return promise.promise;
                };


                $scope.getPage = function(data, page) {
                    var res = [];
                    for (var i = (page * 100); i < (page + 1) * 100 && i < data.length; ++i) {
                        res.push(data[i]);
                    }
                    return res;
                };

                $scope.checkDataLength = function( discardDirection) {
                    // work out whether we need to discard a page, if so discard from the direction passed in
                    if( $scope.lastPage - $scope.firstPage > 3 ){
                        // we want to remove a page
                        $scope.gridApi.infiniteScroll.saveScrollPercentage();

                        if( discardDirection === 'up' ){
                            $scope.data = $scope.data.slice(100);
                            $scope.firstPage++;
                            $timeout(function() {
                                // wait for grid to ingest data changes
                                $scope.gridApi.infiniteScroll.dataRemovedTop($scope.firstPage > 0, $scope.lastPage < 4);
                            });
                        } else {
                            $scope.data = $scope.data.slice(0, 400);
                            $scope.lastPage--;
                            $timeout(function() {
                                // wait for grid to ingest data changes
                                $scope.gridApi.infiniteScroll.dataRemovedBottom($scope.firstPage > 0, $scope.lastPage < 4);
                            });
                        }
                    }
                };

                $scope.reset = function() {
                    $scope.firstPage = 2;
                    $scope.lastPage = 2;

                    // turn off the infinite scroll handling up and down - hopefully this won't be needed after @swalters scrolling changes
                    $scope.gridApi.infiniteScroll.setScrollDirections( false, false );
                    $scope.data = [];

                    $scope.getFirstData().then(function(){
                        $timeout(function() {
                            // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
                            $scope.gridApi.infiniteScroll.resetScroll( $scope.firstPage > 0, $scope.lastPage < 4 );
                        });
                    });
                };

                $scope.getFirstData().then(function(){
                    $timeout(function() {
                        // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
                        // you need to call resetData once you've loaded your data if you want to enable scroll up,
                        // it adjusts the scroll position down one pixel so that we can generate scroll up events
                        $scope.gridApi.infiniteScroll.resetScroll( $scope.firstPage > 0, $scope.lastPage < 4 );
                    });
                });
            }
        };
    }

    function ideHeader(appMenu, appInfo, userInfo) {
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
    }

    function ideSplitter(){
        return {
            restrict: 'AE',
            link: function (scope, elem, attrs) {
                var outerSplitter = elem.ideSplitter({
                    orientation: "horizontal",
                    resize: function(e){
                        var h = elem.find(".k-pane")[0].scrollHeight;
                        $('.k-pane').height(h);
                        $('.k-splitbar').height(h);
                    },
                    panes: [
                        { collapsible: true, resizable: true, size: "20%" },
                        { collapsible: true, resizable: true },
                        { collapsible: true, resizable: true, size: "20%" }
                    ]
                }).data('kendoSplitter');
                var pageHeight = $("#page-wrapper").height();
                function resizeSplitter() {
                    elem.height(pageHeight);
                    elem.resize();
                }

                resizeSplitter();
                //browserWindow.resize(resizeSplitter);
            },
            controller:function($scope){}
        };
    }

    function skinConfigChanger(){
        return {
            restrict: 'AE',
            templateUrl:  _rootPath+'controls/skin-config.html'
        };
    }

    function minimalizaSidebar($timeout) {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: function ($scope, $element) {
                $scope.minimalize = function () {
                    $("body").toggleClass("mini-navbar");
                    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                        // Hide menu in order to smoothly turn on when maximize menu
                        $('#side-menu').hide();
                        // For smoothly turn on menu
                        setTimeout(
                            function () {
                                $('#side-menu').fadeIn(500);
                            }, 100);
                    } else if ($('body').hasClass('fixed-sidebar')){
                        $('#side-menu').hide();
                        setTimeout(
                            function () {
                                $('#side-menu').fadeIn(500);
                            }, 300);
                    } else {
                        // Remove all inline style from jquery fadeIn function to reset menu state
                        $('#side-menu').removeAttr('style');
                    }
                }
            }
        };
    };

    app
        .config(angularHelper)
        .config(['$routeProvider', '$locationProvider', config])
        .directive('ideHeader', ['appMenu', 'appInfo','userInfo', ideHeader])
        .directive('ideGrid', ['$q', '$http','$timeout', ideGrid])
        .directive('landingScrollspy', landingScrollspy)
        .directive('iboxTools',['$timeout', iboxTools])
        .directive('skinConfigChanger',skinConfigChanger)
        .directive('minimalizaSidebar', minimalizaSidebar)
        .directive('ideSplitter', ideSplitter)
        .controller('ideController', ideController)
        .controller('draggablePanels', draggablePanels)
        .controller('ideViewController', ideViewController)
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
            var _info = resp['data'];
            app.constant('appMenu', _info['data']['menu']);
            app.constant('appInfo', _info['data']['app']);
            app.constant('userInfo', _info['data']['user']);
            document.body.innerHTML='<div ng-controller="ideController as main" landing-scrollspy id="page-top"><div id="wrapper"><div ide-header></div><div ng-view></div></div><div skin-config-changer></div></div>';
            angular.bootstrap(document, [appName]);
        }, function (error) {
            throw new Error('Config file has error : ' + error);
        });
    });
    return;
})();