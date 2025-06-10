module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    'Course',
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
        field: 'courseName',
      },
      courseDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'courseDescription',
      },
      courseCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'courseCode',
      },
      instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'instructorId',
        references: {
          model: 'User',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('Draft', 'Published', 'Archived'),
        defaultValue: 'Draft',
        allowNull: false,
        field: 'status',
      },
    },
    {
      tableName: 'Courses',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: 'instructorId',
      as: 'instructor',
    });

    Course.hasMany(models.Chapter, {
      foreignKey: 'courseId',
      as: 'chapters',
    });

    Course.hasMany(models.CoursePermission, {
      foreignKey: 'courseId',
      as: 'permissions',
    });
  };

  return Course;
};
