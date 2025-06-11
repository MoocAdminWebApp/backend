module.exports = (sequelize, DataTypes) => {
  const Chapter = sequelize.define('Chapter', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
     courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Course', 
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER, 
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id',
      },
    },
  }, {
    tableName: 'chapters',
    underscored: true, 
    timestamps: true, 
  });

  Chapter.associate = models => {
    Chapter.belongsTo(models.Course, { foreignKey: 'courseId', as: "course" });

   Chapter.hasMany(models.Media, { foreignKey: "chapterId", as: "mediaFiles" });
   };

  return Chapter;
};