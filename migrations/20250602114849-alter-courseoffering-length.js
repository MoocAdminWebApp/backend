"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("course_offerings", "courseName", {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
    await queryInterface.changeColumn("course_offerings", "teacherName", {
      type: Sequelize.STRING(40),
      allowNull: false,
    });
    await queryInterface.changeColumn("course_offerings", "location", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.changeColumn("course_offerings", "schedule", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.changeColumn("course_offerings", "semester", {
      type: Sequelize.STRING(40),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("course_offerings", "courseName", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("course_offerings", "teacherName", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("course_offerings", "location", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("course_offerings", "schedule", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("course_offerings", "semester", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
