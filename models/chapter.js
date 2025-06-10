module.exports = (sequelize, DataTypes) => {
  const Chapter = sequelize.define('Chapter', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    courseId: {
      field: 'course_Id',
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    orderIndex: {
      field: 'order_index',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    isPublished: {
      field: 'is_published',
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    } }, {
    tableName: 'chapters',
    underscored: true,
    timestamps: true  
  });

  Chapter.associate = models => {
    Chapter.belongsTo(models.Course, { foreignKey: 'courseId' });

  //   Chapter.hasMany(models.Section, { foreignKey: 'chapterId' });
   };

  return Chapter;
};