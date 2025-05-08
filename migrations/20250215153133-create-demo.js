"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Demo", {
      // Model attributes are defined here
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      mark: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      acitve: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      dataTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
    
    console.log("Table Demo Created");

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("Demo");
    console.log("table Demo droped");
  },
};
