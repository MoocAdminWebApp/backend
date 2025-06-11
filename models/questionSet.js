module.exports = (sequelize, DataTypes) => {
  const QuestionSet = sequelize.define("QuestionSet", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: "question_sets",
    timestamps: true,
  })

  QuestionSet.associate = models => {
    QuestionSet.belongsToMany(models.Question, {
      through: "question_set_questions",
      foreignKey: "questionSetId",
      otherKey: "questionId",
    })
  }

  return QuestionSet
}