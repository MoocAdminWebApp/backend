"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("CourseOfferings", "courseName", {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
    await queryInterface.changeColumn("CourseOfferings", "teacherName", {
      type: Sequelize.STRING(40),
      allowNull: false,
    });
    await queryInterface.changeColumn("CourseOfferings", "location", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.changeColumn("CourseOfferings", "schedule", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.changeColumn("CourseOfferings", "semester", {
      type: Sequelize.STRING(40),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("CourseOfferings", "courseName", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("CourseOfferings", "teacherName", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("CourseOfferings", "location", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("CourseOfferings", "schedule", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("CourseOfferings", "semester", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
