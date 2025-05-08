const { DataTypes } = require("sequelize");

const { sequelize } = require("../db/sequelizedb");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleName: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      field: "roleName",
    },
    mark: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    tableName: "Role",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

Role.associate = (models) => {
  Role.belongsToMany(models.User, {
    foreignKey: "roleId",
    through: "UserRole",
    as: "users",
  });

  Role.belongsToMany(models.Menu, {
    foreignKey: "roleId",
    through: "RoleMenu",
    as: "menus",
  });
};

module.exports = Role;
