(function(){
    'use strict';
    var connector = require('../db-configs/db.connector');
    function routes(router){
        router.get('/userDbs', function(req, res) {
            var results = {
                pg:{
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
                sql:{ dbName:'SQL', collections:[{
                    server:'127.0.0.1:5432',
                    database:'postgres',
                    user:"postgres",
                    password : "password@123",
                    options:{encrypt:true}
                }] },
                mySql:{ dbName:'mySql', collections:[] },
                mongodb:{ dbName:'Mongodb', collections:[] },
                oracle:{ dbName:'Oracle', collections:[] },
                IBMDB:{ dbName:'IBMDB', collections:[] }
            };
            return res.json({success: true, data: results});
        });
        router.post('/db/connection', function(req, res) {
            var _reqBody = req.body;
            var _reqKey = Object.keys(req.body)[0];
            var model = {
                type: _reqKey,
                config: _reqBody[_reqKey]
            };
            /*var model = {
                type: 'pg',
                config: "pg://postgres:password@123@127.0.0.1:5432/postgres"
            };*/
            connector.dbConnect(model, function(err, results) {
                if(err){
                    return res.json({success: false, message: JSON.stringify(err)});
                }
                return res.json({success: true, data: 'Connection Successful!'});
            });
        });
        router.post('/db', function(req, res) {
            var _query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';";
            var model = {
                type: 'pg',
                config: "pg://postgres:password@123@127.0.0.1:5432/postgres",
                query : _query
            };

             /*var model = {
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