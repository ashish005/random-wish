/**
 * Created by wiznidev on 5/21/16.
 */
(function(){
    'use strict';
    var logger = require('./utility/db-logger');
    var connector = require('./db-configs/db.connector');
    function routes(express, server, http){
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

                    var _query = {
                        text: 'INSERT INTO config(menu, owner, name, referer, url, pid) values($1, $2, $3, $4, $5 , $6) RETURNING id, url, logo, name, owner, pid;',
                        values: [_defaultMenu, 'Ashish Chaturvedi', req.body['name'].toString(), req.headers['appid'].toString(), _max, process.pid]
                    };
                    client.query(_query, function (err, result) {
                            done();
                            if (err) {
                                return res.status(500).json({success: false, data: err});
                            }
                            return res.json({success: true, row: result.rows[0]});
                        });
                });
            });
        });

        function createMultipleListenrServers (client, callback){
            var query = client.query(" SELECT ce.url from config ce where ce.referer >0");
            var ports = [];
            query.on('row', function(row) {
                ports.push(parseInt(row.url));
            });
            query.on('end', function() {
                ports.forEach(function(port) {
                    server.listen(port);
                });
                callback();
            });
            function reqHandler(req, res) {

            }

        }

        router.get('/setup', function(req, res) {
            var db = connector.postgreSql;var results = {}, createServer = false;
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
                    if(row['pid'] == null){
                        createServer = true;
                    }
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

                    if(createServer) {
                        createMultipleListenrServers(client, function () {
                            done();
                            return res.json({success: true, data: results});
                        });

                    }else {
                        done();
                        return res.json({success: true, data: results});
                    }
                });
            });
        });

        router.post('/projectView', function(req, res) {
            var db = connector.postgreSql;var results = {};
            db.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    done();
                    return res.status(500).json({ success: false, data: err});
                }
                // SQL Query > Insert Data
                var _query = {
                    text: 'INSERT INTO views (appid, name, view) values($1, $2, $3) RETURNING *;',
                    values: [req.body['id'], req.body['name'], req.body['view']]
                };
                client.query(_query,
                    function(err, result) {
                        done();
                        if(err) {
                            return res.status(500).json({ success: false, data: err});
                        }
                        return res.json({ success: true, rows: result.rows[0]});
                    });
            });
        });

        router.get('/projectView', function(req, res) {
            var db = connector.postgreSql;var results = {};
            db.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    done();
                    console.log(err);
                    return res.status(500).json({ success: false, data: err});
                }
                // SQL Query > select data
                var _params = req.query;
                var _query = "select views.*, config.url from views left join config on config.id= views.appid where appid =" + _params['id'];
                if(_params['view']){
                    _query += " and views.name = '"+ _params['view'] +"'";
                }
                client.query(_query,
                    function(err, results) {
                        done();
                        if (err) {
                            return res.status(500).json({success: false, data: err});
                        }
                        return res.json({success: true, data: results.rows});
                    });
            });
        });

        return router;
    }

    module.exports = routes;
})();