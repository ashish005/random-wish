(function () {
    define(['angularAMD'], function (angularAMD) {
        var appName = 'goLive';
        window['name'] = appName;
        var uiGridDependencies = ['ui.grid',
            'ui.grid.edit', 'ui.grid.validate', 'ui.grid.treeView', 'ui.grid.treeBase', 'ui.grid.selection', 'ui.grid.saveState',
            'ui.grid.rowEdit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.pagination', 'ui.grid.moveColumns', 'ui.grid.infiniteScroll',
            'ui.grid.importer', 'ui.grid.grouping', 'ui.grid.exporter', 'ui.grid.expandable', 'ui.grid.edit', 'ui.grid.cellNav'];
        var app = angular.module(appName, ['ngRoute', appName + '.core', 'ui.bootstrap', 'dndLists'].concat(uiGridDependencies));
        var _rootPath = './app/';
        var _baseModulesPath = {
            templateUrl: _rootPath,
            popupBaseTemplateUrl: _rootPath + 'templates/popups/'
        };

        var popupView = {
            dashboard: {
                view: {templateUrl: _baseModulesPath['popupBaseTemplateUrl'] + 'popup-view.html'},
                delete: {templateUrl: _baseModulesPath['popupBaseTemplateUrl'] + 'popup-delete.html'},
                edit: {templateUrl: _baseModulesPath['popupBaseTemplateUrl'] + 'popup-edit.html'},
                tree: {templateUrl: _baseModulesPath['popupBaseTemplateUrl'] + 'popup-tree.html'}
            },
            project: {
                createPage: {templateUrl: _baseModulesPath['popupBaseTemplateUrl'] + 'project/create-page.html'},
                settings: {templateUrl: _baseModulesPath['popupBaseTemplateUrl'] + 'project/tools-config-settings.html'}
            }
        };

        var routeConfig = {
            home: {
                templateUrl: _baseModulesPath.templateUrl + 'home.html',
            },
            projects: {
                templateUrl: _baseModulesPath.templateUrl + 'templates/projects.html',
                controller: draggablePanels
            },
            dashboard: {
                templateUrl: _baseModulesPath.templateUrl + 'templates/dashboard.html',
                controller: ideViewController
            },
            details: {
                templateUrl: _baseModulesPath.templateUrl + 'templates/details.html',
                controller: ideViewController
            },
            admin: {
                templateUrl: _baseModulesPath.templateUrl + 'admin/dashboard.html',
                controller: draggablePanels
            },
            middleLayer: {
                templateUrl: _baseModulesPath.templateUrl + 'middle-layer',
                controllerUrl: 'middle-layer/middle-layer.base'
            },
            databaseLayer: {
                templateUrl: _baseModulesPath.templateUrl + 'database-layer',
                controllerUrl: 'database-layer/database-layer.base'
            },
            dynamicAppView: {
                templateUrl: _baseModulesPath.templateUrl + 'templates/dynamic-app.view.html',
                controller: draggablePanels
            },
        };

        function config($routeProvider) {
            $routeProvider
                .when('/home', routeConfig['home'])
                .when('/projects/:id', routeConfig['projects'])
                .when('/admin', routeConfig['admin'])
                .when('/client-dashboard', routeConfig['dashboard'])
                .when('/db-dashboard', angularAMD.route(routeConfig['databaseLayer']))
                .when('/milldlelayer-dashboard', angularAMD.route(routeConfig['middleLayer']))
                .when('/:view', routeConfig['dynamicAppView'])
                .otherwise({redirectTo: '/'});//Handle all exceptions
        };

        function angularHelper($controllerProvider, $provide, $compileProvider) {
            // Let's keep the older references.
            app._controller = app.controller;
            app._service = app.service;
            app._factory = app.factory;
            app._value = app.value;
            app._directive = app.directive;

            // Provider-based controller.
            app.controller = function (name, constructor) {
                $controllerProvider.register(name, constructor);
                return (this);
            };

            // Provider-based service.
            app.service = function (name, constructor) {
                $provide.service(name, constructor);
                return (this);
            };

            // Provider-based factory.
            app.factory = function (name, factory) {
                $provide.factory(name, factory);
                return (this);
            };

            // Provider-based value.
            app.value = function (name, value) {
                $provide.value(name, value);
                return (this);
            };
            // Provider-based directive.
            app.directive = function (name, factory) {
                $compileProvider.directive(name, factory);
                return (this);
            };
        }

        function ideDashboardController($scope, $compile, $timeout) {

        };

        function ideController($scope) {

        };

        function ideViewController($scope, dashboardService, $timeout, popupService) {
            $scope.form = {
                collection: [],
                actveOpt: ''
            };

            $scope.getInfo = function (key) {
                dashboardService.getInfo().then(
                    function (resp, status, headers, config) {
                        $scope.$broadcast('updatePanal', resp['data']['data']);
                    },
                    function (data, status, headers, config) {
                        console.log('failed to load dashboardService.getInfo()');
                    }
                );
            };
            $scope.getAllCollections = function () {
                dashboardService.getAllCollections().then(
                    function (resp, status, headers, config) {
                        $scope.form.collection = resp['data']['data'];
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    },
                    function (data, status, headers, config) {
                    }
                );
            }

            $scope.selectAction = function () {
                dashboardService.getActiveCollection($scope.form['actveOpt']).then(function (resp, status, headers, config) {
                    $scope.data = resp['data']['data'];

                    $scope.gridOptions.columnDefs = resp['data']['columns'];
                    $scope.gridOptions.columnDefs.unshift({
                        name: 'Action',
                        cellEditableCondition: true,
                        cellTemplate: '<div actions data="row" perform-call-back="grid.appScope.actionCallBack"></div>'
                    });
                    $timeout(function () {
                        $scope.refresh = false;
                    }, 0);
                }, function (data, status, headers, config) {
                });
            };

            $scope.gridHeight = $(window).height() - 250 + "px";
            $scope.gridOptions = {
                infiniteScrollRowsFromEnd: 40,
                infiniteScrollUp: true,
                infiniteScrollDown: true,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                },
                data: 'data'
            };
            $scope.data = [];

            var model = (function (data) {
                return {
                    model: {
                        name: $scope.form['actveOpt']['name'],
                        info: data
                    }
                };
            });

            var ops = {
                view: {
                    prePopupSvc: popupService['showPopup'],
                    template: popupView['dashboard']['view']['templateUrl'],
                    postPopupSvc: {
                        serviceToCall: function () {
                        },
                        success: function (resp) {
                        },
                        failure: function (resp) {
                        },
                    },
                    type: 'view',
                    name: 'View'
                },
                edit: {
                    prePopupSvc: popupService['showPopup'],
                    template: popupView['dashboard']['edit']['templateUrl'],
                    postPopupSvc: {
                        serviceToCall: dashboardService.edit,
                        success: function (resp) {
                        },
                        failure: function (resp) {
                        },
                    },
                    type: 'edit',
                    name: 'Edit'
                },
                delete: {
                    prePopupSvc: popupService['showPopup'],
                    template: popupView['dashboard']['delete']['templateUrl'],
                    postPopupSvc: {
                        serviceToCall: dashboardService.delete,
                        success: function (resp) {
                        },
                        failure: function (resp) {
                        },
                    },
                    type: 'delete',
                    name: 'Delete'
                },
                tree: {
                    prePopupSvc: popupService['showPopup'],
                    template: popupView['dashboard']['tree']['templateUrl'],
                    postPopupSvc: {
                        serviceToCall: function () {
                        },
                        success: function (resp) {
                        },
                        failure: function (resp) {
                        },
                    },
                    type: 'tree',
                    name: 'Tree'
                },
            };

            $scope.actionCallBack = function (type, data) {
                performOps(ops[type], new model(data));
            };

            function performOps(operation, _model) {
                operation.prePopupSvc(operation.template, _model).then(function (resp) {
                    var svc = operation['postPopupSvc'];
                    svc['serviceToCall'](resp.model).then(svc['success'], svc['failure']);
                }, function (err) {
                });
            }
        };

        function landingScrollspy() {
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

        function draggablePanels($scope, $routeParams, projectService, popupService, appInfo) {
            $scope.form = {
                collection: [],
                actveOpt: ''
            };

            $scope.getAppView = function () {
                getViewDetails({id: appInfo.id, view: $routeParams.view}).then(
                    function (resp) {
                        var _data = resp['data']['data'][0];
                        //$scope.models.masterPageId = _data.masterpageid;
                        //$scope.$broadcast('masterPage', {masterPageId:_data.masterpageid});
                        $scope.$emit('masterPage', {masterPageId: _data.masterpageid});
                        new wrapper().deserialize(_data['view'], function (res) {
                            $scope.models.dropzones = res['response'];
                        });
                    },
                    function (err) {
                        alert(err);
                    }
                );
            }
            $scope.getProjectView = function () {
                getViewDetails({id: $routeParams.id}).then(
                    function (resp) {
                        $scope.form.collection = resp['data']['data'];
                    },
                    function (err) {
                        alert(err);
                    }
                );
            };

            function getViewDetails(param) {
                $('#projectView').css("min-height", $(window).height() - 100 + "px");
                return projectService.getViewInfo(param);
            }

            var _controlInfo = new wrapper();
            $scope.models = {
                selected: null,
                masterPages: _controlInfo.getAllMasterPages(),
                templates: _controlInfo.getAllComponents(),
                dropzones: []
            };

            $scope.createDropzone = function () {
                var _col = [
                    [
                        {
                            "type": "item",
                            key: 2,
                            id: Date.now()
                        }
                    ],
                    [
                        {
                            "type": "item",
                            key: 2,
                            id: Date.now()
                        }
                    ]
                ];
                var _defaultZone = [{type: "container", key: 1, columns: _col}];
                $scope.models.dropzones.push(_defaultZone);
            };

            var model = function (modalInfo, data) {
                return {
                    model: {
                        name: modalInfo['name'],
                        info: data
                    }
                };
            };

            $scope.SavePageAs = function (type) {
                var ops = {
                    add: {
                        reqModel: {},
                        prePopupSvc: popupService['showPopup'],
                        template: popupView['project']['createPage']['templateUrl'],
                        postPopupSvc: {
                            serviceToCall: projectService.submit,
                            success: function (resp) {
                                var _data = resp.data;
                                new wrapper().deserialize(_data.rows['view'], function (res) {
                                    $scope.models.dropzones = res['response'];
                                });
                                $scope.form.collection.push(_data.rows);
                            },
                            failure: function (resp) {
                                alert(err);
                            },
                        },
                        type: 'view',
                        name: 'Create Page'
                    }
                };
                var data = {
                    name: ''
                };
                performOps(ops[type], new model(ops[type], data));
            }

            function performOps(operation, _model) {
                operation.prePopupSvc(operation.template, _model).then(function (resp) {
                    new wrapper().serialize($scope.models.dropzones, function (res) {
                        operation['reqModel'] = {
                            id: $routeParams.id,
                            name: resp.model.info.name,
                            masterPageId: $scope.models.masterPageId,
                            view: JSON.stringify(res['response'])
                        };

                    });
                    var svc = operation['postPopupSvc'];
                    svc['serviceToCall'](operation['reqModel']).then(svc['success'], svc['failure']);
                }, function (err) {
                });
            }
        };

        function iboxTools($timeout) {
            return {
                restrict: 'A',
                scope: {
                    type: '@?',
                    referrerId: '@?'
                },
                templateUrl: _rootPath + 'controls/ibox_tools.html',
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

        function ideGrid($q, $http, $timeout, $compile, appInfoFactory) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    gridId: '@'
                },
                templateUrl: _rootPath + 'controls/grid.html',
                link: function (scope, elem) {
                },
                controller: function ($scope, $element) {
                    var gridConfigs = appInfoFactory.getViewConfigByReferrerId($scope.gridId);
                    var _decideAdditionaliFunctionalities = '';

                    if (gridConfigs && gridConfigs.config) {
                        var _keys = Object.keys(gridConfigs.config), keysData = [];
                        _keys.forEach(function (item, i) {
                            if (gridConfigs.config[item]) {
                                keysData.push(item);
                                _decideAdditionaliFunctionalities += ' ' + item;
                            }
                        });
                    }
                    //$scope.$digest();
                    var url = './data/10000_complex.json';
                    $scope.gridHeight = $(window).height() - 270 + "px";
                    $scope.gridOptions = {data: []};
                    var appendHtml = $compile('<div id="{{gridId}}" class="row gridInfo" ui-grid="gridOptions" style="height: {{gridHeight}}" ' + _decideAdditionaliFunctionalities + '></div>')($scope);
                    //angular.element($element.find('.ui-grid')).html(appendHtml);
                    $element.find('.ui-grid').html(appendHtml);

                    if (gridConfigs) {
                        $scope.gridOptions = gridConfigs.config;
                        $scope.gridOptions.onRegisterApi = function (gridApi) {
                            /*gridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.getDataDown);
                             gridApi.infiniteScroll.on.needLoadMoreDataTop($scope, $scope.getDataUp);*/
                            $scope.gridApi = gridApi;
                        };

                        $scope.firstPage = 2;
                        $scope.lastPage = 2;

                        $scope.getFirstData = function () {
                            var promise = $q.defer();
                            $http.get(url)
                                .success(function (data) {
                                    var newData = $scope.getPage(data, $scope.lastPage);
                                    $scope.gridOptions.data = $scope.gridOptions.data.concat(newData);
                                    promise.resolve();
                                });
                            return promise.promise;
                        };

                        $scope.getDataDown = function () {
                            var promise = $q.defer();
                            $http.get(url)
                                .success(function (data) {
                                    $scope.lastPage++;
                                    var newData = $scope.getPage(data, $scope.lastPage);
                                    $scope.gridApi.infiniteScroll.saveScrollPercentage();
                                    $scope.data = $scope.data.concat(newData);
                                    $scope.gridApi.infiniteScroll.dataLoaded($scope.firstPage > 0, $scope.lastPage < 4).then(function () {
                                        $scope.checkDataLength('up');
                                    }).then(function () {
                                        promise.resolve();
                                    });
                                })
                                .error(function (error) {
                                    $scope.gridApi.infiniteScroll.dataLoaded();
                                    promise.reject();
                                });
                            return promise.promise;
                        };

                        $scope.getDataUp = function () {
                            var promise = $q.defer();
                            $http.get(url)
                                .success(function (data) {
                                    $scope.firstPage--;
                                    var newData = $scope.getPage(data, $scope.firstPage);
                                    $scope.gridApi.infiniteScroll.saveScrollPercentage();
                                    $scope.data = newData.concat($scope.data);
                                    $scope.gridApi.infiniteScroll.dataLoaded($scope.firstPage > 0, $scope.lastPage < 4).then(function () {
                                        $scope.checkDataLength('down');
                                    }).then(function () {
                                        promise.resolve();
                                    });
                                })
                                .error(function (error) {
                                    $scope.gridApi.infiniteScroll.dataLoaded();
                                    promise.reject();
                                });
                            return promise.promise;
                        };


                        $scope.getPage = function (data, page) {
                            var res = [];
                            for (var i = (page * 100); i < (page + 1) * 100 && i < data.length; ++i) {
                                res.push(data[i]);
                            }
                            return res;
                        };

                        $scope.checkDataLength = function (discardDirection) {
                            // work out whether we need to discard a page, if so discard from the direction passed in
                            if ($scope.lastPage - $scope.firstPage > 3) {
                                // we want to remove a page
                                $scope.gridApi.infiniteScroll.saveScrollPercentage();

                                if (discardDirection === 'up') {
                                    $scope.data = $scope.data.slice(100);
                                    $scope.firstPage++;
                                    $timeout(function () {
                                        // wait for grid to ingest data changes
                                        $scope.gridApi.infiniteScroll.dataRemovedTop($scope.firstPage > 0, $scope.lastPage < 4);
                                    });
                                } else {
                                    $scope.data = $scope.data.slice(0, 400);
                                    $scope.lastPage--;
                                    $timeout(function () {
                                        // wait for grid to ingest data changes
                                        $scope.gridApi.infiniteScroll.dataRemovedBottom($scope.firstPage > 0, $scope.lastPage < 4);
                                    });
                                }
                            }
                        };

                        $scope.reset = function () {
                            $scope.firstPage = 2;
                            $scope.lastPage = 2;

                            // turn off the infinite scroll handling up and down - hopefully this won't be needed after @swalters scrolling changes
                            $scope.gridApi.infiniteScroll.setScrollDirections(false, false);
                            $scope.data = [];

                            $scope.getFirstData().then(function () {
                                $timeout(function () {
                                    // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
                                    $scope.gridApi.infiniteScroll.resetScroll($scope.firstPage > 0, $scope.lastPage < 4);
                                });
                            });
                        };

                        $scope.getFirstData().then(function () {
                            $timeout(function () {
                                // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
                                // you need to call resetData once you've loaded your data if you want to enable scroll up,
                                // it adjusts the scroll position down one pixel so that we can generate scroll up events
                                //$scope.gridApi.infiniteScroll.resetScroll($scope.firstPage > 0, $scope.lastPage < 4);
                            });
                        });
                    }
                }
            };
        }

        function ideHeader(appMenu, appInfo, userInfo) {
            return {
                restrict: 'AE',
                templateUrl: _rootPath + 'header.html',
                link: function (scope, elem) {
                },
                controller: function ($scope) {
                    $scope.menuInfo = appMenu;
                    $scope.appInfo = appInfo;
                    $scope.userInfo = userInfo;
                }
            };
        }

        function ideSplitter() {
            return {
                restrict: 'AE',
                link: function (scope, elem, attrs) {
                    var outerSplitter = elem.ideSplitter({
                        orientation: "horizontal",
                        resize: function (e) {
                            var h = elem.find(".k-pane")[0].scrollHeight;
                            $('.k-pane').height(h);
                            $('.k-splitbar').height(h);
                        },
                        panes: [
                            {collapsible: true, resizable: true, size: "20%"},
                            {collapsible: true, resizable: true},
                            {collapsible: true, resizable: true, size: "20%"}
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
                controller: function ($scope) {
                }
            };
        }

        function skinConfigChanger() {
            return {
                restrict: 'AE',
                templateUrl: _rootPath + 'controls/skin-config.html'
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
                        } else if ($('body').hasClass('fixed-sidebar')) {
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

        function ideProjectService($http) {
            var projectService = {
                submit: function (data) {
                    return $http({method: 'post', url: '/apis/projectView', data: data});
                },
                getViewInfo: function (data) {
                    return $http({method: 'get', url: '/apis/projectView', params: data});
                },
                setup: function (data) {
                    return $http({method: 'post', url: '/apis/setup', data: data});
                },
                viewConfig: function (data) {
                    return $http({method: 'post', url: '/apis/projectView/config', data: data});
                },
                getViewConfigs: function (req) {
                    return $http({method: 'get', url: '/apis/projectView/config', params: req});
                },
            };
            return projectService;
        }

        function dashboardService($http) {
            var projectService = {
                getInfo: function () {
                    var _httpRequest = {method: 'GET', url: '/core/collection/info'};
                    return $http(_httpRequest);
                },
                getAllCollections: function () {
                    var _httpRequest = {method: 'GET', url: '/core/collections'};
                    return $http(_httpRequest);
                },
                getActiveCollection: function (collectionName) {
                    var _httpRequest = {method: 'GET', url: '/core/collection/data', params: collectionName};
                    return $http(_httpRequest);
                }
            };
            projectService.nodes = {
                add: function (data) {
                    var _httpRequest = {method: 'POST', url: '/core/collection/item', data: data};
                    return $http(_httpRequest);
                },
                update: function (item) {
                    var _httpRequest = {method: 'PUT', url: '/core/collection/item', params: item};
                    return $http(_httpRequest);
                },
                delete: function (item) {
                    var _httpRequest = {method: 'DELETE', url: '/core/collection/item', params: item};
                    return $http(_httpRequest);
                }
            }

            return projectService;
        }

        function goActions() {
            return {
                restrict: 'AE',
                scope: {
                    data: '=?',
                    performCallBack: '&?'
                },
                template: '<div class="btn-group" style="height: 20px;"><button class="btn-white btn btn-xs view">View</button><button class="btn-white edit"><i class="fa fa-pencil"></i></button><button class="btn-white delete"><i class="fa fa-trash"></i> </button></div>',//<button class="btn-white tree">Tree</button>
                controller: function ($scope, $element) {
                    $element.on('click', '.btn-white.btn.btn-xs.view', function (e) {
                        e.stopPropagation();
                        $scope.performCallBack()('view', $scope.data.entity);
                    });
                    $element.on('click', '.btn-white.edit', function (e) {
                        e.stopPropagation();
                        $scope.performCallBack()('edit', $scope.data.entity);
                    });
                    $element.on('click', '.btn-white.delete', function (e) {
                        e.stopPropagation();
                        $scope.performCallBack()('delete', $scope.data.entity);
                    });
                }
            };
        }

        function multiPanal($compile, projectService) {
            return {
                restrict: 'AE',
                scope: {
                    data: '=',
                    invoke: '='
                },
                template: '<div class="col-lg-6">\
            <div class="input-group createApp">\
            <input type="text"  placeholder="Add new App.. " ng-model="appName" class="input input-sm form-control">\
            <span class="input-group-btn">\
            <button type="button" class="btn btn-sm btn-white" ng-click="createApp()"> <i class="fa fa-plus"></i> Create Project</button>\
        </span>\
        </div></div><div class="col-lg-6"><input type="text" class="form-control input-sm m-b-xs" placeholder="Search in Panals"></div>',
                controller: function ($scope, $element) {
                    $scope.items = [];
                    $scope.$on('updatePanal', function (e, data) {
                        $scope.info = data;
                        createPanals(data);
                    });

                    function createPanals(data) {
                        data.forEach(function (item, index) {
                            createPanal(item, index);
                        });
                    }

                    function createPanal(item, index) {
                        $scope.items[index] = item;
                        var html = '<div class="col-lg-3" panal data="items" index="' + index + '"></div>';
                        $element.append($compile(angular.element(html))($scope));
                    };

                    $element.find('.createApp').on('click', 'button', function (e) {
                        projectService.setup({name: $scope.appName}).then(function (resp) {
                            $scope.info.push(resp.data.row);
                            new createPanal(resp.data.row, $scope.info.length - 1);
                        }, function () {
                            console.log('data creation issue');
                        });
                    });
                }
            };
        }

        function Panal($compile) {
            return {
                restrict: 'AE',
                scope: {
                    data: '=',
                    index: '@'
                },
                templateUrl: './app/controls/panal.html'
            };
        };

        function nestedList() {
            return {
                restrict: 'AE',
                scope: {
                    data: '='
                },
                templateUrl: './app/controls/nestable-list.html'
            };
        };

        function pageToolkit($compile, appInfoFactory, ideProjectService) {
            return {
                restrict: 'AE',
                scope: {
                    data: '=',
                    filter: '='
                },
                templateUrl: './app/controls/page-controls-view.html',
                controller: function ($scope, $element) {
                    var wrapper = window.wrapper;
                    $scope.createId = function (node) {
                        node.id = Date.now();
                    };

                    $scope.selectAction = function () {
                        var _data = $scope.filter['actveOpt'];
                        $scope.$emit('masterPage', {masterPageId: _data.masterpageid});
                        appInfoFactory.setAppInfo(_data);
                        var reqModel = {appid: _data.appid, viewid: _data.id}
                        ideProjectService.getViewConfigs(reqModel).then(function (resp, status, headers, config) {
                            appInfoFactory.setViewConfigs(resp.data.data);
                            $scope.data.dropzones = [];
                            new wrapper().deserialize(_data['view'], function (res) {
                                $scope.data.dropzones = res['response'];
                            });
                        }, function (error) {
                        });
                    };

                    $element.on('click', 'ul#ide-side-menu li', function (e) {
                        e.stopPropagation();
                        var _type = this.getAttribute('ide-type');
                        $element.find('#ide-sidebar-container').html($compile('<div sidebar type=' + _type + '></div>')($scope));
                    });
                    $element.find('#ide-sidebar-container').html($compile('<div sidebar type="controls"></div>')($scope));
                }
            };
        };

        function sidebar() {
            return {
                restrict: 'AE',
                templateUrl: function (itemDoc) {
                    var _type = itemDoc[0].getAttribute('type');
                    var controls = {
                        masterPages: './app/controls/control-options/sidebars/sidebar-master-pages.html',
                        controls: './app/controls/control-options/sidebars/sidebar-controls.html',
                        chartControls: './app/controls/control-options/sidebars/sidebar-controls.html',
                        _blank: './app/controls/control-options/sidebars/_blank.html',
                    };
                    var _template = controls[_type];
                    if (!_template) {
                        _template = controls._blank;
                    }
                    ;

                    return _template;
                },
                controller: function ($scope, $element) {
                    $element.on('click', '#ide-sidebar-master ul>li', function (e) {
                        e.stopPropagation();
                        var _masterPageId = this.getAttribute('ide-type');
                        $scope.data.masterPageId = _masterPageId;
                        $scope.$emit('masterPage', {masterPageId: this.getAttribute('ide-type')});
                    });
                }
            };
        };

        function toolsConfigOptions($rootScope, popupService, projectService, appInfoFactory) {
            return {
                restrict: 'AE',
                scope: {
                    type: '@?',
                    referrerId: '@?'
                },
                template: '<li ><a href>Config options</a></li>',
                controller: function ($scope, $element) {
                    $element.on('click', 'li>a', function (item) {
                        var type = $scope.type;

                        var ops = {
                            'ui-grid': {
                                reqModel: {},
                                prePopupSvc: popupService['showPopup'],
                                template: popupView['project']['settings']['templateUrl'],
                                postPopupSvc: {
                                    serviceToCall: projectService.viewConfig,
                                    success: function (resp) {
                                    },
                                    failure: function (resp) {
                                        alert(err);
                                    },
                                },
                                type: 'view',
                                name: 'Config Settings'
                            },
                            'tabs': {
                                reqModel: {},
                                prePopupSvc: popupService['showPopup'],
                                template: popupView['project']['settings']['templateUrl'],
                                postPopupSvc: {
                                    serviceToCall: null,
                                    success: function (resp) {
                                    },
                                    failure: function (resp) {
                                        alert(err);
                                    },
                                },
                                type: 'view',
                                name: 'Config Settings'
                            }
                        };

                        var opsType = ops[type];
                        if (opsType) {
                            var existConfig = appInfoFactory.getViewConfigByReferrerId($scope.referrerId);
                            if (existConfig) {
                                performOps(opsType, new model(opsType, existConfig.config));
                            } else {
                                require(['controls-config-provider'], function (configLoader) {
                                    new configLoader().getConfig(type, function (data) {
                                        performOps(opsType, new model(opsType, data));
                                    });
                                });
                            }
                        }
                    });
                    var model = function (modalInfo, data) {
                        return {
                            model: {
                                name: modalInfo['name'],
                                info: data
                            }
                        };
                    };

                    function performOps(operation, _model) {
                        operation.prePopupSvc(operation.template, _model).then(function (resp) {
                            var _appInfo = appInfoFactory.getAppInfo();
                            if (_appInfo) {
                                var svc = operation['postPopupSvc'];
                                var reqModel = {
                                    appId: _appInfo.appid,
                                    viewId: _appInfo.id,
                                    referrerId: $scope.referrerId,
                                    config: resp.model.info
                                };
                                if ('ui-grid' == $scope.type) {
                                    reqModel.config.data = [];
                                }
                                svc['serviceToCall'](reqModel).then(svc['success'], svc['failure']);
                            }
                        }, function (err) {
                        });
                    }
                }
            };
        };

        function masterPage($compile) {
            return {
                restrict: 'AE',
                template: '<div id="ide-wrapper-view"></div>',
                controller: function ($scope, $element) {
                    $element.find('#ide-wrapper-view').html($compile('<div master-content-view ideMasterPage="none"></div>')($scope));
                    $scope.$on('masterPage', function (e, data) {
                        if (!e.defaultPrevented) {
                            e.preventDefault();
                        } else {
                            e.stopPropagation();
                        }
                        $element.find('#ide-wrapper-view').html($compile('<div master-content-view ideMasterPage=' + data.masterPageId + '></div>')($scope));
                    });
                }
            };
        };

        function masterContentView($compile) {
            return {
                restrict: 'AE',
                templateUrl: function (itemDoc) {
                    var _type = itemDoc[0].getAttribute('ideMasterPage');
                    var controls = {};
                    new wrapper().getAllMasterPages().forEach(function (itemInfo) {
                        itemInfo.children.forEach(function (item) {
                            controls[item.key] = item;
                        });
                    });
                    var _template = controls[_type];
                    if (!_template) {
                        _template = controls['none'];
                    }
                    ;
                    return _template['templateUrl'];
                },
                controller: function ($scope, $element) {
                    $element.find('#ide-content-view').html($compile('<div view-decision-maker dropzone="models.dropzones"></div>')($scope));
                }
            };
        };

        function viewDecisionMaker($compile) {
            return {
                restrict: 'AE',
                scope: {
                    dropzone: '='
                },
                template: '<div view-maker></div>',
                controller: function ($scope, $element) {
                    $scope.responsiveClassSetter = function (_colLength) {
                        var _classInfo = {
                            1: 'col-md-12',
                            2: 'col-md-6',
                            3: 'col-md-4',
                            4: 'col-md-3',
                            5: 'col-md-15 col-sm-3',
                            6: 'col-md-2',
                            12: 'col-md-1'
                        };
                        return _classInfo[_colLength];
                    };

                    /*$scope.$watch('dropzone', function(newValue, oldValue){
                     if(newValue && newValue != oldValue){
                     $element.html($compile('<div view-maker></div>')($scope));
                     }
                     });*/
                }
            };
        };

        function viewMaker($compile) {
            return {
                restrict: 'AE',
                replace: true,
                templateUrl: './app/controls/view-decision-maker.html'
            };
        };

        function checkDataType($compile) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    key: '@?',
                    val: '=?'
                },
                controller: function ($scope, $element) {
                    var checkbox = '<div class="checkbox">\
                    <label class="checkbox" for="closeButton"><input id="closeButton" type="checkbox" ng-model="val" class="input-mini"> {{key}} </label>\
                </div>';
                    var textBox = '<div class="form-horizontal">\
                    <label class="col-sm-2 control-label">{{key}}:</label>\
                    <div class="col-sm-10"><input type="text" ng-model="val" class="form-control"></div>\
                    </div>';
                    var NumberBox = '<div class="form-group">\
                    <label for="title">{{key}}</label>\
                    <input type="number" ng-model="val" class="form-control">\
                    </div>';
                    var objectType = '<div class="form-group"><label for="message">{{key}}</label>\
                    <textarea class="form-control" rows="4" ng-model="val"></textarea>\
                    </div>';

                    var _noneType = '<div class="form-group"><label for="message">{{key}}</label>\
                    <div class="well"> <div class="row diff-wrapper"> {{val}}</div></div>\
                    </div>';
                    var _jsonType = '<div class="form-group"><label for="message">{{key}}</label>\
                    <div class="well"> <div class="row diff-wrapper"> {{val | json}}</div></div>\
                    </div>';

                    switch (typeof $scope.val) {
                        case 'boolean':
                            html = checkbox;
                            break;
                        case 'number':
                            html = NumberBox;
                            break;
                        case 'string':
                            html = textBox;
                            break;
                        case 'function':
                            html = objectType;
                            break;
                        case 'object':
                            html = _jsonType;
                            break;
                        default:
                            html = _noneType;
                    }
                    $element.append($compile(angular.element(html))($scope));
                }
            };
        };

        function decideControls($compile) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    item: '=?'
                },
                controller: function ($scope, $element, $attrs) {
                    var controls = {
                        'grid': '<div ide-grid grid-id="{{item.id}}"></div>'
                    };
                    var html = controls[$scope.item.type];
                    $element.append($compile(angular.element(html))($scope));
                }
            };
        };

        function httpProvider($httpProvider) {
            //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            $httpProvider.defaults.headers.common["Accept"] = "*/*";
            $httpProvider.interceptors.push('tokenInterceptor');
            $httpProvider.defaults.cache = false;
            $httpProvider.defaults.timeout = 600000;
        };

        function appInfoFactory() {
            this.appInfo = null;
            this.viewConfigs = {};

            this.$get = function () {
                var that = this;
                return {
                    setAppInfo: function (appInfo) {
                        that.appInfo = appInfo;
                    },
                    getAppInfo: function () {
                        return that.appInfo;
                    },
                    setViewConfigs: function (data) {
                        this.viewConfigs = {};
                        for (var i = 0; i < data.length; i++) {
                            var _item = data[i];
                            that.viewConfigs[_item.referrerid] = {
                                config: _item.config
                            };
                        }
                    },
                    getViewConfigByReferrerId: function (referrerid) {
                        return that.viewConfigs[referrerid];
                    },
                };
            }
        }

        app
            .config(['$httpProvider', httpProvider])
            .config(angularHelper)
            .config(['$routeProvider', config])
            .directive('ideHeader', ['appMenu', 'appInfo', 'userInfo', ideHeader])
            .directive('ideGrid', ['$q', '$http', '$timeout', '$compile', 'appInfoFactory', ideGrid])
            .directive('landingScrollspy', landingScrollspy)
            .directive('iboxTools', ['$timeout', iboxTools])
            .directive('skinConfigChanger', skinConfigChanger)
            .directive('sidebar', sidebar)
            .directive('minimalizaSidebar', minimalizaSidebar)
            .directive('ideSplitter', ideSplitter)
            .directive('actions', goActions)
            .directive('toolsConfigOptions', ['$rootScope', 'popupService', 'projectService', 'appInfoFactory', toolsConfigOptions])
            .directive('multiPanal', ['$compile', 'projectService', multiPanal])
            .directive('panal', ['$compile', Panal])
            .directive('nestedList', nestedList)
            .directive('pageToolkit', ['$compile', 'appInfoFactory', 'projectService', pageToolkit])
            .directive('viewDecisionMaker', ['$compile', viewDecisionMaker])
            .directive('checkDataType', ['$compile', checkDataType])//decide-controls
            .directive('viewMaker', ['$compile', viewMaker])
            .directive('decideControls', ['$compile', decideControls])
            .directive('masterPage', ['$compile', masterPage])
            .directive('masterContentView', ['$compile', masterContentView])
            .provider('appInfoFactory', appInfoFactory)
            .controller('ideController', ideController)
            .controller('draggablePanels', ['$scope', '$routeParams', 'projectService', 'popupService', 'appInfo', draggablePanels])
            .controller('ideDashboardController', ['$scope', '$compile', '$timeout', ideDashboardController])
            .controller('ideViewController', ['$scope', 'dashboardService', '$timeout', 'popupService', ideViewController])
            .service('projectService', ['$http', ideProjectService])
            .service('dashboardService', ['$http', dashboardService])
            .run(['$rootScope', 'authenticationFactory', function ($rootScope, authenticationFactory) {
                $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {

                });
                $rootScope.$on('$routeChangeSuccess', function (event, nextRoute, currentRoute) {
                });
                $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
                });
                $rootScope.$on('$viewContentLoaded', function () {
                    $rootScope.isLoggedIn = authenticationFactory.isAuthorized();
                });
            }]);

        angular.element(document).ready(function () {
            var initInjector = angular.injector(["ng"]);
            var $http = initInjector.get("$http");
            $http({method: 'GET', url: '/apis/setup'}).then(function (resp) {
                var _info = resp['data'];
                app.constant('appMenu', _info['data']['menu']);
                app.constant('appInfo', _info['data']['app']);
                app.constant('userInfo', _info['data']['user']);
                document.body.innerHTML = '<div ng-controller="ideController as main" landing-scrollspy id="page-top"><div id="wrapper"><div ide-header ng-if="isLoggedIn"></div><div ng-view></div></div><div skin-config-changer></div></div>';
                angular.bootstrap(document, [appName]);
            }, function (error) {
                throw new Error('Config file has error : ' + error.statusText);
            });
        });
        return;
    });
})();


