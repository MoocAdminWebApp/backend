const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelizedb");


const QuestionCourse = sequelize.define('QuestionCourse', {
  questionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: "questions",
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: "course_offerings",
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: "users",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  updatedBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: "users",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
}, {
  tableName: 'question_courses',
  timestamps: true
});

module.exports = QuestionCourse