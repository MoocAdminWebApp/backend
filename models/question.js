
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define("Question", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.STRING(50),
      validate: {
        len: [2, 50]
      },
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(20),
      validate: {
        isIn: [["Single", "Multiple", "TrueFalse", "ShortAnswer"]]
      },
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.STRING(20),
      validate: {
        isIn: [["Easy", "Medium", "Hard"]]
      },
      allowNull: true,
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
    tableName: "questions",
    timestamps: true,
  });

  Question.associate = models => {
    Question.hasMany(models.Option, {
      foreignKey: "questionId",
      as: "options",
      onDelete: "CASCADE",
    });

    Question.hasMany(models.StudentAnswer, {
      foreignKey: "questionId",
      onDelete: "CASCADE"
    })

    Question.belongsToMany(models.QuestionSet, {
      through: "question_set_questions",
      foreignKey: "questionId",
      otherKey: "questionSetId",
    });
  };

  return Question;
};
