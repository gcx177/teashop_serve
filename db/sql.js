const mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost', //数据库地址
    port: '3306',//端口号
    user: 'root',//用户名
    password: 'root',//密码
    database: 'vue_store'
});

module.exports = connection