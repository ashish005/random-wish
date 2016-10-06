/**
 * Created by wiznidev on 6/3/16.
 */
(function(){
    var _connector = {
        mongoDb:  require('./mongo.db.connector'),
        mySql:  require('./mySql.db.connector'),
        postgreSql:  require('./postgres.db.connector'),
        pg:  require('./pg.db.connector'),
        sql:  require('./sql.db.connector')
    };

    /*_connector.dbConnect = function (config, cb) {
        var db = this.activeDb;
        db.connect(config, function(err, client, done){
            if(err) {
                console.log(JSON.stringify(err));
            };
            cb(client, done);
        });
        return db;
    };*/
    _connector.dbConnect = function (model, cb) {
        this[model.type].dbConnect(model.config, cb);
    };
    _connector.dbSelect = function (model, cb) {
        this[model.type].dbSelect(model, cb);
    };
    
    exports = module.exports = _connector;
})();
