(function(){
    'use strict';
    var connector = require('../db-configs/db.connector');
    function routes(express, server, http){
        var router = express.Router();// get an instance of the express Router
        // a middleware function with no mount path. This code is executed for every request to the router
        router.use(function (req, res, next) {
            next();
        });

        router.get('/userDbs', function(req, res) {
            var results = {
                postgress:{
                    dbName:'Postgress',
                    collections:[
                        {
                            serverName:'127.0.0.1:5432',
                            database:'postgres',
                            userName:"postgres",
                            password : "password@123"
                        }
                    ]
                },
                sql:{ dbName:'SQL', collections:[] },
                mySql:{ dbName:'mySql', collections:[] },
                mongodb:{ dbName:'Mongodb', collections:[] },
                oracle:{ dbName:'Oracle', collections:[] },
                IBMDB:{ dbName:'IBMDB', collections:[] }
            };
            return res.json({success: true, data: results});
        });
        router.post('/db', function(req, res) {
            var _query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';";
            var model = {
                type: 'pg',
                config: "pg://postgres:password@123@127.0.0.1:5432/postgres",
                query : _query
            };

           /* var model = {
                type: 'mssql',
                config: 'Data Source=10.0.1.53/HAMMAD025;Initial Catalog=eSFIDB;Integrated Security=True',
                query : _query
            };*/

            connector.dbSelect(model, function(err, results) {
                if(err){
                    return res.json({success: false, message: JSON.stringify(err)});
                }
                return res.json({success: true, data: results.rows});
            });
        });

        return router;
    }

    module.exports = routes;
})();