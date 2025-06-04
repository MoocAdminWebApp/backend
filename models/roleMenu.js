module.exports = (sequelize, DataTypes) => {
  const RoleMenu = sequelize.define("RoleMenu", {
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "RoleMenus",
    timestamps: false,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  });

  return RoleMenu;
};
