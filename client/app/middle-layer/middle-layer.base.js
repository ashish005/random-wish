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
    
    function middleLayerBaseController($scope, $routeParams, popupService, appInfo) {
        $scope.apis=['a','b','c', 'd'];
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
            }
        };
        $scope.createApis = function (type, data) {
            performOps(ops['view'], data);
        };
        function performOps(operation, _model) {
            operation.prePopupSvc(operation.template, _model).then(function (resp) {
                var svc = operation['postPopupSvc'];
                svc['serviceToCall'](resp.model).then(svc['success'], svc['failure']);
            }, function (err) {
            });
        }
    };

    function apisInfo(){
        return {
            restrict: 'AE',
            templateUrl: _baseModulesPath['baseTemplateUrl'] + 'controls/apis-info.html',
            controller: function ($scope, $element) {}
        };
    }
    
    app.controller('middleLayerBaseController', ['$scope', '$routeParams', 'popupService', 'appInfo', middleLayerBaseController]);
    app.directive('apisInfo', apisInfo);
})();