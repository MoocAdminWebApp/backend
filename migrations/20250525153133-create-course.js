"use strict";

const { up } = require("./20250215153133-create-demo");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("courses", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      instructorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      level: {
        type: Sequelize.ENUM("elementary", "intermediate", "advanced"),
        defaultValue: "elementary",
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      language: {
        type: Sequelize.STRING,
        defaultValue: "English",
      },
      certificate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      enrolmentCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      isFeatured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM("draft", "published", "updated", "disabled"),
        defaultValue: "draft",
      },
      coverImage: {
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
    console.log("Course table created.");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Course");
    console.log("Course table dropped.");
  },
};
