const { Model, DataTypes } = require("sequelize");

module.exports = sequelize => {
  class RolePermission extends Model {
    static associate(models) {
      // 通常中间表不需要定义关联
      models.RolePermission.belongsTo(models.Permission, {
        foreignKey: "permissionId",
        as: "permissionInfo",
      });

      // RolePermission -> Role
      models.RolePermission.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "roleInfo",
      });
    }
  }

  RolePermission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "permissions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      modelName: "RolePermission",
      tableName: "role_permissions",
      timestamps: true,
    }
  );

  return RolePermission;
};
