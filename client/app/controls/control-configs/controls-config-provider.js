define(function(){
    var _options = {
        'ui-grid':{ filePath:'app/../controls/control-configs/grid/ui-grid.config' },
        'tabs':{filePath:'app/../controls/control-configs/tabs/tabs.config'}
    };

    var ConfigLoader = function () {
        var _construct = function () { return _public; },
            _loadClass = function (key, callback) {
               var _class = _options[key];
                require(_class.dependencies,
                    function () {
                        require([_class.filePath],
                            function (LoadedClass) {
                                 var $injector = angular.injector(['ng']);
                                 $injector.loadNewModules(['ui.grid', 'ui.grid.infiniteScroll']);
                                $injector.invoke(function ($compile, $rootScope) {
                                    var v = $injector.get('uiGridColumnMenuService');
                                })
                                //var v = $injector.get('uiGridColumnMenuService');
                                
                                //angular.modules.select(window['name'])
                                define(_class.filePath, ['ui.grid', 'ui.grid.infiniteScroll'], function (info) {
                                    //angular.module(window['name'], ['ui.grid', 'ui.grid.infiniteScroll']);
                                });
                                /*angular.module(window['name'], ['ui.grid']);
                                var v = $injector.get('uiGridColumnMenuService');*/
                                angular.module(window['name'], ['ui.grid', 'ui.grid.infiniteScroll']);
                                var v = $injector.get('uiGridColumnMenuService');
                                callback(LoadedClass);
                            });
                    });

            },
            _getConfig = function (key, callback) {
                var _class = _options[key];
                require([_class.filePath],callback);
            }
            _public = {
                loadClass: _loadClass,
                getConfig: _getConfig
            };
        return _construct();
    }
    return ConfigLoader;
});