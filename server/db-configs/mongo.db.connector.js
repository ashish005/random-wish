/**
 * Created by wiznidev on 6/3/16.
 */
module.exports = function(){
    var mongoose = require('mongoose');
    var serverConfig = { dbUrl:'127.0.0.1:27017/am4it_auth_db_backup' };
    // Database
    mongoose.connect('mongodb://'+ serverConfig.dbUrl, function (error, db) {
        console.log('mongo database Url: ' + serverConfig.dbUrl);
    });

    mongoose.connection.on("open", function(){
        console.log("mongodb is connected on " + serverConfig.dbUrl);
    });

    mongoose.connection.on("close", function(){
        console.log("mongodb is closed from" + serverConfig.dbUrl);
    });
    return mongoose;
}