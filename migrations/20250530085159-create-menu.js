"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("menus", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      menuType: {
        type: Sequelize.ENUM("DIRECTORY", "MENU", "BUTTON"),
        allowNull: false,
        defaultValue: "MENU",
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "menus",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      orderNum: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      route: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      componentPath: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      permission: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "permissions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE", "DRAFT", "DELETED"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },
      comment: {
        type: Sequelize.STRING(200),
        allowNull: true,
        defaultValue: "",
      },
      icon: {
        type: Sequelize.STRING(200),
        allowNull: true,
        defaultValue: "Default",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("menus");
  },
};
