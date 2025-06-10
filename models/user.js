"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // establish associations
    static associate(models) {
      // reference to self
      User.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "creator",
      });

      // reference to self
      User.belongsTo(models.User, {
        foreignKey: "updatedBy",
        as: "updater",
      });

      // User and Role are many-to-many relationship
      User.belongsToMany(models.Role, {
        foreignKey: "userId",
        through: "UserRole",
        as: "roles",
      });

      // User and Profile are one-to-one relationship
      User.hasOne(models.Profile, {
        foreignKey: "userId",
        as: "profile",
      });
    }

    // map access ENUM to number
    get accessNumber() {
      const map = {
        ADMIN: 1,
        TEACHER: 2,
        STUDENT: 3,
      };
      return map[this.access] || 0;
    }

    // rewrite toJSON to include accessNumber
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
        primaryKey: true, //primarykey is unique by default
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
        type: DataTypes.ENUM("ADMIN", "TEACHER", "STUDENT"),
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
