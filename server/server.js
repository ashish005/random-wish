/**
 * Created by wiznidev on 5/21/16.
 */
module.exports = function() {
    'use strict'

    var express = require('express'),
        bodyParser = require('body-parser'),
        cors = require('cors'),
        http = require('http');

    var server = express(); // Set up an express server (but not starting it yet)

// configure app to use bodyParser()
// this will let us get the data from a POST
    server.use(bodyParser.urlencoded({extended: true}));
    server.use(bodyParser.json());
    server.use(cors());

    server.use('/apis', require('./routes')(express, server, http));
    server.use('/core', require('./core')(express));

    var port = process.env.PORT || 4010;        // set our port
    server.set('port', port);
    server.set('views', __dirname + '/views');
    server.set('view engine', 'jade');

    //server.use(livereload({port: livereloadport}));
    //============================================================================
    server.listen(server.get('port'), function () {
        console.log('I am listening to ' + server.get('port'));

    });

    return {
        server:server,
        express:express
    }
}