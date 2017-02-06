(function(){
    'use strict';
    //var connector = require('../db-configs/db.connector');

    function appRoutes(router){
        router.get('/simulation/:api', function(req, res) {
            var results = {
                api:req.params.api
            };
            return res.json({success: true, data: results});
        });
        return router;
    }

    module.exports = appRoutes;
})();