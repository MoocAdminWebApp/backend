module.exports = (sequelize, DataTypes) => {
  const CourseOffering = sequelize.define(
    'CourseOffering',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      courseCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [3, 50]
        }
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Course',
          key: 'id',
        },
      },
      semester: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      maxStudents: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Planning', 'Open', 'InProgress', 'Completed', 'Cancelled'),
        defaultValue: 'Planning',
        allowNull: false,
      },
    },
    {
      tableName: 'CourseOfferings',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  CourseOffering.associate = (models) => {
    CourseOffering.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course',
    });

    CourseOffering.hasMany(models.CoursePermission, {
      foreignKey: 'courseOfferingId',
      as: 'permissions',
    });
  };

  return CourseOffering;
};
