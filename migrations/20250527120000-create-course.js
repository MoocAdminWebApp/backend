"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Course", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      courseName: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      courseDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      courseCode: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      instructorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM("Draft", "Published", "Archived"),
        defaultValue: "Draft",
        allowNull: false,
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
    console.log("Table Course Created");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Course");
  },
};