/**
 * Created by wiznidev on 6/3/16.
 */
module.exports = function(){
    var mongoose = require('mongoose');
    var serverConfig = { dbUrl:'127.0.0.1:27017/am4it_auth_db_backup' };
    // Database
   /* mongoose.connect('mongodb://'+ serverConfig.dbUrl, function (error, db) {
        console.log('mongo database Url: ' + serverConfig.dbUrl);
    });

    mongoose.connection.on("open", function(){
        console.log("mongodb is connected on " + serverConfig.dbUrl);
    });

    mongoose.connection.on("close", function(){
        console.log("mongodb is closed from" + serverConfig.dbUrl);
    });*/

    mongoose.dbConnect = function (config, cb) {
        var db = this;
        db.connect(config, function(err, client, done){
            if(err) {
                console.log(JSON.stringify(err));
            };
            cb(client, done);
        });
    };
    mongoose.dbSelect = function (model, cb) {
        this.dbConnect(model.config, function (client, done) {
            client.query(model.query, function(err, results) {
                done();
                cb(results);
            });
        });
    };
    
    return mongoose;
}