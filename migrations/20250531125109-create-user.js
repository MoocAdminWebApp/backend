"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      userName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM("Other", "Male", "Female"),
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      access: {
        type: Sequelize.ENUM("admin", "teacher", "student"),
        allowNull: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
    console.log("Table User Created");
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
