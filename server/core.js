/**
 * Created by wiznidev on 6/25/16.
 */
(function(){
    'use strict';
    var async = require('async');
    var logger = require('./utility/db-logger');
    var connector = require('./db-configs/db.connector');
    function routes(express){
        var router = express.Router();// get an instance of the express Router
        // a middleware function with no mount path. This code is executed for every request to the router
        router.use(function (req, res, next) {
            next();
        });

        router.get('/core', function(req, res) {
            res.render('core', {data:router.stack});
        });

        router.use(logger.apiLogger);

        router.get('/collections', function(req, res) {
            var db = connector.postgreSql;var results = {};
            db.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    done();
                    console.log(err);
                    return res.status(500).json({ success: false, data: err});
                }
                var query = client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");

                var results = [];
                query.on('row', function(row) {
                    results.push({name: row['table_name']});
                });

                // After all data is returned, close connection and return results
                query.on('end', function() {
                    done();
                    return res.json({ success: true, data: results});
                });
            });
        });

        router.get('/collection/data', function(req, res) {
            var collection = req.query;
            var db = connector.postgreSql;var results = {};
            db.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    done();
                    return res.status(500).json({ success: false, data: err});
                }
                var rows = [], columns =[];

                var _referer = req.headers['appid'];
                var _query =' SELECT * FROM ' + collection['name'];
                //var _query =" SELECT id, logo, name, owner, pid FROM config ce where ce.referer = '" +_referer +"'";
                client.query(_query, function(err, result) {
                    done();
                    if(err) {
                        return res.status(500).json({ success: false, data: err});
                    }

                    result.fields.forEach(function(field, index){
                        columns.push({ displayName: field.name, field :field.name});
                    });

                    return res.json({ success: true, data: result.rows, columns:columns});
                });

            });
        });

        router.get('/collection/info', function(req, res) {
            var db = connector.postgreSql;var results = {};
            db.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    done();
                    return res.status(500).json({ success: false, data: err});
                }
                var _referer = req.headers['appid'];
                var _query =" SELECT id, url, logo, name, owner, pid FROM config ce where ce.referer = '" +_referer +"'";

                client.query(_query, function(err, result) {
                    done();
                    if(err) {
                        return res.status(500).json({ success: false, data: err});
                    }
                    client.end();
                    return res.json({ success: true, data: result.rows});
                });

            });
        });

        return router;
    }

    module.exports = routes;
})();