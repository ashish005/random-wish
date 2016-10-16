(function(){
    'use strict';
    var connector = require('../db-configs/db.connector');
    var config = "pg://postgres:password@123@127.0.0.1:5432/postgres";
    function routes(router){
        router.get('/modules', function(req, res) {
            var results = {
            };
            return res.json({success: true, data: results});
        });
        router.put('/modules', function(req, res) {
            var results = {
            };
            return res.json({success: true, data: results});
        });
        router.post('/modules', function(req, res) {
            var results = {
            };
            return res.json({success: true, data: results});
        });
        router.delete('/modules', function(req, res) {
            var results = {
            };
            return res.json({success: true, data: results});
        });

        router.get('/apis/:id', function(req, res) {
            var _query = "SELECT * FROM public.apisrepository where id = " + req.params.id;

            var model = {
                type: 'pg',
                config: config,
                query : _query
            };
            connector.dbSelect(model, function(err, results) {
                if(err){
                    return res.json({success: false, message: JSON.stringify(err)});
                }
                return res.json({success: true, data: results.rows[0]});
            });
        });

        router.get('/apis', function(req, res) {
            var _query = "SELECT id, method, name FROM public.apisrepository";

            var model = {
                type: 'pg',
                config: config,
                query : _query
            };
            connector.dbSelect(model, function(err, results) {
                if(err){
                    return res.json({success: false, message: JSON.stringify(err)});
                }
                return res.json({success: true, data: results.rows});
            });
        });

        router.post('/apis', function(req, res) {
            var _reqKeys = req.body;
            var _query = {
                text: 'INSERT INTO public.apisrepository (method, name) values($1, $2) RETURNING id, method, name;',
                values: [_reqKeys['method'], _reqKeys['apiName']]
            };
            var model = {
                type: 'pg',
                config: config,
                query : _query
            };
            connector.dbInsert(model, function(err, results) {
                if(err){
                    return res.json({success: false, message: JSON.stringify(err)});
                }
                return res.json({success: true, data: results.rows[0]});
            });
        });
        return router;
    }

    module.exports = routes;
})();