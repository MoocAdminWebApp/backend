"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "course_permissions",
      [
        {
          courseId: 1,
          userId: 1,
          permission: "VIEW",
          grantedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          courseId: 1,
          userId: 2,
          permission: "ADMIN",
          grantedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("course_permissions", null, {});
  },
};
