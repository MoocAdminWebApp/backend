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
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Course',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      role: {
        type: DataTypes.ENUM('Student', 'Teaching Assistant', 'Instructor'),
        allowNull: false,
      },
      enrollmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Pending'),
        defaultValue: 'Pending',
        allowNull: false,
      },
    },
    {
      tableName: "CoursePermissions",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  CoursePermission.associate = (models) => {
    CoursePermission.belongsTo(models.Course, {
      foreignKey: "courseId",
      as: "course"
    });
    
    CoursePermission.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user"
    });
  };

return CoursePermission;
};