"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Permission.belongsToMany(models.Role, {
        foreignKey: "permissionId",
        otherKey: "roleId",
        through: "role_permissions",
        as: "roles",
      });

        Permission.hasMany(models.RolePermission, {
        foreignKey: "permissionId",
        as: "rolePermissions",
      });
      Permission.belongsTo(models.User, { foreignKey: "createdBy", targetKey: "id", as: 'creator'});
      Permission.belongsTo(models.User, { foreignKey: "updatedBy", targetKey: "id" , as: 'updater'});
    }
  }
  Permission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      permissionName: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
        createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
    }
  );
  return Permission;
};
