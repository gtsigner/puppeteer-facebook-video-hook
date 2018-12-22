//const insertData = require('./insertData')

module.exports = async (page, table_name) => {
    page.on('console', msg => {
        if (msg._type == 'debug') {
            var resuit = msg._text.match(/zk-dage-666(.*)/)[1]
            console.log(JSON.parse(resuit))
            // insertData(table_name, JSON.parse(resuit), function (resuit) {
            //     console.log(resuit);
            // })
        }
    });
}