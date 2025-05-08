const { DataTypes } = require("sequelize");

const { sequelize } = require("../db/sequelizedb");

const RoleMenu = sequelize.define(
  "RoleMenu",
  {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: "roleId",
    },
    menuId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: "menuId",
    },
  },
  {
    tableName: "RoleMenu",
    timestamps: false,
  }
);

RoleMenu.associate = function (models) {
  RoleMenu.belongsTo(models.Menu, {
    foreignKey: "menuId",
    as: "menus",
  });
  RoleMenu.belongsTo(models.Role, {
    foreignKey: "roleId",
    as: "roles",
  });
};

module.exports = RoleMenu;
