module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define("RolePermission", {
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "RolePermissions",
    timestamps: false,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  });

  return RolePermission;
};
