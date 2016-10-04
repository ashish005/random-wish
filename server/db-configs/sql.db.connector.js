module.exports = (function(){
    var sql = require('mssql');

    sql.dbConnect = function (config, cb) {
        var db = this;
        db.connect(config, function(err, client){
            errorHandler(err);
            cb(err, client);
        });
    };

    function errorHandler(err){
        if(err){
            console.log(JSON.stringify(err));
        }
    }

    sql.dbSelect = function (model, cb) {
        this.dbConnect(model.config, function (error, client) {
            errorHandler(err);
            if(client) {
                client.query(model.query, function (err, results) {
                    cb(err, results);
                });
            }else {
                cb(error, null);
            }
        });
    };
    return sql;
})();