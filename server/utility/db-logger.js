/**
 * Created by wiznidev on 6/4/16.
 */
'use strict';
var responseTime = require('response-time');
var connector = require('../db-configs/db.connector');

var dbLogger = function (req, res, consumedTime) {
    var db = connector.postgreSql;
    db.connect(db.connectionString, function(err, client, done) {
        if(err) {
            done();
            //return res.status(500).json({ success: false, data: err});
        }

        /*var query = client.query( "CREATE TABLE apistracker"+
            "("+
            "request json,"+
            "response json,"+
            "timeconsumed text,"+
            "id serial NOT NULL"+
            ")");*/

        var info ={
            req :{
                referer:req.headers["referer"],
                method:req.method,
                query:req.query,
                params:req.params,
            },
            resp :{body:''},
            consumedTime :consumedTime
        };

        var _queryText = "insert into apistracker (request, response, timeconsumed) values ('"+ JSON.stringify(info.req) +"', '"+ JSON.stringify(info.resp) +"', '"+info.consumedTime+"')";
        client.query(_queryText, function(err, result) {
            if (err) {
                console.log(err);
            };
            done();
            //client.end();
        });
    });
};

module.exports = {
    apiLogger: responseTime(dbLogger)
};