"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "CoursePermission",
      [
        { 
          id: 1,
          courseId: 1,
          userId: 13,
          permission: "View",
          grantedBy: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        
        { 
          id: 2,
          courseId: 1,
          userId: 11,
          permission: "Admin",
          grantedBy: 12,
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