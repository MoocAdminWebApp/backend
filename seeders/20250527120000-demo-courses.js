"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert(
      "courses",
      [
        {
          id: 1,
          courseName: "JavaScript",
          courseDescription: "JavaScript",
          courseCode: "JS001",
          instructorId: 12, 
          status: "Published",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("courses", null, {});
  },
};