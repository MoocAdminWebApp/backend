"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "CoursePermission",
      [
        {
          courseId: 1,
          userId: 1,
          permission: "View",
          grantedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        
        {
          courseId: 1,
          userId: 2,
          permission: "Admin",
          grantedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: 2,
          userId: 2,
          permission: "Admin",
          grantedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: 3,
          userId: 2,
          permission: "Admin",
          grantedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

    async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("CoursePermission", null, {});
  },
};