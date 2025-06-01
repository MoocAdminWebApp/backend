module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define('Section', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chapter_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    content_type: { type: DataTypes.ENUM('audio','video'), allowNull: false },
    media_url: { type: DataTypes.STRING, allowNull: false },
    order_index: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    tableName: 'sections',
    underscored: true,
    timestamps: true
  });
  Section.associate = models => {
    Section.belongsTo(models.Chapter, { foreignKey: 'chapter_id' });
  };
  return Section;
};