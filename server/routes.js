/**
 * Created by wiznidev on 5/21/16.
 */
(function(){
    'use strict';
    var logger = require('./utility/db-logger');
    var connector = require('./db-configs/db.connector');
    function routes(express, server){
        var router = express.Router();// get an instance of the express Router
        // a middleware function with no mount path. This code is executed for every request to the router
        router.use(function (req, res, next) {
            next();
        });

        router.get('/apis', function(req, res) {
            res.render('apis', {data:router.stack});
        });

        router.use(logger.apiLogger);

        router.post('/setup', function(req, res) {
            var db = connector.postgreSql;var results = {};
            db.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    done();
                    console.log(err);
                    return res.status(500).json({ success: false, data: err});
                }

                var _defaultMenu = JSON.stringify([
                    {
                        "id": 1, "text":"Home", "order":1, "routeTo":"#/", "child": []
                    }
                ]);
                // SQL Query > Insert Data
                var _query = " SELECT url from config";
                client.query(_query, function(err, urlResult) {
                    done();
                    var _max = 4001;

                    urlResult.rows.forEach(function (item) {
                        var _val = item['url'];

                        if ( _val>0 &&  _val >= _max) {
                            _max = parseInt(_val)+1;
                        }
                    });

                    server.listen(_max, function () {
                        console.log('I am listening ' + _max);
                        client.query("INSERT INTO config(menu, owner, name, referer, url, pid) values($1, $2, $3, $4, $5 , $6)",
                            [_defaultMenu, 'Ashish Chaturvedi', req.body['name'].toString(), req.headers['appid'].toString(), _max, process.pid],
                            function(err, result) {
                                done();
                                if(err) {
                                    return res.status(500).json({ success: false, data: err});
                                }
                                client.end();
                                return res.json({ success: true, data: results});
                            });
                    });
                });
            });
        });
        router.get('/setup', function(req, res) {
            var db = connector.postgreSql;var results = {};
            db.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    done();
                    console.log(err);
                    return res.status(500).json({ success: false, data: err});
                }

                //return res.json({ success: true, data: []});
                // SQL Query > Select Data
                var query = client.query(" SELECT * from config ce where ce.url = '"+req.headers['host'].split(':')[1]+"'");

                query.on('row', function(row) {
                    results = {
                        app:{
                            name: row['name'],
                            logo: row['logo'],
                            id:row['id'],
                            owner:row['owner']
                        },
                        menu: row['menu']
                    };
                });

                // After all data is returned, close connection and return results
                query.on('end', function() {
                    done();
                    client.end();
                    return res.json({ success: true, data: results});
                });
            });
        });

        return router;
    }

    module.exports = routes;
})();