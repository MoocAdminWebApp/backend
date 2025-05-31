"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Category", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Category",
          key: "id",
        },
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      creatorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      updaterId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "id",
        },
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Category");
  },
};
