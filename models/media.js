module.exports = (sequelize, DataTypes) => {
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
        references: {
          model: "Chapter",
          key: "id",
        },
      },
      fileName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      originalName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      filePath: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      fileSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      mediaType: {
        type: DataTypes.ENUM("Video", "Document"),
        allowNull: false,
      },
      resourceType: {
        type: DataTypes.ENUM("course", "chapter", "section"),
        allowNull: false,
      },
      resourceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      uploadedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("uploading", "processing", "ready", "error"),
        allowNull: false,
        defaultValue: "uploading",
      },
      thumbnail: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      isProcessed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      foreignKey: "resourceId",
      constraints: false,
      scope: { resourceType: "chapter" },
      as: "chapter",
    });

    Media.belongsTo(models.Course, {
      foreignKey: "resourceId",
      constraints: false,
      scope: { resourceType: "course" },
      as: "course",
    });

    Media.belongsTo(models.User, {
      foreignKey: "uploadedBy",
      as: "uploader",
    });
  };

  return Media;
};
