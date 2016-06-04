/**
 * Created by wiznidev on 5/21/16.
 */
(function(){
    'use strict';
    var logger = require('./utility/db-logger');
    var connector = require('./db-configs/db.connector');
    function routes(express){
        var router = express.Router();// get an instance of the express Router
        // a middleware function with no mount path. This code is executed for every request to the router
        router.use(function (req, res, next) {
            next();
        });

        router.get('/apis', function(req, res) {
            res.render('apis', {data:router.stack});
        });

        router.use(logger.apiLogger);

        router.get('/setup', function(req, res) {
            var db = connector.postgreSql;var results = {};
            db.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    done();
                    console.log(err);
                    return res.status(500).json({ success: false, data: err});
                }

                // SQL Query > Insert Data
               // client.query("INSERT INTO configureEnricher(appid, owner) values($1, $2)", [1111111, 'Ashish Chaturvedi']);

                // SQL Query > Select Data
                var query = client.query(" SELECT * from configureEnricher ce where ce.url = '"+req.headers['host'].split(':')[1]+"'");

                query.on('row', function(row) {
                    results = {
                        app:{
                            name: row['name'],
                            logo: row['logo'],
                            id:row['appid'],
                            owner:row['owner']
                        },
                        menu: row['menu']
                    };
                });

                // After all data is returned, close connection and return results
                query.on('end', function() {
                    done();
                    return res.json({ success: true, data: results});
                });
            });
        });

        return router;
    }

    module.exports = routes;
})();