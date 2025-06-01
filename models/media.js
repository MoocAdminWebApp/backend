const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelizedb");

const Media = sequelize.define(
  "Media",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    chapterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "chapterId",
      references: {
        model: "Chapter",
        key: "id",
      },},
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "fileName",
    },
    originalName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "originalName",
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "filePath",
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "fileSize",
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "mimeType",
    },
    mediaType: {
      type: DataTypes.ENUM("Video", "Document"),
      allowNull: false,
      field: "mediaType",
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "duration",
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "uploadedBy",
      references: {
        model: "User",
        key: "id",
      },
    },
  },
  {
    tableName: "Media",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

Media.associate = function (models) {
  Media.belongsTo(models.Chapter, { 
    foreignKey: "chapterId", 
    as: "chapter" 
  });
  
  Media.belongsTo(models.User, { 
    foreignKey: "uploadedBy", 
    as: "uploader" 
  });
};

module.exports = Media;