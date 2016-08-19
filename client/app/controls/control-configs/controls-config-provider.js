define(function(){

    var _options = {
        'ui-grid':{ filePath:'app/controls/control-configs/grid/ui-grid.config' }
    };

    var ConfigLoader = function () {
        var _construct = function () { return _public; },
            _loadClass = function (key, callback) {
                debugger;
                var className = _options[key]['filePath'];
                /*define(['./controls/control-configs/grid/ui-grid.config'], function () {
                    debugger;
                });*/
                require(['app/../controls/control-configs/grid/ui-grid.config'],
                    function (LoadedClass) {
                        callback(LoadedClass);
                    });
            },
            _public = {
                loadClass: _loadClass
            };
        return _construct();
    }
    return ConfigLoader;
});