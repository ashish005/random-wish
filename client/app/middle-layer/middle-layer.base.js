(function () {
    var app = angular.module(window['name']);

    var _baseModulesPath = {
        baseUrl:'middle-layer/',
        baseTemplateUrl:'app/middle-layer/'
    };
    
    var popupView = {
        dashboard: {
            view: {templateUrl: _baseModulesPath['baseTemplateUrl'] + 'modules/popups/popup-view.html'}
        }
    };
    
    function middleLayerBaseController($scope, $routeParams, popupService, appInfo, MiddleLayerService) {
        var ops = {
            view: {
                prePopupSvc: popupService['showPopup'],
                template: popupView['dashboard']['view']['templateUrl'],
                postPopupSvc: null,
                type: 'view',
                name: 'View'
            }
        };

        $scope.showPopup = function (type, data) {
            var _service = {
                'add-module':{
                    serviceToCall: MiddleLayerService.createApi,
                    success: function (resp) {
                        $scope.$broadcast('updateApiList', resp.data);
                    },
                    failure: function (resp) {
                    },
                },
                'params':{
                    serviceToCall: function(){
                        $scope.$emit('updateParams', arguments[0]);
                    },
                    success: function (resp) {
                    },
                    failure: function (resp) {
                    },
                }
            };
            var types = {
                'add-module':{
                    type: 'add-module', name: 'Module Name',
                    data:[
                        {name:'Module Name', value:'', key:'', type:'dropdownTextBox', validation:'required'}
                    ]
                },
                'params':{
                    type: 'add-params', name: 'Params',
                    data:[
                        { value:'', key:'', type:'keyValTextBox', validation:'required'},
                        { value:'', key:'', type:'keyValTextBox', validation:'required'}
                    ]
                }
            };
            /*ops['view']['postPopupSvc'] = _service[type];
            performOps(ops['view'], (function (modalInfo) {
                return {
                    model: {
                        type: modalInfo['type'],
                        name: modalInfo['name'],
                        data: modalInfo['data']
                    }
                };
            })(types[type]));*/
            performPopup((function (modalInfo) {
                return {
                    model: {
                        type: modalInfo['type'],
                        name: modalInfo['name'],
                        data: modalInfo['data']
                    }
                };
            })(types[type]), _service[type],  popupService)();
        };

        /*function performOps(operation, _model) {
            operation.prePopupSvc(operation.template, _model).then(function (resp) {
                var _info = resp.model['data'];
                var svc = operation['postPopupSvc'];
                var svcInvoked = svc['serviceToCall'](_info);
                if(svcInvoked) {
                    svcInvoked.then(svc['success'], svc['failure']);
                }
            }, function (err) {
            });
        }*/
    };

    function performPopup(_model, postPopupSvc, popupService){
       var _model = _model || {model:{ type: 'type', name: 'name', data: [] }},
           operation = {
                   prePopupSvc: popupService['showPopup'],
                   template: popupView['dashboard']['view']['templateUrl'],
                   postPopupSvc: postPopupSvc || null
            };

        return function () {
            operation.prePopupSvc(operation.template, _model).then(function (resp) {
                var _info = resp.model['data'];
                var svc = operation['postPopupSvc'];
                var svcInvoked = svc['serviceToCall'](_info);
                if(svcInvoked) {
                    svcInvoked.then(svc['success'], svc['failure']);
                }
            }, function (err) {
            });
        }
    }

    function apisInfo($rootScope, popupService, MiddleLayerService, apiReqModel){
        return {
            restrict: 'AE',
            replace: true,
            scope:false,
            transclude: true,
            templateUrl: _baseModulesPath['baseTemplateUrl'] + 'controls/apis-info.html',
            link: function ($scope, $element, $attrs) {

                $scope.apiInfo = apiReqModel.getInfoModel({});
                $rootScope.$on('apiInfo', function(event, req) {
                    MiddleLayerService.getApisCollectionsById(req).then(function(resp){
                        $scope.apiInfo = apiReqModel.getInfoModel(resp.data);
                    }, function(error){
                        console.log(JSON.stringify(error));
                    });
                });
            },
            controller: function ($scope, $element, $controller) {
                $element.on('click', '#params', function(e) {
                    e.stopPropagation();
                    var type = this.getAttribute('ide-key');
                    var _service = {
                        'params':{
                            serviceToCall: function(){
                                $scope.apiInfo.params = [];
                                arguments[0].every(function (item, index) {
                                    var _item = {};
                                    _item[item.key] = item.value;
                                    $scope.apiInfo.params.push(_item);
                                });
                            },
                            success: function (resp) {
                            },
                            failure: function (resp) {
                            },
                        }
                    };
                    var types = {
                        'params':{
                            type: 'add-params',
                            name: 'Params',
                            data: [{ value:'', key: '', type:'keyValTextBox'}]
                        }
                    };

                    var _paramsData = ($scope.apiInfo.params && $scope.apiInfo.params.length>0)?$scope.apiInfo.params:[] ;

                    _paramsData.every(function(item){
                        var _k = Object.keys(item)[0];
                        types[type]['data'].push({ value:item[_k], key: _k, type:'keyValTextBox'});
                    });

                    performPopup((function (modalInfo) {
                        return {
                            model: {
                                type: modalInfo['type'],
                                name: modalInfo['name'],
                                data: modalInfo['data']
                            }
                        };
                    })(types[type]), _service[type],  popupService)();
                });

                $element.on('click', '#saveApi', function(e) {
                    e.stopPropagation();
                    debugger;
                    console.log(apiReqModel.get());
                    alert('hi');
                });
            }
        };
    }

    function keyValOptions($compile) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                data: '=?'
            },
            templateUrl: _baseModulesPath['baseTemplateUrl'] + 'controls/key-val-options.html',
            controller: function ($scope, $element) {
                $scope.add = function(data){
                    data.push({key:'', val:''});
                }
            }
        };
    };
    
    function apisList($rootScope, MiddleLayerService){
        return {
            restrict: 'AE',
            scope:{},
            templateUrl: _baseModulesPath['baseTemplateUrl']+'modules/apis-list.html',
            link: function($scope, $element, $attr, $ctrl) {
                $element.on('click', '#invokeApi', function(e) {
                    e.stopPropagation();
                    var _key = this.getAttribute('key');
                    $rootScope.$broadcast('apiInfo', {id:_key});
                });
            },
            controller: function ($scope, $element, $controller) {
                MiddleLayerService.getApisCollections().then(function(resp){
                    $scope.data = resp.data;
                }, function(error){
                    console.log(JSON.stringify(error));
                });
                $scope.$on('updateApiList', function (e, data) {
                    $scope.data.unshift({
                        id :data.id,
                        method:data.method,
                        name:data.name
                    });
                });
            }
        };
    }

    function dynamicModelElements(){
        return {
            restrict: 'AE',
            templateUrl: function (itemDoc) {
                var _type = itemDoc[0].getAttribute('type');
                var controls = {
                    _blank: _baseModulesPath['baseTemplateUrl']+'controls/add-module.html',
                };
                var _template = controls[_type];
                if (!_template) {
                    _template = controls._blank;
                };

                return _template;
            },
            controller: function ($scope, $element) {}
        };
    }

    function popupDecisionMaker($compile){
        return {
            restrict: 'AE',
            scope:{
                type:'@',
                model:'='
            },
            controller: function ($scope, $element) {
                $element.html($compile('<div dynamic-model-elements type="'+$scope.type+'"></div>')($scope));
            }
        };
    }

    function createElement($compile) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                index: '@?',
                val: '=?'
            },
            controller: function ($scope, $element) {
                var _baseControlUrl = _baseModulesPath['baseTemplateUrl'];
                var _inputControlsInfo = {
                    keyValTextBox:"<div ng-include src=\"'app/middle-layer/controls/form-input-controls/keyVal-textBox.formcontrol.html'\"></div>",
                    textBox:"<div ng-include src=\"'app/middle-layer/controls/form-input-controls/textbox.formcontrol.html'\"></div>",
                    dropdownTextBox:"<div ng-include src=\"'app/middle-layer/controls/form-input-controls/dropdown-textbox.formcontrol.html'\"></div>"
                };
                var checkbox = '<div class="checkbox">\
                    <label class="checkbox" for="closeButton"><input id="closeButton" type="checkbox" ng-model="val" class="input-mini"> {{key}} </label>\
                </div>';
                var textBox = '<div class="form-horizontal">\
                    <label class="col-sm-2 control-label">{{val.name}}: </label>\
                    <div class="col-sm-10"><input type="text" ng-model="val.value" class="form-control"></div>\
                    </div>';

                var html = _inputControlsInfo[$scope.val['type']];
                $element.append($compile(angular.element(html))($scope));
            }
        };
    };

    function codeEditor($compile, apiReqModel) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                type:"@?",
                data: '=?',
                mode:'@?'
            },
            template:'<div><div><ul id="codeOptions" class="list-group m-t">\
                        <li ide-key="undo" class="list-group-item"> Undo </li>\
                        <li ide-key="redo" class="list-group-item"> Redo </li>\
                        </ul></div>\
            <div id="editor">{{data}}</div><textarea name="editor" ng-model="data" style="display: none;" /></div>',
            controller: function ($scope, $element) {
                var editor = null;
                $element.find('#codeOptions').on('click', 'li', function (e) {
                    e.preventDefault();
                    var type = this.getAttribute('ide-key');
                    if('undo' === type){
                        editor.undo();
                    }else if('redo' === type){
                        editor.redo();
                    } else if('debug' === type){

                    }
                });
                //$scope.data = 'function foo(items) { var x = "All this is syntax highlighted";return x;}';
                require([ace], function(){
                     editor = ace.edit('editor');
                    var textarea = $('textarea[name="editor"]');
                    editor.setTheme("ace/theme/monokai");
                    editor.getSession().setMode("ace/mode/"+$scope.mode);

                    if($scope.data) {
                        editor.getSession().setValue($scope.data);
                    }
                    editor.getSession().on("change", function () {
                        var _val = editor.getSession().getValue();
                        textarea.val(_val);
                        $scope.data = _val;
                        apiReqModel.update($scope.type, _val);
                    });
                    /*setTimeout(function() {
                        editor.setValue("And now how can I reset the\nundo stack,so pressing\nCTRL+Z (or Command + Z) will *NOT*\ngo back to previous value?", -1);
                        editor.getSession().setUndoManager(new ace.UndoManager())
                    }, 60000);*/
                });
            }
        };
    };

    function MiddleLayerService($q, $http, RequestResponseParser) {
        var projectService = {
            getApisCollectionsById: function (req) {
                var deferred = $q.defer();
                $http({method: 'GET', url: '/middlelayer/apis/'+req.id}).then(function (resp) {
                    deferred.resolve(resp.data);
                },function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getApisCollections: function () {
                var deferred = $q.defer();
                $http({method: 'GET', url: '/middlelayer/apis'}).then(function (resp) {
                    deferred.resolve(resp.data);
                },function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            createApi: function (data) {
                var reqData = RequestResponseParser.parseRequest('createApi', data);
                var deferred = $q.defer();
                $http({method: 'post', url: '/middlelayer/apis', data: JSON.stringify(reqData)})
                    .then(function (resp) {
                        deferred.resolve(resp.data);
                    },function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
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

    function RequestResponseParser() {
        var fac = {};
        fac.parseRequest = function(key, data){
            var _info = data[0];
            return {
                method:_info['method'],
                apiName:_info['value'],
                params: null
            };
        };
        fac.parserResponse  = function(){};

        return fac;
    }

    function apiReqModel(){
        var _model = {
            id : null,
            method:'Get',
            name : '',
        };
        function infoModel(model) {
            this.id = model.id || null;
            this.method = model.method || 'Get';
            this.name = model.name || '';
            this.params = model.params || [];
            this.authrization = model.authrization || null;
            this.headers = model.headers || [{key:'', val:''}];
            this.params = model.params || [{key:'', val:''}];
            this.body = model.body || [{key:'', val:''}];
            this.prereqscript = model.prereqscript || 'function () {}';
            this.simulation = model.simulation  || JSON.stringify({});
        }
        var info = {};
        info.update = function (key, data) {
            this[key] = data;
        };
        info.get = function () {
            return this;
        };
        info.getInfoModel = function (model) {
            return infoModel(model);
        };
        return info;
    };

    app.controller('middleLayerBaseController', ['$scope', '$routeParams', 'popupService', 'appInfo', 'middleLayerService',
        middleLayerBaseController]);
    app.directive('apisInfo',['$rootScope', 'popupService', 'middleLayerService', 'apiReqModel', apisInfo]);
    app.directive('dynamicModelElements', dynamicModelElements);
    app.directive('apisList', ['$rootScope', 'middleLayerService', apisList]);
    app.directive('createElement', ['$compile', createElement]);
    app.directive('codeEditor', ['$compile', 'apiReqModel', codeEditor]);
    app.directive('keyValOptions', ['$compile', keyValOptions]);

    app.service('middleLayerService', ['$q', '$http', 'requestResponseParser', MiddleLayerService]);
    app.factory('apiReqModel',  apiReqModel);
    app.factory('requestResponseParser', ['$http', RequestResponseParser]);
    app.directive('popupDecisionMaker', ['$compile', popupDecisionMaker]);
})();