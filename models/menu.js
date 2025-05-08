const { DataTypes } = require("sequelize");

const { sequelize } = require("../db/sequelizedb");

const Menu = sequelize.define(
  "Menu",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      field: "title",
      allowNull: false,
    },
    permission: {
      type: DataTypes.STRING,
      field: "permission",
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      field: "parentId",
      allowNull: true,
      references: {
        model: "menu",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    route: {
      type: DataTypes.STRING,
      field: "route",
      allowNull: true,
    },
    componentPath: {
      type: DataTypes.STRING,
      field: "componentPath",
      allowNull: true,
    },
    orderNum: {
      type: DataTypes.INTEGER,
      field: "orderNum",
      allowNull: true,
    },
    menuType: {
      type: DataTypes.ENUM("Dir", "Menu", "Btn"),
      field: "menuType",
      allowNull: true,
      get() {
        const menuType = this.getDataValue("menuType");
        const menuTypeToNumber = {
          Dir: 1,
          Menu: 2,
          Btn: 3,
        };
        return menuTypeToNumber[menuType];
      },
    },
    httpUrl: {
      type: DataTypes.STRING,
      field: "httpUrl",
      allowNull: true,
    },
    httpMethod: {
      type: DataTypes.STRING,
      field: "httpMethod",
      allowNull: true,
    },
  },
  {
    tableName: "Menu",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

Menu.associate = function (models) {
  Menu.belongsTo(models.Menu, { foreignKey: "parentId", as: "parentMenu" });
  Menu.hasMany(models.Menu, { foreignKey: "parentId", as: "subMenus" });

  Menu.belongsToMany(models.Role, {
    foreignKey: "menuId",
    through: "RoleMenu",
    as: "roles",
  });

};

module.exports = Menu;
