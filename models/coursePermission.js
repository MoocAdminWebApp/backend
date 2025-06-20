const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
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
        model: "courses",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "userId",
      references: {
        model: "users",
        key: "id",
      },
    },
    permission: {
      type: DataTypes.ENUM("VIEW", "EDIT", "MANAGE", "ADMIN"),
      allowNull: false,
      defaultValue: "VIEW",
      field: "permission",
    },
    grantedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "grantedBy",
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "course_permissions",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

CoursePermission.associate = function (models) {
  CoursePermission.belongsTo(models.Course, {
    foreignKey: "courseId",
    as: "course",
  });

  CoursePermission.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });

  CoursePermission.belongsTo(models.User, {
    foreignKey: "grantedBy",
    as: "grantor",
  });
};

return CoursePermission;
};
