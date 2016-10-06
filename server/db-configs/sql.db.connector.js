module.exports = (function(){
    var sql = require('mssql');

    sql.dbConnect = function (config, cb) {
        var db = this;
        db.connect(config, function(client){
            cb(null, client);
        }, function (err) {
            errorHandler(err);
            cb(err, null);
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
                // Query
                new sql.Request().query(model.query, function (results) {
                    cb(err, results);
                }, function (err) {
                    cb(err, null);
                });
                // Stored Procedure
                /*new sql.Request()
                    .input('input_parameter', sql.Int, value)
                    .output('output_parameter', sql.VarChar(50))
                    .execute('procedure_name').then(function(recordsets) {
                    console.dir(recordsets);
                }).catch(function(err) {
                    // ... execute error checks
                });*/
            }else {
                cb(error, null);
            }
        });
    };
    return sql;
})();