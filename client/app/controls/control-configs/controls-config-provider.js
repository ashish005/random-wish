define(function(){

    var _options = {
        'ui-grid':{ filePath:'app/../controls/control-configs/grid/ui-grid.config', dependencies:["./assets/libs/ui-grid/ui-grid-unstable"] }
    };

    var ConfigLoader = function () {
        var _construct = function () { return _public; },
            _loadClass = function (key, callback) {
               var _class = _options[key];
                /*define(_class.filePath, _class.dependencies, function (info) {
                    //angular.module(window['name'], ['ui.grid', 'ui.grid.infiniteScroll']);

                });*/

                require(_class.dependencies,
                    function () {
                        require([_class.filePath],
                            function (LoadedClass) {
                                 var $injector = angular.injector([window['name']]);
                                 $injector.loadNewModules(['ui.grid', 'ui.grid.infiniteScroll']);
                                /*$injector.invoke(function ($compile, $rootScope) {
                                    //var v = $injector.get('uiGridColumnMenuService');
                                    
                                })*/
                                //var v = $injector.get('uiGridColumnMenuService');
                                
                                //angular.modules.select(window['name'])
                                define(_class.filePath, ['ui.grid', 'ui.grid.infiniteScroll'], function (info) {
                                    //angular.module(window['name'], ['ui.grid', 'ui.grid.infiniteScroll']);
                                    debugger;
                                });
                                callback(LoadedClass);
                            });
                    });

            },
            _public = {
                loadClass: _loadClass
            };
        return _construct();
    }
    return ConfigLoader;
});