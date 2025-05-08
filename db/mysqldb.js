// const mysql = require("mysql");//not support await/async

const mysql2 = require('mysql2/promise');//support awat/async
const { mysqlConfig } = require("../appConfig");

const db = mysql2.createPool({
  host: mysqlConfig.host,
  port: mysqlConfig.port,
  user: mysqlConfig.user,
  password: mysqlConfig.password,
  database: mysqlConfig.database,
});

module.exports = {
  db,
};