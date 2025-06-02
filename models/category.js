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
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    updaterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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

  Category.belongsTo(models.users, {
    foreignKey: "creatorId",
    as: "creator",
  });

  Category.belongsTo(models.users, {
    foreignKey: "updaterId",
    as: "updater",
  });
};

module.exports = Category;
