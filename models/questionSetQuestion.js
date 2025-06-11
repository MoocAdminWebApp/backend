module.exports = (sequelize, DataTypes) => {
  const QuestionSetQuestion = sequelize.define("QuestionSetQuestion", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    questionSetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
        model: "question_sets",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
        model: "questions",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
  },
  {
    tableName: "question_set_questions",
    timestamps: true,
  })

  return QuestionSetQuestion
}