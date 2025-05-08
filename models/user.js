const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelizedb");

const User = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      //allowNull:false,
    },
    phone: {
      type: DataTypes.STRING,
      //allowNull:false,
    },
    address: {
      type: DataTypes.STRING,
      //allowNull:false,
    },
    gender: {
      type: DataTypes.ENUM("Other", "Male", "Female"),
      get() {
        const gender = this.getDataValue("gender");
        const genderoNumber = {
          Other: 0,
          Male: 1,
          Female: 2,
        };
        return genderoNumber[gender];
      },
    },
    age: {
      type: DataTypes.INTEGER,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "User",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

User.associate = (models) => {
  User.belongsToMany(models.Role, {
    foreignKey: "userId",
    through: "UserRole",
    as: "roles",
  });
};

module.exports = User;
