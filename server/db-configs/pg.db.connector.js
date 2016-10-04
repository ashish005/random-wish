module.exports = (function(){
    var pg = require('pg');

    pg.dbConnect = function (config, cb) {
        var db = this;
        db.connect(config, function(err, client, done){
            errorHandler(err);
            cb(err, client, done);
        });
    };
    function errorHandler(err){
        if(err){
            console.log(JSON.stringify(err));
        }
    }
    pg.dbSelect = function (model, cb) {
        this.dbConnect(model.config, function (error, client, done) {
            errorHandler(error);
            if(client) {
                client.query(model.query, function(err, results) {
                    done();
                    cb(err, results);
                });
            }else {
                cb(error, null);
            }
        });
    };
    
    return pg;
})();