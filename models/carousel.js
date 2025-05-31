const DataTypes = require("sequelize");
const { sequelize } = require("../db/sequelizedb");

const carousel = sequelize.define(
  "Carousel",
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderNum: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    linkUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  { timestamps: false, tableName: 'Carousel' }
);

module.exports = carousel;