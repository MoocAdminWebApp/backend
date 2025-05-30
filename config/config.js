const { mysqlConfig } = require('../appConfig');

module.exports = {
  development: {
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    username: mysqlConfig.user,
    password: mysqlConfig.password,
    database: mysqlConfig.database,
    dialect: 'mysql'
  },
  test: {
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    username: mysqlConfig.user,
    password: mysqlConfig.password,
    database: mysqlConfig.testDatabase || 'mooc1_test',  
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4' 
    }
  }
};