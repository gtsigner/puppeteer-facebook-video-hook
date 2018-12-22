// var mysql = require('mysql');

// function outpoutPool() {
// 	this.flag = true;
// 	this.pool = mysql.createPool({
// 		host: 'localhost\\SQLEXPRESS',
// 		user: 'sa',
// 		password: 'suppormysql',
// 		database: 'mmyc',
// 		//port: '3306'
// 	})
// 	this.getPool = function () {
// 		if (this.flag) {
// 			this.pool.on('connection', function (connection) {
// 				connection.query('set session auto_increment_increment=1')
// 				this.flag = false;
// 			});
// 		}
// 		return this.pool;
// 	}
// 	this.queryDataBase = function (quertSql, connection, callback) {
// 		connection.query(quertSql, function (error, data) {
// 			if (error) {
// 				console.log(error);
// 				return error;
// 			}
// 			var resuit = JSON.parse(JSON.stringify(data));
// 			// response.write(JSON.stringify(resuit));
// 			// response.end()
// 			callback(resuit);
// 			connection.release();
// 		})
// 	}

// };

// var newOutputPool = new outpoutPool();
// var pool = newOutputPool.getPool();
// var queryDadaBase = newOutputPool.queryDataBase

// module.exports = {
// 	pool,
// 	queryDadaBase
// };




const sql = require('mssql');
//config for your database
var config = {
	user: 'sa',
	password: 'hellowang',
	server: 'localhost',
	database: 'mmyc'
};

//connect to your database
sql.connect(config, function (err) {
	if (err) console.log(err);

	//create Request object
	var request = new sql.Request();
	// `CREATE TABLE \`${'hello'}\`(
	// 	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	// 	user_url VARCHAR(500) NOT NULL,
	// 	img_url VARCHAR(500) NOT NULL,
	// 	username VARCHAR(500) NOT NULL,
	// 	message VARCHAR(500) NOT NULL,
	//  );`
	request.query(`
		CREATE TABLE ${'hello'} 
		(
		id integer IDENTITY PRIMARY KEY, 
		user_url varchar(500) NOT NULL, 
		img_url varchar(500) NOT NULL,
		username varchar(500) NOT NULL,
		message varchar(500) NOT NULL,
		);`
		, function (err, recordset) {
			if (err) console.log(err);
		});
});
