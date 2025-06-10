module.exports = (sequelize, DataTypes) => {
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
        type: DataTypes.ENUM("SINGLE", "MUTIPLE", "TRUEFALSE", "SHORTANSWER"),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
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
    { timestamps: true, tableName: "questions" }
  );

  Question.associate = models => {
    Question.hasMany(models.Option, {
      foreignKey: "questionId",
      onDelete: "CASCADE",
    });

    Question.belongsToMany(models.Course, {
      through: "CourseQuestion",
      foreignKey: "questionId",
      otherKey: "courseId",
    });
  };

  return Question;
};
