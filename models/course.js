module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      courseName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 200],
        },
      },
      courseDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      
      courseCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("DRAFT", "PUBLISHED", "ARCHIVED"),
        defaultValue: "DRAFT",
        allowNull: false,
      },
    },
    {
      tableName: "courses",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  Course.associate = models => {
    Course.belongsTo(models.User, {
      foreignKey: "instructorId",
      as: "instructor",
    });

    Course.hasMany(models.Chapter, {
      foreignKey: "courseId",
      as: "chapters",
    });

    Course.hasMany(models.CoursePermission, {
      foreignKey: "courseId",
      as: "permissions",
    });

    Course.hasMany(models.CourseOffering, {
      foreignKey: "courseId",
      as: "offerings",
    });
  };

  return Course;
};
