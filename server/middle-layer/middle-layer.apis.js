(function(){
    'use strict';
    var connector = require('../db-configs/db.connector');

    function routes(router){
        router.get('/s', function(req, res) {
            var results = {
            };
            return res.json({success: true, data: results});
        });
        return router;
    }

    module.exports = routes;
})();