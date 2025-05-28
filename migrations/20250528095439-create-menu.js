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
      type: {
        type: Sequelize.ENUM("directory", "menu", "button"),
        allowNull: false,
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      orderNum: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      path: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      component: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      permission: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      hiddle: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      remark: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("menus");
  },
};
