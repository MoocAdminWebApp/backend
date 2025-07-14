// models/demo.js

module.exports = (sequelize, DataTypes) => {
  const Demo = sequelize.define(
    "Demo",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      dataTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "demo",
      timestamps: false,
    }
  );

  return Demo;
};
