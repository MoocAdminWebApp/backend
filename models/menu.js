"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  menu.init(
    {
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
      type: {
        type: DataTypes.ENUM("directory", "menu", "button"),
        allowNull: false,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      orderNum: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      component: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      permission: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      remark: {
        type: DataTypes.STRING,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "menu",
    }
  );
  return menu;
};
