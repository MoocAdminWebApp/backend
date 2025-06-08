module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define("Question", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      onDelete: "CASCADE",
    });

    Question.belongsToMany(models.CourseOffering, {
      through: "CourseOffering",
      foreignKey: "questionId",
      otherKey: "courseId",
    });
  };

  return Question;
};
