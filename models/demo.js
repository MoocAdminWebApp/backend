const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelizedb");

const demo = sequelize.define(
  "Demo",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mark: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull:true,
    },
    acitve: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull:false
    },
    dataTime:{
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull:false
    }
  },
  { timestamps: false, tableName: 'Demo' }
);

module.exports = demo;
