module.exports = (sequelize, DataTypes) => {
  const CourseOffering = sequelize.define(
    "CourseOffering",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      courseName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      teacherName: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      semester: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      enrolledCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      schedule: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isIn: [[0, 1, 2]],
        },
      },
      courseId: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: 'Courses',
    key: 'id',
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
},
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      tableName: "course_offerings",
      timestamps: true,
    }
  );

  CourseOffering.statusLabels = {
    0: "open",
    1: "closed",
    2: "cancelled",
  };

  CourseOffering.prototype.toJSON = function () {
    const values = { ...this.get() };
    values.statusText = CourseOffering.statusLabels?.[values.status] || null;
    return values;
  };
  CourseOffering.associate = (models) => {
    CourseOffering.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });

    CourseOffering.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater',
    });
    CourseOffering.belongsTo(models.Course, {
     foreignKey: 'courseId',
     as: 'course',
   });
  };


  return CourseOffering;
};