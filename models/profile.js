"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      // each profile belongs to one user
      Profile.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // each profile is created by one user
      Profile.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "creator",
      });

      // each profile is updated by one user
      Profile.belongsTo(models.User, {
        foreignKey: "updatedBy",
        as: "updater",
      });
    }
    // map gender ENUM to number
    get genderNumber() {
      const map = {
        MALE: 1,
        FEMALE: 2,
        OTHER: 3,
        PREFER_NOT_TO_SAY: 4
      };
      return map[this.gender] || 0;
    }

    // rewrite toJSON to include genderNumber
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
        primaryKey: true, //primarykey is unique by default
      },     
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
        type: DataTypes.ENUM("MALE", "FEMALE", "OTHER","PREFER_NOT_TO_SAY"),
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
