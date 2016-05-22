/**
 * Created by wizdev on 10/22/2015.
 */
var _basePath = {
    libs:'assets/libs/'
};

require.config({
    urlArgs: 'v=1.0',
    waitSeconds: 200,
    paths: {
        app: 'app/base',
        jQuery:  _basePath.libs+'jquery/jquery-2.1.1.min',
        angular: _basePath.libs+"angular/angular",
        angularAMD:  _basePath.libs+'angular/angularAMD.min',
        ngRoute:  _basePath.libs+'angular/angular-route',
        bootstrap: _basePath.libs+'bootstrap/bootstrap.min',
        'ui-bootstrap': _basePath.libs+'bootstrap/ui-bootstrap-tpls-0.12.0.min',
        "app-core":"core/core",
        "ui-grid":"http://ui-grid.info/release/ui-grid-unstable"
    },
    // angular does not support AMD out of the box, put it in a shim
    shim: {
        angularAMD: ['angular'],
        angular: {exports: "angular"},
        ngRoute: {deps: ["angular"]},
        bootstrap:{deps:['jQuery']},
        jqHighlight:{deps:['jQuery']},
        'ui-bootstrap':{deps: ['jQuery', 'angular']},
        "ui-grid":{deps: ['angular']},
        "app-core":{
            deps: ['bootstrap', 'angular']
        },
        app:{
            deps: ['bootstrap', 'ngRoute', 'ui-bootstrap',"ui-grid"]
        }
    },
    // kick start application
    deps: ['app', "app-core"]
});