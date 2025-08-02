"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("media", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      chapterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "chapters",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      fileName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      originalName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      filePath: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      fileSize: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      mimeType: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      mediaType: {
        type: Sequelize.ENUM("VIDEO", "DOCUMENT"),
        allowNull: false,
      },
      resourceType: {
        type: Sequelize.ENUM("COURSE", "CHAPTER", "SECTION"),
        allowNull: false,
      },
      resourceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      uploadedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.ENUM("UPLOADING", "PROCESSING", "READY", "ERROR"),
        allowNull: false,
        defaultValue: "UPLOADING",
      },
      thumbnail: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      isProcessed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("media");
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_media_mediaType"`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_media_resourceType"`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_media_status"`);
  },
};
