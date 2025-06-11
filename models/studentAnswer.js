module.exports = (sequelize, DataTypes) => {
  const StudentAnswer = sequelize.define("StudentAnswer", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "questions",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    optionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "options",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    answerText: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
  }, {
    tableName: "student_answers",
    timestamps: true,
  });

  StudentAnswer.associate = (models) => {
    StudentAnswer.belongsTo(models.Question), {
      foreignKey: "questionId",
      onDelete: "CASCADE"
    }
  }

  return StudentAnswer;
};
