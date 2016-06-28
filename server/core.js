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
            /*mongoose.model(collection['name']).find({},{_id:0}, function (err, _doc){
                if(err) {
                    return res.status(400).send({isSuccess:false, message:err, data:_doc});
                }
                return res.status(200).send({isSuccess:true, message:err, data:_doc});
            });*/

            var db = connector.postgreSql;var results = {};
            db.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    done();
                    return res.status(500).json({ success: false, data: err});
                }
                var rows = [], columns =[];

                var _query =' SELECT * FROM ' + collection['name'];
                /*var query = client.query(_query);

                query.on('field', function(field, index) {
                    columns.push(field);
                });
                query.on('row', function(row) {
                    rows.push(row);
                });

                // After all data is returned, close connection and return results
                query.on('end', function() {
                    done();
                    return res.json({ success: true, data: rows, columns:columns});
                });*/

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

        return router;
    }

    module.exports = routes;
})();