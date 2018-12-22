const sql = require('mssql');
//config for your database
var config = {
    user: 'sa',
    password: 'hellowang',
    server: 'localhost',
    database: 'mmyc'
};
function createTable(table_name, callback) {
    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        request.query(`
		CREATE TABLE data_${table_name} 
		(
		id integer IDENTITY PRIMARY KEY, 
		user_url varchar(500) NOT NULL, 
		img_url varchar(500) NOT NULL,
		username varchar(500) NOT NULL,
		message varchar(500) NOT NULL,
		);`
            , function (err, recordset) {
                if (err) console.log(err);
                callback&&callback(err);
            });
    });
}
module.exports = createTable