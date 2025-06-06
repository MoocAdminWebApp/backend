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
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    teacherName: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    semester: {
      type: DataTypes.STRING(40),
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
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    schedule: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
    isIn: [[0, 1, 2]],
  },
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
    tableName: "courseOfferings", 
    timestamps: true,            
  }
);

CourseOffering.statusLabels = {
  0: 'open',
  1: 'closed',
  2: 'cancelled'
};

// 自訂 toJSON 方法，讓回傳時自動加上 statusText
CourseOffering.prototype.toJSON = function () {
  const values = { ...this.get() };
  values.statusText = CourseOffering.statusLabels[values.status];
  return values;
};

module.exports = CourseOffering;
