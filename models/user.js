"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // 建立模型关联
    static associate(models) {
      // 自引用：创建者
      User.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "creator",
      });

      // 自引用：更新者
      User.belongsTo(models.User, {
        foreignKey: "updatedBy",
        as: "updater",
      });

      // User 与 Role 多对多通过UserRole关联
      User.belongsToMany(models.Role, {
        foreignKey: "userId",
        through: "UserRole",
        as: "roles",
      });

      // User 与 Profile 一对一关联
      User.hasOne(models.Profile, {
        foreignKey: "userId",
        as: "profile",
      });
    }

    // 添加 accessLevel 映射为数字
    get accessNumber() {
      const map = {
        admin: 1,
        teacher: 2,
        student: 3,
      };
      return map[this.access] || 0;
    }

    // 重写 toJSON 以包含 accessLevel
    toJSON() {
      const values = { ...this.get() };
      values.accessNumber = this.accessNumber;
      return values;
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, //默认就是unique的
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      access: {
        type: DataTypes.ENUM("admin", "teacher", "student"),
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};