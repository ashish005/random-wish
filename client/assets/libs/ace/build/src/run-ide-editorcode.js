/**
 * Created by wizdev on 3/28/2016.
 */
// Prepate the javascript String,
// by adding the parts before and after the user code.
(function(global){
    var window = {};
    window.alert = function(){
        console.log.apply(console, ["Alert: "].concat(Array.prototype.slice.call(arguments)));
    };
    var alert = window.alert;
    var console = {
        log: function(){
            var str = "";
            for(var i = 0; i < arguments.length; i++){
                str += JSON.stringify(arguments[i]) + " ";
            }
            str += "\n";
            // send the message back to the main thread
            self.postMessage(str);
        },
        error: function(){
            console.log.apply(console, ["ERROR: "].concat(Array.prototype.slice.call(arguments)));
        },
        warn: function(){
            console.log.apply(console, ["WARNING: "].concat(Array.prototype.slice.call(arguments)));
        }
    };
    self.addEventListener('message', function(e) {
        console.log(e.data);
    }, false);
})(this);
