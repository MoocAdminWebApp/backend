"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      // 关联到 User（每个 Profile 属于一个 User）
      Profile.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // 创建者（User -> Profile 多个创建记录）
      Profile.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "creator",
      });

      // 更新者
      Profile.belongsTo(models.User, {
        foreignKey: "updatedBy",
        as: "updater",
      });
    }
    // 添加 accessLevel 映射为数字
    get genderNumber() {
      const map = {
        male: 1,
        female: 2,
        other: 3,
      };
      return map[this.gender] || 0;
    }

    // 重写 toJSON 以包含 genderNumber
    toJSON() {
      const values = { ...this.get() };
      values.genderNumber = this.genderNumber;
      return values;
    }
  }

  Profile.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, //默认就是unique的
      },
      //对应user表的id
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      countryCode: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      streetAddress: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      postalCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      bio: {
        type: DataTypes.STRING(500),
        allowNull: true,
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
      modelName: "Profile",
      tableName: "profiles",
      timestamps: true,
    }
  );

  return Profile;
};
