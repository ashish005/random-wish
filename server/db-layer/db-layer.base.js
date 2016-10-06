(function(){
    'use strict';
    function routes(express, server, http){
        var router = express.Router();// get an instance of the express Router
        // a middleware function with no mount path. This code is executed for every request to the router
        router.use(function (req, res, next) {
            next();
        });
        require('./db-layer.apis')(router);
        return router;
    }

    module.exports = routes;
})();