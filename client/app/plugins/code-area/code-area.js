/**
 * Created by wizdev on 3/20/2016.
 */
(function(define, angular){
    "use strict";
    function codeArea($http) {
        return {
            restrict: 'AE',
            templateUrl: require('./templates/code-area.html'),
            link: function ($scope, element, attr, ctrl, transclude) {
                /*var editor = ace.edit("editor");
                editor.setTheme("ace/theme/monokai");
                editor.getSession().setMode("ace/mode/javascript");
                document.getElementById('editor').style.fontSize='16px';*/
            }
        }
    }

    angular
        .module(window['name'])
        .directive('codeArea', ['$http', codeArea])
})(window.define, window.angular);