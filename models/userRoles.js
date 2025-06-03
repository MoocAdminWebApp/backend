module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define("UserRole", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "UserRoles",
    timestamps: false,
  });

  return UserRole;
};
