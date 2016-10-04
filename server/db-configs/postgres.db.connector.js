 module.exports = (function(){
    var pg = require('pg');//'require' the 'pg' module
    var serverConfig = {
        serverName:'127.0.0.1:5432',
        database:'postgres',
        userName:"postgres",
        password : "password@123"
    };

    //pg.connectionString = "pg://"+serverConfig['userName']+':'+serverConfig['password']+'@'+serverConfig['serverName']+'/'+serverConfig['database'];
    pg.connectionString =  "pg://postgres:password@123@127.0.0.1:5432/postgres";
    pg.on("connect", function (err, callback) {
         var client = new pg.Client(connectionString);
         client.connect();
         callback(client);
     });
     pg.on("open", function(){
        console.log("mongodb is connected on " + serverConfig.dbUrl);
     });
     pg.on("close", function(){
        console.log("mongodb is closed from" + serverConfig.dbUrl);
     });
    return pg;
})();