"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Menu", {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      permission: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Menu",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      route: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      componentPath: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      orderNum: {
        type: DataTypes.INTEGER(),
        allowNull: true,
        defaultValue: 0,
      },
      menuType: {
        type: Sequelize.ENUM("Dir", "Menu", "Btn"),
        allowNull: true,
      },
      httpUrl: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      httpMethod: {
        type: DataTypes.STRING(50), //GET,POST,PUT,DELETE .......
        allowNull: true,
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
    console.log("Table Menu Created");
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Menu");
  },
};
