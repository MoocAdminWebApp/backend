module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define("RolePermission", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Roles',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',  
        },
        permissionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Permissions',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
   createBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updateBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
  }, {
    tableName: "RolePermissions",
    timestamps: false,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  });

  return RolePermission;
};
