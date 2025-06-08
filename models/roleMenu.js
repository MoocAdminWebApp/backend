const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class RoleMenu extends Model {
    static associate(models) {
      // 中间表通常不需要设置 associate，除非你有特殊需求
    }
  }

  RoleMenu.init(
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
      menuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "menus",
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
      modelName: "RoleMenu",
      tableName: "role_menus",
      timestamps: true,
    }
  );

  return RoleMenu;
};
