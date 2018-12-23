
const sql = require('mssql');
//config for your database
var config = {
    user: 'sa',
    password: 'hellowang',
    server: 'localhost',
    database: 'mmyc'
};
// user_url
// img_url
// username
// message
function insertData(table_name, {
    sortUrl,
    userImg,
    userName,
    content
}, callback) {
    sql.close();
    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        request.query(
    	`INSERT INTO data_${table_name}(user_url,img_url,username,message) VALUES ('${sortUrl}','${userImg}','${userName}','${content}')`
            , function (err, recordset) {
                if (err) console.log(err);
                callback && callback(recordset);
                sql.close()
            });
    });
    // new sql.ConnectionPool(config).connect().then(pool => {
    //     return pool.query(`INSERT INTO data_${table_name}(user_url,img_url,username,message) VALUES ('${sortUrl}','${userImg}','${userName}','${content}')`)
    // }).then(result => {
    //     callback && callback(recordset);
    //     pool.close()
    // }).catch(err => {
    //     console.log(err);

    // })
}


// sortUrl,
// userImg,
// userName,
// content
// insertData('123', {
//     sortUrl: 15,
//     userImg: 16,
//     userName: 7,
//     content: 5
// }, function (resuit) {
//     console.log(resuit);
// })
// insertData('123', {
//     sortUrl: 15,
//     userImg: 16,
//     userName: 7,
//     content: 5
// }, function (resuit) {
//     console.log(resuit);
// })
module.exports = insertData