/**
 * Created by wiznidev on 5/21/16.
 */
(function(){
    'use strict';
    var responseTime = require('response-time');
    function routes(express){
        var router = express.Router();// get an instance of the express Router

        // a middleware function with no mount path. This code is executed for every request to the router
        router.use(function (req, res, next) {
            next();
        });

        router.use(responseTime(function(req, res, time) {
            console.log('X-Response-Time: ' + time)
            res.header('X-Response-Time', time);
        }));

        router.get('/setup', function(req, res) {
            var _s = require('../database/menu.json');
            var _menu = _s[req.headers['host'].split(':')[1]];
            var _setup = {
                app:{
                    "appName" : "ACE+",
                    "appLogo" : "data:image/png;charset=utf-8;base64,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",
                    "appId" : 1,
                    "landingPage":"login",
                },
                menu:_menu,
                user:{
                    name:'Ashish Chaturvedi',
                    pic:'data:image/jpeg;base64,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'
                }
            };

            res.send(_setup);
        });
        return router;
    }

    module.exports = routes;
})();