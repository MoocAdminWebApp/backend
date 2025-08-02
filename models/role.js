const { Model, DataTypes } = require("sequelize");

module.exports = sequelize => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.User, {
        foreignKey: "roleId",
        through: models.UserRole,
        as: "users",
      });

      Role.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "creator",
      });
      Role.belongsTo(models.User, {
        foreignKey: "updatedBy",
        as: "updater",
      });

      Role.belongsToMany(models.Menu, {
        foreignKey: "roleId",
        through: "role_menus",
        as: "menus",
      });

      Role.belongsToMany(models.Permission, {
        foreignKey: "roleId",
        through: "role_permissions",
        as: "permissions",
      });

      Role.hasMany(models.RolePermission, {
        foreignKey: "roleId",
        as: "rolePermissions",
      });
    }
  }

  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roleName: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
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
      modelName: "Role",
      tableName: "roles",
      timestamps: true,
    }
  );

  return Role;
};
