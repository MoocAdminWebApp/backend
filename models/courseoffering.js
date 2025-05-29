const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelizedb");

const CourseOffering = sequelize.define(
  "CourseOffering",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacherName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enrolledCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schedule: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING, 
      allowNull: false,
      defaultValue: 'open', 
    }
  },
  {
    timestamps: true,
    tableName: "CourseOfferings",
  }
);

module.exports = CourseOffering;
