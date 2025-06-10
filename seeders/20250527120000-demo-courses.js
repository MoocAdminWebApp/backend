"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert(
      "Course",
      [
        {
          courseName: "JavaScript",
          courseDescription: "JavaScript",
          instructorId: 1, 
          status: "Published",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Course", null, {});
  },
};