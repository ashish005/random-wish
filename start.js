var app = require('./server/server')(); //Run Server
app.server.use('/', app.express.static(__dirname + '/client'));
app.server.get('/', function (req, res) {
    res.sendFile('client/index.html' , { root : __dirname});
});
app.server.listen(4019, function () {
    console.log('I am listening ' + 4019);
});
app.server.listen(4016, function () {
    console.log('I am listening ' + 4016);
});

app.server.use('/database', app.express.static(__dirname + '/database'));
app.server.use('/data', app.express.static(__dirname + '/data'));
app.server.use('/server', app.express.static(__dirname + '/server'));
//app.server.use('/images', app.express.static(__dirname + '/images'));
//app.server.use('/assets', app.express.static(__dirname + '/assets'));

/*
var admin = require('./server/admin')(); //Run Server
admin.server.use('/', admin.express.static(__dirname + '/admin'));
admin.server.get('/', function (req, res) {
    console.log(__dirname);
    res.sendFile('admin/index.html' , { root : __dirname});
});*/
