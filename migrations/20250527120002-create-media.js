"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Media", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      chapterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Chapter',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
        type: Sequelize.ENUM("Video", "Document"),
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER, 
        allowNull: true,
      },
      uploadedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }
    });
    console.log("Table Media Created");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Media");
  },
};