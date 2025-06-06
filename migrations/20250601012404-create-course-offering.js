"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course_offerings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      courseName: {
        type: Sequelize.STRING,
      },
      teacherName: {
        type: Sequelize.STRING,
      },
      semester: {
        type: Sequelize.STRING,
      },
      capacity: {
        type: Sequelize.INTEGER,
      },
      enrolledCount: {
        type: Sequelize.INTEGER,
      },
      location: {
        type: Sequelize.STRING,
      },
      schedule: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
       createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      },
       updatedBy: {
       type: Sequelize.INTEGER,
       allowNull: true,
       references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("course_offerings");
  },
};
