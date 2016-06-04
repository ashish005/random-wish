/**
 * Created by wiznidev on 6/3/16.
 */
(function(){
    var _connector = {
        mongoose:  require('./mongo.db.connector'),
        mySql:  require('./mySql.db.connector'),
        postgreSql:  require('./postgreSQL.db.connector'),
        sqlServer:  require('./sql.db.connector')
    };
    exports = module.exports = _connector;
})();
