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
            var _options = _s[req.headers['host'].split(':')[1]];
            var _setup = {
                app:_options['appInfo'],
                menu:_options['menu'],
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