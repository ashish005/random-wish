/**
 * Created by wiznidev on 6/3/16.
 */
module.exports = (function(){
    var pg = require('pg');
    var serverConfig = {
        serverName:'104.236.69.151:5432',
        database:'postgres',
        userName:"postgres",
        password : "password"
    };

    //pg.connectionString = "pg://"+serverConfig['userName']+':'+serverConfig['password']+'@'+serverConfig['serverName']+'/'+serverConfig['database'];
    pg.connectionString =  "pg://postgres:password@127.0.0.1:5432/postgres";
    pg.on("connect", function (err, callback) {
         var client = new pg.Client(connectionString);
         client.connect();
         callback(client);
     });
    /*pg.on("open", function(){
     console.log("mongodb is connected on " + serverConfig.dbUrl);
     });
     pg.on("close", function(){
     console.log("mongodb is closed from" + serverConfig.dbUrl);
     });*/
    return pg;
})();