const DataTypes = require("sequelize");
const { sequelize } = require("../db/sequelizedb");

const Carousel = sequelize.define(
  "Carousel",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    orderNum: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    linkUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
  { 
    sequelize,
    modelName: "Carousel",
    tableName: "carousel",
    timestamps: true,
   }
);

Carousel.associate = (models) => {
  Carousel.belongsTo(models.User, {
    foreignKey: "createdBy",
    as: "creator",
  });
  Carousel.belongsTo(models.User, {
    foreignKey: "updatedBy",
    as: "updater",
  });
};

module.exports = Carousel;
