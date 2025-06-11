module.exports = (sequelize, DataTypes) => {
  const CoursePermission = sequelize.define(
    "CoursePermission",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
   
      courseOfferingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'course_offerings', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' 
      },
      enrollmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Pending', 'Completed', 'Dropped'),
        defaultValue: 'Pending',
        allowNull: false,
      },
   
    },
    {
      tableName: 'course_permissions',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      indexes: [
        {
          unique: true,
          fields: ['userId', 'courseOfferingId'],
          name: 'unique_user_course_offering'
        },
        {
          fields: ['roleId'] 
        },
        {
          fields: ['status']
        }
      ]
    }
  );

  CoursePermission.associate = (models) => {
    CoursePermission.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    CoursePermission.belongsTo(models.CourseOffering, {
      foreignKey: 'courseOfferingId',
      as: 'courseOffering',
    });

    CoursePermission.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });
  };

  return CoursePermission;
};
