/**
 * Created by wizdev on 10/22/2015.
 */
var _basePath = {
    libs:'assets/libs/',
    app:'app/',
    controls:'app/controls/',
};

require.config({
    urlArgs: 'v=1.0',
    waitSeconds: 200,
    paths: {
        app: 'app/base',
        'middle-layer': 'app/middle-layer',
        'database-layer': 'app/database-layer',
        jQuery:  _basePath.libs+'jquery/jquery-2.1.1.min',
        'jQuery-ui':  _basePath.libs+'jquery/jquery-ui/jquery-ui.min',
        angular: _basePath.libs+"angular/angular",
        angularAMD:  _basePath.libs+'angular/angularAMD.min',
        ngRoute:  _basePath.libs+'angular/angular-route',
        bootstrap: _basePath.libs+'bootstrap/bootstrap.min',
        'ui-bootstrap': _basePath.libs+'bootstrap/ui-bootstrap-tpls-0.12.0.min',
        "app-core":"core/core",
        "ui-grid":_basePath.libs+"ui-grid/ui-grid-unstable",
        "ui-sortable":_basePath.libs+'ui-sortable/sortable',
        "dndLists":_basePath.controls+'drag-drop.helper',
        'dynamic-ui.plugin':_basePath.controls +'dynamic-ui.plugin',
        'controls-config-provider':_basePath.controls+'control-configs/controls-config-provider',
        'ace':_basePath.libs+'ace/build/src/ace'
    },
    // angular does not support AMD out of the box, put it in a shim
    shim: {
        angularAMD: ['angular'],
        angular: {exports: "angular", deps: ["jQuery-ui"]},
        ngRoute: {deps: ["angular"]},
        bootstrap:{deps:['jQuery']},
        jqHighlight:{deps:['jQuery']},
        'ui-bootstrap':{deps: ['jQuery', 'angular']},
        "ui-grid":{deps: ['angular']},
        "app-core":{
            deps: ['bootstrap', 'angular']
        },
        "dndLists":{
            deps: ['angular']
        },
        'jQuery-ui':{
            deps: ['jQuery']
        },
        "ui-sortable":{deps: ['angular','jQuery-ui']},
        app:{
            deps: ["app-core",'bootstrap', 'ngRoute', 'ui-bootstrap', "dndLists", 'dynamic-ui.plugin', "ui-grid", 'ace']
        }
    },
    // kick start application
    deps: ['app']
});