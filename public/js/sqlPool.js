var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit :   10,
    host            :   'classmysql.engr.oregonstate.edu',
    user            :   'cs340_lannersn',
    password        :   '4135',
    database        :   'cs340_lannersn'
});

module.exports.pool = pool;