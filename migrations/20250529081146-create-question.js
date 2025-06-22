"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.createTable("questions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      category: {
        type: Sequelize.STRING(50),
        validate: {
          len: [2, 50]
        },
        allowNull: false
      },
      type: {
        type: Sequelize.STRING(20),
        validate: {
          isIn: {
            args: [["Single", "Multiple", "TrueFalse", "ShortAnswer"]],
            msg: "Question type must be one of: Single, Multiple, TrueFalse, ShortAnswer"
        },
        allowNull: false,
      }},
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      difficulty: {
        type: Sequelize.STRING(20),
        validate: {
          isIn: [["Easy", "Medium", "Hard"]]
        },
        allowNull: true,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
      },
    });

    console.log("Table questions created");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("questions");

    console.log("Table questions dropped");
  },
};
