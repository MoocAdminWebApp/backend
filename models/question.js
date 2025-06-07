const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelizedb");

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("single", "multiple", "truefalse", "shortanswer"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
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
  },
  { timestamps: true, 
		tableName: "questions" }
);

Question.associate = models => {
  Question.hasMany(models.Option, {
    foreignKey: "questionId",
    onDelete: "CASCADE",
  });

  Question.belongsToMany(models.Course, {
    through: "QuestionCourse",
    foreignKey: "questionId",
    otherKey: "courseId",
  });
};

module.exports = Question;
