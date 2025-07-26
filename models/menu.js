"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Menu.belongsTo(models.User, { foreignKey: "createdBy", targetKey: "id" });
      Menu.belongsTo(models.User, { foreignKey: "updatedBy", targetKey: "id" });
      Menu.belongsTo(models.Permission, {
        foreignKey: "permission",
        targetKey: "id",
        as: "permissionInfo",
      });

      Menu.belongsTo(models.Menu, { foreignKey: "parentId", as: "parent" });
      Menu.hasMany(models.Menu, { foreignKey: "parentId", as: "children" });

      Menu.belongsToMany(models.Role, {
        foreignKey: "menuId",
        otherKey: "roleId",
        through: "role_menus",
        as: "roles",
      });
    }
  }
  Menu.init(
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
        type: DataTypes.ENUM("DIRECTORY", "MENU", "BUTTON"),
        allowNull: false,
        defaultValue: "MENU",
        get() {
          const type = this.getDataValue("type");
          const typeToNumber = {
            DIRECTORY: 1,
            MENU: 2,
            BUTTON: 3,
          };
          return typeToNumber[type];
        },
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "menus",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "permissions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE", "DRAFT", "DELETED"),
        allowNull: false,
        defaultValue: "ACTIVE",
        get() {
          const status = this.getDataValue("status");
          const statusToNumber = {
            ACTIVE: 1,
            INACTIVE: 2,
            DRAFT: 3,
            DELETED: 4,
          };
          return statusToNumber[status];
        },
      },
      comment: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Menu",
      tableName: "menus",
      timestamps: true,
    }
  );
  return Menu;
};
