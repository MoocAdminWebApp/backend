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
      field: "courseId",
      references: {
        model: "Course",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "userId",
      references: {
        model: "User",
        key: "id",
      },
    },
    permission: {
      type: DataTypes.ENUM("View", "Edit", "Manage", "Admin"),
      allowNull: false,
      defaultValue: "View",
      field: "permission",
    },
    grantedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "grantedBy",
      references: {
        model: "User",
        key: "id",
      },
    },
  },
  {
    tableName: "CoursePermission",
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

  CoursePermission.belongsTo(models.User, { 
    foreignKey: "grantedBy", 
    as: "grantor" 
  });
};

return CoursePermission;
};