const { DataTypes, DATE } = require("sequelize");
const { sequelize } = require("../db/sequelizedb");

const Option = sequelize.define(
  "Option",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "questions",
        key: "id",
      },
      onDelete: "CASCADE",
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
		tableName: "options" }
);

Option.associate = models => {
  Option.belongsTo(models.Question, {
    foreignKey: "questionId",
    onDelete: "CASCADE",
  });
};

module.exports = Option;
