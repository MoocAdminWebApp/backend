const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelizedb");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Category",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "Category",
  }
);

Category.associate = (models) => {
  Category.belongsTo(models.Category, {
    foreignKey: "parentId",
    as: "parent",
  });

  Category.hasMany(models.Category, {
    foreignKey: "parentId",
    as: "children",
  });
};

module.exports = Category;
