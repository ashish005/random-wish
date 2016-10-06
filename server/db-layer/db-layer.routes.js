(function(){
    'use strict';
    
    var apis = require('./db-layer.apis');
    function routes(router){
        router.get('/', function(req, res) {
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
            res.render('db-layer/views/index', { title: 'Hey', message: 'Hello there!', data: results, dataColl:[]});
        });
        return router;
    };
    module.exports = routes;
})();