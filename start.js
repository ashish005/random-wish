var app = require('./server/server')(); //Run Server
app.server.use('/', app.express.static(__dirname + '/client'));
app.server.get('/', function (req, res) {
    res.sendFile('client/index.html' , { root : __dirname});
});
/*app.server.listen(4002, function () {
    console.log('I am listening ' + 4002);
});*/
app.server.use('/database', app.express.static(__dirname + '/database'));

//app.server.use('/images', app.express.static(__dirname + '/images'));
//app.server.use('/assets', app.express.static(__dirname + '/assets'));

/*
var admin = require('./server/admin')(); //Run Server
admin.server.use('/', admin.express.static(__dirname + '/admin'));
admin.server.get('/', function (req, res) {
    console.log(__dirname);
    res.sendFile('admin/index.html' , { root : __dirname});
});*/
