const { mysqlConfig } = require('../appConfig');

module.exports = {
  development: {
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    username: mysqlConfig.user,
    password: mysqlConfig.password,
    database: mysqlConfig.database,
    dialect: 'mysql'
  }
};